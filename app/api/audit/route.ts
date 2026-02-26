import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import { runFullAudit } from '@/lib/audit';
import { sendAuditReport, notifyAdmin, addToBrevoList } from '@/lib/audit-email';

const auditSchema = z.object({
    url: z.string().url('Please enter a valid URL'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate
        const parsed = auditSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { url, name, email } = parsed.data;

        // Normalize URL
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

        // 2. Run the full audit (all 6 checks in parallel)
        const results = await runFullAudit(normalizedUrl);

        // 3. Background execution for emails via Next.js `after()`
        // This ensures emails send AFTER response is returned without Vercel killing the process
        after(async () => {
            console.log(`[Audit API] Starting background jobs for ${email}...`);
            const emailResults = await Promise.allSettled([
                sendAuditReport(email, name, results),
                addToBrevoList(email, name, normalizedUrl),
                notifyAdmin(name, email, normalizedUrl, results),
            ]);

            const emailSent = emailResults[0].status === 'fulfilled' && emailResults[0].value === true;
            const contactAdded = emailResults[1].status === 'fulfilled' && emailResults[1].value === true;
            const adminNotified = emailResults[2].status === 'fulfilled' && emailResults[2].value === true;

            const emailError = !emailSent && emailResults[0].status === 'rejected' ? String(emailResults[0].reason) : (!emailSent ? 'false' : 'ok');
            console.log(`[Audit API Background] email=${emailSent} (${emailError}), contact=${contactAdded}, admin=${adminNotified}`);
        });

        // 4. Return results immediately so the UI doesn't hang and Vercel doesn't timeout
        return NextResponse.json({
            success: true,
            results,
            emailSent: true, // Optimistically assume success
        });

    } catch (error: any) {
        console.error('Audit API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

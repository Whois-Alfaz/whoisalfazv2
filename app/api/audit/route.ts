import { NextResponse } from 'next/server';
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

        // Normalize URL — ensure https
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

        // 2. Run the full audit (all 6 checks in parallel)
        const results = await runFullAudit(normalizedUrl);

        // 3. Send email report + capture lead + notify admin (MUST await)
        // Without await, serverless functions terminate before emails send
        const [emailSent, contactAdded, adminNotified] = await Promise.all([
            sendAuditReport(email, name, results).catch(e => { console.error('Email send failed:', e); return false; }),
            addToBrevoList(email, name, normalizedUrl).catch(e => { console.error('Contact add failed:', e); return false; }),
            notifyAdmin(name, email, normalizedUrl, results).catch(e => { console.error('Admin notify failed:', e); return false; }),
        ]);

        console.log(`Audit complete: email=${emailSent}, contact=${contactAdded}, admin=${adminNotified}`);

        // 4. Return results with email delivery status
        return NextResponse.json({
            success: true,
            results,
            emailSent,
        });

    } catch (error: any) {
        console.error('Audit API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

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

        // 3. Send email report + capture lead + notify admin (in parallel, non-blocking)
        // These run in the background — we don't block the response on email delivery
        Promise.all([
            sendAuditReport(email, name, results).catch(e => console.error('Email send failed:', e)),
            addToBrevoList(email, name, normalizedUrl).catch(e => console.error('Contact add failed:', e)),
            notifyAdmin(name, email, normalizedUrl, results).catch(e => console.error('Admin notify failed:', e)),
        ]);

        // 4. Return results immediately
        return NextResponse.json({
            success: true,
            results,
        });

    } catch (error: any) {
        console.error('Audit API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

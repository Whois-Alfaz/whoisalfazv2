import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
    service: z.string().optional().default('General'),
    source: z.string().optional().default('whoisalfaz.me'),
    website: z.string().optional().nullable(),
});

async function sendBrevoEmail(data: { name: string; email: string; message: string; service: string }) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@whoisalfaz.me';
    const adminEmail = process.env.BREVO_ADMIN_EMAIL;

    if (!apiKey || !adminEmail) {
        console.warn('Brevo API key or admin email not configured. Skipping email notification.');
        return false;
    }

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'whoisalfaz.me', email: senderEmail },
                to: [{ email: adminEmail }],
                subject: `New Contact: ${data.service} — ${data.name}`,
                htmlContent: `
                    <h2>New Contact Form Submission</h2>
                    <table style="border-collapse:collapse;width:100%;max-width:600px;">
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${data.name}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${data.email}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Service</td><td style="padding:8px;border:1px solid #ddd;">${data.service}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${data.message}</td></tr>
                    </table>
                    <p style="margin-top:16px;color:#666;font-size:12px;">Sent from whoisalfaz.me contact form</p>
                `,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Brevo API Error:', errorText);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Brevo send failed:', error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate with Zod
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, message, service } = result.data;

        // 2. Persist to SQLite via Prisma
        const submission = await prisma.formSubmission.create({
            data: {
                name,
                email,
                message,
                service,
            },
        });

        console.log('Form submission saved:', submission.id);

        // 3. Send email notification via Brevo
        const emailSent = await sendBrevoEmail({ name, email, message, service });

        if (!emailSent) {
            console.warn('Email notification failed, but submission was saved.');
        }

        return NextResponse.json(
            { success: true, message: 'Message sent successfully!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

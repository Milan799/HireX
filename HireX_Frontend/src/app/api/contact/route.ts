import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/db';
import { ContactMessage } from '@/lib/models/ContactMessage';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields' },
                { status: 400 }
            );
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            message,
        });

        return NextResponse.json(
            { message: 'Contact message sent successfully', data: newMessage },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}

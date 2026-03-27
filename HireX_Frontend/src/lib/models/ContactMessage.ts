import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const ContactMessage: Model<IContactMessage> = mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

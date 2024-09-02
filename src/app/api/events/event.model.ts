import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    description: string;
    dates: Date;
    location: string;
    createdAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    dates: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;

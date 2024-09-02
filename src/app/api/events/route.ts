import dbConnect from '@/Utils/MongoConnect/dbConncet';
import { NextResponse } from 'next/server';
import Event from './event.model';
import { getErrorMessage } from '@/Utils/CommonFunc/CommonFunc';


export async function GET() {
    await dbConnect();
    try {
        const events = await Event.find({}).sort({ dates: 1 });
        return NextResponse.json({ success: true, data: events }, { status: 200 });
    } catch (error) {
        const message = getErrorMessage(error);
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
    try {
        if (!Array.isArray(body.dates) || body.dates.length === 0) {
            return NextResponse.json({ success: false, error: 'Dates array is required and should not be empty.' }, { status: 400 });
        }
        const { name, description, location, dates } = body;
        const eventsToCreate = dates.map((dateString: string) => ({
            name,
            description,
            location,
            dates: new Date(dateString),
        }));
        const result = await Event.insertMany(eventsToCreate);
        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        const message = getErrorMessage(error);
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

export async function PATCH(req: Request) {
    await dbConnect();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, body, { new: true });
        if (!updatedEvent) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
    } catch (error) {
        const message = getErrorMessage(error);
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        const message = getErrorMessage(error);
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'book') {
            console.log('Starting simulated booking process...');
            
            // Simulate booking delay
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if email credentials are configured
            const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
            
            const mockBooking = {
                success: true,
                booking: {
                    date: getNextWednesday(),
                    time: '4:30 PM',
                    players: 4,
                    holes: 9,
                    cartType: 'Any'
                },
                emailSent: hasEmailConfig,
                notes: [
                    'This is a simulated booking for development',
                    hasEmailConfig 
                        ? 'Email notification would be sent in production' 
                        : 'Configure email credentials to enable notifications',
                    'Deploy to Railway/Render for actual Selenium automation'
                ]
            };

            console.log('Simulated booking completed:', mockBooking);
            return NextResponse.json(mockBooking);
        }

        if (action === 'status') {
            const status = {
                nextWednesday: getNextWednesday(),
                lastBooking: null,
                isScheduled: false
            };

            return NextResponse.json(status);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Get booking history and status
        const status = {
            nextWednesday: getNextWednesday(),
            lastBooking: null,
            isScheduled: false,
            bookingHistory: []
        };

        return NextResponse.json(status);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get booking status' },
            { status: 500 }
        );
    }
}

function getNextWednesday() {
    const today = new Date();
    const nextWednesday = new Date(today);
    
    const daysUntilWednesday = (3 - today.getDay() + 7) % 7;
    if (daysUntilWednesday === 0) {
        nextWednesday.setDate(today.getDate() + 7);
    } else {
        nextWednesday.setDate(today.getDate() + daysUntilWednesday);
    }
    
    return nextWednesday.toISOString().split('T')[0];
}

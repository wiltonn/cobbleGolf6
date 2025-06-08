import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const sqlite3 = require('sqlite3').verbose();
        const path = require('path');
        
        const dbPath = path.join(process.cwd(), 'bookings.db');
        console.log('Creating database at:', dbPath);
        
        const db = new sqlite3.Database(dbPath);
        
        return new Promise((resolve) => {
            // Create the bookings table
            db.run(`
                CREATE TABLE IF NOT EXISTS bookings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT NOT NULL,
                    time TEXT NOT NULL,
                    players INTEGER NOT NULL,
                    holes INTEGER NOT NULL,
                    cart_type TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    db.close();
                    resolve(NextResponse.json({
                        success: false,
                        error: 'Failed to create table',
                        details: { message: err.message }
                    }, { status: 500 }));
                    return;
                }
                
                console.log('Table created successfully');
                
                // Insert some test data
                const testBookings = [
                    {
                        date: '2025-06-11',
                        time: '4:30 PM',
                        players: 4,
                        holes: 9,
                        cart_type: 'Any',
                        status: 'confirmed'
                    },
                    {
                        date: '2025-06-04',
                        time: '5:15 PM', 
                        players: 4,
                        holes: 9,
                        cart_type: 'Any',
                        status: 'confirmed'
                    },
                    {
                        date: '2025-05-28',
                        time: '4:45 PM',
                        players: 4,
                        holes: 9,
                        cart_type: 'Any',
                        status: 'completed'
                    }
                ];
                
                // Insert test bookings
                const stmt = db.prepare(`
                    INSERT INTO bookings (date, time, players, holes, cart_type, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
                `);
                
                let insertCount = 0;
                testBookings.forEach((booking, index) => {
                    stmt.run([
                        booking.date,
                        booking.time,
                        booking.players,
                        booking.holes,
                        booking.cart_type,
                        booking.status,
                        index * 7 // Space bookings 7 days apart
                    ], function(err) {
                        if (err) {
                            console.error('Insert error:', err);
                        } else {
                            insertCount++;
                            console.log('Inserted booking:', booking.time);
                        }
                        
                        if (insertCount + (err ? 1 : 0) === testBookings.length) {
                            stmt.finalize();
                            db.close();
                            
                            resolve(NextResponse.json({
                                success: true,
                                message: 'Database initialized successfully',
                                details: {
                                    dbPath: dbPath,
                                    tableCreated: true,
                                    testDataInserted: insertCount,
                                    totalBookings: insertCount
                                }
                            }));
                        }
                    });
                });
            });
        });
        
    } catch (error: any) {
        console.error('Database initialization failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to initialize database',
            details: {
                message: error.message,
                stack: error.stack
            }
        }, { status: 500 });
    }
}

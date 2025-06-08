import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Check if database file exists
        const fs = require('fs');
        const path = require('path');
        
        const dbPath = path.join(process.cwd(), 'bookings.db');
        const dbExists = fs.existsSync(dbPath);
        
        if (!dbExists) {
            return NextResponse.json({
                success: true,
                message: 'Database file does not exist yet',
                details: {
                    dbPath: dbPath,
                    exists: false,
                    note: 'Database will be created when first booking is made'
                }
            });
        }

        // Try to read database
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(dbPath);
        
        return new Promise((resolve) => {
            // Get all bookings
            db.all("SELECT * FROM bookings ORDER BY created_at DESC", [], (err, bookings) => {
                if (err) {
                    resolve(NextResponse.json({
                        success: false,
                        error: 'Database read error',
                        details: {
                            error: err.message,
                            dbPath: dbPath
                        }
                    }, { status: 500 }));
                    return;
                }

                // Get table schema
                db.all("PRAGMA table_info(bookings)", [], (err, schema) => {
                    db.close();
                    
                    if (err) {
                        resolve(NextResponse.json({
                            success: false,
                            error: 'Schema read error',
                            details: { error: err.message }
                        }, { status: 500 }));
                        return;
                    }

                    resolve(NextResponse.json({
                        success: true,
                        data: {
                            dbPath: dbPath,
                            exists: true,
                            bookings: bookings || [],
                            bookingCount: bookings ? bookings.length : 0,
                            schema: schema || [],
                            lastUpdated: new Date().toISOString()
                        }
                    }));
                });
            });
        });

    } catch (error: any) {
        console.error('Database check failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to check database',
            details: {
                message: error.message,
                suggestion: 'Database might not be initialized yet'
            }
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        const dbPath = path.join(process.cwd(), 'bookings.db');
        
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            return NextResponse.json({
                success: true,
                message: 'Database deleted successfully',
                details: {
                    dbPath: dbPath
                }
            });
        } else {
            return NextResponse.json({
                success: true,
                message: 'Database file does not exist',
                details: {
                    dbPath: dbPath
                }
            });
        }

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: 'Failed to delete database',
            details: {
                message: error.message
            }
        }, { status: 500 });
    }
}

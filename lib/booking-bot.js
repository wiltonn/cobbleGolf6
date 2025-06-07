const { SeleniumBase } = require('selenium-driverless');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();

class CobbleHillsBookingBot {
    constructor() {
        this.driver = null;
        this.db = new sqlite3.Database('./bookings.db');
        this.initializeDatabase();
        this.setupEmailTransporter();
    }

    // Initialize SQLite database
    initializeDatabase() {
        this.db.run(`
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
        `);
    }

    // Setup email transporter
    setupEmailTransporter() {
        this.emailTransporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Get next Wednesday date
    getNextWednesday() {
        const today = new Date();
        const nextWednesday = new Date(today);
        
        const daysUntilWednesday = (3 - today.getDay() + 7) % 7;
        if (daysUntilWednesday === 0) {
            nextWednesday.setDate(today.getDate() + 7);
        } else {
            nextWednesday.setDate(today.getDate() + daysUntilWednesday);
        }
        
        return nextWednesday;
    }

    // Format date for display
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Check if time slot matches priority criteria
    isPreferredTimeSlot(timeText) {
        const time = timeText.toLowerCase().trim();
        
        if (time.includes('4:15') && time.includes('pm')) return 1;
        if (time.includes('4:30') && time.includes('pm')) return 1;
        if (time.includes('4:45') && time.includes('pm')) return 1;
        
        if (time.includes('5:00') && time.includes('pm')) return 2;
        if (time.includes('5:15') && time.includes('pm')) return 2;
        if (time.includes('5:30') && time.includes('pm')) return 2;
        if (time.includes('5:45') && time.includes('pm')) return 2;
        
        return 0;
    }

    // Main booking automation function
    async performBooking() {
        try {
            console.log('Starting Cobble Hills booking automation...');
            
            this.driver = await SeleniumBase.create({
                headless: true,
                options: {
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--disable-extensions',
                        '--no-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                }
            });

            await this.driver.get('https://admin.teeon.com/portal/golfnorth/teetimes/cobblehills');
            await this.driver.sleep(3000);

            await this.handleLogin();
            await this.selectNextWednesday();
            await this.applyFilters();

            const selectedTime = await this.selectPreferredTimeSlot();
            
            if (selectedTime) {
                await this.saveBookingToDatabase(selectedTime);
                await this.sendEmailNotification(selectedTime);
                
                console.log(`Booking successful for time: ${selectedTime.time}`);
                return { success: true, booking: selectedTime };
            } else {
                console.log('No preferred time slots available. Cancelling booking.');
                await this.sendCancellationEmail();
                return { success: false, reason: 'No preferred times available' };
            }

        } catch (error) {
            console.error('Booking automation failed:', error);
            await this.sendErrorEmail(error);
            return { success: false, error: error.message };
        } finally {
            if (this.driver) {
                await this.driver.quit();
            }
        }
    }

    async handleLogin() {
        try {
            const loginForm = await this.driver.findElement({ css: 'form[action*="login"]' });
            if (loginForm) {
                console.log('Login required. Please implement credentials...');
            }
        } catch (error) {
            console.log('No login form detected, proceeding...');
        }
    }

    async selectNextWednesday() {
        try {
            console.log('Selecting next Wednesday date...');
            const nextWednesday = this.getNextWednesday();
            const formattedDate = this.formatDate(nextWednesday);
            
            const datePicker = await this.driver.findElement({ 
                css: 'input[type="date"], input[name*="date"], .datepicker input' 
            });
            
            if (datePicker) {
                await datePicker.clear();
                await datePicker.sendKeys(formattedDate);
                await this.driver.sleep(1000);
            }
            
            console.log(`Selected date: ${formattedDate}`);
        } catch (error) {
            console.error('Error selecting date:', error);
            throw error;
        }
    }

    async applyFilters() {
        try {
            console.log('Applying filters...');
            
            const leagueButton = await this.driver.findElement({ 
                xpath: "//button[contains(text(), 'Cobble Hills Men\\'s League 2025')] | //div[contains(text(), 'Cobble Hills Men\\'s League 2025')]" 
            });
            await leagueButton.click();
            await this.driver.sleep(1000);

            const playersSelect = await this.driver.findElement({ 
                css: 'select[name*="players"], select[id*="players"], input[name*="players"]' 
            });
            
            if (await playersSelect.getTagName() === 'select') {
                await playersSelect.selectByValue('4');
            } else {
                await playersSelect.clear();
                await playersSelect.sendKeys('4');
            }
            await this.driver.sleep(500);

            const holesSelect = await this.driver.findElement({ 
                css: 'select[name*="holes"], select[id*="holes"], input[name*="holes"]' 
            });
            
            if (await holesSelect.getTagName() === 'select') {
                await holesSelect.selectByValue('9');
            } else {
                const nineHolesOption = await this.driver.findElement({ 
                    xpath: "//input[@type='radio' and @value='9'] | //button[contains(text(), '9')]" 
                });
                await nineHolesOption.click();
            }
            await this.driver.sleep(500);

            try {
                const cartSelect = await this.driver.findElement({ 
                    css: 'select[name*="cart"], select[id*="cart"]' 
                });
                await cartSelect.selectByVisibleText('Any');
            } catch (error) {
                const anyCartOption = await this.driver.findElement({ 
                    xpath: "//input[@type='radio' and contains(@value, 'any')] | //button[contains(text(), 'Any')]" 
                });
                await anyCartOption.click();
            }
            await this.driver.sleep(1000);

            console.log('Filters applied successfully');
        } catch (error) {
            console.error('Error applying filters:', error);
            throw error;
        }
    }

    async selectPreferredTimeSlot() {
        try {
            console.log('Searching for preferred time slots...');
            await this.driver.sleep(3000);
            
            const timeSlots = await this.driver.findElements({ 
                css: '.time-slot, .tee-time, [data-time], button[data-time]' 
            });
            
            if (timeSlots.length === 0) {
                console.log('No time slots found on the page');
                return null;
            }

            let bestMatch = null;
            let bestPriority = 0;

            for (let slot of timeSlots) {
                try {
                    const timeText = await slot.getText();
                    const priority = this.isPreferredTimeSlot(timeText);
                    
                    if (priority > bestPriority) {
                        bestPriority = priority;
                        bestMatch = {
                            element: slot,
                            time: timeText,
                            priority: priority
                        };
                    }
                } catch (error) {
                    continue;
                }
            }

            if (bestMatch && bestMatch.priority > 0) {
                console.log(`Found preferred time slot: ${bestMatch.time}`);
                
                await bestMatch.element.click();
                await this.driver.sleep(1000);

                const selectButton = await this.driver.findElement({ 
                    xpath: "//button[contains(text(), 'Select')] | //input[@value='Select']" 
                });
                await selectButton.click();
                
                return {
                    date: this.formatDate(this.getNextWednesday()),
                    time: bestMatch.time,
                    players: 4,
                    holes: 9,
                    cartType: 'Any'
                };
            }

            return null;
        } catch (error) {
            console.error('Error selecting time slot:', error);
            throw error;
        }
    }

    async saveBookingToDatabase(booking) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO bookings (date, time, players, holes, cart_type, status)
                VALUES (?, ?, ?, ?, ?, 'confirmed')
            `);
            
            stmt.run([
                booking.date,
                booking.time,
                booking.players,
                booking.holes,
                booking.cartType
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
            
            stmt.finalize();
        });
    }

    async sendEmailNotification(booking) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'nathan.wilton@gmail.com',
            subject: 'Cobble Hills Golf Booking Confirmed',
            html: `
                <h2>Golf Booking Confirmed!</h2>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Players:</strong> ${booking.players}</p>
                <p><strong>Holes:</strong> ${booking.holes}</p>
                <p><strong>Cart:</strong> ${booking.cartType}</p>
                <p><strong>League:</strong> Cobble Hills Men's League 2025</p>
            `
        };

        try {
            await this.emailTransporter.sendMail(mailOptions);
            console.log('Confirmation email sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sendCancellationEmail() {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'nathan.wilton@gmail.com',
            subject: 'Cobble Hills Golf Booking - No Preferred Times Available',
            html: `
                <h2>Golf Booking Update</h2>
                <p>No preferred time slots were available for next Wednesday.</p>
                <p><strong>Date Checked:</strong> ${this.formatDate(this.getNextWednesday())}</p>
            `
        };

        try {
            await this.emailTransporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending cancellation email:', error);
        }
    }

    async sendErrorEmail(error) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'nathan.wilton@gmail.com',
            subject: 'Cobble Hills Golf Booking - Error',
            html: `
                <h2>Golf Booking Error</h2>
                <p>Error: ${error.message}</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        };

        try {
            await this.emailTransporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending error email:', error);
        }
    }

    closeDatabase() {
        this.db.close();
    }
}

module.exports = CobbleHillsBookingBot;
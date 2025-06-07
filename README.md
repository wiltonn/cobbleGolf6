# Cobble Hills Golf Booking App

An automated golf booking application for Cobble Hills Golf Course, specifically designed for the Men's League 2025. Features a modern Next.js interface with automated booking capabilities.

## Features

### 🎯 Automated Booking
- **Smart Time Selection**: Prioritizes 4:15-5:00 PM, then 5:00-6:00 PM slots
- **Wednesday Focus**: Automatically books for next Wednesday's Men's League
- **Intelligent Filtering**: Sets 4 players, 9 holes, "Any" cart automatically
- **Email Notifications**: Sends confirmations to nathan.wilton@gmail.com

### 🖥️ Modern Web Interface
- **Real-time Dashboard**: Shows booking status and next Wednesday date
- **One-Click Booking**: Start automated booking with a single button
- **Live Progress**: Visual feedback during booking process
- **Result Display**: Clear success/failure messaging with booking details

### 🔒 Secure & Reliable
- **Database Storage**: SQLite database for booking history
- **Error Handling**: Graceful failure handling with email notifications
- **Selenium Automation**: Robust web scraping with selenium-driverless

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Chrome/Chromium browser for automation

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd cobble-golf-app
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
LOGIN_EMAIL=your-booking-site-email
LOGIN_PASSWORD=your-booking-site-password
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Email Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Use the App Password (not your regular password) in `EMAIL_PASS`

### Booking Preferences
The app is pre-configured for:
- **League**: Cobble Hills Men's League 2025
- **Day**: Wednesdays only
- **Players**: 4 players
- **Holes**: 9 holes
- **Cart**: Any cart type
- **Time Preferences**: 4:15-5:00 PM (priority 1), 5:00-6:00 PM (priority 2)

## Usage

1. **Open the Dashboard**: Navigate to the main page
2. **Check Status**: View next Wednesday's date and current booking status
3. **Start Booking**: Click "Start Automated Booking" button
4. **Monitor Progress**: Watch the live progress indicator
5. **View Results**: See booking confirmation or cancellation details
6. **Email Confirmation**: Check email for booking details

## API Endpoints

### `GET /api/booking`
Returns current booking status and next Wednesday date.

### `POST /api/booking`
Executes automated booking process.

```json
{
  "action": "book"
}
```

## Database Schema

```sql
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  players INTEGER NOT NULL,
  holes INTEGER NOT NULL,
  cart_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Automation**: Selenium-driverless
- **Database**: SQLite3
- **Email**: Nodemailer
- **Deployment**: Ready for Vercel

## Development

### Project Structure
```
├── app/
│   ├── api/booking/          # API endpoints
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   └── BookingDashboard.tsx # Main UI component
├── lib/
│   └── booking-bot.js       # Selenium automation logic
└── PRD.md                   # Product Requirements Document
```

### Adding Features
1. **New Time Preferences**: Modify `isPreferredTimeSlot()` in `booking-bot.js`
2. **UI Customization**: Edit `BookingDashboard.tsx`
3. **API Extensions**: Add endpoints in `app/api/`
4. **Database Changes**: Update schema in `booking-bot.js`

## Deployment

### Vercel Deployment
1. **Push to GitHub**: Commit your changes
2. **Connect Vercel**: Link your GitHub repository
3. **Set Environment Variables**: Add your `.env` variables in Vercel dashboard
4. **Deploy**: Automatic deployment on push

### Environment Variables for Production
```env
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-app-password
LOGIN_EMAIL=your-booking-credentials
LOGIN_PASSWORD=your-booking-password
NODE_ENV=production
```

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Gmail App Password setup
2. **Booking fails**: Verify booking site credentials
3. **Chrome issues**: Ensure Chrome/Chromium is installed
4. **Database errors**: Check file permissions for SQLite

### Logs
Check browser console and terminal for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private use only - designed specifically for Cobble Hills Golf Course Men's League 2025.

## Support

For issues or questions, check the error logs or email notifications for detailed information.

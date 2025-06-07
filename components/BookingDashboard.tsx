'use client';

import { useState, useEffect } from 'react';

interface Booking {
  date: string;
  time: string;
  players: number;
  holes: number;
  cartType: string;
}

interface BookingResult {
  success: boolean;
  booking?: Booking;
  reason?: string;
  error?: string;
}

export default function BookingDashboard() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<BookingResult | null>(null);

  // Fetch current status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/booking');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    setLastResult(null);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'book' }),
      });

      const result = await response.json();
      setLastResult(result);
      
      // Refresh status after booking attempt
      if (result.success) {
        await fetchStatus();
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: 'Failed to execute booking'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cobble Hills Golf Booking
        </h1>
        <p className="text-gray-600">
          Automated booking for Cobble Hills Men's League 2025
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
        
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Next Wednesday</h3>
              <p className="text-blue-600">{status.nextWednesday}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Booking Status</h3>
              <p className="text-green-600">
                {status.isScheduled ? 'Scheduled' : 'Ready to Book'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Configuration</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">League:</span>
            <p>Men's League 2025</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Players:</span>
            <p>4 Players</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Holes:</span>
            <p>9 Holes</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Cart:</span>
            <p>Any</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Time Preferences</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• First Priority: 4:15 PM - 5:00 PM</li>
            <li>• Second Priority: 5:00 PM - 6:00 PM</li>
            <li>• If no preferred times available: Cancel booking</li>
          </ul>
        </div>
      </div>

      {/* Booking Action */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Book Tee Time</h2>
        
        <button
          onClick={handleBooking}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking in Progress...
            </span>
          ) : (
            'Start Automated Booking'
          )}
        </button>

        <p className="text-sm text-gray-500 mt-2 text-center">
          This will automatically search and book your preferred tee time
        </p>
      </div>

      {/* Booking Result */}
      {lastResult && (
        <div className={`rounded-lg shadow-md p-6 ${
          lastResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        } border`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            lastResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {lastResult.success ? 'Booking Successful!' : 'Booking Failed'}
          </h2>
          
          {lastResult.success && lastResult.booking ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium text-green-700">Date:</span>
                  <p className="text-green-600">{lastResult.booking.date}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Time:</span>
                  <p className="text-green-600">{lastResult.booking.time}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Players:</span>
                  <p className="text-green-600">{lastResult.booking.players}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Holes:</span>
                  <p className="text-green-600">{lastResult.booking.holes}</p>
                </div>
              </div>
              <p className="text-green-700 mt-4">
                ✓ Confirmation email sent to nathan.wilton@gmail.com
              </p>
            </div>
          ) : (
            <div>
              <p className="text-red-700">
                {lastResult.reason || lastResult.error || 'Unknown error occurred'}
              </p>
              {lastResult.reason === 'No preferred times available' && (
                <p className="text-red-600 mt-2 text-sm">
                  No time slots matching your preferences (4:15-6:00 PM) were found for next Wednesday.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Players Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Regular Players</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Nathan Wilton', 'Dave Cole', 'Dan Clark', 'Gord Johnson'].map((player) => (
            <div key={player} className="bg-gray-50 p-3 rounded text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-green-600 font-medium">
                  {player.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="text-sm font-medium">{player}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

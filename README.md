# EventPulse API

Backend API for Event Management Platform built with Node.js, Express, MongoDB, and Socket.io.

## Features
- **Authentication**: JWT & Role-Based Access Control (Admin & Attendee).
- **Events API**: Filtering, Pagination, Sorting, and Text Search.
- **Registrations**: Event registration with capacity management & double-registration prevention.
- **Real-Time**: Socket.io real-time announcements.
- **Testing**: Unit & Integration testing with Jest & Supertest.

## Setup Instructions
1. Clone repository:
   ```bash
   git clone <repository-url>


   Install dependencies:

Bash
npm install
Set environment variables in .env.

Seed database:

Bash
npm run seed
Start application:

Bash
npm start
Run tests:

Bash
npm test
Endpoints
GET /health - Health check status.

POST /api/auth/register - User registration.

POST /api/auth/login - User login.

GET /api/events - Get list of events.

POST /api/registrations - Register for an event.

POST /api/announcements - Create event announcement (Admin).
# EventPlanner - A Manifest-Powered React Application

This is a full-stack Event Planning Platform built with React and powered by Manifest. It allows event organizers to create and manage events, while attendees can browse and register for them.

## Features

- **Role-Based Access**: Separate user experiences for 'Organizers' and 'Attendees'.
- **Event Creation**: Organizers can create detailed event pages.
- **Image Galleries**: Upload multiple images for each event.
- **Venue Management**: Events are linked to predefined venues with categories.
- **Dynamic Ticketing**: Create multiple pricing tiers (e.g., VIP, General Admission) for each event.
- **Attendee Registration**: Simple registration flow for attendees.
- **Built-in Admin Panel**: Full administrative control over all data via the auto-generated Manifest admin panel.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Heroicons
- **Backend**: Manifest (handles database, API, auth, file storage)
- **SDK**: `@mnfst/sdk` for all backend communication

## Getting Started

### Prerequisites

- Node.js and npm
- A running Manifest backend instance (provided upon deployment).

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Backend Access

- **Admin Panel**: Access the auto-generated admin panel at the URL specified in `src/constants.js` (e.g., `https://eventplanner.mnfst.com/admin`).
- **Default Admin Credentials**: 
  - **Email**: `admin@manifest.build`
  - **Password**: `admin`

### Demo Users

For quick testing, you can use the following pre-configured demo accounts from the landing page:

- **Organizer**: `organizer@demo.com` / `password`
- **Attendee**: `attendee@demo.com` / `password`

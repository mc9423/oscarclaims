# Oscar Claims Management System

A modern, accessible, and user-friendly insurance claims management system built with React, TypeScript, and Tailwind CSS.

<img width="1706" alt="Screenshot 2025-03-29 at 2 03 57 AM" src="https://github.com/user-attachments/assets/2c1ef561-5eb7-43b1-9542-9863585fb2b5" />

## Features

- 📋 Comprehensive claims management dashboard
- 🔍 Filtering and search capabilities
- 📊 Sortable and paginated claims table
- 📝 Detailed claim submission form with validation
- 📎 Document upload and management
- 🔄 Real-time status updates
- ♿ Full accessibility support
- 📱 Responsive design

## Tech Stack

- **Frontend Framework**: React with TypeScript - built on Vite + SWC
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **API Client**: Axios
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Type Safety**: TypeScript
- **Backend**: Supabase

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mc9423/oscarclaims.git
cd oscar-claims
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable UI components
├── config/          # Configuration files
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

### Claims Dashboard

- Displays a list of all claims
- Supports sorting, filtering, and pagination
- Real-time updates

### Claim Details

- Comprehensive view of individual claims
- Document management
- Status updates
- Notes and comments

### Claim Submission

- Form validation
- File upload support
- Real-time feedback

## Accessibility

This project follows WCAG 2.1 guidelines and includes:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TanStack](https://tanstack.com/) for their excellent React libraries
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com) for a free backend as a service

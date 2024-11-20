# Pet Arogya - Modern Dog Health Management System

A Next.js 14-based platform for comprehensive dog health management with real-time updates and responsive design.

## Core Features

- 🔐 Authentication
  - Email/Password login
  - Role-based access control
  - Protected routes

- 🐕 Dog Management
  - Comprehensive dog profiles
  - Image upload
  - Health record tracking
  - Document management

- 📅 Appointments
  - Calendar integration
  - Status tracking
  - Email notifications
  - Recurring appointments

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - React Query
  - Zod validation
  - React Hook Form

- **Authentication**
  - NextAuth.js
  - JWT tokens
  - Role-based access

- **Database**
  - MongoDB
  - Mongoose ODM

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB instance
- npm or pnpm

### Installation

1. Clone and install
```bash
git clone https://github.com/yourusername/pet-arogya.git
cd pet-arogya
npm install
```

2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Run development server
```bash
npm run dev
```

### Project Structure
```
pet-arogya/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dogs/
│   │   ├── appointments/
│   │   └── settings/
│   └── api/
├── components/
│   ├── ui/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── utils/
│   └── validations/
└── types/
```

## Available Scripts

In the frontend directory, you can run:

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint for code quality
- `npm run test` - Runs the test suite (coming soon)

## Features in Development

- [ ] Authentication and user management
- [ ] Genetic data integration
- [ ] Mobile app using React Native
- [ ] Advanced health analytics
- [ ] Integration with veterinary services
- [ ] API documentation
- [ ] Automated testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters of the project

## Contact

Your Name - Rajat

Project Link: [https://github.com/yourusername/pet-arogya](https://github.com/yourusername/pet-arogya)

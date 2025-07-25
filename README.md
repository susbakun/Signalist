# 🚀 Signalist

<div align="center">

![Signalist Logo](https://img.shields.io/badge/Signalist-Trading%20Platform-blue?style=for-the-badge&logo=chart-line-up)

**Advanced Cryptocurrency Trading Platform with Modern UI and Complete Features**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.3-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)

</div>

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Introduction

Signalist is an advanced cryptocurrency trading platform built with the latest web technologies. This project includes a modern frontend with React and TypeScript, and a powerful backend with Express.js.

### 🌟 Key Features

- **Modern UI**: Beautiful and user-friendly design with Tailwind CSS
- **Live Trading**: Real-time price displays and charts
- **Portfolio Management**: Track investments and profit/loss
- **High Security**: Advanced authentication and authorization
- **Mobile Support**: Responsive design for all devices

## ✨ Features

### 📊 Charts & Analytics

- Integrated TradingView charts
- Technical analysis tools
- Live price displays
- Various market indicators

### 💼 Portfolio Management

- Asset tracking
- Profit/loss calculations
- Analytical reports
- Risk management

### 🔐 Security & Authentication

- Two-factor authentication
- Secure session management
- Data encryption
- API protection

### 📱 User Experience

- Responsive user interface
- Smooth animations
- Fast loading
- PWA support

## 🛠 Technologies Used

### Frontend

- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type-safe programming language
- **Vite 5.2.0** - Fast build tool
- **Tailwind CSS 3.4.3** - CSS framework
- **Redux Toolkit 2.2.3** - State management
- **React Router 6.23.0** - Routing
- **Framer Motion 12.5.0** - Animations

### Backend

- **Express.js** - Node.js framework
- **Socket.io** - Real-time communication
- **Redis** - Cache and session storage
- **JWT** - Authentication
- **AWS S3** - File storage

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework
- **Husky** - Git hooks

## 🚀 Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/your-username/signalist.git
cd signalist

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Installation

```bash
# Navigate to backend folder
cd signalist-backend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_key

# Backend
PORT=3000
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket
```

## 📁 Project Structure

```
signalist/
├── src/
│   ├── app/           # Redux store configuration
│   ├── components/    # Reusable components
│   ├── features/      # Main features (Redux slices)
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Main pages
│   ├── services/      # API services
│   ├── shared/        # Shared components and utilities
│   ├── utils/         # Helper functions
│   └── assets/        # Images and static files
├── public/            # Public files
├── tests/             # Test files
└── dist/              # Build files
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Run development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Lint code with ESLint
```

## 🧪 Testing

The project uses Vitest for testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── components/       # Component tests
├── hooks/           # Custom hook tests
├── utils/           # Utility function tests
└── integration/     # Integration tests
```

## 🚀 Deployment

### Liara (Frontend)

```bash
# Install Liara CLI
npm i -g @liara/cli

# Login to Liara
liara login

# Deploy
liara deploy
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Contribution Guidelines

- Format your code with ESLint and Prettier
- Write appropriate tests for new features
- Update documentation
- Use conventional commits

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 📞 Support

- **Email**: support@signalist.com
- **Twitter**: [@signalist_app](https://twitter.com/signalist_app)
- **Telegram**: [@signalist_support](https://t.me/signalist_support)

## 🙏 Acknowledgments

Thank you to all contributors and users who have helped in the development of this project.

---

<div align="center">

**Made with ❤️ by the Signalist Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/signalist?style=social)](https://github.com/your-username/signalist)
[![GitHub forks](https://img.shields.io/github/forks/your-username/signalist?style=social)](https://github.com/your-username/signalist)

</div>

# Word Book

A modern vocabulary learning application built with React, TypeScript, and Vite.

## Features

- **Interactive Word Management**: Add, edit, and manage your vocabulary
- **Two Layout Options**: List view and Two-Column view for different learning styles
- **Quiz Mode**: Test your knowledge with randomized quizzes
- **Local Storage**: All data stored locally in your browser
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Progressive Web App**: Can be installed on mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React hooks with local state
- **Database**: Dexie.js (IndexedDB wrapper)
- **Web Server**: Caddy (for production deployment)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

### Build

```bash
npm run build
```

## Docker Deployment

### Using Docker Compose (Recommended for local testing)

1. Build and run with docker-compose:
   ```bash
   docker-compose up --build
   ```
2. Access the application at http://localhost:8080

### Manual Docker Build

1. Build the Docker image:
   ```bash
   docker build -t word-book .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 -e PORT=8080 word-book
   ```

### Production Deployment

The application is configured for deployment on Railway, Render, or similar platforms that support Docker deployments.

#### Environment Variables

- `PORT`: The port the application will listen on (automatically set by most platforms)

#### Health Check

The application includes a health check endpoint at `/health` that returns a 200 status.

## Usage

### Adding Words

1. Click the "+" button to add a new word
2. Enter the term and its meaning
3. Choose a color for visual organization
4. Save the word

### Quiz Mode

1. Navigate to the Quiz tab
2. Click "Start Random Quiz" 
3. Try to recall the meaning before revealing it
4. Use Previous/Next to navigate through words
5. Click "Stop" to return to the start screen

### Settings

- **Words per page**: Control how many words display at once
- **Layout**: Choose between List view or Two-Column view
- **Data Management**: Export/Import your word collection (hidden by default)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

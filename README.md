# ZuTube - YouTube Clone Frontend

A modern, responsive YouTube clone built with React, Vite, and Tailwind CSS. This frontend application provides a complete video streaming experience with authentication, video playback, comments, and more.

## Features

### 🎥 Core Features
- **Video Player**: Full-featured HTML5 video player with controls
- **Video Grid**: Responsive grid layout for video thumbnails
- **Search & Filter**: Advanced search functionality with category filtering
- **Related Videos**: Sidebar showing related content suggestions

### 🔐 Authentication
- **User Registration**: Create new accounts with validation
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: User avatar and profile information
- **Protected Routes**: Secure access to authenticated features

### 💬 Social Features
- **Comments System**: Add, edit, and delete comments
- **Real-time Updates**: Instant comment posting and updates
- **User Interactions**: Like/dislike videos and comments

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Theme**: YouTube-inspired dark color scheme
- **Hamburger Menu**: Collapsible sidebar navigation
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Skeleton loaders and loading indicators

### 🧭 Navigation
- **Sidebar Menu**: Categories, trending, and library sections
- **Popular Tags**: Quick access to trending topics
- **Breadcrumb Navigation**: Easy navigation between pages
- **Search Bar**: Global search functionality

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Left sidebar navigation
│   ├── VideoCard.jsx   # Video thumbnail component
│   └── Comments.jsx    # Comments section component
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Home page with video grid
│   ├── VideoPage.jsx   # Individual video page
│   ├── Login.jsx       # User login page
│   └── Signup.jsx      # User registration page
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5050

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5050
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get specific video

### Comments
- `GET /api/comments/video/:videoId` - Get video comments
- `POST /api/comments` - Add new comment
- `PUT /api/comments/:id` - Edit comment
- `DELETE /api/comments/:id` - Delete comment

## Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.js`:

```javascript
colors: {
  'youtube-red': '#FF0000',
  'youtube-dark': '#0F0F0F',
  'youtube-gray': '#272727',
  'youtube-light-gray': '#AAAAAA',
}
```

### Components
All components are built with Tailwind CSS classes and can be easily customized by modifying the component files.

## Responsive Design

The application is fully responsive with the following breakpoints:

- **Mobile**: `< 640px` - Single column layout, collapsible sidebar
- **Tablet**: `640px - 1024px` - Two column layout
- **Desktop**: `> 1024px` - Full layout with permanent sidebar

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube for design inspiration
- Tailwind CSS for the utility-first CSS framework
- React team for the amazing framework
- Vite for the fast build tool

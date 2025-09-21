# Modern Portfolio Website - AngularJS

A modern, responsive single-page portfolio website built with AngularJS, featuring dark mode design, 3D animations, and interactive elements.

## Features

- **Dark Mode Design**: Professional dark theme with neon/glow accents
- **3D Interactive Background**: Three.js powered particle system and geometric shapes
- **Smooth Animations**: GSAP powered scroll-triggered animations and transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Contact Form**: Functional contact form with email notifications
- **Modern UI/UX**: Clean typography and futuristic design elements

## Sections

1. **Home**: Hero section with animated background and call-to-action buttons
2. **Services**: Interactive 3D flip cards showcasing skills and services
3. **Experience**: Timeline layout with professional experience
4. **About**: Personal introduction with animated profile section
5. **Contact**: Contact form with real-time validation and email notifications

## Technologies Used

- **Frontend**: AngularJS 1.8.2, HTML5, CSS3, JavaScript ES6+
- **3D Graphics**: Three.js for interactive 3D elements
- **Animations**: GSAP (GreenSock) for smooth animations
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer for contact form notifications
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### 1. Clone or Download

Download all files to your local machine.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Email Settings

1. Open `server.js`
2. Replace the email configuration with your details:

```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-app-password' // Your app password (not regular password)
    }
});
```

**For Gmail users:**
- Enable 2-factor authentication
- Generate an "App Password" for this application
- Use the app password, not your regular Gmail password

### 4. Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

### 5. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access the Website

Open your browser and visit: `http://localhost:3000`

## File Structure

```
portfolio-angularjs/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── app.js             # AngularJS application logic
├── animations.js      # Three.js and GSAP animations
├── server.js          # Node.js backend server
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Customization

### Personal Information

1. **Name and Title**: Update in `index.html` (hero section)
2. **About Section**: Modify the description in `index.html`
3. **Services**: Edit the services array in `app.js`
4. **Experience**: Update the experience array in `app.js`
5. **Skills**: Modify the skills array in `app.js`
6. **Contact Info**: Update contact details in `index.html`

### Styling

- **Colors**: Modify CSS custom properties in `styles.css`
- **Fonts**: Change font imports in `index.html`
- **Animations**: Adjust animation parameters in `animations.js`

### 3D Background

- **Particles**: Modify particle count and properties in `animations.js`
- **Geometric Shapes**: Add or remove shapes in the `createGeometricShapes()` method
- **Colors**: Update color schemes in the Three.js material properties

## Deployment

### Option 1: Heroku

1. Create a `Procfile` in the root directory:
```
web: node server.js
```

2. Deploy to Heroku:
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Option 2: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 3: Netlify

1. Build the project and upload the files
2. Configure build settings to run `npm start`
3. Set environment variables in Netlify dashboard

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Lazy loading of animations
- Optimized Three.js rendering
- Efficient scroll event handling
- Responsive image loading
- Minified external libraries

## Troubleshooting

### Contact Form Not Working

1. Check email configuration in `server.js`
2. Verify app password is correct
3. Check server logs for error messages
4. Ensure all required fields are filled

### 3D Background Not Showing

1. Check browser console for Three.js errors
2. Ensure Three.js library is loaded
3. Verify WebGL support in browser

### Animations Not Working

1. Check if GSAP library is loaded
2. Verify browser supports CSS animations
3. Check console for JavaScript errors

## License

MIT License - feel free to use this template for your own portfolio.

## Support

If you encounter any issues or have questions, please check the troubleshooting section above or create an issue in the repository.

---

**Note**: Remember to replace all placeholder information (name, email, experience, etc.) with your actual details before deploying your portfolio.

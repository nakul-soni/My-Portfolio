# Configuration Guide

## Email Setup

### Gmail Configuration

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - In Google Account settings, go to Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Use this app password (not your regular Gmail password)

3. **Update server.js**
   ```javascript
   const transporter = nodemailer.createTransporter({
       service: 'gmail',
       auth: {
           user: 'your-email@gmail.com',
           pass: 'your-16-character-app-password'
       }
   });
   ```

### Other Email Providers

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: 'your-email@outlook.com',
        pass: 'your-password'
    }
});
```

#### Yahoo
```javascript
const transporter = nodemailer.createTransporter({
    service: 'yahoo',
    auth: {
        user: 'your-email@yahoo.com',
        pass: 'your-app-password'
    }
});
```

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@domain.com',
        pass: 'your-password'
    }
});
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

Then update `server.js` to use environment variables:

```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});
```

## Personal Information

### Update Your Details

1. **Name and Title** (in `index.html`):
   ```html
   <span class="name">Your Name</span>
   <span class="role">Your Job Title</span>
   ```

2. **About Section** (in `index.html`):
   ```html
   <p class="about-description">
       Your personal description here...
   </p>
   ```

3. **Services** (in `app.js`):
   ```javascript
   $scope.services = [
       {
           title: 'Your Service',
           description: 'Service description',
           icon: 'fas fa-icon-name',
           features: ['Feature 1', 'Feature 2', 'Feature 3']
       }
   ];
   ```

4. **Experience** (in `app.js`):
   ```javascript
   $scope.experience = [
       {
           position: 'Your Position',
           company: 'Company Name',
           duration: '2020 - Present',
           description: 'Job description...',
           skills: ['Skill 1', 'Skill 2', 'Skill 3']
       }
   ];
   ```

5. **Skills** (in `app.js`):
   ```javascript
   $scope.skills = [
       {
           name: 'Category Name',
           items: ['Skill 1', 'Skill 2', 'Skill 3']
       }
   ];
   ```

6. **Contact Information** (in `index.html`):
   ```html
   <div class="contact-item">
       <i class="fas fa-envelope"></i>
       <span>your-email@example.com</span>
   </div>
   ```

## Customization Options

### Colors and Theme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #00d4ff;
    --secondary-color: #ff00ff;
    --background-color: #0a0a0a;
    --text-color: #ffffff;
}
```

### 3D Background

Modify particle settings in `animations.js`:

```javascript
// Particle count
const particleCount = 200; // Increase for more particles

// Particle colors
color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6); // Adjust hue range
```

### Animations

Adjust animation timing in `animations.js`:

```javascript
// Animation duration
duration: 1, // Seconds

// Animation delay
delay: index * 0.1, // Stagger delay
```

## Testing

### Local Testing

1. Start the server:
   ```bash
   npm start
   ```

2. Open browser to `http://localhost:3000`

3. Test the contact form with your email

### Production Testing

1. Deploy to your hosting platform
2. Test all functionality
3. Verify email notifications work
4. Check responsive design on different devices

## Troubleshooting

### Contact Form Issues

- **Email not sending**: Check email credentials and app password
- **Server error**: Check console logs for specific error messages
- **Form validation**: Ensure all required fields are filled

### 3D Background Issues

- **Not displaying**: Check browser WebGL support
- **Performance issues**: Reduce particle count
- **Mobile issues**: 3D effects may be disabled on low-end devices

### Animation Issues

- **Not working**: Check if GSAP library loaded correctly
- **Too fast/slow**: Adjust timing in animations.js
- **Mobile performance**: Some animations may be disabled on mobile

## Security Notes

- Never commit `.env` files to version control
- Use app passwords instead of regular passwords
- Consider rate limiting for contact form submissions
- Validate and sanitize all form inputs

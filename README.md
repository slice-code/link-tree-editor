# Linktree UI Builder

A powerful, no-code Linktree alternative UI component built with vanilla JavaScript. Create beautiful, customizable link-in-bio pages with profiles, themes, media, and more.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/gugusdarmayanto)

---

## 👀 Preview

![Linktree UI Preview](./image/view.png)

---

## ✨ Features

- 🎨 **5 Built-in Themes** - Hydra, Dark, Neon, Ocean, Gradient (+ custom themes)
- 👤 **Profile Customization** - Avatar (image or text), name, bio
- 🔤 **Google Fonts Support** - Global and per-element font customization
- 🔗 **Smart Links** - Individual styling, grouped links, hover effects
- 🎯 **Grouped Links** - Organize links by sections/categories
- 📸 **Gallery Images** - Custom styled images with optional links
- 🎬 **Video Embeds** - YouTube video integration
- 💝 **Donation Buttons** - Ko-fi, Buy Me a Coffee, Patreon, PayPal
- 🌐 **Social Links** - FontAwesome icon integration
- 🎨 **Advanced Styling** - Custom colors, borders, shadows, rounded corners
- 📱 **Fully Responsive** - Works on all devices and screen sizes

---

## 🚀 Quick Start

### Installation

1. **Copy the files to your project:**
   ```bash
   cp el.js your-project/
   cp linktree-ui/linktree-ui.js your-project/linktree-ui/
   ```

2. **Include in your HTML:**
   ```html
   <div id="app"></div>
   <script type="module">
     // Import el.js first (dependency)
     import './el.js';
     
     // Then import Linktree UI
     import createLinktreeUI from './linktree-ui/linktree-ui.js';
     
     const config = {
       name: 'Your Name',
       bio: 'Your bio here',
       avatar: 'HJ',  // or image URL
       themeName: 'ocean',
       links: [
         { title: 'My Website', url: 'https://example.com' }
       ]
     };
     
     const linktree = createLinktreeUI(config);
     document.getElementById('app').appendChild(linktree.get());
   </script>
   ```

3. **View in browser** - Open `index.html` at `localhost:3000`

---

## 📖 Basic Configuration

```javascript
const config = {
  // Profile
  name: 'Hydra Juice',
  bio: 'Your daily dose of vitamin C',
  avatar: 'HJ',                              // text avatar
  // OR avatar: 'https://example.com/avatar.jpg'  // image avatar
  
  // Theme
  themeName: 'ocean',                        // or 'hydra', 'dark', 'neon', 'gradient'
  
  // More options...
  links: [...],
  groups: [...],
  images: [...],
  videos: [...],
  donations: [...],
  socialLinks: [...]
};

const linktree = createLinktreeUI(config);
document.getElementById('app').appendChild(linktree.get());
```

---

## 🎨 Themes

### Built-in Themes

| Theme | Style | Best For |
|-------|-------|----------|
| `'hydra'` | Sage Green | Modern, Professional |
| `'dark'` | Dark Mode | Creative, Tech |
| `'neon'` | Cyber Neon | Gaming, Creative |
| `'ocean'` | Blue Water | Calm, Professional |
| `'gradient'` | Purple Gradient | Vibrant, Fun |

### Custom Theme

```javascript
const config = {
  theme: {
    backgroundColor: '#1a1a1a',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundImage: 'https://example.com/bg.jpg',
    backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
    
    textColor: '#ffffff',
    bioColor: '#b0b0b0',
    buttonBg: '#2d2d2d',
    buttonText: '#ffffff',
    buttonHoverBg: '#3d3d3d',
    accentColor: '#6366f1',
    
    fontFamily: '"Segoe UI", sans-serif'
  }
};
```

---

## 🔗 Links

### Single Links

```javascript
const config = {
  links: [
    {
      title: 'My Portfolio',
      url: 'https://portfolio.com',
      
      // Optional: Custom styling
      bgColor: '#ff6b6b',
      textColor: '#ffffff',
      borderRadius: '12px',
      border: '2px solid #ff0000',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      
      // Optional: Hover effects
      hoverBgColor: '#ff5252',
      hoverBoxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      hoverTransform: 'scale(1.05)',
      
      // Optional: Custom font
      fontFamily: "'Comic Neue', cursive"
    }
  ]
};
```

### Grouped Links

```javascript
const config = {
  groups: [
    {
      title: 'Main Links',
      links: [
        { title: 'Link 1', url: 'https://...' },
        { title: 'Link 2', url: 'https://...' }
      ]
    },
    {
      title: 'More Info',
      links: [
        { title: 'Link 3', url: 'https://...' },
        { title: 'Link 4', url: 'https://...' }
      ]
    }
  ]
};
```

---

## 📸 Images

```javascript
const config = {
  images: [
    {
      title: 'Gallery (optional)',
      src: 'https://example.com/image.jpg',
      alt: 'Description',
      
      // Sizing
      width: '100%',
      height: '250px',
      
      // Styling
      borderRadius: '12px',
      border: '2px solid rgba(255,255,255,0.2)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      objectFit: 'cover',
      
      // Optional: Make clickable
      url: 'https://example.com/gallery'
    }
  ]
};
```

---

## 🎬 Videos

```javascript
const config = {
  videos: [
    {
      title: 'My Latest Video',
      youtube_id: 'dQw4w9WgXcQ'
      // or embed_url: 'https://www.youtube.com/embed/VIDEO_ID'
    }
  ]
};
```

---

## 💝 Donations

```javascript
const config = {
  donations: [
    {
      title: '☕ Buy me a coffee',
      url: 'https://ko-fi.com/username',
      icon: 'fas fa-mug-hot',
      buttonColor: '#FF5E78',
      buttonText: '#ffffff'
    },
    {
      title: '💖 Support me',
      url: 'https://www.buymeacoffee.com/username',
      icon: 'fas fa-heart',
      buttonColor: '#FFDD00',
      buttonText: '#000000'
    },
    {
      title: '🎉 Patreon',
      url: 'https://patreon.com/username',
      icon: 'fab fa-patreon',
      buttonColor: '#FF424F',
      buttonText: '#ffffff'
    }
  ]
};
```

---

## 🌐 Social Links

```javascript
const config = {
  socialLinks: [
    { icon: 'fab fa-github', url: 'https://github.com/username' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/username' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com/username' },
    { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@username' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com/@username' },
    { icon: 'fab fa-discord', url: 'https://discord.gg/username' },
    { icon: 'fas fa-globe', url: 'https://website.com' }
  ]
};
```

---

## 🔤 Google Fonts

```javascript
const config = {
  // Load fonts
  googleFonts: ['Poppins:400;600;700', 'Playfair+Display:700'],
  
  // Global font
  fontFamily: "'Poppins', sans-serif",
  
  // Element-specific fonts
  nameFont: "'Playfair Display', serif",
  bioFont: "'Poppins', sans-serif",
  linkFont: "'Poppins', sans-serif"
};
```

### Popular Google Fonts

```
'Poppins:400;600;700'
'Playfair+Display:700'
'Roboto:400;500;700'
'Inter:400;600;700'
'Comic+Neue:400;700'
'Outfit:500;600;700'
```

---

## 💾 Complete Example

```javascript
import createLinktreeUI from './linktree-ui.js';

const config = {
  // Profile
  name: 'Hydra Juice',
  bio: 'Your daily dose of vitamin C ✨',
  avatar: 'HJ',
  
  // Theme & Fonts
  themeName: 'ocean',
  googleFonts: ['Poppins:400;600;700'],
  fontFamily: "'Poppins', sans-serif",
  
  // Links
  groups: [
    {
      title: 'Our Products',
      links: [
        {
          title: 'Shop Now',
          url: 'https://shop.example.com',
          bgColor: '#4CAF50',
          borderRadius: '12px'
        },
        {
          title: 'Menu',
          url: 'https://menu.example.com'
        }
      ]
    },
    {
      title: 'Learn More',
      links: [
        { title: 'About Us', url: 'https://example.com/about' },
        { title: 'Blog', url: 'https://example.com/blog' }
      ]
    }
  ],
  
  // Media
  images: [
    {
      src: 'https://example.com/products.jpg',
      borderRadius: '12px',
      url: 'https://shop.example.com'
    }
  ],
  
  videos: [
    { title: 'Our Story', youtube_id: 'dQw4w9WgXcQ' }
  ],
  
  // Support & Social
  donations: [
    {
      title: '☕ Support Us',
      url: 'https://ko-fi.com/hydrajuice',
      icon: 'fas fa-mug-hot',
      buttonColor: '#FF5E78'
    }
  ],
  
  socialLinks: [
    { icon: 'fab fa-instagram', url: 'https://instagram.com/hydrajuice' },
    { icon: 'fab fa-tiktok', url: 'https://tiktok.com/hydrajuice' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com/hydrajuice' }
  ]
};

const linktree = createLinktreeUI(config);
document.getElementById('app').appendChild(linktree.get());
```

---

## 📚 Full Documentation

For **complete configuration options and advanced usage**, see [linktree-ui/CHEATSHEET.md](linktree-ui/CHEATSHEET.md)

---

## 🎯 Display Order

Elements appear in this order on the page:

1. Profile (Avatar + Name + Bio)
2. Links & Groups
3. Images
4. Videos
5. Donation Buttons
6. Social Icons
7. Bottom Image

---

## 🛠️ File Structure

```
project/
├── linktree-ui/
│   ├── linktree-ui.js          # Main component
│   └── CHEATSHEET.md           # Full documentation
├── index.html                  # Example page
├── index.js                    # Example configuration
└── el.js                       # DOM library (dependency)
```

---

## 🎨 Styling Tips

### Colors Format
- Hex: `'#ff6b6b'`
- RGB: `'rgb(255, 107, 107)'`
- RGBA: `'rgba(255, 107, 107, 0.8)'`
- Named: `'red'`, `'blue'`

### Transform Effects
- `'scale(1.05)'` - Slight zoom
- `'scale(1.1)'` - Bigger zoom
- `'translateY(-2px)'` - Lift up
- `'rotate(5deg)'` - Rotate
- `'skewY(2deg)'` - Skew

### Border Radius
- `'0px'` - Square
- `'8px'` - Slightly rounded
- `'12px'` - Medium rounded
- `'20px'` - More rounded
- `'50%'` - Perfect circle

---

## ⚙️ Requirements

- Modern browser with ES6 modules support
- [el.js](https://github.com/slice-code/el.js) library (included)
- [Font Awesome](https://fontawesome.com) CDN (for social icons)
- Internet connection (for Google Fonts)

---

## 🤝 Support

Build something awesome with Linktree UI? Let me know!

- ☕ [Support via Ko-fi](https://ko-fi.com/gugusdarmayanto)
- 🐛 [Report Issues](https://github.com)

---

## 📄 License

Built with ❤️ using el.js

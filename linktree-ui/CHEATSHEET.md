# Linktree UI - Cheat Sheet

## Quick Start

```js
import createLinktreeUI from './linktree-ui/linktree-ui.js';

const config = {
    name: 'Your Name',
    bio: 'Your bio',
    avatar: 'HJ',  // or image URL
    themeName: 'ocean',
    links: [
        { title: 'Link 1', url: 'https://example.com', icon: null }
    ]
};

const linktree = createLinktreeUI(config);
document.getElementById('app').appendChild(linktree.get());
```

---

## Configuration Properties

### Basic Info
```js
{
    name: 'User Name',                    // Profile name
    bio: 'Short bio description',         // Bio text
    avatar: 'HJ',                         // Text avatar (initials)
    // OR avatar: 'https://...jpg',       // Image avatar
    themeName: 'ocean',                   // Theme name
    bottomImage: 'https://...'            // Optional footer image
}
```

---

## Themes

### Built-in Themes
- `'hydra'` - Sage green (default)
- `'dark'` - Dark mode elegant
- `'neon'` - Cyber neon style
- `'ocean'` - Blue ocean vibes
- `'gradient'` - Purple gradient

### Usage
```js
themeName: 'ocean'
```

### Custom Theme
```js
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
```

---

## Avatar Customization

### Text Avatar (Auto-detect)
```js
avatar: 'HJ'              // Displays as text on colored circle
avatar: 'AB'              // Works with any text
```

### Image Avatar (Auto-detect)
```js
avatar: 'https://example.com/avatar.jpg'  // HTTP(S) URL
avatar: '/path/to/avatar.jpg'             // Relative path
```

---

## Google Fonts

### Load Google Fonts
```js
googleFonts: ['Poppins:400;600;700', 'Playfair+Display:700']
```

### Font Configuration
```js
fontFamily: "'Poppins', sans-serif",       // Global font (all elements)
nameFont: "'Playfair Display', serif",     // Name/title only
bioFont: "'Poppins', sans-serif",          // Bio only
linkFont: "'Poppins', sans-serif"          // Links default
```

### Popular Google Fonts
| Font | Format |
|------|--------|
| Poppins | `'Poppins:400;600;700'` |
| Playfair Display | `'Playfair+Display:700'` |
| Roboto | `'Roboto:400;500;700'` |
| Inter | `'Inter:400;600;700'` |
| Comic Neue | `'Comic+Neue:400;700'` |
| Outfit | `'Outfit:500;600;700'` |

**Note:** Replace spaces with `+`, add weights as `:400;600;700`

---

## Links & Groups

### Individual Links
```js
links: [
    {
        title: 'Link Title',
        url: 'https://example.com',
        icon: null,                       // Optional FontAwesome icon
        
        // Styling (optional)
        bgColor: '#ff6b6b',
        textColor: '#ffffff',
        borderRadius: '12px',
        border: '2px solid #ff0000',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        
        // Hover effects
        hoverBgColor: '#ff5252',
        hoverBoxShadow: '0 6px 20px rgba(0,0,0,0.4)',
        hoverTransform: 'scale(1.05)',
        
        fontFamily: "'Comic Neue', cursive"
    }
]
```

### Grouped Links
```js
groups: [
    {
        title: 'Main Links',
        links: [
            { title: 'Link 1', url: '...' },
            { title: 'Link 2', url: '...' }
        ]
    },
    {
        title: 'More Info',
        links: [
            { title: 'Link 3', url: '...' },
            { title: 'Link 4', url: '...' }
        ]
    }
]
```

### Link Styling Options

| Property | Example | Description |
|----------|---------|-------------|
| `bgColor` | `'#ff6b6b'` | Background color |
| `textColor` | `'#ffffff'` | Text color |
| `borderRadius` | `'12px'` | Rounded corners |
| `border` | `'2px solid #ff0000'` | Border style |
| `boxShadow` | `'0 4px 15px rgba(0,0,0,0.3)'` | Shadow |
| `hoverBgColor` | `'#ff5252'` | Hover background |
| `hoverBoxShadow` | `'0 6px 20px rgba(0,0,0,0.4)'` | Hover shadow |
| `hoverTransform` | `'scale(1.05)'` | Hover transform |
| `fontFamily` | `"'Comic Neue', cursive"` | Custom font |

---

## Images

### Add Gallery Images
```js
images: [
    {
        title: 'Gallery Title (optional)',
        src: 'https://example.com/image.jpg',
        alt: 'Image description',
        
        // Dimensions
        width: '100%',
        height: '250px',
        
        // Styling
        borderRadius: '12px',              // '0px', '8px', '50%' (circle)
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        objectFit: 'cover',                // cover, contain, fill
        
        // Optional: Make clickable
        url: 'https://example.com/gallery'
    }
]
```

### Border-radius Examples
- `'0px'` - Square
- `'8px'` - Slightly rounded
- `'12px'` - Medium rounded
- `'20px'` - More rounded
- `'50%'` - Perfect circle

---

## Videos

### Embed YouTube
```js
videos: [
    {
        title: 'Video Title (optional)',
        youtube_id: 'dQw4w9WgXcQ'
    }
]
```

### Custom Embed
```js
videos: [
    {
        title: 'Video Title',
        embed_url: 'https://www.youtube.com/embed/VIDEO_ID'
    }
]
```

---

## Donation Buttons

### Ko-fi
```js
donations: [
    {
        title: '☕ Buy me a coffee',
        url: 'https://ko-fi.com/username',
        icon: 'fas fa-mug-hot',
        buttonColor: '#FF5E78',
        buttonText: '#ffffff'
    }
]
```

### Buy Me a Coffee
```js
{
    title: '💖 Support me',
    url: 'https://www.buymeacoffee.com/username',
    icon: 'fas fa-heart',
    buttonColor: '#FFDD00',
    buttonText: '#000000'
}
```

### Patreon
```js
{
    title: '🎉 Patreon',
    url: 'https://patreon.com/username',
    icon: 'fab fa-patreon',
    buttonColor: '#FF424F',
    buttonText: '#ffffff'
}
```

### PayPal
```js
{
    title: '💳 PayPal',
    url: 'https://paypal.me/username',
    icon: 'fab fa-paypal',
    buttonColor: '#003087',
    buttonText: '#ffffff'
}
```

---

## Social Links

### Add Social Icons
```js
socialLinks: [
    {
        icon: 'fab fa-github',
        url: 'https://github.com/username'
    },
    {
        icon: 'fab fa-twitter',
        url: 'https://twitter.com/username'
    },
    {
        icon: 'fab fa-instagram',
        url: 'https://instagram.com/username'
    },
    {
        icon: 'fab fa-tiktok',
        url: 'https://tiktok.com/@username'
    },
    {
        icon: 'fab fa-youtube',
        url: 'https://youtube.com/@username'
    }
]
```

### FontAwesome Icons
- `'fab fa-github'` - GitHub (brands)
- `'fab fa-twitter'` - Twitter
- `'fab fa-instagram'` - Instagram
- `'fab fa-tiktok'` - TikTok
- `'fab fa-youtube'` - YouTube
- `'fab fa-discord'` - Discord
- `'fas fa-globe'` - Website (solid)
- `'fas fa-envelope'` - Email
- `'fas fa-phone'` - Phone

---

## Complete Example

```js
const config = {
    // Basic
    name: 'Hydra Juice',
    bio: 'Your daily dose of vitamin C',
    avatar: 'HJ',
    themeName: 'ocean',
    
    // Fonts
    googleFonts: ['Poppins:400;600;700'],
    fontFamily: "'Poppins', sans-serif",
    nameFont: "'Poppins', sans-serif",
    
    // Links
    groups: [
        {
            title: 'Main Links',
            links: [
                {
                    title: 'Our Drinks',
                    url: 'https://example.com/drinks',
                    bgColor: '#4CAF50',
                    borderRadius: '12px'
                },
                {
                    title: 'Find Us',
                    url: 'https://example.com/locations'
                }
            ]
        }
    ],
    
    // Images
    images: [
        {
            title: 'Our Products',
            src: 'https://example.com/products.jpg',
            borderRadius: '12px',
            url: 'https://example.com/shop'
        }
    ],
    
    // Videos
    videos: [
        {
            title: 'Latest Update',
            youtube_id: 'dQw4w9WgXcQ'
        }
    ],
    
    // Donations
    donations: [
        {
            title: '☕ Support Us',
            url: 'https://ko-fi.com/hydrajuice',
            icon: 'fas fa-mug-hot',
            buttonColor: '#FF5E78'
        }
    ],
    
    // Social
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

## Element Display Order

1. Profile (Avatar + Name + Bio)
2. Links & Groups
3. Images
4. Videos
5. Donation Buttons
6. Social Icons
7. Bottom Image

---

## Color Format

All colors support:
- Hex: `'#ff6b6b'`
- RGB: `'rgb(255, 107, 107)'`
- RGBA: `'rgba(255, 107, 107, 0.8)'`
- Named: `'red'`, `'blue'`

---

## Hover Effects

### Transform Options
- `'scale(1.05)'` - Slight zoom
- `'scale(1.1)'` - Bigger zoom
- `'translateY(-2px)'` - Lift up
- `'translateY(2px)'` - Push down
- `'rotate(5deg)'` - Rotate
- `'skewY(2deg)'` - Skew

---

## Tips & Tricks

### Use Text Avatar for Initial
```js
avatar: 'GU'  // Good for Gugus
```

### Match Colors with Theme
```js
// In ocean theme, use matching blues
bgColor: '#457b9d',
accentColor: '#e63946'
```

### Responsive Images
```js
width: '100%',      // Always full width
height: 'auto'      // Maintains aspect ratio
```

### Accessible Links
```js
{
    title: 'GitHub Profile',
    url: 'https://github.com/username',
    icon: 'fab fa-github'
}
```

---

## Export & Load

```js
// Load both function and themes
import createLinktreeUI, { themes, loadGoogleFonts } from './linktree-ui/linktree-ui.js';

// Access built-in themes
console.log(themes.ocean);
console.log(themes.dark);

// Manually load fonts if needed
loadGoogleFonts(['Poppins:400;700']);
```

---

## Common Issues & Solutions

### Font not loading
- Check font name format: `'FontName:weights'`
- Replace spaces with `+`: `Playfair+Display`
- Add weights: `:400;600;700`

### Image not showing
- Use full URL (http/https)
- Check CORS settings
- Set width/height explicitly

### Custom font for link not working
- Include font in `googleFonts` array first
- Use correct CSS font-family format: `"'FontName', serif"`

### Avatar text too big/small
- Avatar size fixed at 120px
- Adjust global fontSize if needed

---

## Resources

- [Google Fonts](https://fonts.google.com)
- [FontAwesome Icons](https://fontawesome.com)
- [CSS Colors](https://www.w3schools.com/css/css_colors.asp)
- [CSS Transforms](https://www.w3schools.com/css/css3_transforms.asp)

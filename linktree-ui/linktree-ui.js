// Linktree UI Builder using el.js
// Creates a beautiful link sharing landing page

// Load Google Fonts dynamically
function loadGoogleFonts(fontNames = []) {
  if (fontNames && fontNames.length > 0) {
    const fontQuery = fontNames
      .map(font => font.replace(/\s+/g, '+'))
      .join('&family=');
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

// Built-in themes
const themes = {
  hydra: {
    backgroundColor: '#5a7a6b',
    textColor: '#ffffff',
    bioColor: '#cbd5e1',
    buttonBg: '#c9d5d0',
    buttonText: '#334155',
    buttonHoverBg: '#b8c9c4',
    buttonHoverText: '#334155',
    accentColor: '#ff8c42',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  dark: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    bioColor: '#b0b0b0',
    buttonBg: '#2d2d2d',
    buttonText: '#ffffff',
    buttonHoverBg: '#3d3d3d',
    buttonHoverText: '#ffffff',
    accentColor: '#6366f1',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  neon: {
    backgroundColor: '#0a0e27',
    textColor: '#00ff88',
    bioColor: '#00cc66',
    buttonBg: '#1a1f3a',
    buttonText: '#00ff88',
    buttonHoverBg: '#2a2f4a',
    buttonHoverText: '#00ff88',
    accentColor: '#ff006e',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  ocean: {
    backgroundColor: '#0f3460',
    textColor: '#ffffff',
    bioColor: '#a8dadc',
    buttonBg: '#457b9d',
    buttonText: '#ffffff',
    buttonHoverBg: '#1d3557',
    buttonHoverText: '#ffffff',
    accentColor: '#e63946',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  gradient: {
    backgroundColor: '#667eea',
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    bioColor: '#e8e8f0',
    buttonBg: 'rgba(255, 255, 255, 0.2)',
    buttonText: '#ffffff',
    buttonHoverBg: 'rgba(255, 255, 255, 0.3)',
    buttonHoverText: '#ffffff',
    accentColor: '#ff6b6b',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  }
};

function createLinktreeUI(config = {}) {
  // Default configuration
  const {
    name = 'Your Name',
    bio = 'Welcome to my link hub',
    avatar = 'https://via.placeholder.com/120/6366f1/ffffff?text=A',
    isPreview = false,  // NEW: If true, content will auto-resize instead of filling viewport
    links = [],
    groups = [],  // Array of link groups
    videos = [],  // Array of videos
    images = [],  // Array of custom images
    donations = [], // Array of donation buttons
    socialLinks = [],
    bottomImage = null,
    themeName = 'hydra',
    theme = null,
    googleFonts = [],  // NEW: Array of Google Font names to load
    fontFamily = null, // NEW: Global font family (overrides theme font)
    nameFont = null,   // NEW: Font for name/title
    bioFont = null,    // NEW: Font for bio
    linkFont = null,    // NEW: Default font for links
    bgMode = '',         // Background mode: 'color', 'gradient', 'image' or '' (auto from theme)
    bgColor = '',        // Custom background color
    bgGradient = '',     // Custom background gradient
    bgImage = ''         // Custom background image URL
  } = config;

  // Load Google Fonts if provided
  if (googleFonts && googleFonts.length > 0) {
    loadGoogleFonts(googleFonts);
  }

  // Get theme - merge custom overrides on top of built-in theme
  const baseTheme = themes[themeName] || themes.hydra;
  const activeTheme = theme ? { ...baseTheme, ...Object.fromEntries(Object.entries(theme).filter(([_, v]) => v !== undefined && v !== '')) } : baseTheme;

  // Create main container CSS
  const containerCSS = {
    minHeight: '100vh',
    height: isPreview ? 'auto' : '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: fontFamily || activeTheme.fontFamily,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: isPreview ? 'scroll' : 'fixed'
  };

  // Handle background based on bgMode (explicit choice) or theme defaults
  const effectiveBgMode = bgMode || (activeTheme.backgroundImage ? 'image' : activeTheme.backgroundGradient ? 'gradient' : 'color');

  if (effectiveBgMode === 'image') {
    const imgUrl = bgImage || activeTheme.backgroundImage;
    if (imgUrl) {
      containerCSS.backgroundImage = `url('${imgUrl}')`;
      if (activeTheme.backgroundOverlay) {
        containerCSS.backgroundColor = activeTheme.backgroundOverlay;
        containerCSS.backgroundBlendMode = 'multiply';
      }
    }
  } else if (effectiveBgMode === 'gradient') {
    const grad = bgGradient || activeTheme.backgroundGradient;
    if (grad) {
      containerCSS.background = grad;
    }
  } else {
    containerCSS.background = bgColor || activeTheme.backgroundColor;
  }

  // Create main container
  const container = el('div')
    .css(containerCSS);

  // Create content wrapper
  const content = el('div')
    .css({
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center'
    });

    // Create avatar - can be image or text
    const isImageAvatar = avatar && (avatar.includes('http') || avatar.includes('/') || avatar.startsWith('data:'));
    let imgWrapper;

    if (isImageAvatar) {
      // Avatar as image
      imgWrapper = el('div')
        .css({
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        })
        .html(`<img src="${avatar}" alt="${name}" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid ${activeTheme.accentColor}; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" />`);
    } else {
      // Avatar as text
      imgWrapper = el('div')
        .css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `3px solid ${activeTheme.accentColor}`,
          backgroundColor: activeTheme.accentColor,
          margin: '0 auto 20px auto',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#ffffff',
          fontFamily: fontFamily || activeTheme.fontFamily,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        })
        .text(avatar);
    }

  // Name
  const nameEl = el('h1')
    .text(name)
    .css({
      fontSize: '28px',
      fontWeight: 'bold',
      color: activeTheme.textColor,
      margin: '10px 0 5px 0',
      fontFamily: nameFont || fontFamily || activeTheme.fontFamily
    });

  // Bio
  const bioEl = el('p')
    .text(bio)
    .css({
      fontSize: '14px',
      color: activeTheme.bioColor,
      marginBottom: '12px',
      lineHeight: '1.5',
      fontFamily: bioFont || fontFamily || activeTheme.fontFamily
    });

  // Social icons - built early, placed after bio
  let socialContainerEl = null;
  if (socialLinks && socialLinks.length > 0) {
    const socialContainer = el('div')
      .css({
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '15px'
      });

    const socialIcons = socialLinks.map(social => {
      return el('a')
        .attr('href', social.url)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .html(`<i class="${social.icon}"></i>`)
        .css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          color: activeTheme.textColor,
          textDecoration: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        })
        .on('mouseenter', function() {
          el(this).css({
            transform: 'scale(1.15)',
            opacity: '0.8'
          });
        })
        .on('mouseleave', function() {
          el(this).css({
            transform: 'scale(1)',
            opacity: '1'
          });
        });
    });

    socialContainer.child(socialIcons);
    socialContainerEl = socialContainer;
  }

  // Links container
  const linksContainer = el('div')
    .css({
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    });

  // Helper function to create link button
  const createLinkButton = (link) => {
    // Default button styles with custom overrides
    const buttonStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '14px 20px',
      backgroundColor: link.bgColor || activeTheme.buttonBg,
      color: link.textColor || activeTheme.buttonText,
      textDecoration: 'none',
      borderRadius: link.borderRadius || activeTheme.buttonBorderRadius || '24px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: link.border || activeTheme.buttonBorder || 'none',
      boxShadow: link.boxShadow || activeTheme.buttonBoxShadow || 'none',
      fontFamily: link.fontFamily || linkFont || fontFamily || activeTheme.fontFamily
    };

    const linkBtn = el('a')
      .attr('href', link.url)
      .attr('target', '_blank')
      .attr('rel', 'noopener noreferrer')
      .css(buttonStyles)
      .on('mouseenter', function() {
        el(this).css({
          backgroundColor: link.hoverBgColor || activeTheme.buttonHoverBg,
          color: link.hoverTextColor || activeTheme.buttonHoverText,
          transform: link.hoverTransform || 'scale(1.02)',
          boxShadow: link.hoverBoxShadow || 'none'
        });
      })
      .on('mouseleave', function() {
        el(this).css({
          backgroundColor: link.bgColor || activeTheme.buttonBg,
          color: link.textColor || activeTheme.buttonText,
          transform: 'scale(1)',
          boxShadow: link.boxShadow || 'none'
        });
      });

    // Add icon if provided
    if (link.icon) {
      linkBtn.html(`<i class="${link.icon}"></i> ${link.title}`);
    } else {
      linkBtn.text(link.title);
    }

    return linkBtn;
  };

  // Create individual link buttons
  const linkElements = (links || []).map(createLinkButton);

  // Create grouped links (if provided)
  let allLinkElements = [...linkElements];
  if (groups && groups.length > 0) {
    groups.forEach(group => {
      // Only show group header if group has a name
      const groupName = group.name || group.title;
      if (groupName && groupName.trim() !== '') {
        const groupTitle = el('div')
          .text(groupName)
          .css({
            fontSize: '12px',
            fontWeight: 'bold',
            color: activeTheme.textColor,
            marginTop: '10px',
            marginBottom: '8px',
            opacity: '0.8',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          });

        allLinkElements.push(groupTitle);
      }

      // Group links
      if (group.links && group.links.length > 0) {
        group.links.forEach(link => {
          allLinkElements.push(createLinkButton(link));
        });
      }
    });
  }

  // Assemble the UI
  content
    .child(imgWrapper)
    .child(nameEl)
    .child(bioEl);

  // Social icons right after bio/description
  if (socialContainerEl) {
    content.child(socialContainerEl.get());
  }

  content.child(linksContainer.child(allLinkElements).get());

  // Add videos if provided
  if (videos && videos.length > 0) {
    const videosContainer = el('div')
      .css({
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '30px'
      });

    videos.forEach(video => {
      // Video title (optional)
      if (video.title) {
        const videoTitle = el('div')
          .text(video.title)
          .css({
            fontSize: '14px',
            fontWeight: 'bold',
            color: activeTheme.textColor,
            marginBottom: '8px'
          });
        videosContainer.child(videoTitle);
      }

      // Video embed wrapper
      const videoWrapper = el('div')
        .css({
          width: '100%',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px'
        })
        .html(`<iframe
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
          src="${video.embed_url || `https://www.youtube.com/embed/${video.youtube_id || ''}`}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`);

      videosContainer.child(videoWrapper);
    });

    content.child(videosContainer.get());
  }

  // Add custom images if provided
  if (images && images.length > 0) {
    const imagesContainer = el('div')
      .css({
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '30px'
      });

    images.forEach(image => {
      // Image title (optional)
      if (image.title) {
        const imageTitle = el('div')
          .text(image.title)
          .css({
            fontSize: '14px',
            fontWeight: 'bold',
            color: activeTheme.textColor,
            marginBottom: '8px'
          });
        imagesContainer.child(imageTitle);
      }

      // Build image HTML with custom styles
      const imageStyles = `
        width: ${image.width || '100%'};
        height: ${image.height || 'auto'};
        border-radius: ${image.borderRadius || '8px'};
        object-fit: ${image.objectFit || 'cover'};
        border: ${image.border || 'none'};
        box-shadow: ${image.boxShadow || 'none'};
        border-radius: ${image.borderRadius || '8px'};
        cursor: ${image.url ? 'pointer' : 'default'};
        transition: all 0.3s ease;
      `;

      let imageWrapper = el('div')
        .css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        });

      // If image has a link, wrap it in anchor tag
      if (image.url) {
        imageWrapper.html(`
          <a href="${image.url}" target="_blank" rel="noopener noreferrer" style="display: flex; width: 100%; justify-content: center;">
            <img 
              src="${image.src}" 
              alt="${image.alt || 'Image'}"
              style="${imageStyles}"
            />
          </a>
        `);
      } else {
        // Just display the image
        imageWrapper.html(`
          <img 
            src="${image.src}" 
            alt="${image.alt || 'Image'}"
            style="${imageStyles}"
          />
        `);
      }

      imagesContainer.child(imageWrapper);
    });

    content.child(imagesContainer.get());
  }

  // Add donation buttons if provided
  if (donations && donations.length > 0) {
    const donationsContainer = el('div')
      .css({
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '30px'
      });

    donations.forEach(donation => {
      const donationBtn = el('a')
        .attr('href', donation.url)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '14px 20px',
          backgroundColor: donation.buttonColor || activeTheme.accentColor,
          color: donation.buttonText || '#ffffff',
          textDecoration: 'none',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: 'none'
        })
        .on('mouseenter', function() {
          el(this).css({
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
          });
        })
        .on('mouseleave', function() {
          el(this).css({
            transform: 'translateY(0)',
            boxShadow: 'none'
          });
        });

      // Add icon and text
      if (donation.icon) {
        donationBtn.html(`<i class="${donation.icon}"></i> ${donation.title}`);
      } else {
        donationBtn.text(donation.title);
      }

      donationsContainer.child(donationBtn);
    });

    content.child(donationsContainer.get());
  }

  // Add bottom image if provided
  if (bottomImage) {
    const bottomImageWrapper = el('div')
      .css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30px'
      })
      .html(`<img src="${bottomImage}" alt="showcase" style="border-radius: 12px; object-fit: cover; max-width: 100%; max-height: 200px;" />`);

    content.child(bottomImageWrapper.get());
  }

  container.child(content);

  return container;
}

export default createLinktreeUI;
export { themes, loadGoogleFonts };

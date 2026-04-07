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
    label: 'Hydra',
    category: 'Nature',
    description: 'Soft green and ivory tones with a calm, organic touch.',
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
    label: 'Dark',
    category: 'Modern',
    description: 'Minimal dark mode style with strong contrast and depth.',
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
    label: 'Neon',
    category: 'Vibrant',
    description: 'Bold neon accents and a dramatic cyberpunk palette.',
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
    label: 'Ocean',
    category: 'Nature',
    description: 'Deep blue waters with soft coral highlights.',
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
  pastel: {
    label: 'Pastel',
    category: 'Soft',
    description: 'Gentle pastel tones with creamy backgrounds and muted highlights.',
    backgroundColor: '#f8f0ff',
    textColor: '#302b4b',
    bioColor: '#6b7280',
    buttonBg: '#e9d5ff',
    buttonText: '#3f3c74',
    buttonHoverBg: '#d8b4fe',
    buttonHoverText: '#2d2a4c',
    accentColor: '#fd7f92',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  sunset: {
    label: 'Sunset',
    category: 'Warm',
    description: 'Warm sunset hues with glowing orange and pink accents.',
    backgroundColor: '#fbbf77',
    backgroundGradient: 'linear-gradient(135deg, #fbbf77 0%, #f97316 100%)',
    textColor: '#1f2937',
    bioColor: '#4b5563',
    buttonBg: '#ffffff',
    buttonText: '#b45309',
    buttonHoverBg: '#fde68a',
    buttonHoverText: '#92400e',
    accentColor: '#dc2626',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  retro: {
    label: 'Retro',
    category: 'Vibrant',
    description: 'Bold retro colors with bright highlights and playful contrast.',
    backgroundColor: '#1f2937',
    backgroundGradient: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
    textColor: '#f8fafc',
    bioColor: '#cbd5e1',
    buttonBg: '#f97316',
    buttonText: '#ffffff',
    buttonHoverBg: '#facc15',
    buttonHoverText: '#111827',
    accentColor: '#22c55e',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  forest: {
    label: 'Forest',
    category: 'Nature',
    description: 'Rich forest greens with earthy accents for a grounded look.',
    backgroundColor: '#162b21',
    backgroundGradient: 'linear-gradient(135deg, #162b21 0%, #3f704d 100%)',
    textColor: '#e9f5ee',
    bioColor: '#b8d8c2',
    buttonBg: '#4f826b',
    buttonText: '#ffffff',
    buttonHoverBg: '#6aa68f',
    buttonHoverText: '#0f172a',
    accentColor: '#a3e635',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  minimal: {
    label: 'Minimal',
    category: 'Modern',
    description: 'Clean monochrome style with crisp spacing and subtle accents.',
    backgroundColor: '#f8fafc',
    textColor: '#111827',
    bioColor: '#4b5563',
    buttonBg: '#ffffff',
    buttonText: '#111827',
    buttonHoverBg: '#e2e8f0',
    buttonHoverText: '#111827',
    accentColor: '#2563eb',
    fontFamily: '"Helvetica Neue", Arial, sans-serif'
  },
  glass: {
    label: 'Glass',
    category: 'Soft',
    description: 'Frosted glass effect with cool tones and translucent UI.',
    backgroundColor: '#f3f4f6',
    textColor: '#111827',
    bioColor: '#6b7280',
    buttonBg: 'rgba(255,255,255,0.75)',
    buttonText: '#111827',
    buttonHoverBg: 'rgba(255,255,255,0.9)',
    buttonHoverText: '#111827',
    accentColor: '#0ea5e9',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  gradient: {
    label: 'Gradient',
    category: 'Modern',
    description: 'Soft gradient hero background with luminous accents.',
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
    imageGroups = [], // Array of image groups
    imageColumns = 1,
    donations = [], // Array of donation buttons
    socialLinks = [],
    bottomImage = null,
    sectionOrder = [],
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
    bgImage = '',        // Custom background image URL
    bgSize = 'cover'     // Custom background size: cover / contain / auto
  } = config;

  // Helper: ensure font family values with spaces are quoted
  function formatFontFamily(font) {
    if (!font) return '';
    const trimmed = font.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed;
    }
    return trimmed.includes(' ') ? `"${trimmed}"` : trimmed;
  }

  // Load Google Fonts if provided
  if (googleFonts && googleFonts.length > 0) {
    loadGoogleFonts(googleFonts);
  }

  // Get theme - merge custom overrides on top of built-in theme
  const baseTheme = themes[themeName] || themes.hydra;
  const activeTheme = theme ? { ...baseTheme, ...Object.fromEntries(Object.entries(theme).filter(([_, v]) => v !== undefined && v !== '')) } : baseTheme;

  // Create main container CSS
  const containerCSS = {
    width: '100%',
    minHeight: '100%',
    height: 'auto',
    maxHeight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isPreview ? '30px 24px' : '20px',
    fontFamily: formatFontFamily(fontFamily || activeTheme.fontFamily),
    backgroundSize: bgSize || 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    boxSizing: 'border-box'
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
      maxWidth: isPreview ? '480px' : '500px',
      width: '100%',
      textAlign: 'center',
      margin: '0 auto',
      boxSizing: 'border-box'
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
      fontFamily: formatFontFamily(nameFont || fontFamily || activeTheme.fontFamily)
    });

  // Bio
  const bioEl = el('p')
    .text(bio)
    .css({
      fontSize: '14px',
      color: activeTheme.bioColor,
      marginBottom: '12px',
      lineHeight: '1.5',
      fontFamily: formatFontFamily(bioFont || fontFamily || activeTheme.fontFamily)
    });

  // Social icons - built early, placed after bio
  let socialContainerEl = null;
  if (socialLinks && socialLinks.length > 0) {
    const socialContainer = el('div')
      .css({
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '15px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '2px',
        // Optional: hide scrollbar for cleaner look (uncomment if diinginkan)
        // scrollbarColor: 'rgba(0,0,0,0.2) transparent',
        // msOverflowStyle: 'none',
        // '&::-webkit-scrollbar': { display: 'none' },
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
      fontFamily: formatFontFamily(link.fontFamily || linkFont || fontFamily || activeTheme.fontFamily)
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

  const sectionBlocks = {};

  if ((links && links.length > 0) || (groups && groups.length > 0)) {
    if (links && links.length > 0) {
      const linksContainer = el('div')
        .css({
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '30px',
          width: '100%',
          boxSizing: 'border-box'
        });

      links.forEach(link => {
        linksContainer.child(createLinkButton(link));
      });

      sectionBlocks.links = linksContainer.get();
    }

    if (groups && groups.length > 0) {
      groups.forEach(group => {
        const groupContainer = el('div')
          .css({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '30px',
            width: '100%',
            boxSizing: 'border-box'
          });

        if (group.name && group.name.trim() !== '') {
          groupContainer.child(
            el('div')
              .text(group.name)
              .css({
                fontSize: '12px',
                fontWeight: 'bold',
                color: activeTheme.textColor,
                marginBottom: '8px',
                opacity: '0.8',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              })
          );
        }

        if (group.links && group.links.length > 0) {
          group.links.forEach(link => {
            groupContainer.child(createLinkButton(link));
          });
        }

        sectionBlocks[group.id] = groupContainer.get();
      });
    }

    if (imageGroups && imageGroups.length > 0) {
      imageGroups.forEach(group => {
        if (!group.images || group.images.length === 0) return;

        const groupContainer = el('div')
          .css({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '30px',
            width: '100%',
            boxSizing: 'border-box'
          });

        if (group.name && group.name.trim() !== '') {
          groupContainer.child(
            el('div')
              .text(group.name)
              .css({
                fontSize: '12px',
                fontWeight: 'bold',
                color: activeTheme.textColor,
                marginBottom: '8px',
                opacity: '0.8',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              })
          );
        }

        const groupColumns = group.imageColumns || imageColumns;
        const imagesContainer = el('div')
          .css({
            display: 'grid',
            gridTemplateColumns: groupColumns === 2 ? '1fr 1fr' : '1fr',
            gap: '15px'
          });

        group.images.forEach(image => {
          const imageWrapper = el('div')
            .css({ display: 'flex', justifyContent: 'center', alignItems: 'center' });

          if (image.src) {
            if (image.url) {
              imageWrapper.html(`
                <a href="${image.url}" target="_blank" rel="noopener noreferrer" style="display: flex; width: 100%; justify-content: center;">
                  <img src="${image.src}" alt="${image.alt || 'Image'}" style="width: ${image.width || '100%'}; height: ${image.height || 'auto'}; border-radius: ${image.borderRadius || '8px'}; object-fit: ${image.objectFit || 'cover'}; border: ${image.border || 'none'}; box-shadow: ${image.boxShadow || 'none'}; transition: all 0.3s ease; cursor: pointer;" />
                </a>
              `);
            } else {
              imageWrapper.html(`
                <img src="${image.src}" alt="${image.alt || 'Image'}" style="width: ${image.width || '100%'}; height: ${image.height || 'auto'}; border-radius: ${image.borderRadius || '8px'}; object-fit: ${image.objectFit || 'cover'}; border: ${image.border || 'none'}; box-shadow: ${image.boxShadow || 'none'}; transition: all 0.3s ease; cursor: default;" />
              `);
            }
          } else {
            imageWrapper.html(`
              <div style="width: 100%; min-height: 120px; border-radius: ${image.borderRadius || '8px'}; border: 1px dashed #d1d5db; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; padding: 16px; box-sizing: border-box;">
                <i class="fas fa-image" style="font-size: 28px; margin-bottom: 8px;"></i>
                <span style="font-size: 12px;">No image selected</span>
              </div>
            `);
          }
          imagesContainer.child(imageWrapper);
        });

        groupContainer.child(imagesContainer.get());
        sectionBlocks[group.id] = groupContainer.get();
      });
    }
  }

  if (videos && videos.length > 0) {
    const videosContainer = el('div')
      .css({
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '30px',
        width: '100%',
        boxSizing: 'border-box'
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
          borderRadius: '12px',
          backgroundColor: '#000'
        });

      const iframeWrapper = el('div')
        .css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: '1'
        })
        .html(`<iframe
          style="width: 100%; height: 100%; border: none;"
          src="${video.embed_url || `https://www.youtube.com/embed/${video.youtube_id || ''}` }"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`);

      videoWrapper.child(iframeWrapper);

      if (video.cover) {
        const playUrl = video.embed_url || `https://www.youtube.com/embed/${video.youtube_id || ''}`;
        const autoplayUrl = playUrl.includes('?') ? `${playUrl}&autoplay=1` : `${playUrl}?autoplay=1`;

        const coverOverlay = el('div')
          .css({
            position: 'absolute',
            inset: '0',
            backgroundImage: `url('${video.cover}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: '2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          })
          .on('click', () => {
            const iframe = iframeWrapper.get().querySelector('iframe');
            if (iframe) {
              iframe.src = autoplayUrl;
            }
            coverOverlay.get().remove();
          });

        const playIcon = el('div')
          .css({
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
          })
          .html('<i class="fas fa-play" style="color:#fff; font-size:24px;"></i>');

        coverOverlay.child(playIcon);
        videoWrapper.child(coverOverlay);
      }

      videosContainer.child(videoWrapper);
    });

    sectionBlocks.videos = videosContainer.get();
  }

  // Add custom images if provided
  if (images && images.length > 0) {
    const imagesContainer = el('div')
      .css({
        display: 'grid',
        gridTemplateColumns: imageColumns === 2 ? '1fr 1fr' : '1fr',
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

      if (image.src) {
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
      } else {
        const placeholderStyles = `
          width: 100%;
          min-height: 120px;
          border-radius: ${image.borderRadius || '8px'};
          border: 1px dashed #d1d5db;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          padding: 16px;
          box-sizing: border-box;
        `;

        imageWrapper.html(`
          <div style="${placeholderStyles}">
            <i class="fas fa-image" style="font-size: 28px; margin-bottom: 8px;"></i>
            <span style="font-size: 12px;">No image selected</span>
          </div>
        `);
      }

      imagesContainer.child(imageWrapper);
    });

    sectionBlocks.images = imagesContainer.get();
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

    sectionBlocks.donations = donationsContainer.get();
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

    sectionBlocks.bottomImage = bottomImageWrapper.get();
  }

  const defaultOrder = ['links', ...(groups ? groups.map(group => group.id) : []), ...(imageGroups ? imageGroups.map(group => group.id) : []), 'images', 'videos', 'donations', 'bottomImage'];
  const effectiveSectionOrder = Array.isArray(sectionOrder) && sectionOrder.length ? [...new Set([...sectionOrder, ...defaultOrder])] : defaultOrder;
  effectiveSectionOrder.forEach((key) => {
    if (sectionBlocks[key]) {
      content.child(sectionBlocks[key]);
    }
  });

  container.child(content);

  return container;
}

export default createLinktreeUI;
export { themes, loadGoogleFonts };

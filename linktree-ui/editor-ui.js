/**
 * Linktree UI Editor - Professional Layout with Drag & Drop
 * Left: Sidebar nav | Center: Editor sections | Right: Live preview
 */

import createLinktreeUI, { themes } from './linktree-ui.js';

export default function createEditorUI(initConfig = {}) {
  // State
  let config = {
    name: 'Samantha Lee',
    bio: 'Product designer & creative thinker | Bringing ideas to life!',
    avatar: 'SL',
    themeName: 'gradient',
    theme: null,
    googleFonts: [],
    fontFamily: '',
    nameFont: '',
    bioFont: '',
    linkFont: '',
    groups: [
      {
        id: 'default',
        name: '',
        links: [
          { title: 'Instagram', url: 'https://instagram.com/slmobbin', icon: '' },
          { title: 'YouTube', url: 'https://youtube.com/slmobbin', icon: '' },
          { title: 'TikTok', url: 'https://tiktok.com/sammy', icon: '' }
        ]
      }
    ],
    links: [],
    videos: [],
    images: [],
    imageGroups: [],
    imageColumns: 1,
    donations: [],
    socialLinks: [
      { icon: 'fab fa-instagram', url: 'https://instagram.com' },
      { icon: 'fab fa-youtube', url: 'https://youtube.com' },
      { icon: 'fab fa-tiktok', url: 'https://tiktok.com' },
      { icon: 'fab fa-spotify', url: 'https://spotify.com' },
      { icon: 'fab fa-pinterest', url: 'https://pinterest.com' }
    ],
    bottomImage: '',
    sectionOrder: [],
    bgMode: '',
    bgColor: '',
    bgGradient: '',
    bgImage: '',
    ...initConfig
  };

  let currentSection = 'header';

  // ==================== MAIN LAYOUT ====================
  const container = el('div')
    .css({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      boxSizing: 'border-box'
    });

  let mobileSidebarOpen = false;

  const mobileMenuBtn = el('button')
    .text('Menu')
    .css({
      padding: '10px 18px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'none'
    })
    .on('click', () => {
      mobileSidebarOpen = !mobileSidebarOpen;
      mobileViewMode = mobileSidebarOpen ? 'menu' : 'editor';
      updateUI();
    });

  const topBar = el('div')
    .css({
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '16px 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      zIndex: '10'
    })
    .child([
      el('div').child([
        el('h1').text('Linktree Editor').css({ margin: '0', fontSize: '18px', fontWeight: '700', color: '#111827' }),
        el('p').text('Build and preview your page here').css({ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' })
      ]),
      el('button').text('Publish').css({
        padding: '10px 18px',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
      }).on('click', () => {
        console.log('Publish clicked', config);
      })
    ]);

  // ==================== SIDEBAR ====================
  const sidebar = el('div')
    .css({
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      padding: '20px 0',
      overflowY: 'auto'
    });

  const navSections = [
    { id: 'header', label: '👤 Header', icon: '👤' },
    { id: 'links', label: '🔗 Links', icon: '🔗' },
    { id: 'videos', label: '🎬 Videos', icon: '🎬' },
    { id: 'images', label: '🖼️ Images', icon: '🖼️' },
    { id: 'donations', label: '💰 Donations', icon: '💰' },
    { id: 'layout', label: '🧩 Layout', icon: '🧩' },
    { id: 'theme', label: '🎨 Theme', icon: '🎨' },
    { id: 'appearance', label: '🖌️ Appearance', icon: '🖌️' },
    { id: 'social', label: '📱 Social', icon: '📱' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  const navButtons = {};
  navSections.forEach(section => {
    const btn = el('button')
      .text(section.label)
      .css({
        width: '100%',
        padding: '12px 20px',
        border: 'none',
        backgroundColor: currentSection === section.id ? '#f0f0f0' : 'transparent',
        color: currentSection === section.id ? '#6366f1' : '#6b7280',
        fontSize: '13px',
        fontWeight: currentSection === section.id ? '600' : '400',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        borderLeft: currentSection === section.id ? '3px solid #6366f1' : '3px solid transparent'
      })
      .on('click', () => switchSection(section.id));

    navButtons[section.id] = btn;
    sidebar.child(btn);
  });

  // ==================== CENTER PANEL ====================
  const centerPanel = el('div')
    .css({
      backgroundColor: '#ffffff',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      minWidth: '0',
      minHeight: '0',
      boxSizing: 'border-box'
    });

  const contentArea = el('div')
    .css({
      flex: '1',
      minHeight: '0',
      padding: '30px'
    });

  centerPanel.child(contentArea);

  // ==================== RIGHT PREVIEW ====================
  const previewPanel = el('div')
    .css({
      backgroundColor: '#f9fafb',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      width: '480px',
      minWidth: '0',
      minHeight: '0',
      flex: '0 0 480px',
      boxSizing: 'border-box'
    });

  let previewIframe = null;
  let previewIframeReady = false;
  let pendingPreviewRoot = null;

  // ==================== CONTENT WRAPPER (Editor + Preview) ====================
  const contentWrapper = el('div')
    .css({
      display: 'flex',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    })
    .child([centerPanel, previewPanel]);

  const bodyWrapper = el('div')
    .css({
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    })
    .child([sidebar, contentWrapper]);

  const mobileViewTabs = el('div')
    .css({
      display: 'none',
      width: '100%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '8px 16px',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center'
    });

  let mobileViewMode = 'editor';

  const editorTabBtn = el('button')
    .text('Editor')
    .css({
      padding: '8px 14px',
      border: '1px solid #d1d5db',
      borderRadius: '999px',
      backgroundColor: '#ffffff',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600'
    })
    .on('click', () => {
      mobileViewMode = 'editor';
      updateUI();
    });

  const previewTabBtn = el('button')
    .text('Preview')
    .css({
      padding: '8px 14px',
      border: '1px solid #d1d5db',
      borderRadius: '999px',
      backgroundColor: '#ffffff',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600'
    })
    .on('click', () => {
      mobileSidebarOpen = false;
      mobileViewMode = 'preview';
      updateUI();
    });

  mobileViewTabs.child([mobileMenuBtn, editorTabBtn, previewTabBtn]);

  const MOBILE_BREAKPOINT = 960;
  function applyResponsiveLayout() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    container.css({
      width: '100%',
      minHeight: '100vh',
      height: '100vh'
    });

    topBar.css({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      gap: '8px',
      padding: isMobile ? '10px 14px' : '16px 24px'
    });

      mobileMenuBtn.css({ display: isMobile ? 'inline-flex' : 'none' });

    const menuActive = isMobile && mobileViewMode === 'menu';
    const topOffset = topBar.get().offsetHeight + mobileViewTabs.get().offsetHeight;

    sidebar.css({
      borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
      borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
      width: '100%',
      height: menuActive ? `calc(100vh - ${topOffset}px)` : 'auto',
      display: isMobile ? (menuActive ? 'block' : 'none') : 'block',
      position: menuActive ? 'absolute' : 'relative',
      top: menuActive ? `${topOffset}px` : '0',
      left: '0',
      right: '0',
      bottom: menuActive ? '0' : 'auto',
      zIndex: menuActive ? '20' : 'auto',
      overflowY: 'auto',
      backgroundColor: '#ffffff'
    });

    contentArea.css({
      padding: isMobile ? '20px 16px' : '30px'
    });

    mobileViewTabs.css({ display: isMobile ? 'flex' : 'none' });

    contentWrapper.css({
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    });

    sidebar.css({
      width: isMobile ? '100%' : '200px',
      minHeight: isMobile ? 'auto' : '0',
      flex: isMobile ? '0 0 auto' : '0 0 200px'
    });

    bodyWrapper.css({
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    });
  }

  window.addEventListener('resize', updateUI);
  applyResponsiveLayout();

  // ==================== FUNCTIONS ====================

  function switchSection(sectionId) {
    currentSection = sectionId;
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      mobileViewMode = 'editor';
      mobileSidebarOpen = false;
    }
    updateUI();
  }

  function updateUI() {
    // Update sidebar
    navSections.forEach(section => {
      const isActive = currentSection === section.id;
      navButtons[section.id].css({
        backgroundColor: isActive ? '#f0f0f0' : 'transparent',
        color: isActive ? '#6366f1' : '#6b7280',
        fontWeight: isActive ? '600' : '400',
        borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent'
      });
    });

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    mobileViewTabs.css({ display: isMobile ? 'flex' : 'none' });

    editorTabBtn.css({
      backgroundColor: mobileViewMode === 'editor' ? '#6366f1' : '#ffffff',
      color: mobileViewMode === 'editor' ? '#ffffff' : '#374151',
      borderColor: mobileViewMode === 'editor' ? '#6366f1' : '#d1d5db'
    });
    previewTabBtn.css({
      backgroundColor: mobileViewMode === 'preview' ? '#6366f1' : '#ffffff',
      color: mobileViewMode === 'preview' ? '#ffffff' : '#374151',
      borderColor: mobileViewMode === 'preview' ? '#6366f1' : '#d1d5db'
    });

    const menuActive = isMobile && mobileViewMode === 'menu';
    const topOffset = topBar.get().offsetHeight + mobileViewTabs.get().offsetHeight;
    mobileMenuBtn.text(menuActive ? 'Hide menu' : 'Menu');
    mobileMenuBtn.css({
      display: isMobile ? 'inline-flex' : 'none',
      backgroundColor: menuActive ? '#6366f1' : '#f3f4f6',
      color: menuActive ? '#ffffff' : '#374151',
      borderColor: menuActive ? '#6366f1' : '#d1d5db'
    });

    topBar.css({ padding: isMobile ? '10px 14px' : '16px 24px' });
    contentArea.css({ padding: isMobile ? '20px 16px' : '30px' });

    sidebar.css({
      display: isMobile ? (menuActive ? 'block' : 'none') : 'block',
      height: menuActive ? `calc(100vh - ${topOffset}px)` : 'auto',
      position: menuActive ? 'absolute' : 'relative',
      top: menuActive ? `${topOffset}px` : '0',
      bottom: menuActive ? '0' : 'auto',
      left: '0',
      right: isMobile ? '0' : 'auto',
      width: isMobile ? '100%' : '200px',
      minHeight: isMobile ? 'auto' : '0',
      flex: isMobile ? '0 0 auto' : '0 0 200px',
      borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
      borderBottom: isMobile && menuActive ? '1px solid #e5e7eb' : 'none',
      zIndex: menuActive ? '20' : 'auto',
      overflowY: 'auto',
      boxSizing: 'border-box'
    });

    bodyWrapper.css({
      display: isMobile ? 'flex' : 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    });

    contentWrapper.css({
      display: menuActive ? 'none' : 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%',
      minHeight: '0',
      flex: '1',
      overflow: 'hidden'
    });

    centerPanel.css({ display: !isMobile || mobileViewMode === 'editor' ? 'flex' : 'none' });
    previewPanel.css({
      width: isMobile ? '100%' : '480px',
      display: !isMobile || mobileViewMode === 'preview' ? 'flex' : 'none',
      minHeight: '0',
      flex: isMobile ? '1' : '0 0 480px'
    });

    // Clear and render content
    el(contentArea.get()).clear();
    let content;

    if (currentSection === 'links') {
      content = buildLinksSection();
    } else if (currentSection === 'header') {
      content = buildHeaderSection();
    } else if (currentSection === 'videos') {
      content = buildVideosSection();
    } else if (currentSection === 'images') {
      content = buildImagesSection();
    } else if (currentSection === 'donations') {
      content = buildDonationsSection();
    } else if (currentSection === 'layout') {
      content = buildLayoutSection();
    } else if (currentSection === 'theme') {
      content = buildThemeSection();
    } else if (currentSection === 'appearance') {
      content = buildAppearanceSection();
    } else if (currentSection === 'social') {
      content = buildSocialSection();
    } else if (currentSection === 'settings') {
      content = buildSettingsSection();
    }

    if (content) {
      el(contentArea.get()).child(content).get();
    }

    updatePreview();
  }

  // ==================== LINKS SECTION ====================
  function buildLinksSection() {
    const section = el('div');
    let draggedGroupId = null;
    let draggedLinkId = null;

    section.child([
      el('div')
        .css({
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e5e7eb'
        })
        .child([
          el('h2')
            .text('🔗 Links & Groups')
            .css({
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
              color: '#111827'
            }),
          el('p')
            .text('Use the drag handle on the left to reorder groups and links.')
            .css({
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            })
        ]),
      el('button')
        .text('+ Add New Group')
        .css({
          width: '100%',
          padding: '12px',
          backgroundColor: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px'
        })
        .on('click', () => {
          config.groups.push({
            id: 'group-' + Date.now(),
            name: 'New Group',
            links: []
          });
          updateUI();
        })
    ]);

    // Groups with links
    config.groups.forEach((group, groupIdx) => {
      const groupCard = el('div')
        .attr('data-group-id', group.id)
        .css({
          backgroundColor: '#f9fafb',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          transition: 'all 0.3s'
        });

      // Group header with drag handle
      const headerDiv = el('div')
        .css({
          display: 'flex',
          gap: '10px',
          marginBottom: '15px',
          alignItems: 'flex-start'
        });

      const dragHandle = el('div')
        .attr('draggable', 'true')
        .attr('title', 'Drag to reorder group')
        .html(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 7H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 17H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`)
        .css({
          cursor: 'grab',
          color: '#9ca3af',
          userSelect: 'none',
          padding: '8px',
          borderRadius: '6px',
          transition: 'all 0.2s',
          flexShrink: 0,
          marginTop: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6'
        })
        .on('mouseenter', function() {
          el(this).css({ backgroundColor: '#e5e7eb', color: '#6366f1' });
        })
        .on('mouseleave', function() {
          el(this).css({ backgroundColor: 'transparent', color: '#9ca3af' });
        })
        .on('dragstart', (e) => {
          draggedGroupId = group.id;
          groupCard.get().style.opacity = '0.5';
          groupCard.get().style.backgroundColor = '#e0e7ff';
          e.dataTransfer.effectAllowed = 'move';
        })
        .on('dragend', (e) => {
          groupCard.get().style.opacity = '1';
          groupCard.get().style.backgroundColor = '#f9fafb';
          groupCard.get().style.borderColor = '#e5e7eb';
          draggedGroupId = null;
        });

      // Drop handlers for group
      groupCard
        .on('dragover', (e) => {
          e.preventDefault();
          if (draggedGroupId !== null && draggedGroupId !== group.id) {
            groupCard.get().style.borderColor = '#6366f1';
            groupCard.get().style.borderWidth = '3px';
          }
        })
        .on('dragleave', (e) => {
          groupCard.get().style.borderColor = '#e5e7eb';
          groupCard.get().style.borderWidth = '2px';
        })
        .on('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          groupCard.get().style.borderColor = '#e5e7eb';
          groupCard.get().style.borderWidth = '2px';
          
          if (draggedGroupId !== null && draggedGroupId !== group.id) {
            // Find indices by ID
            const draggedIdx = config.groups.findIndex(g => g.id === draggedGroupId);
            const targetIdx = config.groups.findIndex(g => g.id === group.id);
            
            if (draggedIdx !== -1 && targetIdx !== -1) {
              const draggedGroup = config.groups[draggedIdx];
              config.groups.splice(draggedIdx, 1);
              
              // Recalculate target index after removal
              const newTargetIdx = config.groups.findIndex(g => g.id === group.id);
              if (draggedIdx < targetIdx) {
                // Moving DOWN: insert AFTER the shifted target
                config.groups.splice(newTargetIdx + 1, 0, draggedGroup);
              } else {
                // Moving UP: insert BEFORE the target
                config.groups.splice(newTargetIdx, 0, draggedGroup);
              }
              updateUI();
            }
          }
        });

      const groupNameInput = el('input')
        .attr('type', 'text')
        .attr('placeholder', 'Group name')
        .css({
          flex: '1',
          fontSize: '16px',
          fontWeight: '600',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          padding: '10px'
        });
      groupNameInput.get().value = group.name;
      groupNameInput.on('input', (e) => {
        config.groups[groupIdx].name = e.target.value;
        updatePreview();
      });

      const deleteGroupBtn = el('button')
        .text('🗑️')
        .css({
          width: '40px',
          height: '40px',
          backgroundColor: '#fee2e2',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          flexShrink: 0
        })
        .on('click', () => {
          config.groups.splice(groupIdx, 1);
          updateUI();
        });

      headerDiv.child([dragHandle, groupNameInput, deleteGroupBtn]);
      groupCard.child(headerDiv);

      // Links container inside group
      const linksContainerDiv = el('div')
        .css({
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '15px',
          border: '1px solid #e5e7eb'
        });

      // Add section header
      linksContainerDiv.child(
        el('label')
          .text('Links in this group:')
          .css({
            display: 'block',
            fontSize: '12px',
            fontWeight: '700',
            color: '#6b7280',
            marginBottom: '10px',
            textTransform: 'uppercase'
          })
      );

      // Links in group
      if (group.links && group.links.length > 0) {
        group.links.forEach((link, linkIdx) => {
          const linkCard = el('div')
            .attr('data-link-idx', linkIdx)
            .css({
              backgroundColor: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '10px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              transition: 'all 0.3s'
            });

          const linkDragHandle = el('div')
            .attr('draggable', 'true')
            .attr('title', 'Drag to reorder link')
            .html(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 17H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`)
            .css({
              cursor: 'grab',
              color: '#9ca3af',
              userSelect: 'none',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              flexShrink: 0,
              marginTop: '2px',
              transition: 'all 0.2s',
              backgroundColor: '#f3f4f6'
            })
            .on('mouseenter', function() {
              el(this).css({ backgroundColor: '#d1d5db', color: '#6366f1' });
            })
            .on('mouseleave', function() {
              el(this).css({ backgroundColor: '#f3f4f6', color: '#9ca3af' });
            })
            .on('dragstart', (e) => {
              draggedLinkId = `${group.id}-${linkIdx}`;
              linkCard.get().style.opacity = '0.5';
              linkCard.get().style.backgroundColor = '#e0e7ff';
              e.dataTransfer.effectAllowed = 'move';
            })
            .on('dragend', (e) => {
              linkCard.get().style.opacity = '1';
              linkCard.get().style.backgroundColor = '#f9fafb';
              linkCard.get().style.borderColor = '#d1d5db';
              draggedLinkId = null;
            });

          const linkMoveButtons = el('div')
            .css({ display: 'grid', gap: '6px', marginTop: '6px' });

          const moveUpBtn = el('button')
            .text('↑')
            .attr('title', 'Move link up')
            .css({
              width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #d1d5db',
              backgroundColor: '#ffffff', color: '#374151', cursor: linkIdx > 0 ? 'pointer' : 'not-allowed',
              opacity: linkIdx > 0 ? 1 : 0.4
            })
            .on('click', () => {
              if (linkIdx > 0) {
                const linkItem = config.groups[groupIdx].links.splice(linkIdx, 1)[0];
                config.groups[groupIdx].links.splice(linkIdx - 1, 0, linkItem);
                updateUI();
              }
            });

          const moveDownBtn = el('button')
            .text('↓')
            .attr('title', 'Move link down')
            .css({
              width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #d1d5db',
              backgroundColor: '#ffffff', color: '#374151', cursor: linkIdx < group.links.length - 1 ? 'pointer' : 'not-allowed',
              opacity: linkIdx < group.links.length - 1 ? 1 : 0.4
            })
            .on('click', () => {
              if (linkIdx < group.links.length - 1) {
                const linkItem = config.groups[groupIdx].links.splice(linkIdx, 1)[0];
                config.groups[groupIdx].links.splice(linkIdx + 1, 0, linkItem);
                updateUI();
              }
            });

          const linkControlGroup = el('div').css({ display: 'flex', flexDirection: 'column', alignItems: 'center' }).child([linkDragHandle, linkMoveButtons.child([moveUpBtn, moveDownBtn])]);

          linkCard
            .on('dragover', (e) => {
              e.preventDefault();
              if (draggedLinkId && draggedLinkId.startsWith(group.id + '-')) {
                const draggedIdx = parseInt(draggedLinkId.split('-').pop());
                if (draggedIdx !== linkIdx) {
                  linkCard.get().style.borderColor = '#6366f1';
                  linkCard.get().style.borderWidth = '2px';
                }
              }
            })
            .on('dragleave', (e) => {
              linkCard.get().style.borderColor = '#d1d5db';
              linkCard.get().style.borderWidth = '1px';
            })
            .on('drop', (e) => {
              e.preventDefault();
              e.stopPropagation();
              linkCard.get().style.borderColor = '#d1d5db';
              
              if (draggedLinkId && draggedLinkId.startsWith(group.id + '-')) {
                const draggedIdxStr = draggedLinkId.split('-').pop();
                const draggedIdx = parseInt(draggedIdxStr);
                
                if (draggedIdx !== linkIdx) {
                  const draggedLink = config.groups[groupIdx].links.splice(draggedIdx, 1)[0];
                  
                  // Insert at original target position
                  // Moving down: target shifted left, so linkIdx lands after it
                  // Moving up: target didn't shift, so linkIdx lands before it
                  config.groups[groupIdx].links.splice(linkIdx, 0, draggedLink);
                  updateUI();
                }
              }
            });

          const linkInfo = el('div')
            .css({ flex: '1', marginBottom: '0' });

          const titleInput = el('input')
            .attr('type', 'text')
            .attr('placeholder', 'Link title')
            .css({
              width: '100%',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '6px 8px',
              marginBottom: '6px',
              boxSizing: 'border-box'
            });
          titleInput.get().value = link.title;
          titleInput.on('input', (e) => {
            config.groups[groupIdx].links[linkIdx].title = e.target.value;
            updatePreview();
          });

          const urlInput = el('input')
            .attr('type', 'text')
            .attr('placeholder', 'Link URL')
            .css({
              width: '100%',
              fontSize: '12px',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '6px 8px',
              boxSizing: 'border-box',
              marginBottom: '6px'
            });
          urlInput.get().value = link.url;
          urlInput.on('input', (e) => {
            config.groups[groupIdx].links[linkIdx].url = e.target.value;
            updatePreview();
          });

          const iconField = buildIconPickerField('', link.icon || '', (v) => {
            config.groups[groupIdx].links[linkIdx].icon = v;
            updatePreview();
          });

          linkInfo.child([titleInput, urlInput, iconField]);

          const deleteBtn = el('button')
            .text('🗑️')
            .css({
              width: '32px',
              height: '32px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              flexShrink: 0
            })
            .on('click', () => {
              config.groups[groupIdx].links.splice(linkIdx, 1);
              updateUI();
            });

          linkCard.child([linkControlGroup, linkInfo, deleteBtn]);
          linksContainerDiv.child(linkCard);
        });
      } else {
        linksContainerDiv.child(
          el('p')
            .text('No links yet. Add one using the button below.')
            .css({
              fontSize: '12px',
              color: '#9ca3af',
              fontStyle: 'italic',
              margin: '10px 0',
              textAlign: 'center'
            })
        );
      }

      groupCard.child(linksContainerDiv);

      const addLinkBtn = el('button')
        .text('+ Add Link to Group')
        .css({
          width: '100%',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          border: '1px dashed #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          color: '#6366f1',
          fontWeight: '500',
          marginTop: '10px'
        })
        .on('click', () => {
          config.groups[groupIdx].links.push({ title: 'New Link', url: 'https://example.com' });
          updateUI();
        });

      groupCard.child(addLinkBtn);
      section.child(groupCard);
    });

    return section;
  }

  // ==================== HEADER SECTION ====================
  function buildHeaderSection() {
    const section = el('div');

    const isImageAvatar = config.avatar && (config.avatar.includes('http') || config.avatar.includes('/') || config.avatar.startsWith('data:'));

    section.child([
      el('h2')
        .text('👤 Header Settings')
        .css({
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#111827'
        }),
      el('p')
        .text('Set the profile name, bio, avatar and optional footer image for your page.')
        .css({ fontSize: '13px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }),

      buildField('Profile Name', config.name, (v) => {
        config.name = v;
        updatePreview();
      }),

      buildField('Bio / Description', config.bio, (v) => {
        config.bio = v;
        updatePreview();
      }),

      // Avatar type toggle
      el('div').css({ marginBottom: '20px' }).child([
        el('label')
          .text('Avatar Type')
          .css({
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#374151'
          }),
        el('div').css({ display: 'flex', gap: '10px', marginBottom: '12px' }).child([
          createToggleBtn('Text / Initials', !isImageAvatar, () => {
            config.avatar = 'SL';
            updateUI();
          }),
          createToggleBtn('Image', isImageAvatar, () => {
            config.avatar = 'https://via.placeholder.com/120';
            updateUI();
          })
        ]),
        isImageAvatar
          ? (() => {
              const avatarEditor = el('div');

              // Preview current avatar
              if (config.avatar && config.avatar !== 'https://via.placeholder.com/120') {
                avatarEditor.child(
                  el('div').css({ marginBottom: '12px', textAlign: 'center' }).child(
                    el('div')
                      .css({
                        width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto',
                        backgroundImage: `url(${config.avatar})`, backgroundSize: 'cover',
                        backgroundPosition: 'center', border: '2px solid #6366f1'
                      })
                  )
                );
              }

              // Upload button
              const fileInput = el('input')
                .attr('type', 'file')
                .attr('accept', 'image/*')
                .css({ display: 'none' });
              fileInput.on('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  config.avatar = ev.target.result;
                  updateUI();
                };
                reader.readAsDataURL(file);
              });

              const uploadBtn = el('button')
                .text('📁 Upload Image')
                .css({
                  width: '100%', padding: '10px', backgroundColor: '#eef2ff',
                  border: '1px dashed #6366f1', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', color: '#6366f1', fontWeight: '500', marginBottom: '10px'
                })
                .on('click', () => fileInput.get().click());

              avatarEditor.child([fileInput, uploadBtn]);

              // Or paste URL
              avatarEditor.child(
                buildField('Or paste Image URL', config.avatar.startsWith('data:') ? '' : config.avatar, (v) => {
                  if (v) {
                    config.avatar = v;
                    updatePreview();
                  }
                })
              );

              return avatarEditor;
            })()
          : buildField('Avatar Text (Initials)', config.avatar, (v) => {
              config.avatar = v;
              updatePreview();
            })
      ]),

      // Bottom image
      (() => {
        const wrapper = el('div').css({ marginBottom: '18px' });
        // State: mode ('url' or 'upload')
        let mode = 'url';
        if (config.bottomImage && config.bottomImage.startsWith('data:')) mode = 'upload';

        // Radio buttons
        const radioRow = el('div').css({ display: 'flex', gap: '18px', marginBottom: '8px', alignItems: 'center' });
        const urlRadio = el('input').attr('type', 'radio').attr('name', 'bottomImageMode').attr('id', 'bottomImageUrlRadio').attr('value', 'url');
        const uploadRadio = el('input').attr('type', 'radio').attr('name', 'bottomImageMode').attr('id', 'bottomImageUploadRadio').attr('value', 'upload');
        if (mode === 'url') urlRadio.get().checked = true;
        if (mode === 'upload') uploadRadio.get().checked = true;
        const urlLabel = el('label').attr('for', 'bottomImageUrlRadio').text('URL').css({ cursor: 'pointer' });
        const uploadLabel = el('label').attr('for', 'bottomImageUploadRadio').text('Upload').css({ cursor: 'pointer' });
        urlLabel.on('click', () => { urlRadio.get().checked = true; urlRadio.get().dispatchEvent(new Event('change', { bubbles: true })); });
        uploadLabel.on('click', () => { uploadRadio.get().checked = true; uploadRadio.get().dispatchEvent(new Event('change', { bubbles: true })); });
        radioRow.child([
          urlRadio,
          urlLabel,
          uploadRadio,
          uploadLabel
        ]);
        wrapper.child(radioRow);

        // URL input
        const urlInput = el('input')
          .attr('type', 'text')
          .attr('placeholder', 'Bottom Image URL (optional)')
          .css({
            width: '100%', padding: '8px', border: '1px solid #d1d5db',
            borderRadius: '6px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box',
            backgroundColor: mode === 'url' ? '#fff' : '#f3f4f6', color: '#374151'
          });
        urlInput.get().value = (mode === 'url' && config.bottomImage && !config.bottomImage.startsWith('data:')) ? config.bottomImage : '';
        urlInput.get().disabled = mode !== 'url';
        urlInput.on('input', (e) => {
          if (mode === 'url') {
            config.bottomImage = e.target.value;
            updatePreview();
          }
        });
        wrapper.child(urlInput);

        // Upload button
        const fileInput = el('input')
          .attr('type', 'file')
          .attr('accept', 'image/*')
          .css({ display: 'none' });
        const uploadBtn = el('button')
          .text('📁 Upload Bottom Image')
          .css({
            width: '100%', padding: '10px', backgroundColor: mode === 'upload' ? '#eef2ff' : '#f3f4f6',
            border: '1px dashed #6366f1', borderRadius: '6px', cursor: mode === 'upload' ? 'pointer' : 'not-allowed',
            fontSize: '13px', color: '#6366f1', fontWeight: '500', marginTop: '6px', opacity: mode === 'upload' ? 1 : 0.6
          })
          .on('click', () => {
            if (mode === 'upload') fileInput.get().click();
          });
        fileInput.on('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            config.bottomImage = ev.target.result;
            updatePreview();
          };
          reader.readAsDataURL(file);
        });
        wrapper.child([fileInput, uploadBtn]);

        // Radio change logic
        urlRadio.on('change', () => {
          mode = 'url';
          urlInput.get().disabled = false;
          urlInput.css({ backgroundColor: '#fff' });
          uploadBtn.css({ cursor: 'not-allowed', backgroundColor: '#f3f4f6', opacity: 0.6 });
          if (urlInput.get().value) {
            config.bottomImage = urlInput.get().value;
            updatePreview();
          }
        });
        uploadRadio.on('change', () => {
          mode = 'upload';
          urlInput.get().disabled = true;
          urlInput.css({ backgroundColor: '#f3f4f6' });
          uploadBtn.css({ cursor: 'pointer', backgroundColor: '#eef2ff', opacity: 1 });
        });

        return wrapper;
      })()
    ]);

    return section;
  }

  // ==================== APPEARANCE SECTION ====================
  function buildAppearanceSection() {
    const section = el('div');
    const baseTheme = themes[config.themeName] || themes.hydra;

    // Helper for theme color override
    const themeColor = (prop, value, placeholder, onChange) => {
      return buildColorRow(prop, value, placeholder, (v) => {
        if (!config.theme) config.theme = {};
        config.theme[onChange] = v || undefined;
        if (!hasCustomTheme()) config.theme = null;
        updatePreview();
      });
    };

    section.child([
      el('h2')
        .text('🖌️ Appearance')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#111827' }),

      // ── GROUP: Background ──
      (() => {
        // Determine effective mode
        const themeHasGradient = !!baseTheme.backgroundGradient;
        const effectiveMode = config.bgMode || (themeHasGradient ? 'gradient' : 'color');

        const children = [
          // Mode selector
          el('div').css({ display: 'flex', gap: '8px', marginBottom: '16px' }).child([
            createToggleBtn('🎨 Solid Color', effectiveMode === 'color', () => {
              config.bgMode = 'color';
              updateUI();
            }),
            createToggleBtn('🌈 Gradient', effectiveMode === 'gradient', () => {
              config.bgMode = 'gradient';
              if (!config.bgGradient && !baseTheme.backgroundGradient) {
                config.bgGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }
              updateUI();
            }),
            createToggleBtn('🖼️ Image', effectiveMode === 'image', () => {
              config.bgMode = 'image';
              updateUI();
            })
          ])
        ];

        if (effectiveMode === 'color') {
          // Get a sensible default color from theme
          const defaultColor = baseTheme.backgroundColor || '#333333';
          children.push(
            buildColorRow('Background Color', config.bgColor || '', defaultColor, (v) => {
              config.bgColor = v;
              updatePreview();
            })
          );
        } else if (effectiveMode === 'gradient') {
          const defaultGrad = baseTheme.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          children.push(
            buildGradientRow('Gradient', config.bgGradient || '', defaultGrad, (v) => {
              config.bgGradient = v;
              updatePreview();
            })
          );
        } else if (effectiveMode === 'image') {
          children.push(
            (() => {
              const wrapper = el('div').css({ marginBottom: '10px' });
              let mode = 'url';
              if (config.bgImage && config.bgImage.startsWith('data:')) mode = 'upload';

              const radioRow = el('div').css({ display: 'flex', gap: '14px', marginBottom: '10px', alignItems: 'center' });
              const urlRadio = el('input').attr('type', 'radio').attr('name', 'bgImageMode').attr('id', 'bgImageUrlRadio').attr('value', 'url');
              const uploadRadio = el('input').attr('type', 'radio').attr('name', 'bgImageMode').attr('id', 'bgImageUploadRadio').attr('value', 'upload');
              if (mode === 'url') urlRadio.get().checked = true;
              if (mode === 'upload') uploadRadio.get().checked = true;
              const urlLabel = el('label').attr('for', 'bgImageUrlRadio').text('URL').css({ cursor: 'pointer', fontSize: '13px' });
              const uploadLabel = el('label').attr('for', 'bgImageUploadRadio').text('Upload').css({ cursor: 'pointer', fontSize: '13px' });
              radioRow.child([urlRadio, urlLabel, uploadRadio, uploadLabel]);
              wrapper.child(radioRow);

              const urlInput = el('input')
                .attr('type', 'text')
                .attr('placeholder', 'Background Image URL')
                .css({
                  width: '100%', padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '6px', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box',
                  backgroundColor: mode === 'url' ? '#fff' : '#f3f4f6', color: '#374151'
                });
              urlInput.get().value = (mode === 'url' && config.bgImage && !config.bgImage.startsWith('data:')) ? config.bgImage : '';
              urlInput.get().disabled = mode !== 'url';
              urlInput.on('input', (e) => {
                if (mode === 'url') {
                  config.bgImage = e.target.value;
                  updatePreview();
                }
              });
              wrapper.child(urlInput);

              const fileInput = el('input').attr('type', 'file').attr('accept', 'image/*').css({ display: 'none' });
              const uploadBtn = el('button')
                .text('📁 Upload Image')
                .css({
                  width: '100%', padding: '10px', backgroundColor: mode === 'upload' ? '#eef2ff' : '#f3f4f6',
                  border: '1px dashed #6366f1', borderRadius: '6px', cursor: mode === 'upload' ? 'pointer' : 'not-allowed',
                  fontSize: '13px', color: '#6366f1', fontWeight: '500', opacity: mode === 'upload' ? 1 : 0.6
                })
                .on('click', () => {
                  if (mode === 'upload') fileInput.get().click();
                });

              fileInput.on('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  config.bgImage = ev.target.result;
                  updatePreview();
                };
                reader.readAsDataURL(file);
              });
              wrapper.child([fileInput, uploadBtn]);

              const sizeLabel = el('label')
                .text('Background Size')
                .css({ display: 'block', fontSize: '14px', fontWeight: '600', margin: '14px 0 8px', color: '#374151' });

              const sizeSelect = el('select')
                .css({
                  width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box'
                });
              ['cover', 'contain', 'auto'].forEach((optionValue) => {
                const option = el('option').attr('value', optionValue).text(optionValue);
                if ((config.bgSize || 'cover') === optionValue) option.get().selected = true;
                sizeSelect.child(option);
              });
              sizeSelect.on('change', (e) => {
                config.bgSize = e.target.value;
                updatePreview();
              });
              wrapper.child([sizeLabel, sizeSelect]);

              urlRadio.on('change', () => {
                mode = 'url';
                urlInput.get().disabled = false;
                urlInput.css({ backgroundColor: '#fff' });
                uploadBtn.css({ cursor: 'not-allowed', backgroundColor: '#f3f4f6', opacity: 0.6 });
                if (urlInput.get().value) {
                  config.bgImage = urlInput.get().value;
                  updatePreview();
                }
              });

              uploadRadio.on('change', () => {
                mode = 'upload';
                urlInput.get().disabled = true;
                urlInput.css({ backgroundColor: '#f3f4f6' });
                uploadBtn.css({ cursor: 'pointer', backgroundColor: '#eef2ff', opacity: 1 });
                if (config.bgImage && config.bgImage.startsWith('data:')) updatePreview();
              });

              return wrapper;
            })()
          );
        }

        return buildGroupCard('🖼️ Background', children);
      })(),

      // ── GROUP: Text Colors ──
      buildGroupCard('✏️ Text Colors', [
        el('p').text('Override text colors from the theme.').css({ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }),
        buildColorRow('Name / Text Color', config.theme?.textColor || '', baseTheme.textColor || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.textColor = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildColorRow('Bio Color', config.theme?.bioColor || '', baseTheme.bioColor || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.bioColor = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildColorRow('Accent Color', config.theme?.accentColor || '', baseTheme.accentColor || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.accentColor = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        })
      ]),

      // ── GROUP: Link / Button Style ──
      buildGroupCard('🔗 Link / Button Style', [
        el('p').text('Customize how link buttons look.').css({ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }),
        buildColorRow('Button Background', config.theme?.buttonBg || '', baseTheme.buttonBg || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonBg = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildColorRow('Button Text Color', config.theme?.buttonText || '', baseTheme.buttonText || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonText = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildColorRow('Button Hover BG', config.theme?.buttonHoverBg || '', baseTheme.buttonHoverBg || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonHoverBg = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildColorRow('Button Hover Text', config.theme?.buttonHoverText || '', baseTheme.buttonHoverText || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonHoverText = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildSliderField('Button Border Radius', config.theme?.buttonBorderRadius || '8', 0, 50, 'px', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonBorderRadius = v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildBorderField('Button Border', config.theme?.buttonBorder || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonBorder = v === 'none' ? undefined : v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        }),
        buildShadowField('Button Box Shadow', config.theme?.buttonBoxShadow || '', (v) => {
          if (!config.theme) config.theme = {};
          config.theme.buttonBoxShadow = v === 'none' ? undefined : v || undefined;
          if (!hasCustomTheme()) config.theme = null;
          updatePreview();
        })
      ]),

      // ── GROUP: Fonts ──
      buildGroupCard('🔤 Fonts', [
        el('p').text('Load Google Fonts and customize per element.').css({ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }),
        buildFontSection(),
        buildFontSelectField('Global Font Family', config.fontFamily || '', 'fontFamily'),
        buildFontSelectField('Name Font', config.nameFont || '', 'nameFont'),
        buildFontSelectField('Bio Font', config.bioFont || '', 'bioFont'),
        buildFontSelectField('Link Font', config.linkFont || '', 'linkFont')
      ])
    ]);

    return section;
  }

  function buildThemeSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('🎨 Theme')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#111827' }),

      buildGroupCard('🎨 Theme Selection', [
        el('p').text('Search themes, filter by category, and click a theme card to apply it.')
          .css({ fontSize: '14px', color: '#6b7280', marginBottom: '18px' }),
        createThemePicker()
      ])
    ]);

    return section;
  }

  function buildLayoutSection() {
    const section = el('div');
    const reorderList = el('div').css({ display: 'flex', flexDirection: 'column', gap: '12px' });

    function getSectionItems() {
      const groupIds = config.groups.filter(group => Array.isArray(group.links) && group.links.length > 0).map(group => group.id);
      const imageGroupIds = config.imageGroups.filter(group => Array.isArray(group.images) && group.images.length > 0).map(group => group.id);
      const order = Array.isArray(config.sectionOrder) ? config.sectionOrder : [];
      const allowed = ['links', ...groupIds, ...imageGroupIds, 'images', 'videos', 'donations', 'bottomImage'];
      const normalized = [...new Set([...order, ...allowed])].filter(item => allowed.includes(item));
      const visible = normalized.filter(item => {
        if (item === 'links') return Array.isArray(config.links) && config.links.length > 0;
        if (item === 'images') return Array.isArray(config.images) && config.images.length > 0;
        if (item === 'videos') return Array.isArray(config.videos) && config.videos.length > 0;
        if (item === 'donations') return Array.isArray(config.donations) && config.donations.length > 0;
        if (item === 'bottomImage') return !!config.bottomImage;
        return groupIds.includes(item) || imageGroupIds.includes(item);
      });
      config.sectionOrder = visible;
      return visible;
    }

    function getSectionLabel(key) {
      if (key === 'links') return 'Links';
      if (key === 'images') return 'Group: Images';
      if (key === 'videos') return 'Videos';
      if (key === 'donations') return 'Donations';
      if (key === 'bottomImage') return 'Bottom Image';
      const imageGroup = config.imageGroups.find(group => group.id === key);
      if (imageGroup) return imageGroup.name && imageGroup.name.trim() !== '' ? `Image Group: ${imageGroup.name}` : 'Image Group';
      const group = config.groups.find(group => group.id === key);
      return group ? `Group: ${group.name || group.id}` : key;
    }

    let draggedSectionKey = null;

    function renderOrder() {
      reorderList.empty();
      const order = getSectionItems();

      order.forEach((key, index) => {
        const itemLabel = getSectionLabel(key);

        const item = el('div')
          .attr('draggable', 'true')
          .css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
            cursor: 'grab'
          });

        item.on('dragstart', (e) => {
          draggedSectionKey = key;
          e.dataTransfer.effectAllowed = 'move';
          item.css({ opacity: '0.5' });
        });

        item.on('dragend', () => {
          draggedSectionKey = null;
          item.css({ opacity: '1' });
        });

        item.on('dragover', (e) => {
          e.preventDefault();
        });

        item.on('dragenter', () => {
          if (draggedSectionKey && draggedSectionKey !== key) {
            item.css({ borderColor: '#6366f1', backgroundColor: '#eef2ff' });
          }
        });

        item.on('dragleave', () => {
          item.css({ borderColor: '#e5e7eb', backgroundColor: '#ffffff' });
        });

        item.on('drop', (e) => {
          e.preventDefault();
          if (draggedSectionKey && draggedSectionKey !== key) {
            const newOrder = [...order];
            const fromIndex = newOrder.indexOf(draggedSectionKey);
            const toIndex = newOrder.indexOf(key);
            if (fromIndex !== -1 && toIndex !== -1) {
              newOrder.splice(fromIndex, 1);
              newOrder.splice(toIndex, 0, draggedSectionKey);
              config.sectionOrder = newOrder;
              renderOrder();
              updatePreview();
            }
          }
        });

        const label = el('span').text(itemLabel).css({ fontSize: '14px', color: '#111827', fontWeight: '600' });
        const actions = el('div').css({ display: 'flex', gap: '8px' });

        const upBtn = el('button')
          .text('↑')
          .css({
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            color: index === 0 ? '#9ca3af' : '#374151'
          })
          .on('click', () => {
            if (index === 0) return;
            const newOrder = [...order];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            config.sectionOrder = newOrder;
            renderOrder();
            updatePreview();
          });

        const downBtn = el('button')
          .text('↓')
          .css({
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            cursor: index === order.length - 1 ? 'not-allowed' : 'pointer',
            color: index === order.length - 1 ? '#9ca3af' : '#374151'
          })
          .on('click', () => {
            if (index === order.length - 1) return;
            const newOrder = [...order];
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
            config.sectionOrder = newOrder;
            renderOrder();
            updatePreview();
          });

        actions.child([upBtn, downBtn]);
        item.child([label, actions]);
        reorderList.child(item);
      });

      reorderList.get();
    }

    section.child([
      el('h2')
        .text('🧩 Layout')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#111827' }),
      buildGroupCard('Section Order', [
        el('p').text('Reorder the preview sections to customize their position on the page.')
          .css({ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }),
        reorderList
      ])
    ]);

    renderOrder();
    return section;
  }

  // ==================== SOCIAL SECTION ====================
  function buildSocialSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('📱 Social Links')
        .css({
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#111827'
        }),

      el('p')
        .text('Add your social media or external profile links with icon labels.')
        .css({
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '8px'
        }),
      el('p')
        .text('Click the icon box to choose an icon, then enter the URL.')
        .css({
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '20px'
        })
    ]);

    let draggedSocialIdx = null;
    config.socialLinks.forEach((social, idx) => {
      const row = el('div')
        .attr('draggable', 'true')
        .css({
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: '12px',
          cursor: 'grab',
          boxSizing: 'border-box'
        });

      row.on('dragstart', (e) => {
        draggedSocialIdx = idx;
        row.css({ opacity: '0.5' });
        e.dataTransfer.effectAllowed = 'move';
      });

      row.on('dragend', () => {
        draggedSocialIdx = null;
        row.css({ opacity: '1' });
      });

      row.on('dragover', (e) => {
        e.preventDefault();
      });

      row.on('dragenter', () => {
        if (draggedSocialIdx !== null && draggedSocialIdx !== idx) {
          row.css({ borderColor: '#6366f1', backgroundColor: '#eef2ff' });
        }
      });

      row.on('dragleave', () => {
        row.css({ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' });
      });

      row.on('drop', (e) => {
        e.preventDefault();
        if (draggedSocialIdx !== null && draggedSocialIdx !== idx) {
          const newLinks = [...config.socialLinks];
          const moved = newLinks.splice(draggedSocialIdx, 1)[0];
          newLinks.splice(idx, 0, moved);
          config.socialLinks = newLinks;
          updateUI();
        }
      });

      const dragHandle = el('div')
        .text('⋮⋮')
        .css({
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          color: '#6b7280',
          cursor: 'grab',
          userSelect: 'none'
        });

      const isMobileSocial = window.innerWidth <= 480;
      const iconField = buildIconPickerField('', social.icon || '', (v) => {
        config.socialLinks[idx].icon = v;
        updatePreview();
      }).css(Object.assign({
        flex: isMobileSocial ? '0 0 auto' : '1 1 160px',
        minWidth: '120px',
        maxWidth: isMobileSocial ? '100%' : '220px',
        minHeight: '42px',
        boxSizing: 'border-box',
        width: isMobileSocial ? '100%' : 'auto'
      }, {}));

      const urlInput = el('input')
        .attr('type', 'text')
        .attr('placeholder', 'URL')
        .css({
          flex: isMobileSocial ? '0 1 auto' : '1 1 260px',
          minWidth: isMobileSocial ? '0' : '180px',
          width: '100%',
          padding: '8px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '13px',
          height: '42px',
          lineHeight: '20px',
          boxSizing: 'border-box'
        });
      urlInput.get().value = social.url;
      urlInput.on('input', (e) => {
        config.socialLinks[idx].url = e.target.value;
        updatePreview();
      });

      const actions = el('div').css({
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        flexWrap: 'wrap',
        flex: isMobileSocial ? '0 1 100%' : '0 0 auto',
        minWidth: '120px',
        justifyContent: isMobileSocial ? 'flex-start' : 'flex-end'
      });
      const upBtn = el('button')
        .text('↑')
        .css({
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          cursor: idx === 0 ? 'not-allowed' : 'pointer',
          color: idx === 0 ? '#9ca3af' : '#374151'
        })
        .on('click', () => {
          if (idx === 0) return;
          const list = [...config.socialLinks];
          [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
          config.socialLinks = list;
          updateUI();
        });
      const downBtn = el('button')
        .text('↓')
        .css({
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          cursor: idx === config.socialLinks.length - 1 ? 'not-allowed' : 'pointer',
          color: idx === config.socialLinks.length - 1 ? '#9ca3af' : '#374151'
        })
        .on('click', () => {
          if (idx === config.socialLinks.length - 1) return;
          const list = [...config.socialLinks];
          [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
          config.socialLinks = list;
          updateUI();
        });

      const deleteBtn = el('button')
        .text('✕')
        .css({
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid #fee2e2',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          cursor: 'pointer',
          fontWeight: 'bold'
        })
        .on('click', () => {
          config.socialLinks.splice(idx, 1);
          updateUI();
        });

      actions.child([upBtn, downBtn, deleteBtn]);

      const topRow = el('div').css({
        display: 'flex',
        width: '100%',
        gap: '10px',
        alignItems: isMobileSocial ? 'stretch' : 'center',
        flexWrap: 'wrap',
        flexDirection: isMobileSocial ? 'column' : 'row'
      });
      const bottomRow = el('div').css({
        display: 'flex',
        width: '100%',
        gap: '10px',
        alignItems: isMobileSocial ? 'stretch' : 'center',
        justifyContent: isMobileSocial ? 'flex-start' : 'space-between',
        flexWrap: 'wrap',
        flexDirection: isMobileSocial ? 'column' : 'row',
        boxSizing: 'border-box'
      });

      topRow.child([dragHandle, urlInput]);
      bottomRow.child([iconField, actions]);
      row.child([topRow, bottomRow]);
      section.child(row);
    });

    section.child(
      el('button')
        .text('+ Add Social')
        .css({
          width: '100%',
          padding: '10px',
          marginTop: '15px',
          backgroundColor: '#f0f0f0',
          border: '1px dashed #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#6366f1',
          fontWeight: '500'
        })
        .on('click', () => {
          config.socialLinks.push({ icon: 'fab fa-instagram', url: 'https://instagram.com' });
          updateUI();
        })
    );

    return section;
  }

  // ==================== VIDEOS SECTION ====================
  
  // Helper function to extract YouTube ID from various URL formats
  function extractYouTubeId(input) {
    if (!input) return '';
    
    // If it's already just an ID (11 characters, alphanumeric + - _)
    if (/^[\w\-_]{11}$/.test(input)) return input;
    
    // Try to extract from various YouTube URL formats
    let match;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    // Format: youtube.com/watch?v=VIDEO_ID&other_params
    match = input.match(/v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    // Format: youtu.be/VIDEO_ID
    match = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    return input; // Return as-is if no match
  }

  function buildVideosSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('🎬 Videos')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }),
      el('p')
        .text('Embed YouTube videos and optionally set a cover image shown before playback.')
        .css({ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }),
      el('p')
        .text('Use cover images for a nicer preview and click to play behavior.')
        .css({ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }),
      el('button')
        .text('+ Add Video')
        .css({
          width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '20px'
        })
        .on('click', () => {
          config.videos.push({ title: '', youtube_id: '', embed_url: '', cover: '', inputMode: 'youtube' });
          updateUI();
        })
    ]);

    config.videos.forEach((video, idx) => {
      const card = el('div')
        .css({
          backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
          padding: '15px', marginBottom: '12px'
        });

      const titleInput = createInput('Video title (optional)', video.title || '');
      titleInput.on('input', (e) => { config.videos[idx].title = e.target.value; updatePreview(); });

      const mode = video.inputMode || 'youtube';

      const modeRow = el('div').css({ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' });
      modeRow.child([
        el('span').text('Input mode:').css({ fontSize: '13px', fontWeight: '600', color: '#374151', minWidth: '100px' }),
        createToggleBtn('YouTube ID / Link', mode === 'youtube', () => {
          config.videos[idx].inputMode = 'youtube';
          updateUI();
        }),
        createToggleBtn('Embed URL', mode === 'embed', () => {
          config.videos[idx].inputMode = 'embed';
          updateUI();
        })
      ]);

      const ytInput = createInput('YouTube Video ID or paste link (e.g. youtube.com/watch?v=...)', video.youtube_id || '');
      ytInput.on('input', (e) => { 
        const extracted = extractYouTubeId(e.target.value);
        config.videos[idx].youtube_id = extracted;
        ytInput.get().value = extracted;
        updatePreview();
      });

      const embedInput = createInput('Embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)', video.embed_url || '');
      embedInput.on('input', (e) => { config.videos[idx].embed_url = e.target.value; updatePreview(); });

      const coverInput = createInput('Cover Image URL (optional)', video.cover || '');
      coverInput.on('input', (e) => { config.videos[idx].cover = e.target.value; updatePreview(); });

      const coverFileInput = el('input').attr('type', 'file').attr('accept', 'image/*').css({ display: 'none' });
      coverFileInput.on('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          config.videos[idx].cover = ev.target.result;
          updateUI();
        };
        reader.readAsDataURL(file);
      });

      const coverUploadBtn = el('button')
        .text('📁 Upload Cover')
        .css({
          width: '100%', padding: '8px', backgroundColor: '#eef2ff',
          border: '1px dashed #6366f1', borderRadius: '6px', cursor: 'pointer',
          fontSize: '12px', color: '#6366f1', fontWeight: '500', marginBottom: '8px'
        })
        .on('click', () => coverFileInput.get().click());

      const coverPreview = video.cover && video.cover !== ''
        ? el('div').css({ marginBottom: '8px', textAlign: 'center' }).child(
            el('img').attr('src', video.cover).attr('alt', video.title || 'Cover image').css({
              width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '180px'
            })
          )
        : null;

      const deleteBtn = createDeleteBtn(() => { config.videos.splice(idx, 1); updateUI(); });

      const cardChildren = [
        el('div').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }).child([
          el('span').text(`Video ${idx + 1}`).css({ fontWeight: '600', fontSize: '14px', color: '#374151' }),
          deleteBtn
        ]),
        modeRow,
        titleInput,
        ...(mode === 'youtube' ? [ytInput] : []),
        ...(mode === 'embed' ? [embedInput] : []),
        coverInput,
        coverUploadBtn,
        coverFileInput
      ];
      if (coverPreview) cardChildren.splice(4, 0, coverPreview);
      card.child(cardChildren);
      section.child(card);
    });

    if (config.videos.length === 0) {
      section.child(emptyState('No videos yet. Add one to embed on your page.'));
    }

    return section;
  }

  // ==================== IMAGES SECTION ====================
  function buildImagesSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('🖼️ Images')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }),
      el('p')
        .text('Add gallery-style images with optional links and styling.')
        .css({ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }),
      el('p')
        .text('Upload or paste image URLs, then set titles, alt text, and border radius.')
        .css({ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }),
      el('button')
        .text('+ Add Image Group')
        .css({
          width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '20px'
        })
        .on('click', () => {
          config.imageGroups.push({ id: 'image-group-' + Date.now(), name: '', images: [], imageColumns: 1 });
          updateUI();
        }),
      el('p')
        .text('Create image groups and control layout separately for each group.')
        .css({ fontSize: '13px', color: '#6b7280', marginBottom: '20px', lineHeight: '1.5' })
    ]);

    if (config.imageGroups && config.imageGroups.length > 0) {
      config.imageGroups.forEach((group, groupIdx) => {
        const groupCard = el('div')
          .css({
            backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
            padding: '15px', marginBottom: '16px'
          });

        const header = el('div')
          .css({ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' });

        const groupNameInput = el('input')
          .attr('type', 'text')
          .attr('placeholder', 'Optional group label')
          .css({
            flex: '1', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', minWidth: '220px'
          });
        groupNameInput.get().value = group.name;
        groupNameInput.on('input', (e) => {
          config.imageGroups[groupIdx].name = e.target.value;
          updatePreview();
        });

        const addGroupImageBtn = el('button')
          .text('+ Add Image')
          .css({ padding: '10px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#fff', cursor: 'pointer' })
          .on('click', () => {
            config.imageGroups[groupIdx].images.push({ src: '', title: '', alt: '', url: '', borderRadius: '8px', inputMode: 'upload' });
            updateUI();
          });

        const columnToggle = el('div')
          .css({ display: 'flex', gap: '6px', alignItems: 'center' })
          .child([
            el('span').text('Columns:').css({ fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }),
            createToggleBtn('1', (group.imageColumns || 1) === 1, () => {
              config.imageGroups[groupIdx].imageColumns = 1;
              updateUI();
            }),
            createToggleBtn('2', (group.imageColumns || 1) === 2, () => {
              config.imageGroups[groupIdx].imageColumns = 2;
              updateUI();
            })
          ]);

        const deleteGroupBtn = createDeleteBtn(() => {
          config.imageGroups.splice(groupIdx, 1);
          updateUI();
        });

        header.child([groupNameInput, addGroupImageBtn, columnToggle, deleteGroupBtn]);
        groupCard.child(header);

        if (!group.images || group.images.length === 0) {
          groupCard.child(emptyState('No images in this group yet.'));
        }

        group.images && group.images.forEach((image, idx) => {
          const card = el('div')
            .css({
              backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px',
              padding: '15px', marginBottom: '12px'
            });

          const mode = image.inputMode || 'upload';
          const modeRow = el('div').css({ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' });
          modeRow.child([
            el('span').text('Image source:').css({ fontSize: '13px', fontWeight: '600', color: '#374151', minWidth: '100px' }),
            createToggleBtn('URL', mode === 'url', () => {
              config.imageGroups[groupIdx].images[idx].inputMode = 'url';
              updateUI();
            }),
            createToggleBtn('Upload', mode === 'upload', () => {
              config.imageGroups[groupIdx].images[idx].inputMode = 'upload';
              updateUI();
            })
          ]);

          const srcInput = createInput('Image URL (src)', image.src || '');
          srcInput.on('input', (e) => { config.imageGroups[groupIdx].images[idx].src = e.target.value; updatePreview(); });

          const fileInput = el('input').attr('type', 'file').attr('accept', 'image/*').css({ display: 'none' });
          fileInput.on('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              config.imageGroups[groupIdx].images[idx].src = ev.target.result;
              updateUI();
            };
            reader.readAsDataURL(file);
          });

          const uploadBtn = el('button')
            .text('📁 Upload Image')
            .css({
              width: '100%', padding: '8px', backgroundColor: mode === 'upload' ? '#eef2ff' : '#f3f4f6',
              border: '1px dashed #6366f1', borderRadius: '6px', cursor: mode === 'upload' ? 'pointer' : 'not-allowed',
              fontSize: '12px', color: '#6366f1', fontWeight: '500', marginBottom: '8px', opacity: mode === 'upload' ? 1 : 0.6
            })
            .on('click', () => { if (mode === 'upload') fileInput.get().click(); });

          const previewEl = el('div').css({ marginBottom: '8px', textAlign: 'center' });
          if (image.src && image.src !== '') {
            previewEl.child(
              el('div').css({
                width: '100%', maxHeight: '120px', borderRadius: image.borderRadius || '8px',
                backgroundImage: `url(${image.src})`, backgroundSize: 'cover',
                backgroundPosition: 'center', border: '1px solid #d1d5db', minHeight: '80px'
              })
            );
          } else {
            previewEl.child(
              el('div').css({
                width: '100%', minHeight: '120px', borderRadius: image.borderRadius || '8px',
                border: '1px dashed #d1d5db', backgroundColor: '#ffffff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af', gap: '8px', padding: '12px'
              }).child([
                el('i').attr('class', 'fas fa-image').css({ fontSize: '28px' }),
                el('span').text('No image selected').css({ fontSize: '12px' })
              ])
            );
          }

          const titleInput = createInput('Title (optional)', image.title || '');
          titleInput.on('input', (e) => { config.imageGroups[groupIdx].images[idx].title = e.target.value; updatePreview(); });

          const altInput = createInput('Alt text', image.alt || '');
          altInput.on('input', (e) => { config.imageGroups[groupIdx].images[idx].alt = e.target.value; updatePreview(); });

          const urlInput = createInput('Link URL (optional, clicks go here)', image.url || '');
          urlInput.on('input', (e) => { config.imageGroups[groupIdx].images[idx].url = e.target.value; updatePreview(); });

          const radiusRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' });
          const radiusLabel = el('span').text('Border Radius').css({ fontSize: '12px', color: '#6b7280', minWidth: '90px' });
          const radiusSlider = el('input').attr('type', 'range').attr('min', '0').attr('max', '50')
            .css({ flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px' });
          radiusSlider.get().value = parseInt(image.borderRadius) || 8;
          const radiusVal = el('span').text(image.borderRadius || '8px')
            .css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '40px', textAlign: 'right' });
          radiusSlider.on('input', (e) => {
            const v = `${e.target.value}px`;
            radiusVal.text(v);
            config.imageGroups[groupIdx].images[idx].borderRadius = v;
            updatePreview();
          });
          radiusRow.child([radiusLabel, radiusSlider, radiusVal]);

          const deleteBtn = createDeleteBtn(() => { config.imageGroups[groupIdx].images.splice(idx, 1); updateUI(); });

          const cardChildren = [
            el('div').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }).child([
              el('span').text(`Image ${idx + 1}`).css({ fontWeight: '600', fontSize: '14px', color: '#374151' }),
              deleteBtn
            ]),
            modeRow,
            ...(mode === 'url' ? [srcInput] : []),
            ...(mode === 'upload' ? [uploadBtn, fileInput] : []),
          ];
          if (previewEl) cardChildren.push(previewEl);
          cardChildren.push(titleInput, altInput, urlInput, radiusRow);

          card.child(cardChildren);
          groupCard.child(card);
        });

        section.child(groupCard);
      });
    }

    if (config.images && config.images.length > 0) {
      config.images.forEach((image, idx) => {
        const card = el('div')
          .css({
            backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
            padding: '15px', marginBottom: '12px'
          });

        const mode = image.inputMode || 'upload';
        const modeRow = el('div').css({ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' });
        modeRow.child([
          el('span').text('Image source:').css({ fontSize: '13px', fontWeight: '600', color: '#374151', minWidth: '100px' }),
          createToggleBtn('URL', mode === 'url', () => {
            config.images[idx].inputMode = 'url';
            updateUI();
          }),
          createToggleBtn('Upload', mode === 'upload', () => {
            config.images[idx].inputMode = 'upload';
            updateUI();
          })
        ]);

        const srcInput = createInput('Image URL (src)', image.src || '');
        srcInput.on('input', (e) => { config.images[idx].src = e.target.value; updatePreview(); });

        const fileInput = el('input').attr('type', 'file').attr('accept', 'image/*').css({ display: 'none' });
        fileInput.on('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            config.images[idx].src = ev.target.result;
            updateUI();
          };
          reader.readAsDataURL(file);
        });

        const uploadBtn = el('button')
          .text('📁 Upload Image')
          .css({
            width: '100%', padding: '8px', backgroundColor: mode === 'upload' ? '#eef2ff' : '#f3f4f6',
            border: '1px dashed #6366f1', borderRadius: '6px', cursor: mode === 'upload' ? 'pointer' : 'not-allowed',
            fontSize: '12px', color: '#6366f1', fontWeight: '500', marginBottom: '8px', opacity: mode === 'upload' ? 1 : 0.6
          })
          .on('click', () => { if (mode === 'upload') fileInput.get().click(); });

        const previewEl = el('div').css({ marginBottom: '8px', textAlign: 'center' });
        if (image.src && image.src !== '') {
          previewEl.child(
            el('div').css({
              width: '100%', maxHeight: '120px', borderRadius: image.borderRadius || '8px',
              backgroundImage: `url(${image.src})`, backgroundSize: 'cover',
              backgroundPosition: 'center', border: '1px solid #d1d5db', minHeight: '80px'
            })
          );
        } else {
          previewEl.child(
            el('div').css({
              width: '100%', minHeight: '120px', borderRadius: image.borderRadius || '8px',
              border: '1px dashed #d1d5db', backgroundColor: '#ffffff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#9ca3af', gap: '8px', padding: '12px'
            }).child([
              el('i').attr('class', 'fas fa-image').css({ fontSize: '28px' }),
              el('span').text('No image selected').css({ fontSize: '12px' })
            ])
          );
        }

        const titleInput = createInput('Title (optional)', image.title || '');
        titleInput.on('input', (e) => { config.images[idx].title = e.target.value; updatePreview(); });

        const altInput = createInput('Alt text', image.alt || '');
        altInput.on('input', (e) => { config.images[idx].alt = e.target.value; updatePreview(); });

        const urlInput = createInput('Link URL (optional, clicks go here)', image.url || '');
        urlInput.on('input', (e) => { config.images[idx].url = e.target.value; updatePreview(); });

        const radiusRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' });
        const radiusLabel = el('span').text('Border Radius').css({ fontSize: '12px', color: '#6b7280', minWidth: '90px' });
        const radiusSlider = el('input').attr('type', 'range').attr('min', '0').attr('max', '50')
          .css({ flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px' });
        radiusSlider.get().value = parseInt(image.borderRadius) || 8;
        const radiusVal = el('span').text(image.borderRadius || '8px')
          .css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '40px', textAlign: 'right' });
        radiusSlider.on('input', (e) => {
          const v = `${e.target.value}px`;
          radiusVal.text(v);
          config.images[idx].borderRadius = v;
          updatePreview();
        });
        radiusRow.child([radiusLabel, radiusSlider, radiusVal]);

        const deleteBtn = createDeleteBtn(() => { config.images.splice(idx, 1); updateUI(); });

        const cardChildren = [
          el('div').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }).child([
            el('span').text(`Image ${idx + 1}`).css({ fontWeight: '600', fontSize: '14px', color: '#374151' }),
            deleteBtn
          ]),
          modeRow,
          ...(mode === 'url' ? [srcInput] : []),
          ...(mode === 'upload' ? [uploadBtn, fileInput] : []),
        ];
        if (previewEl) cardChildren.push(previewEl);
        cardChildren.push(titleInput, altInput, urlInput, radiusRow);

        card.child(cardChildren);
        section.child(card);
      });
    }

    if ((!config.imageGroups || config.imageGroups.length === 0) && (!config.images || config.images.length === 0)) {
      section.child(emptyState('No images yet. Add one to display on your page.'));
    }

    return section;
  }

  // ==================== DONATIONS SECTION ====================
  function buildDonationsSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('💰 Donations')
        .css({ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }),
      el('p')
        .text('Add donation/tip buttons to your page')
        .css({ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }),
      el('button')
        .text('+ Add Donation Button')
        .css({
          width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '20px'
        })
        .on('click', () => {
          config.donations.push({ title: 'Buy me a coffee', url: 'https://buymeacoffee.com', icon: 'fas fa-coffee', buttonColor: '', buttonText: '' });
          updateUI();
        })
    ]);

    config.donations.forEach((donation, idx) => {
      const card = el('div')
        .css({
          backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
          padding: '15px', marginBottom: '12px'
        });

      const titleInput = createInput('Button label', donation.title || '');
      titleInput.on('input', (e) => { config.donations[idx].title = e.target.value; updatePreview(); });

      const urlInput = createInput('Donation URL', donation.url || '');
      urlInput.on('input', (e) => { config.donations[idx].url = e.target.value; updatePreview(); });

      const iconField = buildIconPickerField('Icon', donation.icon || '', (v) => { config.donations[idx].icon = v; updatePreview(); });

      const colorInput = buildColorRow('Button Background', donation.buttonColor || '', '#ff6b6b', (v) => { config.donations[idx].buttonColor = v; updatePreview(); });
      const textColorInput = buildColorRow('Button Text Color', donation.buttonText || '', '#ffffff', (v) => { config.donations[idx].buttonText = v; updatePreview(); });

      const deleteBtn = createDeleteBtn(() => { config.donations.splice(idx, 1); updateUI(); });

      card.child([
        el('div').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }).child([
          el('span').text(`Donation ${idx + 1}`).css({ fontWeight: '600', fontSize: '14px', color: '#374151' }),
          deleteBtn
        ]),
        titleInput, urlInput, iconField, colorInput, textColorInput
      ]);
      section.child(card);
    });

    if (config.donations.length === 0) {
      section.child(emptyState('No donation buttons yet. Add one to accept tips.'));
    }

    return section;
  }

  // ==================== SETTINGS SECTION ====================
  function buildSettingsSection() {
    const section = el('div');

    section.child([
      el('h2')
        .text('⚙️ Settings')
        .css({
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#111827'
        }),

      el('div')
        .css({
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '20px'
        })
        .child([
          el('h3')
            .text('Account Settings')
            .css({
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '10px',
              color: '#111827'
            }),
          el('p')
            .text('Export data, analytics, and more features coming soon!')
            .css({
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            })
        ])
    ]);

    return section;
  }

  // ==================== HELPERS ====================

  function buildShadowField(label, value, onChange) {
    const container = el('div').css({ marginBottom: '16px' });

    const labelEl = el('label').text(label).css({
      display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151'
    });

    // Parse shadow: "0 4px 8px 0 rgba(0,0,0,0.1)"
    const parseShadow = (shadow) => {
      if (!shadow) return { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000cc', inset: false };
      const isInset = shadow.includes('inset');
      const parts = shadow.replace('inset', '').trim().split(/\s+/);
      try {
        return {
          offsetX: parseInt(parts[0]) || 0,
          offsetY: parseInt(parts[1]) || 4,
          blur: parseInt(parts[2]) || 8,
          spread: parseInt(parts[3]) || 0,
          color: parts[4] || '#000000cc',
          inset: isInset
        };
      } catch (e) {
        return { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000cc', inset: false };
      }
    };

    const current = parseShadow(value);

    // Preview box with shadow
    const preview = el('div').css({
      height: '60px', borderRadius: '8px', marginBottom: '10px',
      backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: value || `0 4px 8px 0 ${current.color}`,
      border: '1px solid #e5e7eb',
      fontSize: '12px', color: '#6b7280', fontWeight: '500'
    }).text('Preview');

    // Inset toggle
    const insetRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const insetCheckbox = el('input').attr('type', 'checkbox').css({ width: '18px', height: '18px', cursor: 'pointer' });
    insetCheckbox.get().checked = current.inset;
    const insetLabel = el('label').text('Inset').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', cursor: 'pointer' });
    insetRow.child([insetCheckbox, insetLabel]);

    // Offset X
    const offsetXRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const offsetXLabel = el('span').text('X:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '30px' });
    const offsetXSlider = el('input').attr('type', 'range').attr('min', '-20').attr('max', '20').css({
      flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    offsetXSlider.get().value = current.offsetX;
    const offsetXVal = el('span').text(current.offsetX).css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '25px' });
    offsetXRow.child([offsetXLabel, offsetXSlider, offsetXVal]);

    // Offset Y
    const offsetYRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const offsetYLabel = el('span').text('Y:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '30px' });
    const offsetYSlider = el('input').attr('type', 'range').attr('min', '-20').attr('max', '20').css({
      flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    offsetYSlider.get().value = current.offsetY;
    const offsetYVal = el('span').text(current.offsetY).css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '25px' });
    offsetYRow.child([offsetYLabel, offsetYSlider, offsetYVal]);

    // Blur radius
    const blurRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const blurLabel = el('span').text('Blur:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '30px' });
    const blurSlider = el('input').attr('type', 'range').attr('min', '0').attr('max', '30').css({
      flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    blurSlider.get().value = current.blur;
    const blurVal = el('span').text(current.blur).css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '25px' });
    blurRow.child([blurLabel, blurSlider, blurVal]);

    // Spread radius
    const spreadRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const spreadLabel = el('span').text('Spread:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '30px' });
    const spreadSlider = el('input').attr('type', 'range').attr('min', '-10').attr('max', '10').css({
      flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    spreadSlider.get().value = current.spread;
    const spreadVal = el('span').text(current.spread).css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '25px' });
    spreadRow.child([spreadLabel, spreadSlider, spreadVal]);

    // Color picker + opacity
    const colorRow = el('div').css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
    const colorLabel = el('span').text('Color:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '50px' });
    const colorInput = el('input').attr('type', 'color').css({
      width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '2px'
    });
    const hexColor = current.color.includes('rgba') ? '#000000' : current.color;
    colorInput.get().value = hexColor;

    const opacityLabel = el('span').text('Opacity:').css({ fontSize: '11px', fontWeight: '600', color: '#6b7280', marginLeft: 'auto', minWidth: '55px' });
    const opacitySlider = el('input').attr('type', 'range').attr('min', '0').attr('max', '100').css({
      width: '80px', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    const opacity = current.color.includes('rgba') ? parseInt(current.color.match(/[\d.]+(?=\))/)?.[0] * 100 || 80) : 100;
    opacitySlider.get().value = opacity;
    const opacityVal = el('span').text(`${opacity}%`).css({ fontSize: '11px', color: '#6366f1', fontWeight: '600', minWidth: '30px' });

    colorRow.child([colorLabel, colorInput, opacityLabel, opacitySlider, opacityVal]);

    const updateShadow = () => {
      const x = offsetXSlider.get().value;
      const y = offsetYSlider.get().value;
      const b = blurSlider.get().value;
      const s = spreadSlider.get().value;
      const c = colorInput.get().value;
      const o = (opacitySlider.get().value / 100).toFixed(2);
      const inset = insetCheckbox.get().checked ? 'inset ' : '';
      const rgba = `rgba(${parseInt(c.slice(1, 3), 16)}, ${parseInt(c.slice(3, 5), 16)}, ${parseInt(c.slice(5, 7), 16)}, ${o})`;
      const shadow = `${inset}${x}px ${y}px ${b}px ${s}px ${rgba}`;
      preview.css({ boxShadow: shadow });
      onChange(shadow);
    };

    offsetXSlider.on('input', (e) => { offsetXVal.text(e.target.value); updateShadow(); });
    offsetYSlider.on('input', (e) => { offsetYVal.text(e.target.value); updateShadow(); });
    blurSlider.on('input', (e) => { blurVal.text(e.target.value); updateShadow(); });
    spreadSlider.on('input', (e) => { spreadVal.text(e.target.value); updateShadow(); });
    colorInput.on('input', updateShadow);
    opacitySlider.on('input', (e) => { opacityVal.text(`${e.target.value}%`); updateShadow(); });
    insetCheckbox.on('change', updateShadow);

    // Clear button
    const clearBtn = el('button').text('✕ Clear').css({
      padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none',
      borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginTop: '6px'
    }).on('click', () => {
      offsetXSlider.get().value = 0;
      offsetYSlider.get().value = 4;
      blurSlider.get().value = 8;
      spreadSlider.get().value = 0;
      insetCheckbox.get().checked = false;
      opacitySlider.get().value = 80;
      offsetXVal.text('0');
      offsetYVal.text('4');
      blurVal.text('8');
      spreadVal.text('0');
      opacityVal.text('80%');
      preview.css({ boxShadow: 'none' });
      onChange('none');
    });

    container.child([labelEl, preview, insetRow, offsetXRow, offsetYRow, blurRow, spreadRow, colorRow, clearBtn]);
    return container;
  }

  function buildBorderField(label, value, onChange) {
    const container = el('div').css({ marginBottom: '16px' });

    const labelEl = el('label').text(label).css({
      display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151'
    });

    // Parse border: "1px solid #fff"
    const parseBorder = (border) => {
      if (!border) return { width: 1, style: 'solid', color: '#ffffff' };
      const match = border.match(/(\d+)px\s+(\w+)\s+(#[0-9a-fA-F]{3,8}|\w+)/);
      return match ? { width: parseInt(match[1]), style: match[2], color: match[3] }
        : { width: 1, style: 'solid', color: '#ffffff' };
    };

    const current = parseBorder(value);

    // Preview bar
    const preview = el('div').css({
      height: '40px', borderRadius: '6px', marginBottom: '10px',
      backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: value || `1px solid #ccc`,
      fontSize: '12px', color: '#6b7280', fontWeight: '600'
    }).text(value || 'No border');

    // Controls row
    const row = el('div').css({ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' });

    // Width slider
    const widthLabel = el('span').text('Width:').css({ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '50px' });
    const widthSlider = el('input').attr('type', 'range').attr('min', '0').attr('max', '10').css({
      width: '80px', accentColor: '#6366f1', cursor: 'pointer', height: '6px'
    });
    widthSlider.get().value = current.width;
    const widthVal = el('span').text(current.width).css({ fontSize: '12px', color: '#6366f1', fontWeight: '600', minWidth: '20px' });

    // Style dropdown
    const styleSelect = el('select').css({
      padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px'
    });
    ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none'].forEach(st => {
      const opt = el('option').attr('value', st).text(st.charAt(0).toUpperCase() + st.slice(1));
      if (st === current.style) opt.get().selected = true;
      styleSelect.child(opt);
    });

    // Color picker
    const colorInput = el('input').attr('type', 'color').css({
      width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '2px'
    });
    colorInput.get().value = current.color.startsWith('#') ? current.color : '#ffffff';

    const updateBorder = () => {
      const w = widthSlider.get().value;
      const s = styleSelect.get().value;
      const c = colorInput.get().value;
      const border = s === 'none' ? 'none' : `${w}px ${s} ${c}`;
      preview.css({ border: border, fontSize: s === 'none' ? '12px' : 'auto', color: s === 'none' ? '#9ca3af' : '#6b7280' })
        .text(border === 'none' ? 'No border' : border);
      onChange(border);
    };

    widthSlider.on('input', (e) => {
      widthVal.text(e.target.value);
      updateBorder();
    });
    styleSelect.on('change', updateBorder);
    colorInput.on('input', updateBorder);

    row.child([widthLabel, widthSlider, widthVal, styleSelect, colorInput]);

    // Clear button
    const clearBtn = el('button').text('✕ Clear').css({
      padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none',
      borderRadius: '4px', fontSize: '11px', cursor: 'pointer'
    }).on('click', () => {
      preview.css({ border: 'none', color: '#9ca3af' }).text('No border');
      widthSlider.get().value = 1;
      widthVal.text('1');
      styleSelect.get().value = 'solid';
      colorInput.get().value = '#ffffff';
      onChange('none');
    });

    container.child([labelEl, preview, row, clearBtn]);
    return container;
  }

  function buildSliderField(label, value, min, max, unit, onChange) {
    const field = el('div').css({ marginBottom: '20px' });
    const numVal = parseInt(value) || min;

    const labelEl = el('label')
      .text(label)
      .css({
        display: 'block', fontSize: '14px', fontWeight: '600',
        marginBottom: '8px', color: '#374151'
      });

    const row = el('div').css({
      display: 'flex', alignItems: 'center', gap: '12px'
    });

    const slider = el('input')
      .attr('type', 'range')
      .attr('min', String(min))
      .attr('max', String(max))
      .css({ flex: '1', accentColor: '#6366f1', cursor: 'pointer', height: '6px' });
    slider.get().value = numVal;

    const valueDisplay = el('span')
      .text(`${numVal}${unit}`)
      .css({
        fontSize: '13px', color: '#6366f1', fontWeight: '600',
        minWidth: '50px', textAlign: 'right'
      });

    slider.on('input', (e) => {
      const v = e.target.value;
      valueDisplay.text(`${v}${unit}`);
      onChange(`${v}${unit}`);
    });

    row.child([slider, valueDisplay]);
    field.child([labelEl, row]);
    return field;
  }

  function buildField(label, value, onChange) {
    const field = el('div').css({ marginBottom: '20px' });

    const labelEl = el('label')
      .text(label)
      .css({
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151'
      });

    const input = el('input')
      .attr('type', 'text')
      .css({
        width: '100%',
        padding: '10px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box'
      });
    input.get().value = value;
    input.on('input', (e) => onChange(e.target.value));

    field.child([labelEl, input]);
    return field;
  }

  function createInput(placeholder, value) {
    const input = el('input')
      .attr('type', 'text')
      .attr('placeholder', placeholder)
      .css({
        width: '100%',
        padding: '8px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '13px',
        marginBottom: '8px',
        boxSizing: 'border-box'
      });
    input.get().value = value;
    return input;
  }

  function createDeleteBtn(onClick) {
    return el('button')
      .text('🗑️')
      .css({
        width: '36px', height: '36px', backgroundColor: '#fee2e2', color: '#dc2626',
        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', flexShrink: 0
      })
      .on('click', onClick);
  }

  function createToggleBtn(label, isActive, onClick) {
    return el('button')
      .text(label)
      .css({
        flex: '1',
        padding: '10px',
        border: isActive ? '2px solid #6366f1' : '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: isActive ? '#eef2ff' : '#fff',
        color: isActive ? '#6366f1' : '#6b7280',
        fontWeight: isActive ? '600' : '400',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      })
      .on('click', onClick);
  }

  function buildColorRow(label, value, placeholder, onChange) {
    const row = el('div').css({ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' });

    const labelEl = el('label')
      .text(label)
      .css({ fontSize: '13px', fontWeight: '500', color: '#374151', width: '140px', flexShrink: 0 });

    // Helper: parse color and opacity from value
    function parseColorAndOpacity(val) {
      if (!val) return { color: '#333333', opacity: 1 };
      // rgba or rgb
      const rgbaMatch = val.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
      if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1]), g = parseInt(rgbaMatch[2]), b = parseInt(rgbaMatch[3]);
        const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
        return { color: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`, opacity: a };
      }
      // hex with alpha
      if (/^#[0-9a-fA-F]{8}$/.test(val)) {
        const hex = val.slice(1, 7);
        const alpha = parseInt(val.slice(7, 9), 16) / 255;
        return { color: `#${hex}`, opacity: alpha };
      }
      // hex
      if (/^#[0-9a-fA-F]{3,6}$/.test(val)) return { color: val, opacity: 1 };
      return { color: '#333333', opacity: 1 };
    }

    // Helper: combine color + opacity to rgba
    function toRgba(hex, opacity) {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
      return `rgba(${r},${g},${b},${opacity})`;
    }

    const { color: initialColor, opacity: initialOpacity } = parseColorAndOpacity(value || placeholder || '#333333');

    const colorPreview = el('div')
      .css({
        width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0,
        border: value ? '2px solid #6366f1' : '1px solid #d1d5db',
        backgroundColor: toRgba(initialColor, initialOpacity),
        cursor: 'pointer'
      });

    const colorInput = el('input')
      .attr('type', 'color')
      .css({ width: '0', height: '0', opacity: '0', position: 'absolute' });
    colorInput.get().value = initialColor;

    // Opacity slider
    const opacityInput = el('input')
      .attr('type', 'range')
      .attr('min', '0')
      .attr('max', '100')
      .attr('step', '1')
      .css({ width: '70px', accentColor: '#6366f1', cursor: 'pointer' });
    opacityInput.get().value = Math.round(initialOpacity * 100);

    // Opacity label
    const opacityLabel = el('span')
      .text(`${Math.round(initialOpacity * 100)}%`)
      .css({ fontSize: '12px', color: '#6366f1', minWidth: '32px', textAlign: 'right' });

    // Text input
    const textInput = el('input')
      .attr('type', 'text')
      .attr('placeholder', placeholder ? `Theme: ${placeholder}` : '#hex or empty')
      .css({
        flex: '1', padding: '6px 8px', border: '1px solid #d1d5db',
        borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box'
      });
    textInput.get().value = value || toRgba(initialColor, initialOpacity);

    // State
    let currentColor = initialColor;
    let currentOpacity = initialOpacity;

    function updateAll(newColor, newOpacity) {
      const rgba = toRgba(newColor, newOpacity);
      colorPreview.css({ backgroundColor: rgba, border: '2px solid #6366f1' });
      textInput.get().value = rgba;
      opacityLabel.text(`${Math.round(newOpacity * 100)}%`);
      onChange(rgba);
    }

    colorInput.on('input', (e) => {
      currentColor = e.target.value;
      updateAll(currentColor, currentOpacity);
    });

    opacityInput.on('input', (e) => {
      currentOpacity = parseInt(e.target.value, 10) / 100;
      updateAll(currentColor, currentOpacity);
    });

    colorPreview.on('click', () => colorInput.get().click());

    textInput.on('input', (e) => {
      // Try to parse rgba or hex
      const c = e.target.value;
      const parsed = parseColorAndOpacity(c);
      currentColor = parsed.color;
      currentOpacity = parsed.opacity;
      colorInput.get().value = currentColor;
      opacityInput.get().value = Math.round(currentOpacity * 100);
      updateAll(currentColor, currentOpacity);
    });

    row.child([labelEl, colorPreview, colorInput, textInput, opacityInput, opacityLabel]);
    return row;
  }

  function buildSectionDivider(title) {
    return el('div')
      .css({ marginTop: '25px', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' })
      .child(
        el('h3').text(title).css({ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' })
      );
  }

  function buildGroupCard(title, children) {
    return el('div')
      .css({
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '18px',
        marginBottom: '16px'
      })
      .child([
        el('h3').text(title).css({
          fontSize: '15px', fontWeight: '600', color: '#111827',
          margin: '0 0 14px 0', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb'
        }),
        ...children
      ]);
  }

  // ==================== ICON PICKER ====================
  const iconCategories = {
    'Social Media': [
      { cls: 'fab fa-instagram', label: 'Instagram' },
      { cls: 'fab fa-youtube', label: 'YouTube' },
      { cls: 'fab fa-tiktok', label: 'TikTok' },
      { cls: 'fab fa-twitter', label: 'Twitter' },
      { cls: 'fab fa-x-twitter', label: 'X (Twitter)' },
      { cls: 'fab fa-facebook', label: 'Facebook' },
      { cls: 'fab fa-facebook-f', label: 'Facebook F' },
      { cls: 'fab fa-linkedin', label: 'LinkedIn' },
      { cls: 'fab fa-linkedin-in', label: 'LinkedIn In' },
      { cls: 'fab fa-snapchat', label: 'Snapchat' },
      { cls: 'fab fa-pinterest', label: 'Pinterest' },
      { cls: 'fab fa-spotify', label: 'Spotify' },
      { cls: 'fab fa-twitch', label: 'Twitch' },
      { cls: 'fab fa-discord', label: 'Discord' },
      { cls: 'fab fa-github', label: 'GitHub' },
      { cls: 'fab fa-gitlab', label: 'GitLab' },
      { cls: 'fab fa-telegram', label: 'Telegram' },
      { cls: 'fab fa-whatsapp', label: 'WhatsApp' },
      { cls: 'fab fa-reddit', label: 'Reddit' },
      { cls: 'fab fa-medium', label: 'Medium' },
      { cls: 'fab fa-behance', label: 'Behance' },
      { cls: 'fab fa-dribbble', label: 'Dribbble' },
      { cls: 'fab fa-soundcloud', label: 'SoundCloud' },
      { cls: 'fab fa-patreon', label: 'Patreon' },
      { cls: 'fab fa-etsy', label: 'Etsy' },
      { cls: 'fab fa-mastodon', label: 'Mastodon' },
      { cls: 'fab fa-threads', label: 'Threads' },
      { cls: 'fab fa-vimeo', label: 'Vimeo' },
      { cls: 'fab fa-vimeo-v', label: 'Vimeo V' },
      { cls: 'fab fa-tumblr', label: 'Tumblr' },
      { cls: 'fab fa-flickr', label: 'Flickr' },
      { cls: 'fab fa-deviantart', label: 'DeviantArt' },
      { cls: 'fab fa-stack-overflow', label: 'Stack Overflow' },
      { cls: 'fab fa-codepen', label: 'CodePen' },
      { cls: 'fab fa-slack', label: 'Slack' },
      { cls: 'fab fa-skype', label: 'Skype' },
      { cls: 'fab fa-line', label: 'LINE' },
      { cls: 'fab fa-weixin', label: 'WeChat' },
      { cls: 'fab fa-qq', label: 'QQ' },
      { cls: 'fab fa-weibo', label: 'Weibo' },
      { cls: 'fab fa-vk', label: 'VK' },
      { cls: 'fab fa-odnoklassniki', label: 'OK' },
      { cls: 'fab fa-mixcloud', label: 'Mixcloud' },
      { cls: 'fab fa-bandcamp', label: 'Bandcamp' },
      { cls: 'fab fa-lastfm', label: 'Last.fm' },
      { cls: 'fab fa-itch-io', label: 'itch.io' },
      { cls: 'fab fa-steam', label: 'Steam' },
      { cls: 'fab fa-playstation', label: 'PlayStation' },
      { cls: 'fab fa-xbox', label: 'Xbox' },
      { cls: 'fab fa-google', label: 'Google' },
      { cls: 'fab fa-apple', label: 'Apple' },
      { cls: 'fab fa-google-play', label: 'Google Play' },
      { cls: 'fab fa-app-store', label: 'App Store' },
      { cls: 'fab fa-kickstarter', label: 'Kickstarter' },
      { cls: 'fab fa-product-hunt', label: 'Product Hunt' },
      { cls: 'fab fa-xing', label: 'Xing' },
      { cls: 'fab fa-angellist', label: 'AngelList' },
    ],
    'Commerce & Payment': [
      { cls: 'fas fa-coffee', label: 'Coffee' },
      { cls: 'fas fa-mug-hot', label: 'Hot Mug' },
      { cls: 'fas fa-store', label: 'Store' },
      { cls: 'fas fa-shopping-cart', label: 'Cart' },
      { cls: 'fas fa-shopping-bag', label: 'Bag' },
      { cls: 'fas fa-gift', label: 'Gift' },
      { cls: 'fas fa-credit-card', label: 'Credit Card' },
      { cls: 'fas fa-wallet', label: 'Wallet' },
      { cls: 'fas fa-dollar-sign', label: 'Dollar' },
      { cls: 'fas fa-euro-sign', label: 'Euro' },
      { cls: 'fas fa-coins', label: 'Coins' },
      { cls: 'fas fa-piggy-bank', label: 'Piggy Bank' },
      { cls: 'fas fa-receipt', label: 'Receipt' },
      { cls: 'fas fa-tag', label: 'Tag' },
      { cls: 'fas fa-tags', label: 'Tags' },
      { cls: 'fas fa-barcode', label: 'Barcode' },
      { cls: 'fas fa-qrcode', label: 'QR Code' },
      { cls: 'fas fa-box', label: 'Box' },
      { cls: 'fas fa-box-open', label: 'Box Open' },
      { cls: 'fas fa-truck', label: 'Truck' },
      { cls: 'fas fa-percent', label: 'Percent' },
      { cls: 'fas fa-handshake', label: 'Handshake' },
      { cls: 'fas fa-cash-register', label: 'Cash Register' },
      { cls: 'fab fa-paypal', label: 'PayPal' },
      { cls: 'fab fa-bitcoin', label: 'Bitcoin' },
      { cls: 'fab fa-ethereum', label: 'Ethereum' },
      { cls: 'fab fa-stripe', label: 'Stripe' },
      { cls: 'fab fa-amazon', label: 'Amazon' },
      { cls: 'fab fa-shopify', label: 'Shopify' },
      { cls: 'fab fa-ebay', label: 'eBay' },
      { cls: 'fab fa-cc-visa', label: 'Visa' },
      { cls: 'fab fa-cc-mastercard', label: 'Mastercard' },
      { cls: 'fab fa-cc-paypal', label: 'CC PayPal' },
      { cls: 'fab fa-cc-stripe', label: 'CC Stripe' },
      { cls: 'fab fa-cc-amazon-pay', label: 'Amazon Pay' },
      { cls: 'fab fa-cc-apple-pay', label: 'Apple Pay' },
    ],
    'Media & Content': [
      { cls: 'fas fa-music', label: 'Music' },
      { cls: 'fas fa-headphones', label: 'Headphones' },
      { cls: 'fas fa-microphone', label: 'Microphone' },
      { cls: 'fas fa-podcast', label: 'Podcast' },
      { cls: 'fas fa-film', label: 'Film' },
      { cls: 'fas fa-video', label: 'Video' },
      { cls: 'fas fa-tv', label: 'TV' },
      { cls: 'fas fa-play', label: 'Play' },
      { cls: 'fas fa-camera', label: 'Camera' },
      { cls: 'fas fa-camera-retro', label: 'Camera Retro' },
      { cls: 'fas fa-image', label: 'Image' },
      { cls: 'fas fa-images', label: 'Images' },
      { cls: 'fas fa-book', label: 'Book' },
      { cls: 'fas fa-book-open', label: 'Book Open' },
      { cls: 'fas fa-bookmark', label: 'Bookmark' },
      { cls: 'fas fa-pen', label: 'Pen' },
      { cls: 'fas fa-pencil', label: 'Pencil' },
      { cls: 'fas fa-pen-nib', label: 'Pen Nib' },
      { cls: 'fas fa-blog', label: 'Blog' },
      { cls: 'fas fa-newspaper', label: 'News' },
      { cls: 'fas fa-quote-left', label: 'Quote' },
      { cls: 'fas fa-code', label: 'Code' },
      { cls: 'fas fa-gamepad', label: 'Gamepad' },
      { cls: 'fas fa-dice', label: 'Dice' },
      { cls: 'fas fa-chess', label: 'Chess' },
      { cls: 'fas fa-puzzle-piece', label: 'Puzzle' },
      { cls: 'fas fa-compact-disc', label: 'CD / Vinyl' },
      { cls: 'fas fa-guitar', label: 'Guitar' },
      { cls: 'fas fa-drum', label: 'Drum' },
      { cls: 'fas fa-palette', label: 'Palette' },
      { cls: 'fas fa-paint-roller', label: 'Paint Roller' },
      { cls: 'fas fa-scroll', label: 'Scroll' },
      { cls: 'fas fa-feather', label: 'Feather' },
      { cls: 'fas fa-file-alt', label: 'File' },
      { cls: 'fas fa-microscope', label: 'Microscope' },
      { cls: 'fas fa-flask', label: 'Flask' },
      { cls: 'fas fa-atom', label: 'Atom' },
    ],
    'Tech & Dev': [
      { cls: 'fas fa-laptop', label: 'Laptop' },
      { cls: 'fas fa-desktop', label: 'Desktop' },
      { cls: 'fas fa-mobile-alt', label: 'Mobile' },
      { cls: 'fas fa-tablet-alt', label: 'Tablet' },
      { cls: 'fas fa-keyboard', label: 'Keyboard' },
      { cls: 'fas fa-server', label: 'Server' },
      { cls: 'fas fa-database', label: 'Database' },
      { cls: 'fas fa-microchip', label: 'Microchip' },
      { cls: 'fas fa-terminal', label: 'Terminal' },
      { cls: 'fas fa-code-branch', label: 'Git Branch' },
      { cls: 'fas fa-wifi', label: 'WiFi' },
      { cls: 'fas fa-satellite', label: 'Satellite' },
      { cls: 'fas fa-satellite-dish', label: 'Satellite Dish' },
      { cls: 'fab fa-git-alt', label: 'Git' },
      { cls: 'fab fa-docker', label: 'Docker' },
      { cls: 'fab fa-aws', label: 'AWS' },
      { cls: 'fab fa-react', label: 'React' },
      { cls: 'fab fa-angular', label: 'Angular' },
      { cls: 'fab fa-vuejs', label: 'Vue.js' },
      { cls: 'fab fa-python', label: 'Python' },
      { cls: 'fab fa-js', label: 'JavaScript' },
      { cls: 'fab fa-node-js', label: 'Node.js' },
      { cls: 'fab fa-php', label: 'PHP' },
      { cls: 'fab fa-wordpress', label: 'WordPress' },
      { cls: 'fab fa-android', label: 'Android' },
      { cls: 'fab fa-windows', label: 'Windows' },
      { cls: 'fab fa-linux', label: 'Linux' },
      { cls: 'fab fa-ubuntu', label: 'Ubuntu' },
      { cls: 'fab fa-chrome', label: 'Chrome' },
      { cls: 'fab fa-firefox', label: 'Firefox' },
      { cls: 'fab fa-figma', label: 'Figma' },
    ],
    'General': [
      { cls: 'fas fa-star', label: 'Star' },
      { cls: 'fas fa-heart', label: 'Heart' },
      { cls: 'fas fa-fire', label: 'Fire' },
      { cls: 'fas fa-bolt', label: 'Bolt' },
      { cls: 'fas fa-globe', label: 'Globe' },
      { cls: 'fas fa-link', label: 'Link' },
      { cls: 'fas fa-envelope', label: 'Email' },
      { cls: 'fas fa-phone', label: 'Phone' },
      { cls: 'fas fa-map-marker-alt', label: 'Location' },
      { cls: 'fas fa-calendar', label: 'Calendar' },
      { cls: 'fas fa-calendar-alt', label: 'Calendar Alt' },
      { cls: 'fas fa-clock', label: 'Clock' },
      { cls: 'fas fa-trophy', label: 'Trophy' },
      { cls: 'fas fa-crown', label: 'Crown' },
      { cls: 'fas fa-diamond', label: 'Diamond' },
      { cls: 'fas fa-gem', label: 'Gem' },
      { cls: 'fas fa-medal', label: 'Medal' },
      { cls: 'fas fa-certificate', label: 'Certificate' },
      { cls: 'fas fa-award', label: 'Award' },
      { cls: 'fas fa-rocket', label: 'Rocket' },
      { cls: 'fas fa-paint-brush', label: 'Art' },
      { cls: 'fas fa-graduation-cap', label: 'Education' },
      { cls: 'fas fa-briefcase', label: 'Work' },
      { cls: 'fas fa-home', label: 'Home' },
      { cls: 'fas fa-thumbs-up', label: 'Thumbs Up' },
      { cls: 'fas fa-thumbs-down', label: 'Thumbs Down' },
      { cls: 'fas fa-bell', label: 'Bell' },
      { cls: 'fas fa-lock', label: 'Lock' },
      { cls: 'fas fa-unlock', label: 'Unlock' },
      { cls: 'fas fa-key', label: 'Key' },
      { cls: 'fas fa-shield-alt', label: 'Shield' },
      { cls: 'fas fa-user', label: 'User' },
      { cls: 'fas fa-user-plus', label: 'Add User' },
      { cls: 'fas fa-users', label: 'Users' },
      { cls: 'fas fa-user-circle', label: 'User Circle' },
      { cls: 'fas fa-id-card', label: 'ID Card' },
      { cls: 'fas fa-search', label: 'Search' },
      { cls: 'fas fa-flag', label: 'Flag' },
      { cls: 'fas fa-chart-bar', label: 'Bar Chart' },
      { cls: 'fas fa-chart-line', label: 'Line Chart' },
      { cls: 'fas fa-chart-pie', label: 'Pie Chart' },
      { cls: 'fas fa-map', label: 'Map' },
      { cls: 'fas fa-compass', label: 'Compass' },
      { cls: 'fas fa-sun', label: 'Sun' },
      { cls: 'fas fa-moon', label: 'Moon' },
      { cls: 'fas fa-cloud', label: 'Cloud' },
      { cls: 'fas fa-snowflake', label: 'Snowflake' },
      { cls: 'fas fa-leaf', label: 'Leaf' },
      { cls: 'fas fa-tree', label: 'Tree' },
      { cls: 'fas fa-seedling', label: 'Seedling' },
      { cls: 'fas fa-mountain', label: 'Mountain' },
      { cls: 'fas fa-paw', label: 'Paw' },
      { cls: 'fas fa-feather-alt', label: 'Feather Alt' },
      { cls: 'fas fa-magic', label: 'Magic' },
      { cls: 'fas fa-infinity', label: 'Infinity' },
      { cls: 'fas fa-recycle', label: 'Recycle' },
      { cls: 'fas fa-bicycle', label: 'Bicycle' },
      { cls: 'fas fa-car', label: 'Car' },
      { cls: 'fas fa-plane', label: 'Plane' },
      { cls: 'fas fa-ship', label: 'Ship' },
      { cls: 'fas fa-bus', label: 'Bus' },
      { cls: 'fas fa-train', label: 'Train' },
      { cls: 'fas fa-motorcycle', label: 'Motorcycle' },
      { cls: 'fas fa-hospital', label: 'Hospital' },
      { cls: 'fas fa-cross', label: 'Cross' },
      { cls: 'fas fa-spa', label: 'Spa' },
      { cls: 'fas fa-dumbbell', label: 'Dumbbell' },
      { cls: 'fas fa-futbol', label: 'Soccer' },
      { cls: 'fas fa-basketball-ball', label: 'Basketball' },
      { cls: 'fas fa-volleyball-ball', label: 'Volleyball' },
      { cls: 'fas fa-swimming-pool', label: 'Swimming' },
      { cls: 'fas fa-utensils', label: 'Food' },
      { cls: 'fas fa-pizza-slice', label: 'Pizza' },
      { cls: 'fas fa-hamburger', label: 'Burger' },
      { cls: 'fas fa-ice-cream', label: 'Ice Cream' },
      { cls: 'fas fa-cocktail', label: 'Cocktail' },
      { cls: 'fas fa-wine-glass', label: 'Wine' },
      { cls: 'fas fa-beer', label: 'Beer' },
    ]
  };

  function buildIconPickerModal(currentValue, onSelect) {
    const allIcons = Object.values(iconCategories).flat();

    const modal = el('div').css({
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '9999'
    });

    const modalBox = el('div').css({
      backgroundColor: '#fff', borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
      maxWidth: '540px', width: '95%', maxHeight: '75vh',
      display: 'flex', flexDirection: 'column'
    });

    // Header
    const header = el('div').css({
      padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', gap: '12px'
    });
    header.child([
      el('h3').text('Pick Icon').css({ fontSize: '16px', fontWeight: '700', color: '#111827', flex: '1', margin: '0' }),
      el('button').text('✕').css({
        background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280'
      }).on('click', () => modal.remove())
    ]);

    // Search
    const searchWrap = el('div').css({ padding: '12px 20px', borderBottom: '1px solid #e5e7eb' });
    const searchInput = el('input').attr('type', 'text').attr('placeholder', 'Search icons...')
      .css({
        width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
        borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box'
      });
    searchWrap.child(searchInput);

    // Body (scrollable)
    const body = el('div').css({ flex: '1', overflowY: 'auto', padding: '16px 20px' });

    const renderIcons = (filter) => {
      body.empty();
      const filtered = filter
        ? allIcons.filter(i => i.label.toLowerCase().includes(filter) || i.cls.includes(filter))
        : null;

      const categoriesToShow = filter
        ? [{ name: `Results (${filtered.length})`, icons: filtered }]
        : Object.entries(iconCategories).map(([name, icons]) => ({ name, icons }));

      categoriesToShow.forEach(({ name, icons }) => {
        const catLabel = el('p').text(name).css({
          fontSize: '11px', fontWeight: '700', color: '#9ca3af',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: '4px'
        });
        const grid = el('div').css({
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
          gap: '6px', marginBottom: '16px'
        });

        icons.forEach(({ cls, label }) => {
          const isActive = currentValue === cls;
          const btn = el('div').css({
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '10px 4px', borderRadius: '8px',
            cursor: 'pointer', gap: '6px',
            backgroundColor: isActive ? '#eef2ff' : '#f9fafb',
            border: isActive ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.15s'
          });
          btn.child([
            el('i').attr('class', cls).css({ fontSize: '20px', color: isActive ? '#6366f1' : '#374151' }),
            el('span').text(label).css({ fontSize: '9px', color: '#6b7280', textAlign: 'center', lineHeight: '1.2' })
          ]);
          btn.on('click', () => {
            onSelect(cls);
            modal.remove();
          });
          grid.child(btn);
        });

        body.child([catLabel, grid]);
      });
      body.get();
    };

    searchInput.on('input', (e) => renderIcons(e.target.value.toLowerCase().trim() || null));
    renderIcons(null);

    // Footer
    const footer = el('div').css({
      padding: '12px 20px', borderTop: '1px solid #e5e7eb',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
    });
    const clearBtn = el('button').text('✕ Clear Icon').css({
      padding: '8px 14px', backgroundColor: '#fee2e2', color: '#dc2626',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
    }).on('click', () => { onSelect(''); modal.remove(); });
    footer.child([clearBtn, el('span').text('Click icon to select').css({ fontSize: '12px', color: '#9ca3af' })]);

    modalBox.child([header, searchWrap, body, footer]);
    modal.child(modalBox);
    return modal;
  }

  function buildIconPickerField(label, currentValue, onChange) {
    const wrapper = el('div').css({ marginBottom: '8px' });
    if (label) {
      wrapper.child(el('span').text(label).css({ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }));
    }

    const row = el('div').css({ display: 'flex', gap: '6px', alignItems: 'center' });

    const preview = el('i')
      .attr('class', currentValue || '')
      .css({
        width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '16px', color: '#374151',
        flexShrink: '0', border: '1px solid #e5e7eb'
      });
    if (!currentValue) preview.text('?').css({ fontSize: '14px', color: '#9ca3af' });

    const textInput = el('input')
      .attr('type', 'text')
      .attr('placeholder', 'Icon class...')
      .attr('readonly', true)
      .css({
        flex: '1', padding: '8px', border: '1px solid #d1d5db',
        borderRadius: '4px', fontSize: '12px', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'pointer'
      });
    textInput.get().value = currentValue || '';
    // Remove manual input handler, only update via picker


    function openIconPicker() {
      const modal = buildIconPickerModal(textInput.get().value, (cls) => {
        textInput.get().value = cls;
        preview.attr('class', cls || '');
        if (!cls) { preview.text('?'); preview.css({ color: '#9ca3af' }); }
        else { preview.text(''); preview.css({ color: '#374151' }); }
        onChange(cls);
      });
      document.body.appendChild(modal.get());
    }

    const pickBtn = el('button').text('🎨').css({
      width: '36px', height: '36px', backgroundColor: '#6366f1', color: '#fff',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', flexShrink: '0'
    }).on('click', openIconPicker);

    textInput.on('click', openIconPicker);

    row.child([preview, textInput, pickBtn]);
    wrapper.child(row);
    return wrapper;
  }

  function buildFontPicker(currentFonts) {
    const popularFonts = [
      'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Source Sans Pro',
      'Playfair Display', 'Montserrat', 'Inter', 'Ubuntu', 'Raleway',
      'Dosis', 'Work Sans', 'Quicksand', 'Heebo', 'Manrope',
      'Barlow', 'Rubik', 'Outfit', 'Mulish', 'Space Grotesk',
      'Lexend', 'Merriweather', 'IBM Plex Sans', 'Sora', 'Inconsolata',
      'Comic Neue', 'Caveat', 'Fredoka', 'Pacifico', 'Righteous',
      'Nunito', 'Oswald', 'Roboto Condensed', 'Lora', 'Garamond',
      'Bodoni Moda', 'Cormorant', 'Abhaya Libre', 'Baskervville', 'Bitter',
      'Courier Prime', 'JetBrains Mono', 'IBM Plex Mono', 'Roboto Mono', 'Fira Code',
      'Prata', 'Bebas Neue', 'Impact', 'Dancing Script', 'Great Vibes',
      'Permanent Marker', 'Bailey Sans', 'Indie Flower', 'Handlee', 'Aleo',
      'Crimson Text', 'EB Garamond', 'Libre Baskerville', 'Playfair Display SC', 'Abril Fatface',
      'Shadows Into Light', 'Almonde', 'Krona One', 'Michroma', 'Electrolize'
    ];


    const modal = el('div').css({
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '9999'
    });

    const modalContent = el('div').css({
      backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      maxWidth: '500px', width: '90%', maxHeight: '70vh',
      display: 'flex', flexDirection: 'column'
    });

    const scrollableContent = el('div').css({
      flex: '1', overflowY: 'auto', padding: '24px', borderBottom: '1px solid #e5e7eb'
    });

    const title = el('h3').text('Select Google Fonts').css({
      fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#111827'
    });

    const searchInput = el('input')
      .attr('type', 'text')
      .attr('placeholder', 'Search fonts...')
      .css({
        width: '100%', padding: '10px', marginBottom: '16px',
        border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px',
        boxSizing: 'border-box'
      });

    const fontsList = el('div').css({
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px'
    });

    const selectedItems = el('div').css({ display: 'flex', flexWrap: 'wrap', gap: '6px' });

    const selectedList = el('div').css({
      backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '12px', marginBottom: '16px'
    });

    const selectedTitle = el('p').text('Selected Fonts:').css({
      fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px'
    });

    let selectedFonts = [...(currentFonts || [])];

    const updateSelectedDisplay = () => {
      selectedItems.empty();
      selectedFonts.forEach(font => {
        const chip = el('div').css({
          backgroundColor: '#6366f1', color: '#fff', padding: '4px 10px',
          borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center',
          gap: '6px'
        });
        const removeBtn = el('button').text('✕')
          .css({
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
            fontSize: '14px', padding: '0', width: 'auto'
          })
          .on('click', () => {
            selectedFonts = selectedFonts.filter(f => f !== font);
            updateSelectedDisplay();
            renderFontsList(currentFilteredFonts);
          });
        chip.child([el('span').text(font), removeBtn]);
        selectedItems.child(chip);
      });
      selectedItems.get();
    };

    let currentFilteredFonts = popularFonts;

    const renderFontsList = (fonts) => {
      fontsList.empty();
      fonts.forEach(font => {
        const isSelected = selectedFonts.includes(font);
        const btn = el('button')
          .text(font)
          .css({
            padding: '10px', border: isSelected ? '2px solid #6366f1' : '1px solid #d1d5db',
            borderRadius: '6px', backgroundColor: isSelected ? '#eef2ff' : '#fff',
            color: isSelected ? '#6366f1' : '#374151', cursor: 'pointer',
            fontSize: '13px', fontWeight: isSelected ? '600' : '400',
            transition: 'all 0.2s'
          })
          .on('click', () => {
            if (isSelected) {
              selectedFonts = selectedFonts.filter(f => f !== font);
            } else {
              selectedFonts.push(font);
            }
            renderFontsList(fonts);
            updateSelectedDisplay();
          });
        fontsList.child(btn);
      });
      fontsList.get();
    };

    searchInput.on('input', (e) => {
      const query = e.target.value.toLowerCase();
      currentFilteredFonts = popularFonts.filter(f => f.toLowerCase().includes(query));
      renderFontsList(currentFilteredFonts.length > 0 ? currentFilteredFonts : popularFonts);
    });

    renderFontsList(popularFonts);
    updateSelectedDisplay();

    const closeBtn = el('button').text('Close').css({
      padding: '10px 20px', backgroundColor: '#e5e7eb', color: '#374151',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
      fontWeight: '600', marginRight: '8px'
    }).on('click', () => modal.remove());

    const applyBtn = el('button').text('Apply').css({
      padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
      fontWeight: '600'
    }).on('click', () => {
      config.googleFonts = selectedFonts;
      updateUI();
      modal.remove();
    });

    const buttonRow = el('div').css({
      display: 'flex', justifyContent: 'flex-end', gap: '8px',
      padding: '16px 24px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb'
    });
    buttonRow.child([closeBtn, applyBtn]);

    const availableTitle = el('p').text('Available:').css({
      fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', marginTop: '0'
    });

    selectedList.child([selectedTitle, selectedItems]);
    scrollableContent.child([title, searchInput, availableTitle, fontsList, selectedList]);
    modalContent.child([scrollableContent, buttonRow]);
    modal.child(modalContent);

    return modal;
  }

  function buildFontSelectField(label, currentValue, configKey) {
    const field = el('div').css({ marginBottom: '20px' });

    const labelEl = el('label')
      .text(label)
      .css({
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151'
      });

    const select = el('select').css({
      width: '100%',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    });

    const updateOptions = () => {
      select.empty();
      
      // Empty option
      const emptyOpt = el('option').attr('value', '').text('-- Select Font --');
      select.child(emptyOpt);

      // Google Fonts options
      if (config.googleFonts && config.googleFonts.length > 0) {
        config.googleFonts.forEach(font => {
          const opt = el('option').attr('value', font).text(font);
          if (currentValue === font) opt.get().selected = true;
          select.child(opt);
        });
      }

      select.get();
    };

    updateOptions();
    select.get().value = currentValue || '';

    select.on('change', (e) => {
      config[configKey] = e.target.value;
      updatePreview();
    });

    field.child([labelEl, select]);
    return field;
  }

  function buildFontSection() {
    const section = el('div').css({ marginBottom: '20px' });

    const labelEl = el('label').text('Google Fonts').css({
      display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'
    });

    const row = el('div').css({ display: 'flex', gap: '8px', alignItems: 'flex-start' });

    const selectedDisplay = el('div').css({
      flex: '1', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px',
      backgroundColor: '#f9fafb', fontSize: '13px', color: '#6b7280', minHeight: '40px',
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px'
    });

    const updateDisplay = () => {
      selectedDisplay.empty();
      if (config.googleFonts && config.googleFonts.length > 0) {
        config.googleFonts.forEach(font => {
          const chip = el('span').text(font).css({
            backgroundColor: '#dbeafe', color: '#0c4a6e', padding: '2px 8px',
            borderRadius: '4px', fontSize: '12px'
          });
          selectedDisplay.child(chip);
        });
      } else {
        selectedDisplay.text('No fonts selected');
      }
      selectedDisplay.get();
    };

    const pickBtn = el('button').text('📋 Pick').css({
      padding: '10px 16px', backgroundColor: '#6366f1', color: '#fff',
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
      fontWeight: '600', whiteSpace: 'nowrap'
    }).on('click', () => {
      const modal = buildFontPicker(config.googleFonts);
      const modalDom = modal.get();
      document.body.appendChild(modalDom);
      
      // Watch for modal removal and update display
      const checkInterval = setInterval(() => {
        if (!document.body.contains(modalDom)) {
          clearInterval(checkInterval);
          updateDisplay();
        }
      }, 100);
    });

    updateDisplay();
    row.child([selectedDisplay, pickBtn]);
    section.child([labelEl, row]);
    return section;
  }

  function buildGradientRow(label, value, placeholder, onChange) {
    const container = el('div').css({ marginBottom: '16px' });

    const labelEl = el('label').text(label).css({
      display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151'
    });

    // Parse existing gradient colors
    const parseGradientColors = (grad) => {
      if (!grad) return ['#667eea', '#764ba2'];
      const matches = grad.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g);
      return matches && matches.length >= 2 ? [matches[0], matches[1]] : ['#667eea', '#764ba2'];
    };

    const currentGrad = value || placeholder;
    const colors = parseGradientColors(currentGrad);

    // Gradient preview
    const gradPreview = el('div').css({
      height: '36px', borderRadius: '6px', marginBottom: '10px',
      background: currentGrad || `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      border: '1px solid #d1d5db'
    });

    // Color pickers row
    const pickersRow = el('div').css({ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' });

    const color1Input = el('input').attr('type', 'color').css({ width: '40px', height: '36px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', padding: '2px' });
    color1Input.get().value = colors[0];

    const arrowEl = el('span').text('→').css({ fontSize: '18px', color: '#9ca3af' });

    const color2Input = el('input').attr('type', 'color').css({ width: '40px', height: '36px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', padding: '2px' });
    color2Input.get().value = colors[1];

    // Direction select
    const dirSelect = el('select').css({ padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', flex: '1' });
    ['135deg', '90deg', '180deg', '45deg', '0deg', '270deg'].forEach(dir => {
      const opt = el('option').attr('value', dir).text(dir === '135deg' ? '↘ 135°' : dir === '90deg' ? '→ 90°' : dir === '180deg' ? '↓ 180°' : dir === '45deg' ? '↗ 45°' : dir === '0deg' ? '↑ 0°' : '← 270°');
      if (currentGrad && currentGrad.includes(dir)) opt.get().selected = true;
      dirSelect.child(opt);
    });

    const applyBtn = el('button').text('Apply').css({
      padding: '6px 14px', backgroundColor: '#6366f1', color: '#fff', border: 'none',
      borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
    });

    const updateGradient = () => {
      const c1 = color1Input.get().value;
      const c2 = color2Input.get().value;
      const dir = dirSelect.get().value;
      const grad = `linear-gradient(${dir}, ${c1} 0%, ${c2} 100%)`;
      gradPreview.css({ background: grad });
      textInput.get().value = grad;
      onChange(grad);
    };

    color1Input.on('input', updateGradient);
    color2Input.on('input', updateGradient);
    dirSelect.on('change', updateGradient);
    applyBtn.on('click', updateGradient);

    pickersRow.child([color1Input, arrowEl, color2Input, dirSelect, applyBtn]);

    // Manual text input
    const textInput = el('input').attr('type', 'text').attr('placeholder', placeholder || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)').css({
      width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px',
      fontSize: '11px', color: '#6b7280', boxSizing: 'border-box'
    });
    textInput.get().value = value;
    textInput.on('input', (e) => {
      const v = e.target.value;
      if (v) gradPreview.css({ background: v });
      onChange(v);
    });

    // Clear button
    const clearBtn = el('button').text('✕ Clear').css({
      padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none',
      borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginTop: '6px'
    }).on('click', () => {
      textInput.get().value = '';
      gradPreview.css({ background: '#e5e7eb' });
      onChange('');
    });

    container.child([labelEl, gradPreview, pickersRow, textInput, clearBtn]);
    return container;
  }

  function emptyState(text) {
    return el('div')
      .css({
        backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px',
        padding: '30px', textAlign: 'center'
      })
      .child(
        el('p').text(text).css({ fontSize: '14px', color: '#9ca3af', margin: '0' })
      );
  }

  function hasCustomTheme() {
    if (!config.theme) return false;
    return Object.values(config.theme).some(v => v !== undefined && v !== '');
  }

  function createThemePicker() {
    const container = el('div');
    let searchQuery = '';
    let selectedCategory = 'All';

    const allThemes = Object.entries(themes).map(([key, theme]) => ({ key, theme }));
    const categories = ['All', ...Array.from(new Set(allThemes.map(({ theme }) => theme.category || 'General')))]
      .sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));

    const searchInput = el('input')
      .attr('type', 'search')
      .attr('placeholder', 'Search themes...')
      .css({
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #d1d5db',
        borderRadius: '10px',
        fontSize: '14px',
        marginBottom: '14px',
        boxSizing: 'border-box'
      })
      .on('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderThemes();
      });

    const categoryRow = el('div')
      .css({ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' });

    const grid = el('div')
      .css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      });

    const renderCategoryButtons = () => {
      categoryRow.empty();
      categories.forEach(category => {
        categoryRow.child(
          el('button')
            .text(category)
            .css({
              padding: '8px 14px',
              borderRadius: '999px',
              border: selectedCategory === category ? '1px solid #6366f1' : '1px solid #d1d5db',
              backgroundColor: selectedCategory === category ? '#eef2ff' : 'transparent',
              color: selectedCategory === category ? '#3730a3' : '#374151',
              cursor: 'pointer',
              fontSize: '13px'
            })
            .on('click', () => {
              selectedCategory = category;
              renderCategoryButtons();
              renderThemes();
            })
        );
      });
      if (categoryRow.el.isConnected) categoryRow.get();
    };

    const renderThemes = () => {
      grid.empty();
      const filtered = allThemes.filter(({ key, theme }) => {
        const matchesCategory = selectedCategory === 'All' || (theme.category || 'General') === selectedCategory;
        const matchesSearch = !searchQuery || key.toLowerCase().includes(searchQuery) || (theme.label || key).toLowerCase().includes(searchQuery) || (theme.description || '').toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.child(
          el('div')
            .css({
              gridColumn: '1 / -1',
              backgroundColor: '#f8fafc',
              border: '1px dashed #d1d5db',
              borderRadius: '14px',
              padding: '28px',
              textAlign: 'center'
            })
            .child(
              el('p').text('No themes match your search.').css({ fontSize: '14px', color: '#6b7280', margin: '0' })
            )
        );
        if (grid.el.isConnected) grid.get();
        return;
      }

      filtered.forEach(({ key, theme }) => {
        const isSelected = config.themeName === key;
        const card = el('div')
          .css({
            backgroundColor: '#ffffff',
            border: isSelected ? '2px solid #6366f1' : '1px solid #e5e7eb',
            borderRadius: '18px',
            padding: '16px',
            cursor: 'pointer',
            boxShadow: isSelected ? '0 12px 28px rgba(99, 102, 241, 0.14)' : '0 1px 3px rgba(15, 23, 42, 0.08)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          })
          .on('click', () => {
            config.themeName = key;
            config.theme = null;
            config.bgMode = '';
            config.bgColor = '';
            config.bgGradient = '';
            config.bgImage = '';
            updateUI();
          })
          .on('mouseenter', () => {
            card.css({ transform: 'translateY(-1px)' });
          })
          .on('mouseleave', () => {
            card.css({ transform: 'translateY(0)' });
          });

        const preview = el('div')
          .css({
            height: '110px',
            borderRadius: '14px',
            marginBottom: '14px',
            background: theme.backgroundGradient || theme.backgroundColor || '#f3f4f6'
          });

        const label = el('div')
          .text(theme.label || key)
          .css({ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '6px' });

        const description = el('div')
          .text(theme.description || '')
          .css({ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', minHeight: '40px' });

        const footer = el('div')
          .css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' })
          .child([
            el('span')
              .text(theme.category || 'General')
              .css({ fontSize: '12px', color: '#4b5563', padding: '4px 8px', borderRadius: '999px', backgroundColor: '#f3f4f6' }),
            el('span')
              .text(isSelected ? 'Selected' : 'Choose')
              .css({ fontSize: '12px', color: isSelected ? '#2563eb' : '#6b7280', fontWeight: '600' })
          ]);

        card.child([preview, label, description, footer]);
        grid.child(card);
      });
      if (grid.el.isConnected) grid.get();
    };

    renderCategoryButtons();
    renderThemes();

    container.child([searchInput, categoryRow, grid]);
    return container;
  }

  function updatePreview() {
    const previewDom = previewPanel.get();
    previewDom.style.position = 'relative';
    previewDom.style.overflow = 'hidden';
    previewDom.style.overflowX = 'hidden';

    if (!previewIframe) {
      previewDom.innerHTML = '';
      previewIframe = document.createElement('iframe');
      previewIframe.style.width = '100%';
      previewIframe.style.height = '100%';
      previewIframe.style.border = 'none';
      previewIframe.style.display = 'block';
      previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

      const html = `<!DOCTYPE html><html><head><base target="_blank"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" /><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:auto;}</style></head><body></body></html>`;
      previewIframe.srcdoc = html;
      previewIframe.onload = () => {
        const doc = previewIframe.contentDocument || previewIframe.contentWindow?.document;
        if (!doc) return;
        previewIframeReady = true;
        if (pendingPreviewRoot) {
          doc.body.innerHTML = '';
          doc.body.appendChild(doc.adoptNode(pendingPreviewRoot));
          pendingPreviewRoot = null;
        }
      };

      previewDom.appendChild(previewIframe);
    }

    const preview = createLinktreeUI({ ...config, isPreview: true });
    const root = preview && preview.get ? preview.get() : null;
    if (!root) return;

    pendingPreviewRoot = root;
    if (previewIframeReady && previewIframe && previewIframe.contentDocument) {
      const doc = previewIframe.contentDocument || previewIframe.contentWindow?.document;
      if (doc) {
        doc.body.innerHTML = '';
        doc.body.appendChild(doc.adoptNode(root));
        pendingPreviewRoot = null;
      }
    }
  }

  // ==================== INIT ====================
  container.child([topBar, mobileViewTabs, bodyWrapper]);
  updateUI();

  return container;
}

export { themes };

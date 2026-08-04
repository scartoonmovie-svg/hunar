 // Event Countdown Timer - August 9, 2026
function updateCountdown() {
    // Event date: August 9, 2026 at 9:00 AM
    const eventDate = new Date('2026-08-09T09:00:00').getTime();
    
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance < 0) {
        const timer = document.querySelector('.countdown-timer');
        if (timer) {
            timer.innerHTML = '<h4 style="font-size: 24px; color: #7c3aed;">Event is Live! 🎉</h4>';
        }
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Start countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// Background Video Auto-play Fix
const bgVideo = document.getElementById('bgVideo');
const webcamVideo = document.getElementById('webcamVideo');

if (bgVideo) {
    // Try to play the video file
    bgVideo.play().catch(e => {
        console.log('Video file failed, trying webcam...');
        // If video fails, use webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function(stream) {
                    bgVideo.style.display = 'none';
                    webcamVideo.style.display = 'block';
                    webcamVideo.srcObject = stream;
                    webcamVideo.play();
                })
                .catch(function(error) {
                    console.log('Webcam also failed:', error);
                    // Hide video container if both fail
                    document.querySelector('.hero-video-container').style.opacity = '0';
                });
        }
    });
    
    // Restart video when it ends
    bgVideo.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    });
    
    // Play video on user interaction if autoplay failed
    document.addEventListener('click', function() {
        if (bgVideo.paused) {
            bgVideo.play();
        }
    }, { once: true });
}

// Animated Counter for Stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const step = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    };
    step();
}

// Observe stat numbers for animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            if (!isNaN(target)) {
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
});

// ========================================
// MOBILE NAVIGATION
// ========================================
const MobileNavigation = {
    menuBtn: document.getElementById('mobileMenuBtn'),
    closeBtn: document.getElementById('mobileCloseBtn'),
    mobileOverlay: document.getElementById('mobileMenuOverlay'),
    
    init() {
        if (!this.menuBtn || !this.mobileOverlay) return;
        
        // Toggle menu on button click
        this.menuBtn.addEventListener('click', () => this.toggle());
        
        // Close on close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on link click
        this.mobileOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },
    
    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    },
    
    open() {
        this.mobileOverlay.classList.add('active');
        this.menuBtn.classList.add('active');
        document.body.classList.add('menu-open');
    },
    
    close() {
        this.mobileOverlay.classList.remove('active');
        this.menuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
    },
    
    isOpen() {
        return this.mobileOverlay.classList.contains('active');
    }
};

// Initialize mobile navigation
MobileNavigation.init();

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.stat-card, .category-card, .stall-card, .faq-item, .about-card, .info-card, .rule-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(124, 58, 237, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ec4899';
            } else {
                input.style.borderColor = 'rgba(124, 58, 237, 0.3)';
            }
        });
        
        if (isValid) {
            alert('Form submitted successfully! We will get back to you soon.');
            form.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
});

// ============================================
// DYNAMIC STALLS LOADER - Load all 108 stalls from JSON
// ============================================
let allStalls = []; // Store all stalls globally
let currentFilter = 'all';
let currentSearchTerm = '';

// Function to load stalls from JSON file
async function loadStalls() {
    try {
        const response = await fetch('stalls-data.json');
        const data = await response.json();
        const stallsData = data['Form Responses 1'];
        
        // Transform JSON data to stall objects
        allStalls = stallsData.map((stall, index) => {
            const name = stall['  Proposed Stall Name.  '] || `Stall ${index + 1}`;
            const owner = stall['Please Enter Your Name.'] || 'Unknown';
            const category = stall['Stall Category.'] || 'Others';
            const description = stall['Brief Description of Your Stall'] || 'No description provided';
            const price = stall['  Approximate Price Range of Your Products  '] || 'Contact for pricing';
            
            return {
                name: name.trim(),
                owner: owner.trim(),
                category: category.trim(),
                description: description.trim(),
                price: price.toString().trim()
            };
        });
        
        // Render all stalls initially
        renderStalls(allStalls);
        
        // Initialize filter and search
        initializeFilters();
        initializeSearch();
        
    } catch (error) {
        console.error('Error loading stalls:', error);
        const stallsGrid = document.getElementById('stallsGrid');
        if (stallsGrid) {
            stallsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                    <h3>Error Loading Stalls</h3>
                    <p style="color: #9CA3AF; margin-top: 10px;">Please refresh the page to try again</p>
                </div>
            `;
        }
    }
}

// Function to render stalls in the grid
function renderStalls(stalls) {
    const stallsGrid = document.getElementById('stallsGrid');
    if (!stallsGrid) return;
    
    if (stalls.length === 0) {
        stallsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>No Stalls Found</h3>
                <p style="color: #9CA3AF; margin-top: 10px;">Try adjusting your filters or search term</p>
            </div>
        `;
        return;
    }
    
    stallsGrid.innerHTML = stalls.map(stall => {
        // Format price display
        let priceDisplay = stall.price;
        if (!priceDisplay.includes('₹') && !priceDisplay.toLowerCase().includes('contact') && !priceDisplay.toLowerCase().includes('tbd')) {
            priceDisplay = `₹${priceDisplay}`;
        }
        
        // Truncate description for card view
        const shortDesc = stall.description.length > 120 
            ? stall.description.substring(0, 120) + '...' 
            : stall.description;
        
        // Escape quotes for onclick function
        const escapedName = stall.name.replace(/'/g, "\\'");
        const escapedOwner = stall.owner.replace(/'/g, "\\'");
        const escapedDesc = stall.description.replace(/'/g, "\\'").replace(/\n/g, ' ');
        const escapedPrice = priceDisplay.replace(/'/g, "\\'");
        const escapedCategory = stall.category.replace(/'/g, "\\'");
        
        return `
            <div class="stall-card" data-category="${stall.category}" data-name="${stall.name.toLowerCase()}" data-owner="${stall.owner.toLowerCase()}">
                <div class="stall-header">
                    <div class="stall-category">${stall.category.toUpperCase()}</div>
                    <h3 class="stall-name">${stall.name}</h3>
                    <p class="stall-owner">By ${stall.owner}</p>
                </div>
                <div class="stall-body">
                    <p class="stall-description">${shortDesc}</p>
                    <div class="stall-price">PRICE: ${priceDisplay}</div>
                </div>
                <div class="stall-actions">
                    <button class="view-details-btn" onclick="showStallDetails('${escapedName}', '${escapedOwner}', '${escapedDesc}', '${escapedPrice}', '${escapedCategory}')">View Details →</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Animate cards appearance
    const cards = stallsGrid.querySelectorAll('.stall-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 30); // Stagger animation
    });
}

// Function to filter stalls
function filterStalls() {
    let filtered = allStalls;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(stall => stall.category === currentFilter);
    }
    
    // Apply search filter
    if (currentSearchTerm) {
        const searchLower = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(stall => 
            stall.name.toLowerCase().includes(searchLower) ||
            stall.owner.toLowerCase().includes(searchLower) ||
            stall.category.toLowerCase().includes(searchLower) ||
            stall.description.toLowerCase().includes(searchLower)
        );
    }
    
    renderStalls(filtered);
}

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current filter
            currentFilter = btn.getAttribute('data-filter');
            
            // Apply filters
            filterStalls();
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('stallSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            filterStalls();
        });
    }
}

// Load stalls when page loads
if (window.location.pathname.includes('stalls.html')) {
    loadStalls();
}

// URL Parameter Filter for Stalls (keep existing functionality)
const urlParams = new URLSearchParams(window.location.search);
const filter = urlParams.get('filter');

if (filter && window.location.pathname.includes('stalls.html')) {
    setTimeout(() => {
        const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }, 500); // Wait for stalls to load
}

// Smooth Scroll for All Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 20px rgba(124, 58, 237, 0.5);
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
});

// Lazy Loading for Gallery Images
const lazyImages = document.querySelectorAll('.gallery-item img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Trigger load
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Page Loading Animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a15;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const spinner = loader.querySelector('.loader-spinner');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 5px solid rgba(124, 58, 237, 0.2);
        border-top: 5px solid #7c3aed;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    // Add keyframes for spinner
    if (!document.querySelector('#loader-keyframes')) {
        const style = document.createElement('style');
        style.id = 'loader-keyframes';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentElement) {
                loader.remove();
            }
        }, 500);
    }, 500);
});

// Interactive Map Zones
const mapZones = document.querySelectorAll('.map-zone');
const zoneInfoDiv = document.getElementById('zoneInfo');

if (mapZones.length > 0 && zoneInfoDiv) {
    mapZones.forEach(zone => {
        zone.addEventListener('click', () => {
            const zoneName = zone.getAttribute('data-zone');
            
            // Zone-specific detailed information
            const zoneInfo = {
                'Entrance': {
                    icon: '🚪',
                    description: 'Main entry point for all visitors. Registration desk and information center available here.',
                    facilities: ['Registration Desk', 'Entry Passes', 'Event Schedule', 'Welcome Packets'],
                    timing: 'Open from 8:00 AM onwards'
                },
                'Help Desk': {
                    icon: 'ℹ️',
                    description: 'Central assistance point for all your queries, directions, and emergency needs.',
                    facilities: ['Information Counter', 'First Aid', 'Lost & Found', 'Volunteer Support'],
                    timing: 'Available throughout the event'
                },
                'Main Stage': {
                    icon: '🎤',
                    description: 'The heart of entertainment! Live performances, cultural shows, award ceremonies, and announcements.',
                    facilities: ['Performance Area', 'Sound System', 'Lighting Setup', 'Seating Arrangement'],
                    timing: 'Performances: 10:00 AM - 5:00 PM'
                },
                'Food Court': {
                    icon: '🍔',
                    description: 'Delicious food paradise with 17+ stalls offering diverse cuisines from Indian street food to desserts!',
                    facilities: ['17 Food Stalls', 'Seating Area', 'Hygiene Standards', 'Veg & Non-Veg Options'],
                    timing: 'Open all day',
                    popular: 'Momos, Pizzas, Cold Coffee, Cupcakes, Chaat'
                },
                'School Ground': {
                    icon: '🏫',
                    description: 'The main event arena where most stalls, activities, and attractions are located. Perfect for exploring!',
                    facilities: ['Multiple Stall Zones', 'Open Space', 'Photo Opportunities', 'Central Location'],
                    timing: 'Full event access'
                },
                'Game Zone': {
                    icon: '🎮',
                    description: 'Fun-filled gaming area with 17+ interactive game stalls! Win exciting prizes and create memories.',
                    facilities: ['17 Game Stalls', 'Prize Counters', 'Ring Toss', 'Shooting Games', 'Target Challenges'],
                    timing: 'Open all day',
                    popular: 'Aim Shooter, Game Galaxy, Mystic Arcade'
                },
                'Art & Craft': {
                    icon: '🎨',
                    description: 'Creative showcase featuring handmade crafts, paintings, jewelry, and artistic masterpieces by talented students.',
                    facilities: ['8+ Craft Stalls', 'Handmade Items', 'Art Display', 'DIY Demonstrations'],
                    timing: 'Open all day',
                    popular: 'Clay items, Paintings, Handmade jewelry'
                },
                'DIY & Innovation': {
                    icon: '💡',
                    description: 'Innovation hub displaying creative student projects, DIY demonstrations, and cutting-edge ideas.',
                    facilities: ['Project Displays', 'Innovation Demos', 'Student Inventions', 'Interactive Sessions'],
                    timing: 'Demos: 11:00 AM - 4:00 PM'
                },
                'Back Gate': {
                    icon: '🚪',
                    description: 'Secondary entrance/exit for convenient access. Useful for parking and quick entry/exit.',
                    facilities: ['Alternative Entry', 'Exit Point', 'Parking Access', 'Less Crowded'],
                    timing: 'Open throughout event'
                }
            };
            
            const info = zoneInfo[zoneName];
            
            if (info) {
                let facilitiesHTML = info.facilities.map(f => `<li>✓ ${f}</li>`).join('');
                let popularHTML = info.popular ? `<p style="margin-top: 15px;"><strong>🌟 Popular Items:</strong> ${info.popular}</p>` : '';
                
                zoneInfoDiv.innerHTML = `
                    <div style="text-align: left;">
                        <h3 style="font-size: 28px; margin-bottom: 15px; color: var(--primary-color);">
                            ${info.icon} ${zoneName}
                        </h3>
                        <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px; color: var(--text-light);">
                            ${info.description}
                        </p>
                        <div style="background: rgba(124, 58, 237, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                            <strong style="color: var(--primary-color); font-size: 16px;">📋 Facilities:</strong>
                            <ul style="margin-top: 10px; padding-left: 20px; color: var(--text-gray);">
                                ${facilitiesHTML}
                            </ul>
                        </div>
                        ${popularHTML}
                        <p style="margin-top: 15px; font-size: 14px; color: var(--text-gray);">
                            <strong>⏰ Timing:</strong> ${info.timing}
                        </p>
                    </div>
                `;
            } else {
                zoneInfoDiv.innerHTML = `
                    <p style="text-align: center; color: var(--text-gray); padding: 30px;">
                        👆 Click on any zone above to see detailed information about stalls, facilities, and activities in that area.
                    </p>
                `;
            }
            
            // Highlight selected zone with smooth animation
            mapZones.forEach(z => {
                z.style.transform = 'scale(1)';
                z.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            });
            zone.style.transform = 'scale(1.08)';
            zone.style.boxShadow = '0 20px 50px rgba(124, 58, 237, 0.6)';
            
            // Smooth scroll to zone details
            document.querySelector('.zone-details-panel').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        });
    });
}

// Enhanced Category Cards Click Animation
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            width: 20px;
            height: 20px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        const rect = card.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS
if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
        @keyframes ripple {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
                margin-left: -50px;
                margin-top: -50px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Parallax Effect for Hero Section - DISABLED (causes menu clipping)
// window.addEventListener('scroll', () => {
//     const heroContent = document.querySelector('.hero-content');
//     if (heroContent && window.scrollY < window.innerHeight) {
//         const scrolled = window.scrollY;
//         heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
//         heroContent.style.opacity = 1 - (scrolled / 500);
//     }
// });

// Copy to Clipboard for Phone Numbers
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const phoneNumber = link.textContent.trim();
        navigator.clipboard.writeText(phoneNumber).then(() => {
            // Show copied notification
            const notification = document.createElement('div');
            notification.textContent = '📋 Number copied!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #7c3aed;
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        });
    });
});

// Print-friendly feature
const createPrintBtn = () => {
    if (window.location.pathname.includes('stalls.html') || window.location.pathname.includes('rules.html')) {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '🖨️ Print';
        printBtn.className = 'print-btn';
        printBtn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 5px 20px rgba(124, 58, 237, 0.5);
            transition: all 0.3s ease;
        `;
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.transform = 'translateY(-3px)';
        });
        
        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.transform = 'translateY(0)';
        });
        
        document.body.appendChild(printBtn);
    }
};

createPrintBtn();

// Add animations CSS
if (!document.querySelector('#animation-keyframes')) {
    const style = document.createElement('style');
    style.id = 'animation-keyframes';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance: Reduce animations on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

console.log('🎉 Hunar Bazaar 2026 - Website Loaded Successfully!');
console.log('✨ All features activated and ready to go!');


// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const ScrollToTop = {
    button: null,
    
    init() {
        // Create scroll-to-top button
        this.button = document.createElement('button');
        this.button.className = 'scroll-to-top';
        this.button.innerHTML = '↑';
        this.button.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(this.button);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => this.toggleVisibility());
        
        // Scroll to top on click
        this.button.addEventListener('click', () => this.scrollToTop());
    },
    
    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Initialize scroll-to-top
ScrollToTop.init();

// ========================================
// ========================================
// FAQ ACCORDION
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const parentItem = this.closest('.faq-item');
            if (!parentItem) return;
            
            const isAlreadyActive = parentItem.classList.contains('active');
            
            // Close all open FAQs
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle clicked FAQ (if it wasn't already active, open it)
            if (!isAlreadyActive) {
                parentItem.classList.add('active');
            }
        });
    });
});

// ========================================
// LAZY LOADING IMAGES
// ========================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Initialize lazy loading
LazyLoad.init();

// ========================================
// ENHANCED VIDEO LOADING
// ========================================
const VideoLoader = {
    init() {
        const heroVideo = document.getElementById('heroVideo');
        if (!heroVideo) return;
        
        // Show video once it's loaded enough to play
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.style.opacity = '1';
        });
        
        // Handle video loading error
        heroVideo.addEventListener('error', () => {
            console.log('Video failed to load');
            const container = document.querySelector('.hero-video-container');
            if (container) {
                container.style.opacity = '0.3';
            }
        });
    }
};

// Initialize video loader
VideoLoader.init();

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// PERFORMANCE: Debounce scroll events
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent functions run here
}, 100));

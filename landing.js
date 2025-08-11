// Smooth scrolling for navigation links
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

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.feature-item, .instrument-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add click handlers for CTA buttons
document.querySelector('.cta-button.primary')?.addEventListener('click', () => {
    document.querySelector('#instruments').scrollIntoView({
        behavior: 'smooth'
    });
});

// Add hover effects for instrument cards
document.querySelectorAll('.instrument-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add floating musical notes to hero section
function createMusicNote() {
    const note = document.createElement('div');
    const noteSymbols = ['♪', '♩', '♫', '♬'];
    note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];

    note.style.position = 'absolute';
    note.style.fontSize = `${Math.random() * 20 + 20}px`; // 20px to 40px
    note.style.opacity = '0.8';
    note.style.color = 'white';
    note.style.left = `${Math.random() * 100}%`;
    note.style.top = '100%';
    note.style.pointerEvents = 'none';
    note.style.animation = 'noteFloat 6s linear';

    document.querySelector('.hero').appendChild(note);

    setTimeout(() => {
        note.remove();
    }, 6000);
}

// Add CSS keyframes for musical note floating
const noteStyle = document.createElement('style');
noteStyle.textContent = `
    @keyframes noteFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(noteStyle);

// Create musical notes more frequently (every 300ms)
setInterval(createMusicNote, 1000);


// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create particles periodically
setInterval(createParticle, 2000);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('instrument-card')) {
        const playButton = e.target.querySelector('.play-button');
        if (playButton) {
            playButton.click();
        }
    }
});

// Make cards focusable for accessibility
document.querySelectorAll('.instrument-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Play ${card.querySelector('h3').textContent}`);
});
// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking on a link
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu on window resize if it's open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Enhanced touch support for mobile cards
document.querySelectorAll('.instrument-card').forEach(card => {
    let touchStartTime = 0;
    
    card.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
    });
    
    card.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        
        // If it's a quick tap (less than 300ms), trigger the flip
        if (touchDuration < 300) {
            e.preventDefault();
            card.classList.toggle('flipped');
        }
    });
});

// Add CSS class for manual card flipping on mobile
const cardFlipStyle = document.createElement('style');
cardFlipStyle.textContent = `
    @media (max-width: 768px) {
        .instrument-card.flipped .card-inner {
            transform: rotateY(180deg);
        }
        
        .instrument-card:hover .card-inner {
            transform: none;
        }
        
        .instrument-card.flipped:hover .card-inner {
            transform: rotateY(180deg);
        }
    }
`;
document.head.appendChild(cardFlipStyle);
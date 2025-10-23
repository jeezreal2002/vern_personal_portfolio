// ===================================
// 0. Preloader
// ===================================

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const heroSection = document.querySelector('.hero');
  
  // Add a minimum display time of 1 second for smooth experience
  setTimeout(() => {
    preloader.classList.add('fade-out');
    
    // Remove preloader from DOM after fade out
    setTimeout(() => {
      preloader.style.display = 'none';
      
      // Trigger hero fade-in animation
      if (heroSection) {
        heroSection.classList.add('fade-in');
      }
    }, 500);
  }, 1000);
});

// ===================================
// 1. Utility Functions
// ===================================

// Debounce function for performance optimization
function debounce(func, wait = 10) {
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

// ===================================
// 2. Navigation Functionality
// ===================================

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Update ARIA attribute
    const isExpanded = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open on mobile
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 767) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
});

// Add shadow to navbar on scroll
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

// ===================================
// 3. Smooth Scrolling
// ===================================

// Smooth scroll for all navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Smooth scroll for hero CTA button
const contactButton = document.querySelector('.btn-secondary');
if (contactButton) {
  contactButton.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = contactButton.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// ===================================
// 4. Active Navigation Link Highlighting
// ===================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
  
  // Special case for top of page
  if (window.scrollY < 100) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[0].classList.add('active'); // Home link
  }
}

window.addEventListener('scroll', debounce(highlightNavLink, 10));

// ===================================
// 5. Scroll-to-Top Button
// ===================================

const scrollTopBtn = document.getElementById('scrollTopBtn');

function handleScrollTopButton() {
  if (window.scrollY > 200) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', debounce(handleScrollTopButton, 10));

// Scroll to top when button is clicked
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===================================
// 6. Intersection Observer for Animations
// ===================================

// Education Section Fade-In Animation Only
if ('IntersectionObserver' in window) {
  const educationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add fade-in class with staggered delay
        const timelineItems = entry.target.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('fade-in');
          }, index * 150); // 150ms delay between each item
        });
        
        // Stop observing after animation is triggered
        educationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px'
  });
  
  // Observe only the education section
  const educationSection = document.getElementById('education');
  if (educationSection) {
    educationObserver.observe(educationSection);
  }
} else {
  // Fallback: Show all timeline items immediately
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.classList.add('fade-in');
  });
}

// ===================================
// 7. Contact Form Handling
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:verngeneralao11@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thank you for your message! Your email client will open to send the message.');
    
    // Reset form
    contactForm.reset();
  });
}

// ===================================
// 8. Keyboard Navigation Enhancement
// ===================================

// Trap focus in mobile menu when open
document.addEventListener('keydown', (e) => {
  if (navMenu.classList.contains('active') && e.key === 'Escape') {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});

// ===================================
// 9. Initialize on Page Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Initial navbar state
  handleNavbarScroll();
  
  // Initial scroll top button state
  handleScrollTopButton();
  
  // Initial active nav link
  highlightNavLink();
  
  // Add loaded class to body for any CSS transitions
  document.body.classList.add('loaded');
  
  console.log('Portfolio website loaded successfully!');
});

// ===================================
// 10. Handle Window Resize
// ===================================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 767) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }, 250);
});

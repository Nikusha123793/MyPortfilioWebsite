// Projects Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.projects-slider');
    if (!slider) return;

    const container = slider.querySelector('.slider-container');
    const cards = slider.querySelectorAll('.project-card');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsContainer = slider.querySelector('.slider-dots');
    
    // Initialize variables
    let currentIndex = 0;
    let cardWidth = cards[0]?.offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight) || 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Create dots navigation
    function createDots() {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Update slider position and UI
    function updateSlider() {
        container.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
        
        updateDots();
        updateButtons();
    }
    
    // Update active dot
    function updateDots() {
        const dots = slider.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update navigation buttons visibility
    function updateButtons() {
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentIndex === cards.length - 1 ? 'none' : 'flex';
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= cards.length) return;
        currentIndex = index;
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    // Handle swipe gestures
    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }
    
    // Initialize drag events
    function initDragEvents() {
        cards.forEach(card => {
            // Prevent image drag
            const images = card.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });
            
            // Touch events
            card.addEventListener('touchstart', touchStart, { passive: true });
            card.addEventListener('touchmove', touchMove, { passive: true });
            card.addEventListener('touchend', touchEnd);
        });
    }
    
    // Touch start handler
    function touchStart(e) {
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        container.style.scrollBehavior = 'auto';
    }
    
    // Touch move handler
    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        container.scrollLeft = prevTranslate - diff;
    }
    
    // Touch end handler
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        container.style.scrollBehavior = 'smooth';
        
        // Snap to nearest card
        const snapPosition = Math.round(container.scrollLeft / cardWidth) * cardWidth;
        container.scrollTo({
            left: snapPosition,
            behavior: 'smooth'
        });
        
        // Update current index
        currentIndex = Math.round(container.scrollLeft / cardWidth);
        updateSlider();
    }
    
    // Animation frame for smooth dragging
    function animation() {
        container.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }
    
    // Handle window resize
    function handleResize() {
        cardWidth = cards[0]?.offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight) || 0;
        updateSlider();
    }
    
    // Initialize the slider
    function initSlider() {
        if (cards.length === 0) return;
        
        createDots();
        initDragEvents();
        updateButtons();
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            else if (e.key === 'ArrowLeft') prevSlide();
        });
        
        window.addEventListener('resize', handleResize);
        
        // Initialize position
        updateSlider();
    }
    
    // Start the slider
    initSlider();
});

// Toggle mobile menu
const burgerMenu = document.getElementById('burger-menu');
const mainMenu = document.getElementById('main-menu');

if (burgerMenu && mainMenu) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mainMenu.classList.toggle('active');
    });
}

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Enhanced smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Special handling for home link to scroll to top
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (mainMenu && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
            }
        }
    });
});

// Improved animation on scroll for hero section
function animateOnScroll() {
    const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .scroll-indicator');
    const heroSection = document.querySelector('.hero');

    if (!heroSection) return;

    const heroPosition = heroSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if (heroPosition < screenPosition) {
        elements.forEach(el => {
            // Reset and replay animations
            el.style.animation = 'none';
            void el.offsetWidth; // Trigger reflow
            el.style.animation = null;
            
            // Ensure elements stay visible
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
}

// Run on load and scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Animate about section when scrolled to
const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    const aboutElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(aboutSection);
}

// Animate skills section when scrolled to
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    const skillElements = document.querySelectorAll('.animate-in');
    const skillBars = document.querySelectorAll('.skill-level');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill cards
                skillElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });

                // Animate skill bars
                skillBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = level + '%';
                });
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(skillsSection);
}

// Animate services section when scrolled to
const servicesSection = document.querySelector('.services-section');
if (servicesSection) {
    const serviceElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                serviceElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(servicesSection);
}

// Animate projects section when scrolled to
const projectsSection = document.querySelector('.projects-section');
if (projectsSection) {
    const projectElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                projectElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(projectsSection);
}

// Animate contact section when scrolled to
const contactSection = document.querySelector('.contact-section');
if (contactSection) {
    const contactElements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                contactElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(contactSection);
}

// EmailJS form submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("PYB4vKdvDvJxq4uIV");
    }

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data using EmailJS
            emailjs.sendForm('service_rpn568a', 'template_l88cvwi', contactForm)
                .then(function() {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 8px;"></i>Message sent successfully!';
                    successMessage.style.color = '#2ecc71'; // Emerald green
                    successMessage.style.background = 'rgba(46, 204, 113, 0.1)'; // ღია გამჭვირვალე ფონი
                    successMessage.style.padding = '12px 20px';
                    successMessage.style.border = '1px solid rgba(46, 204, 113, 0.4)';
                    successMessage.style.borderRadius = '10px';
                    successMessage.style.fontWeight = '500';
                    successMessage.style.fontSize = '1rem';
                    successMessage.style.textAlign = 'center';
                    successMessage.style.marginTop = '20px';
                    successMessage.style.transition = 'opacity 0.5s ease';
                    contactForm.appendChild(successMessage);
                    
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        setTimeout(() => {
                            successMessage.remove();
                        }, 500);
                    }, 3000);
                }, function(error) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>An error occurred. Please try again.';
                    errorMessage.style.color = '#e74c3c'; // Soft vivid red
                    errorMessage.style.background = 'rgba(231, 76, 60, 0.1)'; // ღია ფონური რბილი წითელი
                    errorMessage.style.padding = '12px 20px';
                    errorMessage.style.border = '1px solid rgba(231, 76, 60, 0.4)';
                    errorMessage.style.borderRadius = '10px';
                    errorMessage.style.fontWeight = '500';
                    errorMessage.style.fontSize = '1rem';
                    errorMessage.style.textAlign = 'center';
                    errorMessage.style.marginTop = '20px';
                    errorMessage.style.transition = 'opacity 0.5s ease';
                    contactForm.appendChild(errorMessage);
                    
                    setTimeout(() => {
                        errorMessage.style.opacity = '0';
                        setTimeout(() => {
                            errorMessage.remove();
                        }, 500);
                    }, 3000);
                    console.error('EmailJS Error:', error);
                });
        });
    }
});

// Footer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for footer links
    document.querySelectorAll('.footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add floating particles to hero section
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    hero.appendChild(particlesContainer);

    const particleCount = 15;
    const colors = ['rgba(138, 30, 226, 0.5)', 'rgba(94, 140, 255, 0.5)', 'rgba(255, 255, 255, 0.3)'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
});
// Wait for all animation libraries to load
window.addEventListener('load', () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize AOS with custom settings
    AOS.init({
        duration: 1000,
        once: false,
        offset: 100,
        mirror: true,
        delay: 100
    });

    // Image Slider
    const slider = {
        container: document.querySelector('.slider'),
        slides: document.querySelectorAll('.slide'),
        nav: document.querySelector('.slider-nav'),
        dots: document.querySelector('.slider-dots'),
        prevBtn: document.querySelector('.slider-btn.prev'),
        nextBtn: document.querySelector('.slider-btn.next'),
        currentSlide: 0,
        interval: null,
        isTransitioning: false
    };

    // Create dots for each slide
    slider.slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => !slider.isTransitioning && goToSlide(index));
        slider.dots.appendChild(dot);
    });

    function updateDots() {
        const dots = slider.dots.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slider.currentSlide);
        });
    }

    function goToSlide(index, direction = 'next') {
        if (slider.isTransitioning || index === slider.currentSlide) return;
        
        slider.isTransitioning = true;
        
        const currentSlide = slider.slides[slider.currentSlide];
        const nextSlide = slider.slides[index];
        
        // Remove previous animation classes
        slider.slides.forEach(slide => {
            slide.classList.remove('sliding-in', 'sliding-out');
        });
        
        // Add animation classes based on direction
        if (direction === 'next') {
            nextSlide.style.transform = 'translateX(100%)';
            nextSlide.classList.add('sliding-in');
            currentSlide.classList.add('sliding-out');
        } else {
            nextSlide.style.transform = 'translateX(-100%)';
            nextSlide.classList.add('sliding-in');
            currentSlide.classList.add('sliding-out');
        }
        
        // Update active classes
        currentSlide.classList.remove('active');
        nextSlide.classList.add('active');
        
        // Update current slide index
        slider.currentSlide = index;
        
        // Update dots
        updateDots();
        
        // Reset transition flag
        setTimeout(() => {
            slider.isTransitioning = false;
            nextSlide.style.transform = '';
        }, 1000);
    }

    function nextSlide() {
        const next = (slider.currentSlide + 1) % slider.slides.length;
        goToSlide(next, 'next');
    }

    function prevSlide() {
        const prev = (slider.currentSlide - 1 + slider.slides.length) % slider.slides.length;
        goToSlide(prev, 'prev');
    }

    // Add click events to navigation buttons
    slider.prevBtn.addEventListener('click', () => {
        clearInterval(slider.interval);
        prevSlide();
        startAutoSlide();
    });

    slider.nextBtn.addEventListener('click', () => {
        clearInterval(slider.interval);
        nextSlide();
        startAutoSlide();
    });

    // Start auto sliding
    function startAutoSlide() {
        if (slider.interval) {
            clearInterval(slider.interval);
        }
        slider.interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Initialize auto sliding
    startAutoSlide();

    // Pause auto sliding when user hovers over slider
    slider.container.addEventListener('mouseenter', () => {
        clearInterval(slider.interval);
    });

    slider.container.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Theme Switcher with localStorage
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animate theme change
        gsap.to('body', {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                gsap.to('body', {
                    opacity: 1,
                    duration: 0.2
                });
            }
        });
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function setActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // Initialize all animations
    function initAnimations() {
        // Hero Section Animations
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        heroTimeline
            .fromTo('.hero-text', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1 }
            )
            .fromTo('.animated-title',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 },
                '-=0.5'
            )
            .fromTo('.animated-subtitle',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1 },
                '-=0.7'
            )
            .fromTo('.cta-buttons',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.5'
            );

        // Product Cards Animation
        gsap.utils.toArray('.product-card').forEach((card, i) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 50,
                    rotateX: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        end: 'bottom center',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Sector Cards Animation
        gsap.utils.toArray('.sector-card').forEach((card, i) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: i * 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        end: 'bottom center',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Stats Animation
        const stats = document.querySelectorAll('.stat-item h4');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            
            gsap.to({}, {
                duration: 2,
                onStart: () => {
                    const interval = setInterval(() => {
                        current = Math.min(current + Math.ceil(target / 50), target);
                        stat.textContent = current + (stat.textContent.includes('+') ? '+' : '');
                        
                        if (current >= target) {
                            clearInterval(interval);
                        }
                    }, 40);
                },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // Initialize animations
    initAnimations();

    // Reinitialize AOS on theme change
    document.addEventListener('aos:refreshed', () => {
        AOS.refresh();
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Navbar Animation
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(26, 26, 79, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Products Scroll Functionality
    const productsWrapper = document.querySelector('.products-wrapper');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const scrollIndicator = document.querySelector('.scroll-indicator-dots');
    const productCards = document.querySelectorAll('.product-card');

    // Create scroll indicator dots
    const totalDots = Math.ceil(productCards.length / 3); // Assuming 3 cards visible at a time
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = `scroll-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => scrollToPosition(i));
        scrollIndicator.appendChild(dot);
    }

    // Scroll buttons click handlers
    scrollLeftBtn?.addEventListener('click', () => {
        productsWrapper.scrollBy({
            left: -340,
            behavior: 'smooth'
        });
    });

    scrollRightBtn?.addEventListener('click', () => {
        productsWrapper.scrollBy({
            left: 340,
            behavior: 'smooth'
        });
    });

    // Update active dot based on scroll position
    function updateActiveDot() {
        const scrollPosition = productsWrapper.scrollLeft;
        const maxScroll = productsWrapper.scrollWidth - productsWrapper.clientWidth;
        const scrollPercentage = scrollPosition / maxScroll;
        const activeDotIndex = Math.round(scrollPercentage * (totalDots - 1));

        document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    // Scroll to position based on dot click
    function scrollToPosition(dotIndex) {
        const maxScroll = productsWrapper.scrollWidth - productsWrapper.clientWidth;
        const scrollTo = (maxScroll / (totalDots - 1)) * dotIndex;
        productsWrapper.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
    }

    // Update dots on scroll
    productsWrapper.addEventListener('scroll', updateActiveDot);

    // Add hover effect for product cards
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.card-shine'), {
                opacity: 1,
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-shine'), {
                opacity: 0,
                duration: 0.3
            });
        });
    });

    // Sectors Scroll Functionality
    const sectorsWrapper = document.querySelector('.sectors-wrapper');
    const sectorScrollLeftBtn = document.querySelector('.sectors .scroll-left');
    const sectorScrollRightBtn = document.querySelector('.sectors .scroll-right');
    const sectorScrollIndicator = document.querySelector('.sectors .scroll-indicator-dots');
    const sectorCards = document.querySelectorAll('.sector-card');

    // Create scroll indicator dots for sectors
    const totalSectorDots = Math.ceil(sectorCards.length / 3); // Assuming 3 cards visible at a time
    for (let i = 0; i < totalSectorDots; i++) {
        const dot = document.createElement('div');
        dot.className = `scroll-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => scrollSectorsToPosition(i));
        sectorScrollIndicator.appendChild(dot);
    }

    // Scroll buttons click handlers for sectors
    sectorScrollLeftBtn?.addEventListener('click', () => {
        sectorsWrapper.scrollBy({
            left: -320,
            behavior: 'smooth'
        });
    });

    sectorScrollRightBtn?.addEventListener('click', () => {
        sectorsWrapper.scrollBy({
            left: 320,
            behavior: 'smooth'
        });
    });

    // Update active dot based on scroll position for sectors
    function updateSectorActiveDot() {
        const scrollPosition = sectorsWrapper.scrollLeft;
        const maxScroll = sectorsWrapper.scrollWidth - sectorsWrapper.clientWidth;
        const scrollPercentage = scrollPosition / maxScroll;
        const activeDotIndex = Math.round(scrollPercentage * (totalSectorDots - 1));

        document.querySelectorAll('.sectors .scroll-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    // Scroll to position based on dot click for sectors
    function scrollSectorsToPosition(dotIndex) {
        const maxScroll = sectorsWrapper.scrollWidth - sectorsWrapper.clientWidth;
        const scrollTo = (maxScroll / (totalSectorDots - 1)) * dotIndex;
        sectorsWrapper.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
    }

    // Update dots on scroll for sectors
    sectorsWrapper.addEventListener('scroll', updateSectorActiveDot);

    // Add hover effect for sector cards
    sectorCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.card-shine'), {
                opacity: 1,
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-shine'), {
                opacity: 0,
                duration: 0.3
            });
        });
    });

    // Counter Animation
    function animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    // Initialize counter animations when in view
    const counterElements = document.querySelectorAll('.counter-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    counterElements.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    gsap.from(timelineItems, {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.journey-timeline',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        }
    });

    // Values animation
    const valueItems = document.querySelectorAll('.value-item');
    gsap.from(valueItems, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.values-grid',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        }
    });

    // Achievement cards animation
    const achievementCards = document.querySelectorAll('.achievement-card');
    gsap.from(achievementCards, {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
            trigger: '.achievements-grid',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        }
    });
}); 
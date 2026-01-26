// Navigation functionality
(function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('main > section[id]');

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 100; // Account for nav
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                if (sectionId === 'index') {
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    scrollToSection(sectionId);
                }
            }
        });
    });

    // Update active nav link on scroll
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}`) {
                        link.style.opacity = '1';
                    } else if (href && href.startsWith('#')) {
                        link.style.opacity = '0.6';
                    }
                });
            }
        });

        // Check if at top (index section)
        if (scrollPos < 200) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === '#index' || (href && href.includes('index.html'))) {
                    link.style.opacity = '1';
                } else if (href && href.startsWith('#')) {
                    link.style.opacity = '0.6';
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
})();

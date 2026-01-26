// Navigation functionality
(function() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('main > section[id]');

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 80; // Account for fixed nav
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
            const section = link.getAttribute('data-section');
            
            if (section === 'work') {
                // Open work modal
                const workButton = document.getElementById('index-work-button') || document.getElementById('work-button');
                if (workButton) {
                    workButton.click();
                }
            } else if (section === 'index') {
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollToSection(section);
            }
        });
    });

    // Update active nav link on scroll
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        link.style.opacity = '1';
                    } else {
                        link.style.opacity = '0.6';
                    }
                });
            }
        });

        // Check if at top (index section)
        if (scrollPos < 200) {
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'index') {
                    link.style.opacity = '1';
                } else {
                    link.style.opacity = '0.6';
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
})();

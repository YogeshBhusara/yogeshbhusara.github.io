// Work carousel functionality - adapted from LogoLoop
(function() {
    const carouselContainer = document.getElementById('index-work-carousel');
    if (!carouselContainer) return;

    // Work data
    const works = [
        {
            id: 'flower-app',
            title: 'Flower iPhone App',
            meta: 'MOBILE · PRODUCT DESIGN',
            thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        },
        {
            id: 'propertiease',
            title: 'PropertiEase App',
            meta: 'B2C · WEB & MOBILE',
            thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        },
        {
            id: 'matrimony-app',
            title: 'Matrimony App UI',
            meta: 'MOBILE · UI DESIGN',
            thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        },
        {
            id: 'analytics-dashboard',
            title: 'Analytics Dashboard',
            meta: 'WEB · DATA VISUALIZATION',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        }
    ];

    const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };
    const speed = 50;
    const gap = 32;
    const itemWidth = 350;

    let trackRef = null;
    let seqWidth = 0;
    let copyCount = ANIMATION_CONFIG.MIN_COPIES;
    let rafId = null;
    let lastTimestamp = null;
    let offset = 0;
    let velocity = speed;
    let isHovered = false;
    let isInitialized = false;

    function createCarouselItem(work) {
        const item = document.createElement('div');
        item.className = 'work-carousel__item';
        item.dataset.workId = work.id;
        
        item.innerHTML = `
            <div class="work-carousel__thumbnail">
                <img src="${work.thumbnail}" alt="${work.title}" loading="lazy">
            </div>
            <div class="work-carousel__info">
                <h3 class="work-carousel__title">${work.title}</h3>
                <p class="work-carousel__meta">${work.meta}</p>
            </div>
        `;

        item.addEventListener('click', () => {
            sessionStorage.setItem('openWorkId', work.id);
            window.location.href = 'work.html';
        });

        return item;
    }

    function initCarousel() {
        // Create track container
        const track = document.createElement('div');
        track.className = 'work-carousel__track';
        trackRef = track;

        carouselContainer.appendChild(track);

        // Setup hover handlers
        track.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        track.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Build carousel after DOM is ready
        buildCarousel();
    }

    function buildCarousel() {
        if (!trackRef || !carouselContainer) return;

        // Clear existing items
        trackRef.innerHTML = '';

        // First, create a single sequence to measure actual width
        works.forEach(work => {
            const item = createCarouselItem(work);
            trackRef.appendChild(item);
        });

        // Wait for layout to calculate actual dimensions
        requestAnimationFrame(() => {
            const firstItem = trackRef.querySelector('.work-carousel__item');
            if (!firstItem) return;

            // Measure actual item width
            const actualItemWidth = firstItem.offsetWidth || itemWidth;
            seqWidth = works.length * (actualItemWidth + gap);

            // Calculate copies needed to fill viewport
            const containerWidth = carouselContainer.clientWidth || window.innerWidth;
            copyCount = Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / seqWidth) + ANIMATION_CONFIG.COPY_HEADROOM);

            // Clear and rebuild with all copies
            trackRef.innerHTML = '';
            for (let i = 0; i < copyCount; i++) {
                works.forEach(work => {
                    const item = createCarouselItem(work);
                    trackRef.appendChild(item);
                });
            }

            // Wait for images to load, then start animation
            const images = trackRef.querySelectorAll('img');
            let loadedCount = 0;
            const totalImages = images.length;

            const startAnimation = () => {
                if (!isInitialized) {
                    isInitialized = true;
                    offset = 0;
                    lastTimestamp = null;
                    animate();
                }
            };

            if (totalImages === 0) {
                startAnimation();
                return;
            }

            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        startAnimation();
                    }
                } else {
                    img.addEventListener('load', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            startAnimation();
                        }
                    }, { once: true });
                    img.addEventListener('error', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            startAnimation();
                        }
                    }, { once: true });
                }
            });
        });
    }

    function animate(timestamp) {
        if (!trackRef || seqWidth <= 0) {
            rafId = requestAnimationFrame(animate);
            return;
        }

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
            rafId = requestAnimationFrame(animate);
            return;
        }

        const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const target = isHovered ? 0 : speed;
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocity += (target - velocity) * easingFactor;

        if (velocity > 0) {
            offset += velocity * deltaTime;
            
            // Reset offset when it exceeds sequence width for seamless loop
            while (offset >= seqWidth) {
                offset -= seqWidth;
            }
        }

        trackRef.style.transform = `translate3d(${-offset}px, 0, 0)`;

        rafId = requestAnimationFrame(animate);
    }

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (trackRef && carouselContainer) {
                isInitialized = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                lastTimestamp = null;
                offset = 0;
                buildCarousel();
            }
        }, 100);
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();

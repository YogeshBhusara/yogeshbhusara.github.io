/**
 * work-carousel.js — Horizontal work carousel on homepage (#index-work-carousel).
 */
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
    const itemWidth = 403;

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
        isInitialized = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        // First, create a single sequence to measure actual width
        works.forEach(work => {
            const item = createCarouselItem(work);
            trackRef.appendChild(item);
        });

        // Wait for layout to calculate actual dimensions - use double RAF for reliable measurement
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const firstItem = trackRef.querySelector('.work-carousel__item');
                if (!firstItem) {
                    // Fallback: use default values
                    seqWidth = works.length * (itemWidth + gap);
                } else {
                    // Measure actual item width
                    const actualItemWidth = firstItem.offsetWidth || itemWidth;
                    seqWidth = works.length * (actualItemWidth + gap);
                }

                // Ensure seqWidth is valid
                if (seqWidth <= 0) {
                    seqWidth = works.length * (itemWidth + gap);
                }

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
                let animationStarted = false;

                const startAnimation = () => {
                    if (animationStarted) return;
                    animationStarted = true;
                    
                    // Recalculate seqWidth after all items are rendered
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            const firstItem = trackRef.querySelector('.work-carousel__item');
                            if (firstItem) {
                                const actualItemWidth = firstItem.offsetWidth || itemWidth;
                                seqWidth = works.length * (actualItemWidth + gap);
                            }
                            
                            // Ensure seqWidth is valid
                            if (seqWidth <= 0) {
                                seqWidth = works.length * (itemWidth + gap);
                            }
                            
                            if (!isInitialized && seqWidth > 0) {
                                isInitialized = true;
                                offset = 0;
                                lastTimestamp = null;
                                velocity = speed;
                                animate();
                            }
                        });
                    });
                };

                // Timeout fallback - start animation after 2 seconds even if images aren't loaded
                const timeoutId = setTimeout(() => {
                    startAnimation();
                }, 2000);

                if (totalImages === 0) {
                    clearTimeout(timeoutId);
                    startAnimation();
                    return;
                }

                images.forEach(img => {
                    if (img.complete) {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            clearTimeout(timeoutId);
                            startAnimation();
                        }
                    } else {
                        img.addEventListener('load', () => {
                            loadedCount++;
                            if (loadedCount === totalImages) {
                                clearTimeout(timeoutId);
                                startAnimation();
                            }
                        }, { once: true });
                        img.addEventListener('error', () => {
                            loadedCount++;
                            if (loadedCount === totalImages) {
                                clearTimeout(timeoutId);
                                startAnimation();
                            }
                        }, { once: true });
                    }
                });
            });
        });
    }

    function animate(timestamp) {
        if (!trackRef) {
            rafId = null;
            return;
        }

        if (seqWidth <= 0) {
            // If seqWidth is not ready, try to recalculate
            const firstItem = trackRef.querySelector('.work-carousel__item');
            if (firstItem) {
                const actualItemWidth = firstItem.offsetWidth || itemWidth;
                seqWidth = works.length * (actualItemWidth + gap);
            }
            
            if (seqWidth <= 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }
        }

        if (lastTimestamp === null) {
            lastTimestamp = timestamp || performance.now();
            rafId = requestAnimationFrame(animate);
            return;
        }

        const currentTime = timestamp || performance.now();
        const deltaTime = Math.max(0, (currentTime - lastTimestamp) / 1000);
        lastTimestamp = currentTime;

        const target = isHovered ? 0 : speed;
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocity += (target - velocity) * easingFactor;

        if (velocity > 0 && seqWidth > 0) {
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

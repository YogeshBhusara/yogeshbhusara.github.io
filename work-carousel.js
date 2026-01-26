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
    const itemWidth = 280;

    let trackRef = null;
    let seqWidth = 0;
    let copyCount = ANIMATION_CONFIG.MIN_COPIES;
    let rafId = null;
    let lastTimestamp = null;
    let offset = 0;
    let velocity = speed;
    let isHovered = false;

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

        // Calculate sequence width
        seqWidth = works.length * (itemWidth + gap);
        
        // Calculate copies needed
        const containerWidth = carouselContainer.clientWidth || window.innerWidth;
        copyCount = Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / seqWidth) + ANIMATION_CONFIG.COPY_HEADROOM);

        // Create items and copies
        for (let i = 0; i < copyCount; i++) {
            works.forEach(work => {
                const item = createCarouselItem(work);
                track.appendChild(item);
            });
        }

        carouselContainer.appendChild(track);

        // Setup hover handlers
        track.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        track.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Wait for images to load, then start animation
        const images = track.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
            animate();
            return;
        }

        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
                if (loadedCount === totalImages) {
                    animate();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        animate();
                    }
                }, { once: true });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        animate();
                    }
                }, { once: true });
            }
        });
    }

    function animate(timestamp) {
        if (!trackRef) return;

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const target = isHovered ? 0 : speed;
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocity += (target - velocity) * easingFactor;

        if (seqWidth > 0) {
            offset += velocity * deltaTime;
            // Reset offset when it exceeds sequence width for seamless loop
            if (offset >= seqWidth) {
                offset = offset % seqWidth;
            }

            trackRef.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }

        rafId = requestAnimationFrame(animate);
    }

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (trackRef && carouselContainer) {
                const containerWidth = carouselContainer.clientWidth;
                const newCopyCount = Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / seqWidth) + ANIMATION_CONFIG.COPY_HEADROOM);
                if (newCopyCount !== copyCount) {
                    copyCount = newCopyCount;
                    trackRef.innerHTML = '';
                    for (let i = 0; i < copyCount; i++) {
                        works.forEach(work => {
                            const item = createCarouselItem(work);
                            trackRef.appendChild(item);
                        });
                    }
                }
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

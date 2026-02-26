/**
 * work-page.js — Work page: list render, detail modal, and next-project navigation.
 */
(function() {
    const workList = document.getElementById('work-list');
    const workDetail = document.getElementById('work-detail');
    const workDetailClose = document.getElementById('work-detail-close');
    const workDetailInner = document.getElementById('work-detail-inner');

    // Work data (shared via work-data.js)
    const works = (window.PORTFOLIO_WORKS || []);

    // Render work list (device-mockup style cards: image, title, category, arrow CTA)
    function renderWorkList() {
        if (!workList) return;
        
        workList.innerHTML = '';
        works.forEach(work => {
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'work-list-item';
            item.dataset.workId = work.id;
            
            const category = work.meta ? work.meta.split(' · ')[0] : work.category;
            const thumb = work.images && work.images[0]
                ? `<div class="work-list-item-thumb"><img src="${work.images[0]}" alt="${work.title}" loading="lazy"></div>`
                : '<div class="work-list-item-thumb work-list-item-thumb--placeholder"></div>';
            
            item.innerHTML = `
                ${thumb}
                <div class="work-list-item-footer">
                    <div class="work-list-item-info">
                        <h3 class="work-list-item-title">${work.title}</h3>
                        <p class="work-list-item-category">${category}</p>
                    </div>
                    <span class="work-list-item-cta">View <svg class="work-list-item-cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openWorkDetail(work.id);
            });
            
            workList.appendChild(item);
        });
    }

    // Open work detail
    function openWorkDetail(workId) {
        const work = works.find(w => w.id === workId);
        if (!work) return;

        renderWorkDetail(work);
        
        requestAnimationFrame(() => {
            workDetail.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            workDetailInner.scrollTop = 0;
            
            if (typeof gsap !== 'undefined') {
                const elements = document.querySelectorAll('.work-detail-header, .work-detail-section, .work-detail-image-wrapper, .work-detail-navigation');
                gsap.fromTo(elements,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        stagger: 0.08, 
                        delay: 0.15,
                        ease: 'power2.out'
                    }
                );
            }
        });
    }

    // Render work detail
    function renderWorkDetail(work) {
        const currentIndex = works.findIndex(w => w.id === work.id);
        const nextIndex = (currentIndex + 1) % works.length;
        const nextWork = works[nextIndex];
        
        workDetailInner.innerHTML = `
            <div class="work-detail-header">
                <h1 class="work-detail-title">${work.title}</h1>
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${work.year}</span>
                    <span class="work-detail-tag">${work.category}</span>
                </div>
                <p class="work-detail-description">${work.description}</p>
            </div>
            
            ${work.sections.map((section, index) => `
                <div class="work-detail-section">
                    <h2 class="work-detail-section-title">${section.title}</h2>
                    <div class="work-detail-section-content">
                        <p>${section.content}</p>
                    </div>
                </div>
                ${work.images[index] ? `
                    <div class="work-detail-image-wrapper">
                        <img src="${work.images[index]}" alt="${work.title}" class="work-detail-image" loading="lazy">
                    </div>
                ` : ''}
            `).join('')}
            
            ${work.images.slice(work.sections.length).map(img => `
                <div class="work-detail-image-wrapper">
                    <img src="${img}" alt="${work.title}" class="work-detail-image" loading="lazy">
                </div>
            `).join('')}
            
            <div class="work-detail-navigation">
                <button class="work-detail-next" data-next-id="${nextWork.id}">
                    Next Project →
                </button>
            </div>
        `;
        
        const nextButton = workDetailInner.querySelector('.work-detail-next');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextId = nextButton.dataset.nextId;
                closeWorkDetail();
                setTimeout(() => {
                    openWorkDetail(nextId);
                }, 400);
            });
        }
    }

    // Close work detail
    function closeWorkDetail() {
        workDetail.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }

    // Event listeners
    if (workDetailClose) {
        workDetailClose.addEventListener('click', closeWorkDetail);
    }

    if (workDetail) {
        const overlay = workDetail.querySelector('.work-detail-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeWorkDetail);
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && workDetail && workDetail.getAttribute('aria-hidden') === 'false') {
            closeWorkDetail();
        }
    });

    // Initialize
    renderWorkList();

    // Bento / index: open work detail when clicking any [data-work-id]
    document.body.addEventListener('click', function(e) {
        const el = e.target.closest('a[data-work-id], [data-work-id]');
        if (el && el.dataset.workId) {
            e.preventDefault();
            openWorkDetail(el.dataset.workId);
        }
    });

    // Check if we need to open a specific work detail from carousel
    const openWorkId = sessionStorage.getItem('openWorkId');
    if (openWorkId) {
        sessionStorage.removeItem('openWorkId');
        setTimeout(() => {
            openWorkDetail(openWorkId);
        }, 100);
    }
})();

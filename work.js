/**
 * work.js — Work modal and grid (homepage); opens detail from grid items. Depends on work-data.js.
 */
(function() {
    const workButton = document.getElementById('work-button');
    const workModal = document.getElementById('work-modal');
    const workModalClose = document.getElementById('work-modal-close');
    const workGrid = document.getElementById('work-grid');
    const workDetail = document.getElementById('work-detail');
    const workDetailClose = document.getElementById('work-detail-close');
    const workDetailInner = document.getElementById('work-detail-inner');

    // Work data (shared via work-data.js)
    const works = (window.PORTFOLIO_WORKS || []);

    // Open work modal
    function openWorkModal() {
        document.body.style.overflow = 'hidden';
        renderWorkGrid();
        
        // Use requestAnimationFrame for smooth transition
        requestAnimationFrame(() => {
            workModal.setAttribute('aria-hidden', 'false');
            
            // Animate work items with stagger
            if (typeof gsap !== 'undefined') {
                const items = document.querySelectorAll('.work-item');
                gsap.fromTo(items,
                    { opacity: 0, y: 15 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.4, 
                        stagger: 0.05, 
                        delay: 0.2,
                        ease: 'power2.out'
                    }
                );
            }
        });
    }

    // Close work modal
    function closeWorkModal() {
        workModal.setAttribute('aria-hidden', 'true');
        
        // Wait for transition to complete
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }

    // Render work grid
    function renderWorkGrid() {
        workGrid.innerHTML = '';
        works.forEach(work => {
            const item = document.createElement('div');
            item.className = `work-item work-item--${work.size}`;
            item.dataset.workId = work.id;
            
            item.innerHTML = `
                <div class="work-item-content">
                    <div>
                        <h3 class="work-item-title">${work.title}</h3>
                        <p class="work-item-meta">${work.meta}</p>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => openWorkDetail(work.id));
            workGrid.appendChild(item);
        });
    }

    // Open work detail
    function openWorkDetail(workId) {
        const work = works.find(w => w.id === workId);
        if (!work) return;

        // Close modal first if open
        if (workModal && workModal.getAttribute('aria-hidden') === 'false') {
            closeWorkModal();
        }

        // Render detail
        renderWorkDetail(work);
        
        // Use requestAnimationFrame for smooth transition
        requestAnimationFrame(() => {
            workDetail.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Scroll to top
            workDetailInner.scrollTop = 0;
            
            // Animate content with stagger
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
        
            // Add event listener to next button
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
        
        // Wait for transition to complete
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }

    // Event listeners
    if (workButton) {
        workButton.addEventListener('click', openWorkModal);
    }

    // Index "See My Work" button
    const indexWorkButton = document.getElementById('index-work-button');
    if (indexWorkButton) {
        indexWorkButton.addEventListener('click', openWorkModal);
    }

    if (workModalClose) {
        workModalClose.addEventListener('click', closeWorkModal);
    }

    if (workDetailClose) {
        workDetailClose.addEventListener('click', closeWorkDetail);
    }

    // Close on overlay click
    if (workModal) {
        const overlay = workModal.querySelector('.work-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeWorkModal);
        }
    }

    if (workDetail) {
        const overlay = workDetail.querySelector('.work-detail-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeWorkDetail);
        }
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (workDetail && workDetail.getAttribute('aria-hidden') === 'false') {
                closeWorkDetail();
            } else if (workModal && workModal.getAttribute('aria-hidden') === 'false') {
                closeWorkModal();
            }
        }
    });
})();

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
                    <span class="work-list-item-cta" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </span>
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

    function slugify(value) {
        return String(value || '')
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function renderRichText(content) {
        const raw = (content == null ? '' : String(content)).trim();
        if (!raw) return '';

        // If author provided HTML, trust it (portfolio-controlled content).
        if (raw.startsWith('<')) return raw;

        // Otherwise treat as plain text with paragraph breaks.
        const paragraphs = raw
            .split(/\n\s*\n/g)
            .map(p => p.trim())
            .filter(Boolean);

        return paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // Render work detail
    function renderWorkDetail(work) {
        const currentIndex = works.findIndex(w => w.id === work.id);
        const nextIndex = (currentIndex + 1) % works.length;
        const nextWork = works[nextIndex];

        const sections = Array.isArray(work.sections) ? work.sections : [];
        const toc = sections
            .map((section) => {
                const id = `section-${slugify(section.title)}`;
                return `<a href="#${id}" class="work-detail-toc__link" data-toc-target="${id}">${section.title}</a>`;
            })
            .join('');
        
        workDetailInner.innerHTML = `
            ${toc ? `
                <nav class="work-detail-toc" aria-label="Case study sections">
                    ${toc}
                </nav>
            ` : ''}

            <div class="work-detail-header">
                <h1 class="work-detail-title">${work.title}</h1>
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${work.year}</span>
                    <span class="work-detail-tag">${work.category}</span>
                </div>
                <p class="work-detail-description">${work.description}</p>
            </div>
            
            ${sections.map((section, index) => {
                const sectionId = `section-${slugify(section.title)}`;
                const bodyHtml = renderRichText(section.content);

                return `
                    <div class="work-detail-section" id="${sectionId}">
                        <h2 class="work-detail-section-title">${section.title}</h2>
                        <div class="work-detail-section-content">
                            ${bodyHtml}
                        </div>
                    </div>
                    ${work.images && work.images[index] ? `
                        <div class="work-detail-image-wrapper">
                            <img src="${work.images[index]}" alt="${work.title}" class="work-detail-image" loading="lazy">
                        </div>
                    ` : ''}
                `;
            }).join('')}
            
            ${(Array.isArray(work.images) ? work.images : []).slice(sections.length).map(img => `
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

        setupWorkDetailToc();
    }

    function setupWorkDetailToc() {
        const toc = workDetailInner.querySelector('.work-detail-toc');
        if (!toc) return;

        const scrollRoot = workDetail ? workDetail.querySelector('.work-detail-content') : null;
        const links = Array.from(toc.querySelectorAll('.work-detail-toc__link'));
        const targets = links
            .map((link) => {
                const id = link.getAttribute('data-toc-target') || link.getAttribute('href')?.replace(/^#/, '');
                if (!id) return null;
                const el = workDetailInner.querySelector(`#${CSS.escape(id)}`);
                return el ? { link, el, id } : null;
            })
            .filter(Boolean);

        function setActiveLink(activeId) {
            links.forEach((link) => {
                const id = link.getAttribute('data-toc-target') || link.getAttribute('href')?.replace(/^#/, '');
                const isActive = id === activeId;
                link.classList.toggle('work-detail-toc__link--active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        // Click: scroll within modal (not window)
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('data-toc-target') || link.getAttribute('href')?.replace(/^#/, '');
                if (!id) return;
                const el = workDetailInner.querySelector(`#${CSS.escape(id)}`);
                if (!el || !scrollRoot) return;

                e.preventDefault();
                const top = el.offsetTop;
                scrollRoot.scrollTo({ top, behavior: 'smooth' });
                setActiveLink(id);
            });
        });

        // Scrollspy: update active link while scrolling the modal
        if (!scrollRoot || typeof IntersectionObserver === 'undefined' || targets.length === 0) {
            if (targets[0]) setActiveLink(targets[0].id);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));

            if (visible.length === 0) return;
            const topMost = visible[0].target;
            if (topMost && topMost.id) setActiveLink(topMost.id);
        }, {
            root: scrollRoot,
            threshold: [0.15, 0.35, 0.55],
            rootMargin: '-20% 0px -70% 0px'
        });

        targets.forEach(({ el }) => observer.observe(el));

        // Default state
        setActiveLink(targets[0].id);
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

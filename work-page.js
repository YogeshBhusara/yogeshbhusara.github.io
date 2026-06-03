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

    function getWorkDetailScrollRoot() {
        return workDetail ? workDetail.querySelector('.work-detail-content') : null;
    }

    function resetWorkDetailScroll() {
        const scrollRoot = getWorkDetailScrollRoot();
        if (scrollRoot) scrollRoot.scrollTop = 0;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Render work list (same layout / classes as blog vertical list: text column + linked thumb)
    function renderWorkList() {
        if (!workList) return;

        workList.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'blog-posts-list';

        works.forEach((work) => {
            const li = document.createElement('li');
            li.className = 'blog-posts-item';

            const category = work.meta ? work.meta.split(' · ')[0] : work.category;
            const categoryHtml = category
                ? '<span class="blog-posts-date">' + escapeHtml(category) + '</span>'
                : '';
            const desc = work.description
                ? '<p class="blog-posts-desc">' + escapeHtml(work.description) + '</p>'
                : '';

            const imgSrc = work.images && work.images[0] ? work.images[0] : '';
            const thumbInner = imgSrc
                ? '<img class="blog-posts-thumb__img" src="' +
                  escapeHtml(imgSrc) +
                  '" alt="" loading="lazy" decoding="async" width="220" height="160">'
                : '<div class="blog-posts-thumb__grad" aria-hidden="true"></div>';

            const thumbLabel = 'Open ' + work.title;
            const thumb =
                '<a href="#" class="blog-posts-thumb" data-work-id="' +
                escapeHtml(work.id) +
                '" aria-label="' +
                escapeHtml(thumbLabel) +
                '">' +
                thumbInner +
                '</a>';

            li.innerHTML =
                '<div class="blog-posts-main">' +
                categoryHtml +
                '<a href="#" class="blog-posts-link" data-work-id="' +
                escapeHtml(work.id) +
                '">' +
                escapeHtml(work.title) +
                '</a>' +
                desc +
                '</div>' +
                thumb;

            ul.appendChild(li);
        });

        workList.appendChild(ul);
    }

    // Open work detail
    function openWorkDetail(workId) {
        if (!workDetail || !workDetailInner) return;
        const work = works.find(w => w.id === workId);
        if (!work) return;

        renderWorkDetail(work);
        resetWorkDetailScroll();

        requestAnimationFrame(() => {
            workDetail.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            resetWorkDetailScroll();

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

    /** Normalize sections for rendering; each case study supplies its own section list. */
    function normalizeWorkSections(work) {
        const raw = Array.isArray(work.sections) ? work.sections : [];
        const usedIds = new Set();

        return raw.map((section, index) => {
            const title = section && section.title != null ? String(section.title) : '';
            let id = section && section.id != null ? String(section.id).trim() : '';
            if (id) {
                id = slugify(id);
            } else {
                id = slugify(title) || `part-${index}`;
            }
            id = id.startsWith('section-') ? id : `section-${id}`;

            let uniqueId = id;
            let suffix = 2;
            while (usedIds.has(uniqueId)) {
                uniqueId = `${id}-${suffix++}`;
            }
            usedIds.add(uniqueId);

            const inToc = section && section.inToc !== false;
            const tocLabel =
                section && section.tocLabel != null && String(section.tocLabel).trim()
                    ? String(section.tocLabel).trim()
                    : title;

            return {
                title,
                content: section && section.content != null ? section.content : '',
                id: uniqueId,
                inToc,
                tocLabel
            };
        });
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

        const sections = normalizeWorkSections(work);
        const tocSections = sections.filter((section) => section.inToc);
        const headerDescription = (work.detailDescription || work.description || '');
        const toc = tocSections
            .map((section) => {
                return (
                    '<a href="#' +
                    escapeHtml(section.id) +
                    '" class="work-detail-toc__link" data-toc-target="' +
                    escapeHtml(section.id) +
                    '">' +
                    escapeHtml(section.tocLabel) +
                    '</a>'
                );
            })
            .join('');

        workDetailInner.innerHTML = `
            ${toc ? `
                <nav class="work-detail-toc" aria-label="Case study sections">
                    ${toc}
                </nav>
            ` : ''}

            <div class="work-detail-header">
                <h1 class="work-detail-title" id="work-detail-title">${escapeHtml(work.title)}</h1>
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${escapeHtml(work.year)}</span>
                    <span class="work-detail-tag">${escapeHtml(work.category)}</span>
                </div>
                <p class="work-detail-description">${escapeHtml(headerDescription)}</p>
            </div>
            
            ${sections.map((section, index) => {
                const bodyHtml = renderRichText(section.content);

                return `
                    <div class="work-detail-section" id="${escapeHtml(section.id)}">
                        <h2 class="work-detail-section-title">${escapeHtml(section.title)}</h2>
                        <div class="work-detail-section-content">
                            ${bodyHtml}
                        </div>
                    </div>
                    ${work.images && work.images[index] ? `
                        <div class="work-detail-image-wrapper">
                            <img src="${escapeHtml(work.images[index])}" alt="${escapeHtml(work.title)}" class="work-detail-image" loading="lazy">
                        </div>
                    ` : ''}
                `;
            }).join('')}
            
            ${(Array.isArray(work.images) ? work.images : []).slice(sections.length).map(img => `
                <div class="work-detail-image-wrapper">
                    <img src="${escapeHtml(img)}" alt="${escapeHtml(work.title)}" class="work-detail-image" loading="lazy">
                </div>
            `).join('')}
            
            <div class="work-detail-navigation">
                <button class="work-detail-next" data-next-id="${escapeHtml(nextWork.id)}">
                    Next Project →
                </button>
            </div>
        `;
        
        const nextButton = workDetailInner.querySelector('.work-detail-next');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextId = nextButton.dataset.nextId;
                if (nextId) openWorkDetail(nextId);
            });
        }

        setupWorkDetailToc();
    }

    function setupWorkDetailToc() {
        const toc = workDetailInner.querySelector('.work-detail-toc');
        if (!toc) return;

        const scrollRoot = getWorkDetailScrollRoot();
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
        if (!workDetail) return;
        workDetail.setAttribute('aria-hidden', 'true');
        resetWorkDetailScroll();
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 400);
    }

    // Event listeners
    if (workDetailClose && workDetail) {
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

    function renderHomeProjectList() {
        const el = document.getElementById('home-project-list');
        if (!el || !works.length) return;
        el.innerHTML = '';
        el.className = 'home-projects-scroller';
        works.forEach((work) => {
            const category = work.meta ? work.meta.split(' · ')[0] : (work.category || '');
            const imgSrc = work.images && work.images[0] ? work.images[0] : '';
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'home-project-card';
            a.dataset.workId = work.id;
            a.setAttribute('role', 'listitem');

            const media = imgSrc
                ? '<div class="home-project-card__media"><img src="' +
                  escapeHtml(imgSrc) +
                  '" alt="' +
                  escapeHtml(work.title) +
                  '" width="480" height="360" loading="lazy" decoding="async"></div>'
                : '<div class="home-project-card__media home-project-card__media--placeholder" aria-hidden="true"></div>';

            a.innerHTML =
                media +
                '<div class="home-project-card__body">' +
                (category
                    ? '<span class="home-project-card__meta">' + escapeHtml(category) + '</span>'
                    : '') +
                '<span class="home-project-card__title">' + escapeHtml(work.title) + '</span></div>';

            el.appendChild(a);
        });
    }

    // Initialize
    renderWorkList();
    renderHomeProjectList();

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

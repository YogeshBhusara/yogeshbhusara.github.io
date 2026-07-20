/**
 * work-page.js — Work index rendering (home + work page) and the
 * case-study overlay (document-style, with section numbers and TOC).
 */
(function() {
    const workList = document.getElementById('work-list');
    const workDetail = document.getElementById('work-detail');
    const workDetailClose = document.getElementById('work-detail-close');
    const workDetailInner = document.getElementById('work-detail-inner');

    // Work data (shared via work-data.js)
    const works = (window.PORTFOLIO_WORKS || []);

    let lastFocusedElement = null;

    const FOCUSABLE_SELECTOR =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function isWorkDetailOpen() {
        return workDetail && workDetail.getAttribute('aria-hidden') === 'false';
    }

    function getFocusableInDialog() {
        if (!workDetail) return [];
        return Array.from(workDetail.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
            if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false;
            const style = window.getComputedStyle(el);
            return style.visibility !== 'hidden' && style.display !== 'none';
        });
    }

    function setBackgroundInert(active) {
        Array.from(document.body.children).forEach((el) => {
            if (el === workDetail) return;
            if (active) {
                el.setAttribute('inert', '');
            } else {
                el.removeAttribute('inert');
            }
        });
    }

    function trapFocus(e) {
        if (e.key !== 'Tab' || !isWorkDetailOpen()) return;

        const focusables = getFocusableInDialog();
        if (!focusables.length) {
            e.preventDefault();
            if (workDetailClose) workDetailClose.focus();
            return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || !workDetail.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
            }
        } else if (document.activeElement === last || !workDetail.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        }
    }

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

    function pad2(n) {
        return String(n).padStart(2, '0');
    }

    function workArea(work) {
        if (work.area) return work.area;
        return work.meta ? work.meta.split(' · ')[0] : (work.category || '');
    }

    /** One editorial index entry. `withThumb` adds a stacked image (touch fallback). */
    function renderIndexEntry(work, index, withThumb, withDescription, withNumber, withYear) {
        const li = document.createElement('li');
        li.className = 'index-entry' + (withThumb ? ' index-entry--thumb' : '');

        const imgSrc = work.images && work.images[0] ? work.images[0] : '';
        // Cursor-follow preview is home-only (compact rows); work page keeps stacked thumbs.
        const thumbAttr = !withThumb && imgSrc
            ? ' data-thumb="' + escapeHtml(imgSrc) + '"'
            : '';
        const thumb = withThumb && imgSrc
            ? '<img class="index-entry__thumb" src="' + escapeHtml(imgSrc) +
              '" alt="" width="220" height="165" loading="lazy" decoding="async">'
            : '';

        li.innerHTML =
            '<button type="button" class="index-entry__link" data-work-id="' +
                escapeHtml(work.id) + '"' + thumbAttr + '>' +
                (withNumber
                    ? '<span class="index-entry__num" aria-hidden="true">' + pad2(index + 1) + '</span>'
                    : '') +
                '<span class="index-entry__main">' +
                    '<span class="index-entry__title">' + escapeHtml(work.title) + '</span>' +
                    (withDescription && work.description
                        ? '<span class="index-entry__context">' + escapeHtml(work.description) + '</span>'
                        : '') +
                '</span>' +
                '<span class="index-entry__meta">' +
                    '<span class="index-entry__area">' + escapeHtml(workArea(work)) + '</span>' +
                    (withYear
                        ? '<span class="index-entry__year">' + escapeHtml([work.category, work.year].filter(Boolean).join(' · ')) + '</span>'
                        : '') +
                '</span>' +
                thumb +
            '</button>';

        return li;
    }

    // Work page: full index with thumbnails
    function renderWorkList() {
        if (!workList) return;
        workList.innerHTML = '';
        works.forEach((work, i) => {
            workList.appendChild(renderIndexEntry(work, i, true, true, true, true));
        });
    }

    // Home: compact index (title + area only) — first 5 only
    function renderHomeProjectList() {
        const el = document.getElementById('home-project-list');
        if (!el || !works.length) return;
        el.innerHTML = '';
        works.slice(0, 5).forEach((work, i) => {
            el.appendChild(renderIndexEntry(work, i, false, false, false, false));
        });
    }

    // Open work detail
    function openWorkDetail(workId) {
        if (!workDetail || !workDetailInner) return;
        const work = works.find(w => w.id === workId);
        if (!work) return;

        cancelCloseTransition();

        if (workDetail.getAttribute('aria-hidden') !== 'false') {
            lastFocusedElement = document.activeElement;
        }

        renderWorkDetail(work);
        resetWorkDetailScroll();

        requestAnimationFrame(() => {
            workDetail.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setBackgroundInert(true);
            resetWorkDetailScroll();
            if (workDetailClose) workDetailClose.focus();
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

    function renderFigure(src, figNumber, contextTitle, workTitle) {
        const caption = contextTitle
            ? 'Fig. ' + pad2(figNumber) + ' — ' + contextTitle
            : 'Fig. ' + pad2(figNumber);
        return `
            <figure class="work-detail-figure">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(workTitle + ' — ' + (contextTitle || 'product screen'))}" loading="lazy" decoding="async">
                <figcaption>${escapeHtml(caption)}</figcaption>
            </figure>
        `;
    }

    // Render work detail
    function renderWorkDetail(work) {
        const currentIndex = works.findIndex(w => w.id === work.id);
        const nextIndex = (currentIndex + 1) % works.length;
        const nextWork = works[nextIndex];

        const sections = normalizeWorkSections(work);
        const headerDescription = (work.detailDescription || work.description || '');
        const toc = sections
            .map((section, index) => ({ section, index }))
            .filter(({ section }) => section.inToc)
            .map(({ section, index }) => {
                return (
                    '<a href="#' +
                    escapeHtml(section.id) +
                    '" class="work-detail-toc__link" data-toc-target="' +
                    escapeHtml(section.id) +
                    '">' +
                    '<span class="work-detail-toc__num" aria-hidden="true">' +
                    pad2(index + 1) +
                    '</span>' +
                    '<span class="work-detail-toc__label">' +
                    escapeHtml(section.tocLabel) +
                    '</span>' +
                    '</a>'
                );
            })
            .join('');

        let figNumber = 0;

        const sectionsHtml = sections.map((section, index) => {
            let html = `
                <section class="work-detail-section" id="${escapeHtml(section.id)}">
                    <h2 class="work-detail-section-title">
                        <span class="section-num" aria-hidden="true">${pad2(index + 1)}</span>
                        ${escapeHtml(section.title)}
                    </h2>
                    <div class="work-detail-section-content">
                        ${renderRichText(section.content)}
                    </div>
                </section>
            `;
            if (work.images && work.images[index]) {
                figNumber += 1;
                html += renderFigure(work.images[index], figNumber, section.title, work.title);
            }
            return html;
        }).join('');

        const remainingImages = (Array.isArray(work.images) ? work.images : [])
            .slice(sections.length)
            .map((img) => {
                figNumber += 1;
                return renderFigure(img, figNumber, '', work.title);
            })
            .join('');

        workDetailInner.innerHTML = `
            ${toc ? `
                <nav class="work-detail-toc" aria-label="Case study sections">
                    ${toc}
                </nav>
            ` : ''}

            <header class="work-detail-header">
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${escapeHtml(workArea(work))}</span>
                    <span class="work-detail-tag">${escapeHtml(work.category || '')}</span>
                    <span class="work-detail-tag">${escapeHtml(work.year || '')}</span>
                </div>
                <h1 class="work-detail-title" id="work-detail-title">${escapeHtml(work.title)}</h1>
                <p class="work-detail-description">${escapeHtml(headerDescription)}</p>
            </header>

            ${sectionsHtml}
            ${remainingImages}

            <div class="work-detail-navigation">
                <button class="work-detail-next" data-next-id="${escapeHtml(nextWork.id)}">
                    Next: ${escapeHtml(nextWork.title)} →
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

    let workDetailTocCleanup = null;

    function getScrollOffsetWithinRoot(el, scrollRoot) {
        return scrollRoot.scrollTop + el.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top;
    }

    function setupWorkDetailToc() {
        if (workDetailTocCleanup) {
            workDetailTocCleanup();
            workDetailTocCleanup = null;
        }

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

        if (targets.length === 0) return;

        let clickScrollLockUntil = 0;

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

        function getActiveSectionId() {
            if (!scrollRoot) return targets[0].id;

            const scrollBottom = scrollRoot.scrollTop + scrollRoot.clientHeight;
            const nearBottom = scrollRoot.scrollHeight - scrollBottom <= 48;
            if (nearBottom) return targets[targets.length - 1].id;

            const rootRect = scrollRoot.getBoundingClientRect();
            const viewportTop = rootRect.top;
            const viewportBottom = rootRect.bottom;
            let activeId = targets[0].id;
            let maxVisible = -1;

            targets.forEach(({ el, id }) => {
                const rect = el.getBoundingClientRect();
                const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
                if (visible > maxVisible) {
                    maxVisible = visible;
                    activeId = id;
                }
            });

            // Image-only gaps: no section intersects the viewport — use last section above focus line
            if (maxVisible <= 0) {
                const focus = scrollRoot.scrollTop + scrollRoot.clientHeight * 0.35;
                targets.forEach(({ el, id }) => {
                    if (getScrollOffsetWithinRoot(el, scrollRoot) <= focus) {
                        activeId = id;
                    }
                });
            }

            return activeId;
        }

        function updateActiveFromScroll() {
            if (Date.now() < clickScrollLockUntil) return;
            setActiveLink(getActiveSectionId());
        }

        function releaseClickScrollLock() {
            clickScrollLockUntil = 0;
            updateActiveFromScroll();
        }

        function lockClickScrollUntilSettled() {
            clickScrollLockUntil = Number.MAX_SAFE_INTEGER;
            let lastTop = scrollRoot.scrollTop;
            let stableFrames = 0;
            let rafId = 0;
            const startedAt = Date.now();

            const watch = () => {
                const currentTop = scrollRoot.scrollTop;
                if (currentTop === lastTop) {
                    stableFrames += 1;
                } else {
                    stableFrames = 0;
                    lastTop = currentTop;
                }

                if (stableFrames >= 4 || Date.now() - startedAt > 1400) {
                    releaseClickScrollLock();
                    return;
                }

                rafId = requestAnimationFrame(watch);
            };

            if (typeof scrollRoot.onscrollend !== 'undefined') {
                scrollRoot.addEventListener('scrollend', releaseClickScrollLock, { once: true });
            }

            rafId = requestAnimationFrame(watch);
            return () => {
                cancelAnimationFrame(rafId);
                scrollRoot.removeEventListener('scrollend', releaseClickScrollLock);
            };
        }

        let clickScrollWatchCleanup = null;

        // Click: scroll within overlay (not window)
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('data-toc-target') || link.getAttribute('href')?.replace(/^#/, '');
                if (!id) return;
                const el = workDetailInner.querySelector(`#${CSS.escape(id)}`);
                if (!el || !scrollRoot) return;

                e.preventDefault();
                e.stopPropagation();

                if (clickScrollWatchCleanup) {
                    clickScrollWatchCleanup();
                    clickScrollWatchCleanup = null;
                }

                const top = Math.max(0, getScrollOffsetWithinRoot(el, scrollRoot) - 16);
                setActiveLink(id);
                clickScrollWatchCleanup = lockClickScrollUntilSettled();
                scrollRoot.scrollTo({ top, behavior: 'smooth' });
            });
        });

        if (!scrollRoot) {
            setActiveLink(targets[0].id);
            return;
        }

        const onScroll = () => updateActiveFromScroll();
        scrollRoot.addEventListener('scroll', onScroll, { passive: true });
        updateActiveFromScroll();

        workDetailTocCleanup = () => {
            scrollRoot.removeEventListener('scroll', onScroll);
            if (clickScrollWatchCleanup) {
                clickScrollWatchCleanup();
                clickScrollWatchCleanup = null;
            }
            clickScrollLockUntil = 0;
        };
    }

    // Close work detail — wait for sheet exit so the slide-down isn’t cut off
    let closeTransitionTimer = null;
    let closeTransitionHandler = null;

    function cancelCloseTransition() {
        if (closeTransitionTimer) {
            clearTimeout(closeTransitionTimer);
            closeTransitionTimer = null;
        }
        const scrollRoot = getWorkDetailScrollRoot();
        if (closeTransitionHandler && scrollRoot) {
            scrollRoot.removeEventListener('transitionend', closeTransitionHandler);
            closeTransitionHandler = null;
        }
        if (workDetail) workDetail.removeAttribute('data-closing');
    }

    function finishCloseWorkDetail() {
        cancelCloseTransition();
        resetWorkDetailScroll();
        document.body.style.overflow = '';
        setBackgroundInert(false);
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    function closeWorkDetail() {
        if (!workDetail) return;
        if (workDetail.getAttribute('aria-hidden') !== 'false') return;
        if (workDetail.getAttribute('data-closing') === 'true') return;

        workDetail.setAttribute('data-closing', 'true');
        workDetail.setAttribute('aria-hidden', 'true');

        const scrollRoot = getWorkDetailScrollRoot();
        const reduceMotion =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!scrollRoot || reduceMotion) {
            finishCloseWorkDetail();
            return;
        }

        closeTransitionHandler = function (e) {
            if (e.target !== scrollRoot) return;
            if (e.propertyName !== 'transform') return;
            finishCloseWorkDetail();
        };
        scrollRoot.addEventListener('transitionend', closeTransitionHandler);
        closeTransitionTimer = setTimeout(finishCloseWorkDetail, 500);
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
        if (!isWorkDetailOpen()) return;
        if (e.key === 'Escape') {
            closeWorkDetail();
            return;
        }
        trapFocus(e);
    });

    // Initialize
    renderWorkList();
    renderHomeProjectList();

    // Open the case study for any [data-work-id] trigger
    document.body.addEventListener('click', function(e) {
        const el = e.target.closest('[data-work-id]');
        if (el && el.dataset.workId) {
            e.preventDefault();
            openWorkDetail(el.dataset.workId);
        }
    });

    // Deep link from another page
    const openWorkId = sessionStorage.getItem('openWorkId');
    if (openWorkId) {
        sessionStorage.removeItem('openWorkId');
        setTimeout(() => {
            openWorkDetail(openWorkId);
        }, 100);
    }
})();

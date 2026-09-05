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
        if (!scrollRoot) return;
        scrollRoot.scrollTop = 0;
        requestAnimationFrame(() => {
            scrollRoot.scrollTop = 0;
        });
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

        const imgSrc = work.thumb || (work.images && work.images[0]) || '';
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

    function renderV2Figure(figure, figState, workTitle) {
        if (!figure || !figure.src) return '';
        figState.n += 1;
        const caption = figure.caption
            ? 'Fig. ' + pad2(figState.n) + ' — ' + figure.caption
            : 'Fig. ' + pad2(figState.n);
        const alt = figure.alt || (workTitle + ' — product screen');
        const heroClass = figure.hero ? ' work-detail-figure--hero' : '';
        const storyClass = figure.storyboard ? ' work-detail-figure--story' : '';
        const pageClass = figure.page ? ' work-detail-figure--page' : '';
        const phoneClass = figure.phone ? ' work-detail-figure--phone' : '';
        return `
            <figure class="work-detail-figure work-detail-figure--v2${heroClass}${storyClass}${pageClass}${phoneClass}">
                <img src="${escapeHtml(figure.src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">
                <figcaption>${escapeHtml(caption)}</figcaption>
            </figure>
        `;
    }

    function v2TocSections(work) {
        const raw = Array.isArray(work.sections) ? work.sections : [];
        const usedIds = new Set();
        let visualIndex = 0;

        return raw
            .filter((section) => section && section.title && section.inToc !== false)
            .map((section) => {
                visualIndex += 1;
                let id = section.id ? slugify(section.id) : slugify(section.title);
                id = id ? `section-${id}` : `section-part-${visualIndex}`;
                let uniqueId = id;
                let suffix = 2;
                while (usedIds.has(uniqueId)) {
                    uniqueId = `${id}-${suffix++}`;
                }
                usedIds.add(uniqueId);
                return {
                    id: uniqueId,
                    title: section.title,
                    tocLabel: (section.tocLabel && String(section.tocLabel).trim()) || section.title,
                    num: visualIndex
                };
            });
    }

    function renderScanIntro(work) {
        const scan = work.scan || {};
        const meta = [
            ['Role', scan.role],
            ['Timeline', scan.timeline],
            ['Team', scan.team],
            ['Platform', scan.platform]
        ].filter(([, value]) => value);

        return `
            <header class="work-detail-header work-scan work-scan--intro">
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${escapeHtml(workArea(work))}</span>
                    <span class="work-detail-tag">${escapeHtml(work.category || '')}</span>
                    <span class="work-detail-tag">${escapeHtml(work.year || '')}</span>
                </div>
                <h1 class="work-detail-title" id="work-detail-title">${escapeHtml(work.title)}</h1>
                <p class="work-detail-description">${escapeHtml(work.detailDescription || work.description || '')}</p>

                <dl class="work-scan__meta">
                    ${meta.map(([label, value]) => (
                        '<div class="work-scan__meta-item">' +
                            '<dt>' + escapeHtml(label) + '</dt>' +
                            '<dd>' + escapeHtml(value) + '</dd>' +
                        '</div>'
                    )).join('')}
                </dl>
            </header>
        `;
    }

    function renderScanHighlights(work) {
        const scan = work.scan || {};
        const contrib = Array.isArray(scan.contribution) ? scan.contribution : [];
        if (!contrib.length && !scan.challenge && !scan.impact) return '';

        return `
            <div class="work-scan__after">
                ${contrib.length ? `
                    <div class="work-scan__contrib">
                        <p class="work-scan__label">My contribution</p>
                        <ul>
                            ${contrib.map((item) => '<li>' + escapeHtml(item) + '</li>').join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="work-scan__highlights">
                    ${scan.challenge ? `
                        <div class="work-scan__highlight">
                            <p class="work-scan__label">The challenge</p>
                            <p>${escapeHtml(scan.challenge)}</p>
                        </div>
                    ` : ''}
                    ${scan.impact ? `
                        <div class="work-scan__highlight work-scan__highlight--impact">
                            <p class="work-scan__label">The impact</p>
                            <p>${escapeHtml(scan.impact)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function renderV2Section(section, tocMap, figState, workTitle) {
        const toc = section.title ? tocMap.get(section) : null;
        const sectionId = toc ? ` id="${escapeHtml(toc.id)}"` : '';
        const heading = section.title
            ? `<h2 class="work-detail-section-title">
                    ${toc ? `<span class="section-num" aria-hidden="true">${pad2(toc.num)}</span>` : ''}
                    ${escapeHtml(section.title)}
               </h2>`
            : '';

        if (section.type === 'figure') {
            return renderV2Figure(section, figState, workTitle);
        }

        if (section.type === 'cards') {
            const cards = Array.isArray(section.cards) ? section.cards : [];
            return `
                <section class="work-detail-section work-cs-section"${sectionId}>
                    ${heading}
                    ${section.lead ? `<p class="work-cs-lead">${escapeHtml(section.lead)}</p>` : ''}
                    <div class="work-cs-cards${cards.length === 3 ? ' work-cs-cards--3' : ''}">
                        ${cards.map((card) => (
                            '<article class="work-cs-card">' +
                                (card.title ? '<h3>' + escapeHtml(card.title) + '</h3>' : '') +
                                (card.body ? '<p>' + escapeHtml(card.body) + '</p>' : '') +
                            '</article>'
                        )).join('')}
                    </div>
                    ${renderV2Figure(section.figure, figState, workTitle)}
                </section>
            `;
        }

        if (section.type === 'process') {
            const steps = Array.isArray(section.steps) ? section.steps : [];
            return `
                <section class="work-detail-section work-cs-section"${sectionId}>
                    ${heading}
                    <ol class="work-cs-process">
                        ${steps.map((step, i) => (
                            '<li>' +
                                '<span class="work-cs-process__num" aria-hidden="true">' + pad2(i + 1) + '</span>' +
                                '<div>' +
                                    '<h3>' + escapeHtml(step.title || '') + '</h3>' +
                                    '<p>' + escapeHtml(step.body || '') + '</p>' +
                                '</div>' +
                            '</li>'
                        )).join('')}
                    </ol>
                </section>
            `;
        }

        if (section.type === 'decision') {
            const rows = [
                ['The problem', section.problem],
                ['Insight', section.insight],
                ['Design decision', section.decision],
                ['Why', section.why],
                ['Result', section.result]
            ].filter(([, value]) => value);
            const followClass = section.title ? '' : ' work-cs-section--follow';
            return `
                <section class="work-detail-section work-cs-section${followClass}"${sectionId}>
                    ${heading}
                    ${section.kicker ? `<p class="work-cs-kicker">${escapeHtml(section.kicker)}</p>` : ''}
                    <div class="work-cs-decision">
                        ${rows.map(([label, value]) => (
                            '<div class="work-cs-decision__row">' +
                                '<p class="work-scan__label">' + escapeHtml(label) + '</p>' +
                                '<p>' + escapeHtml(value) + '</p>' +
                            '</div>'
                        )).join('')}
                    </div>
                    ${renderV2Figure(section.figure, figState, workTitle)}
                </section>
            `;
        }

        if (section.type === 'split') {
            const items = Array.isArray(section.items) ? section.items : [];
            const lead = section.lead ? `<p class="work-cs-lead">${escapeHtml(section.lead)}</p>` : '';
            const points = `
                    <div class="work-cs-points">
                        ${items.map((item) => (
                            '<div class="work-cs-point">' +
                                '<h3>' + escapeHtml(item.title || '') + '</h3>' +
                                '<p>' + escapeHtml(item.body || '') + '</p>' +
                            '</div>'
                        )).join('')}
                    </div>
            `;
            const primaryFigure = renderV2Figure(section.figure, figState, workTitle);
            const extraFigures = (Array.isArray(section.figures) ? section.figures : [])
                .map((figure) => renderV2Figure(figure, figState, workTitle))
                .join('');
            const extras = extraFigures && section.figureGrid
                ? `<div class="work-cs-figgrid">${extraFigures}</div>`
                : extraFigures;
            const visual = section.figureFirst
                ? `${primaryFigure}${lead}${points}${extras}`
                : `${lead}${points}${primaryFigure}${extras}`;
            return `
                <section class="work-detail-section work-cs-section"${sectionId}>
                    ${heading}
                    ${visual}
                </section>
            `;
        }

        if (section.type === 'outcomes') {
            const items = Array.isArray(section.items) ? section.items : [];
            return `
                <section class="work-detail-section work-cs-section"${sectionId}>
                    ${heading}
                    <div class="work-cs-outcomes">
                        ${items.map((item) => (
                            '<article class="work-cs-outcome">' +
                                '<h3>' + escapeHtml(item.title || '') + '</h3>' +
                                '<p>' + escapeHtml(item.body || '') + '</p>' +
                            '</article>'
                        )).join('')}
                    </div>
                </section>
            `;
        }

        if (section.type === 'learnings') {
            const items = Array.isArray(section.items) ? section.items : [];
            return `
                <section class="work-detail-section work-cs-section"${sectionId}>
                    ${heading}
                    <ul class="work-cs-learnings">
                        ${items.map((item) => '<li>' + escapeHtml(item) + '</li>').join('')}
                    </ul>
                </section>
            `;
        }

        const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
        return `
            <section class="work-detail-section work-cs-section"${sectionId}>
                ${heading}
                <div class="work-detail-section-content">
                    ${paragraphs.map((p) => '<p>' + escapeHtml(p) + '</p>').join('')}
                </div>
            </section>
        `;
    }

    function renderCaseStudyV2(work, nextWork) {
        const tocEntries = v2TocSections(work);
        const tocMap = new Map();
        const titled = (work.sections || []).filter((section) => section && section.title && section.inToc !== false);
        titled.forEach((section, i) => {
            if (tocEntries[i]) tocMap.set(section, tocEntries[i]);
        });

        const toc = tocEntries.map((entry) => {
            return (
                '<a href="#' +
                escapeHtml(entry.id) +
                '" class="work-detail-toc__link" data-toc-target="' +
                escapeHtml(entry.id) +
                '">' +
                '<span class="work-detail-toc__num" aria-hidden="true">' +
                pad2(entry.num) +
                '</span>' +
                '<span class="work-detail-toc__label">' +
                escapeHtml(entry.tocLabel) +
                '</span>' +
                '</a>'
            );
        }).join('');

        const mobileToc = tocEntries.map((entry) => {
            return (
                '<a href="#' +
                escapeHtml(entry.id) +
                '" class="work-cs-jump__link" data-toc-target="' +
                escapeHtml(entry.id) +
                '">' +
                escapeHtml(entry.tocLabel) +
                '</a>'
            );
        }).join('');

        const figState = { n: 0 };
        const heroHtml = work.hero
            ? renderV2Figure(Object.assign({ hero: true }, work.hero), figState, work.title)
            : '';
        const bodyHtml = (work.sections || [])
            .map((section) => renderV2Section(section, tocMap, figState, work.title))
            .join('');

        return `
            ${toc ? `
                <nav class="work-detail-toc" aria-label="Case study sections">
                    ${toc}
                </nav>
            ` : ''}

            ${renderScanIntro(work)}

            ${mobileToc ? `
                <nav class="work-cs-jump" aria-label="Jump to section">
                    ${mobileToc}
                </nav>
            ` : ''}

            ${heroHtml}
            ${renderScanHighlights(work)}
            ${bodyHtml}

            <div class="work-detail-navigation">
                <button class="work-detail-next" data-next-id="${escapeHtml(nextWork.id)}">
                    Next: ${escapeHtml(nextWork.title)} →
                </button>
            </div>
        `;
    }

    // Render work detail
    function renderWorkDetail(work) {
        const currentIndex = works.findIndex(w => w.id === work.id);
        const nextIndex = (currentIndex + 1) % works.length;
        const nextWork = works[nextIndex];

        workDetailInner.classList.toggle('work-detail-inner--v2', work.layout === 'case-study-v2');

        if (work.layout === 'case-study-v2') {
            workDetailInner.innerHTML = renderCaseStudyV2(work, nextWork);

            const nextButton = workDetailInner.querySelector('.work-detail-next');
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    const nextId = nextButton.dataset.nextId;
                    if (nextId) openWorkDetail(nextId);
                });
            }

            setupWorkDetailToc();
            return;
        }

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

        const links = Array.from(workDetailInner.querySelectorAll('.work-detail-toc__link, .work-cs-jump__link'));
        if (!links.length) return;

        const scrollRoot = getWorkDetailScrollRoot();
        const targets = links
            .map((link) => {
                const id = link.getAttribute('data-toc-target') || link.getAttribute('href')?.replace(/^#/, '');
                if (!id) return null;
                const el = workDetailInner.querySelector(`#${CSS.escape(id)}`);
                return el ? { link, el, id } : null;
            })
            .filter(Boolean);

        if (targets.length === 0) return;

        function getStickyJumpOffset() {
            const jump = workDetailInner.querySelector('.work-cs-jump');
            if (!jump || !scrollRoot) return 16;
            const style = window.getComputedStyle(jump);
            if (style.position !== 'sticky' && style.position !== 'fixed') return 16;
            return Math.ceil(jump.getBoundingClientRect().height) + 12;
        }

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
            const viewportTop = rootRect.top + getStickyJumpOffset();
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

                const heading = el.querySelector('.work-detail-section-title') || el;
                const top = Math.max(0, getScrollOffsetWithinRoot(heading, scrollRoot) - getStickyJumpOffset());
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

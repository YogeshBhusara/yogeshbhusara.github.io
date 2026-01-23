// Work showcase system
(function() {
    const workButton = document.getElementById('work-button');
    const workModal = document.getElementById('work-modal');
    const workModalClose = document.getElementById('work-modal-close');
    const workGrid = document.getElementById('work-grid');
    const workDetail = document.getElementById('work-detail');
    const workDetailClose = document.getElementById('work-detail-close');
    const workDetailInner = document.getElementById('work-detail-inner');

    // Work data
    const works = [
        {
            id: 'flower-app',
            title: 'Flower iPhone App',
            meta: 'MOBILE · PRODUCT DESIGN',
            size: 'wide',
            description: 'A beautiful mobile application for flower enthusiasts to discover, learn about, and care for various flowers. The app features an intuitive interface with rich visual content and interactive features.',
            year: '2023',
            category: 'Product Design',
            sections: [
                {
                    title: 'Overview',
                    content: 'Flower iPhone App is a comprehensive mobile application designed to help users discover and learn about flowers. The app combines beautiful imagery with practical information, creating an engaging experience for flower lovers.'
                },
                {
                    title: 'Design Process',
                    content: 'The design process focused on creating an intuitive user experience that makes flower discovery enjoyable. Key features include a visual search function, detailed care guides, and a personalized collection system.'
                }
            ],
            images: [
                'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
                'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
            ]
        },
        {
            id: 'propertiease',
            title: 'PropertiEase App',
            meta: 'B2C · WEB & MOBILE',
            size: 'large',
            description: 'A comprehensive real estate platform that simplifies property search, viewing, and transactions. The app provides seamless experience across web and mobile platforms.',
            year: '2022',
            category: 'Product Design',
            sections: [
                {
                    title: 'Challenge',
                    content: 'Design a unified experience that works seamlessly across web and mobile platforms, making property search and transactions effortless for users.'
                },
                {
                    title: 'Solution',
                    content: 'Created a responsive design system that adapts beautifully to different screen sizes while maintaining consistency in functionality and user experience.'
                }
            ],
            images: [
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
            ]
        },
        {
            id: 'matrimony-app',
            title: 'Matrimony App UI',
            meta: 'MOBILE · UI DESIGN',
            size: 'tall',
            description: 'A modern matrimony application with a focus on user trust and engagement. The design emphasizes safety, authenticity, and meaningful connections.',
            year: '2023',
            category: 'UI Design',
            sections: [
                {
                    title: 'Design Approach',
                    content: 'Focused on creating a trustworthy and welcoming interface that helps users feel comfortable while searching for their life partner.'
                }
            ],
            images: [
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
            ]
        },
        {
            id: 'analytics-dashboard',
            title: 'Analytics Dashboard',
            meta: 'WEB · DATA VISUALIZATION',
            size: 'small',
            description: 'A comprehensive analytics dashboard that presents complex data in an intuitive and actionable format.',
            year: '2022',
            category: 'Web Design',
            sections: [
                {
                    title: 'Data Visualization',
                    content: 'Designed interactive charts and graphs that make complex data easy to understand and act upon.'
                }
            ],
            images: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
            ]
        }
    ];

    // Open work modal
    function openWorkModal() {
        workModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        renderWorkGrid();
        
        // Animate in
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(workModal, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo('.work-item',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2 }
            );
        }
    }

    // Close work modal
    function closeWorkModal() {
        if (typeof gsap !== 'undefined') {
            gsap.to(workModal, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    workModal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        } else {
            workModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
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

        // Close modal first
        closeWorkModal();

        // Render detail
        setTimeout(() => {
            renderWorkDetail(work);
            workDetail.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Scroll to top
            workDetailInner.scrollTop = 0;
            
            // Animate in
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(workDetail,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3 }
                );
                gsap.fromTo('.work-detail-header, .work-detail-section',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2 }
                );
            }
        }, 300);
    }

    // Render work detail
    function renderWorkDetail(work) {
        workDetailInner.innerHTML = `
            <div class="work-detail-header">
                <h1 class="work-detail-title">${work.title}</h1>
                <div class="work-detail-meta">
                    <span class="work-detail-tag">${work.year}</span>
                    <span class="work-detail-tag">${work.category}</span>
                </div>
                <p class="work-detail-description">${work.description}</p>
            </div>
            
            ${work.sections.map(section => `
                <div class="work-detail-section">
                    <h2 class="work-detail-section-title">${section.title}</h2>
                    <div class="work-detail-section-content">
                        <p>${section.content}</p>
                    </div>
                </div>
            `).join('')}
            
            ${work.images.map(img => `
                <img src="${img}" alt="${work.title}" class="work-detail-image" loading="lazy">
            `).join('')}
        `;
    }

    // Close work detail
    function closeWorkDetail() {
        if (typeof gsap !== 'undefined') {
            gsap.to(workDetail, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    workDetail.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            });
        } else {
            workDetail.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    if (workButton) {
        workButton.addEventListener('click', openWorkModal);
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

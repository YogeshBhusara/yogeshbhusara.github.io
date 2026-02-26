/**
 * work-data.js — Shared portfolio work list; exposes window.PORTFOLIO_WORKS for work.js and work-page.js.
 */
(function () {
  'use strict';

  const WORKS = [
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

  // Expose on window for other scripts
  if (typeof window !== 'undefined') {
    window.PORTFOLIO_WORKS = WORKS;
  }
})();


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
      description: 'A mobile product case study placeholder demonstrating the case study structure (dummy content for now).',
      year: '2023',
      category: 'Product Design',
      sections: [
        {
          title: 'Context',
          content:
            'This case study is a placeholder to match the structure and rhythm of the reference.\n\n' +
            'The goal is to show how a mobile product can feel calm, modern, and easy to use—even when the domain has a lot of detail.'
        },
        {
          title: 'Problem',
          content:
            'Users wanted inspiration and reliable care info, but existing apps were cluttered and inconsistent.\n\n' +
            'The challenge was to simplify discovery while keeping depth for enthusiasts.'
        },
        {
          title: 'Approach',
          content:
            'Defined a lightweight information architecture, then designed core flows first: browse → learn → save → act.\n\n' +
            'Built reusable patterns for cards, detail pages, and “care” templates so new content could scale.'
        },
        {
          title: 'Collaboration',
          content:
            'Worked with engineering to validate motion, accessibility, and image performance.\n\n' +
            'Iterated in short loops with feedback, focusing on the “few taps to value” principle.'
        },
        {
          title: 'Multi-surface design',
          content:
            'Mobile-first UI for quick scanning, with patterns that can extend to tablet or web.\n\n' +
            'Designed components to support light/dark themes and dynamic type.'
        },
        {
          title: 'Solution',
          content:
            'A focused browsing and learning experience, backed by a scalable component system.\n\n' +
            'The UI emphasizes clarity: strong hierarchy, consistent actions, and minimal cognitive load.'
        },
        {
          title: 'Impact',
          content:
            'Clean, Readable Exports: Main columns display user-friendly names/labels without appended IDs.\n\n' +
            'Comprehensive Data Access: Separate identifier columns support integrations, lookups, and technical processing when needed.'
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
      description: 'A cross-platform product case study placeholder (dummy content for now).',
      year: '2022',
      category: 'Product Design',
      sections: [
        {
          title: 'Context',
          content:
            'A real estate journey involves browsing, comparing, scheduling, and decision-making.\n\n' +
            'This placeholder case study demonstrates how we’ll document complex, multi-step workflows.'
        },
        {
          title: 'Problem',
          content:
            'Existing experiences were fragmented across devices with inconsistent filters, maps, and saved items.\n\n' +
            'Users lost context when moving between web research and mobile follow-ups.'
        },
        {
          title: 'Approach',
          content:
            'Mapped the end-to-end journey and reduced it to repeatable “decision moments”.\n\n' +
            'Designed a filter system that stays consistent across surfaces and supports progressive disclosure.'
        },
        {
          title: 'Collaboration',
          content:
            'Partnered with PM and engineering to align on scope and technical constraints.\n\n' +
            'Reviewed implementation details early to avoid costly rework in responsive breakpoints.'
        },
        {
          title: 'Multi-surface design',
          content:
            'Web supports deep comparison and multi-tab browsing.\n\n' +
            'Mobile emphasizes speed: saved searches, quick scheduling, and location-first discovery.'
        },
        {
          title: 'Solution',
          content:
            'A unified experience with consistent navigation, filters, and saved state across web and mobile.\n\n' +
            'Clear hierarchy for listings, photos, amenities, and next steps.'
        },
        {
          title: 'Impact',
          content:
            'Clean, Readable Exports: Main columns display user-friendly names/labels without appended IDs.\n\n' +
            'Comprehensive Data Access: Separate identifier columns support integrations, lookups, and technical processing when needed.'
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
      description: 'A mobile UI case study placeholder (dummy content for now).',
      year: '2023',
      category: 'UI Design',
      sections: [
        {
          title: 'Context',
          content:
            'Trust-heavy products require careful tone, privacy, and clarity.\n\n' +
            'This placeholder shows how we’ll write about decisions, constraints, and outcomes.'
        },
        {
          title: 'Problem',
          content:
            'Users needed confidence that profiles are real, interactions are safe, and controls are transparent.\n\n' +
            'The UI must reduce anxiety while supporting quick scanning.'
        },
        {
          title: 'Approach',
          content:
            'Designed flows around verification, preferences, and conversation safety.\n\n' +
            'Established visual patterns for “signals of trust” without overwhelming the interface.'
        },
        {
          title: 'Collaboration',
          content:
            'Aligned with product and engineering on moderation and reporting workflows.\n\n' +
            'Validated edge cases for blocking, privacy controls, and consent.'
        },
        {
          title: 'Multi-surface design',
          content:
            'Mobile-first, optimized for one-handed use and short sessions.\n\n' +
            'Components and typography scale cleanly across device sizes.'
        },
        {
          title: 'Solution',
          content:
            'A clean, modern UI with a calm visual language and strong safety affordances.\n\n' +
            'Consistent patterns for browsing, saving, and messaging.'
        },
        {
          title: 'Impact',
          content:
            'Clean, Readable Exports: Main columns display user-friendly names/labels without appended IDs.\n\n' +
            'Comprehensive Data Access: Separate identifier columns support integrations, lookups, and technical processing when needed.'
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
      description: 'A data visualization case study placeholder (dummy content for now).',
      year: '2022',
      category: 'Web Design',
      sections: [
        {
          title: 'Context',
          content:
            'Analytics products need to balance flexibility with clarity.\n\n' +
            'This placeholder case study uses the same section structure as the reference.'
        },
        {
          title: 'Problem',
          content:
            'Users struggled to interpret trends and find “what changed” quickly.\n\n' +
            'The dashboard needed to support both scanning and deep dives.'
        },
        {
          title: 'Approach',
          content:
            'Defined a hierarchy: KPIs first, drivers second, details on demand.\n\n' +
            'Introduced reusable chart patterns and consistent formatting rules.'
        },
        {
          title: 'Collaboration',
          content:
            'Worked with engineering to ensure performance and predictable chart behavior.\n\n' +
            'Validated interaction patterns with stakeholders and iterated quickly.'
        },
        {
          title: 'Multi-surface design',
          content:
            'Desktop-first for dense analysis.\n\n' +
            'Responsive behavior collapses secondary panels while keeping key KPIs accessible.'
        },
        {
          title: 'Solution',
          content:
            'A dashboard that helps teams understand performance at a glance and investigate confidently.\n\n' +
            'Clear navigation, consistent chart language, and focus on decision-making.'
        },
        {
          title: 'Impact',
          content:
            'Clean, Readable Exports: Main columns display user-friendly names/labels without appended IDs.\n\n' +
            'Comprehensive Data Access: Separate identifier columns support integrations, lookups, and technical processing when needed.'
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


/**
 * work-data.js — Shared portfolio work list; exposes window.PORTFOLIO_WORKS for work-page.js (and home preview).
 *
 * Each case study defines its own `sections` array (order, titles, and content).
 * Section titles drive the side nav — they need not match a fixed template
 * (e.g. use "Design Exploration" instead of "Approach" when that fits the story).
 *
 * Optional per section:
 *   - id: stable anchor (defaults to slugified title)
 *   - tocLabel: shorter label in the side nav (defaults to title)
 *   - inToc: false to hide from side nav but still render the section
 */
(function () {
  'use strict';

  const WORKS = [
    {
      id: 'post-planning-calendar-post-ideas',
      title: 'Post Planning Calendar & Post Ideas',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      layout: 'case-study-v2',
      description: 'Content planning feature for a SaaS intranet platform',
      summary:
        'A shared calendar and Post Ideas layer so content teams can plan, schedule, and catch conflicts in one place.',
      detailDescription:
        'A planning layer on an existing publishing system: calendar, Post Ideas, and a path from capture to publish.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      thumb: 'assets/work/post-planning/thumb-northstar.webp',
      images: ['assets/work/post-planning/hero-week-northstar.png'],
      scan: {
        "role": "Senior UI/UX Designer",
        "timeline": "2024",
        "team": "Product Manager, Engineering",
        "platform": "Web · Enterprise intranet",
        "contribution": [
          "Content planning model",
          "Calendar and list views",
          "Scheduling and permissions"
        ],
        "challenge": "Content teams planned posts in spreadsheets while drafts and scheduled posts were scattered across the product.",
        "impact": "A shared planning view brings ideas, drafts, and scheduled posts together, with conflict warnings and bulk import."
      },
      hero: {
        src: 'assets/work/post-planning/hero-week-northstar.png',
        caption: 'Weekly planning calendar — Idea, Draft, and Scheduled as distinct, colour-coded states.',
        alt: 'Weekly content planning calendar showing colour-coded Idea, Draft, and Scheduled post cards'
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Connect the scattered work', body: 'Drafts and scheduled posts were managed in separate areas, while early ideas often stayed in spreadsheets. I mapped these states into one planning flow.' },
            { title: 'Plan before writing', body: 'A calendar alone could not show work that had not yet become a draft. I defined a lightweight idea state to bridge that gap.' },
            { title: 'Build on existing publishing', body: 'The planning views sit on top of the existing editor and publishing flow, so teams can plan without relearning how to publish.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "Planning starts before a draft exists.",
          "decision": "I introduced Post Ideas: lightweight entries that can be dated, scheduled, and converted into posts.",
          "why": "Ideas without dates stay in an Unplanned panel until the team is ready to schedule them.",
          "figure": {
            "src": "assets/work/post-planning/new-idea-modal-northstar.png",
            "caption": "New Post Idea — a lightweight capture modal, separate from post creation.",
            "alt": "New Post Idea modal with title, description, audience, and optional planned publish date"
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Plan together",
              "body": "A shared calendar brings ideas, drafts, and scheduled posts together. Colour-coded states help teams understand what is ready and what still needs work."
            },
            {
              "title": "Schedule visually",
              "body": "Teams can drag unscheduled items onto the calendar, adjust dates, and spot warnings when planned posts overlap."
            },
            {
              "title": "Move from idea to post",
              "body": "Create a post from an idea with its title and audience already filled in."
            }
          ],
          "figure": {
            "src": "assets/work/post-planning/calendar-unplanned-northstar.png",
            "caption": "Weekly calendar with the Unplanned panel open — backlog on the right, scheduled work on the grid.",
            "alt": "Weekly planning calendar beside an Unplanned panel of drafts and ideas"
          },
          "figures": [
            {
              "src": "assets/work/post-planning/month-view-northstar.png",
              "caption": "Month view — the same three states, with overflow when a day fills up.",
              "alt": "Monthly planning calendar with Idea, Draft, and Scheduled cards and overflow counts"
            },
            {
              "src": "assets/work/post-planning/planned-list-northstar.png",
              "caption": "Planned list — All Planned / My Planned in the sidebar, sortable rows, state-appropriate actions.",
              "alt": "Tabular planned-posts list with status, audience, creator, and date columns"
            }
          ]
        }
      ]

    },
    {
      id: 'user-segment-based-dashboards',
      title: 'User Segment Based Dashboards',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      layout: 'case-study-v2',
      description:
        'Homepages assigned to employee groups on an enterprise intranet.',
      summary:
        'Dashboards assigned by employee segment, so each audience gets a homepage that is relevant and ready to act on.',
      detailDescription:
        'One homepage per user segment, with ownership, preview, and a governed publish.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      thumb: 'assets/work/dashboards/thumb-northstar.webp',
      images: ['assets/work/dashboards/hero-preview-northstar.png'],
      scan: {
        "role": "Senior UI/UX Designer",
        "timeline": "2024",
        "team": "Product Manager, Engineering",
        "platform": "Web + mobile · Enterprise intranet",
        "contribution": [
          "Audience assignment",
          "Dashboard ownership",
          "Preview and publishing"
        ],
        "challenge": "Employees with different roles shared the same homepage, and admins could not preview an audience’s experience before publishing.",
        "impact": "Admins can create a dashboard for each audience, preview it, and publish web and mobile layouts independently."
      },
      hero: {
        src: 'assets/work/dashboards/hero-preview-northstar.png',
        caption: 'Preview of an Engaged Users dashboard, viewed as Finance Department — web and mobile in the same chrome.',
        alt: 'Admin preview of an engaged-users dashboard with View as Finance Department and Web/Mobile toggle'
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Design for different audiences', body: 'A single homepage could not serve office and frontline staff equally well. I made the dashboard itself assignable to an employee group, rather than relying only on hidden widgets.' },
            { title: 'Make ownership clear', body: 'Admins can choose who manages each dashboard, so responsibility can be delegated without giving everyone control over every layout.' },
            { title: 'Make changes safely', body: 'Previewing a dashboard as an audience and publishing each platform separately gives admins a chance to check the experience before release.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "Some employees belong to more than one audience, so several dashboards might apply to the same person.",
          "decision": "I used an ordered list: the first matching dashboard is shown, with a default dashboard as a fallback.",
          "why": "The order is visible in the admin list, so the assignment can be explained and adjusted without relying on a hidden rule.",
          "figure": {
            "src": "assets/work/dashboards/dashboard-list-northstar.png",
            "caption": "The list is the hierarchy — “the dashboard at the top of the list for that user will be applied.”",
            "alt": "Dashboard admin list with helper text describing first-match assignment for users in multiple segments"
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Create for an audience",
              "body": "Assign each dashboard to a user segment and choose who can manage it."
            },
            {
              "title": "Build and preview",
              "body": "Arrange widgets and preview the experience for that audience."
            },
            {
              "title": "Publish with control",
              "body": "Release web and mobile layouts separately and choose whether to replace user customisations."
            }
          ],
          "figure": {
            "src": "assets/work/dashboards/edit-dashboard-northstar.png",
            "caption": "Edit Dashboard — the same contract as create: name, segment, ownership.",
            "alt": "Edit Dashboard modal over a list of audience-specific dashboards"
          },
          "figures": [
            {
              "src": "assets/work/dashboards/widget-gallery-northstar.png",
              "caption": "Add Web Widgets — compose the layout from a categorised gallery, then publish when it is ready.",
              "alt": "Add Web Widgets modal with recommended widget cards on a dashboard builder"
            },
            {
              "src": "assets/work/dashboards/preview-customers-northstar.png",
              "caption": "Same preview chrome, Customers Segment — the money comparison against the Finance view in the hero.",
              "alt": "Customer Satisfaction dashboard preview viewed as Customers Segment"
            }
          ]
        }
      ]

    },
    {
      id: 'object-review-approve-publish-workflow',
      title: 'Object Review, Approve & Publish Workflow',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      layout: 'case-study-v2',
      description:
        'One approval setup, reused across content types.',
      summary:
        'One review, approve, and publish setup reused across content types, instead of a different flow for each.',
      detailDescription:
        'Authors keep their editors. Approval is configured once and reused across content types.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Governance',
      thumb: 'assets/work/approvals/thumb-northstar.webp',
      images: ['assets/work/approvals/hero-publish-flow-northstar.png'],
      scan: {
        "role": "Lead Product Designer",
        "timeline": "2024",
        "team": "Product, Engineering",
        "platform": "Web · Posts, then Pages & Wikis",
        "contribution": [
          "Workflow exploration",
          "Admin configuration",
          "Author and approver journeys"
        ],
        "challenge": "Posts, pages, and other content needed review before publishing, but separate approval flows would be difficult to maintain.",
        "impact": "A shared approval workflow launched for Posts and was extended to Pages and Wikis."
      },
      hero: {
        src: 'assets/work/approvals/hero-publish-flow-northstar.png',
        caption: 'Approach 4, end to end — Submit for Approval, confirmation, approver actions, then a Published post.',
        alt: 'Storyboard of post approval: editor with Submit for Approval, sent-for-approval modal, approver card, published article',
        storyboard: true
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Understand the different roles', body: 'Admins needed to configure review, authors needed to submit content easily, and approvers needed enough context to make a decision.' },
            { title: 'Explore the options', body: 'I compared four approaches, from a simple approval settings page to a reusable workflow. A settings-only solution was simpler initially but would duplicate configuration as content types grew.' },
            { title: 'Start with Posts', body: 'Product and Engineering aligned on using the existing workflow engine. Posts provided the first use case before the framework was extended to Pages and Wikis.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "A separate approval feature for each content type would repeat the same work.",
          "decision": "I chose a reusable workflow framework that routes content to the right approvers.",
          "why": "Authors stay in their existing editors, while the same framework can support more content types.",
          "figure": {
            "src": "assets/work/approvals/approach-4-config-northstar.png",
            "caption": "Approach 4 — configure the workflow once (approvers, routing, publish behaviour), then apply it to content.",
            "alt": "Storyboard of generic workflow configuration for post approval",
            "storyboard": true
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Configure",
              "body": "Admins set the review steps and approvers."
            },
            {
              "title": "Submit and review",
              "body": "Authors submit from their usual editor. Approvers can preview the content, approve it, decline it, or request changes from a central request."
            },
            {
              "title": "Keep a record",
              "body": "Approval decisions and feedback remain in the audit trail."
            }
          ],
          "figure": {
            "src": "assets/work/approvals/audit-trail-northstar.png",
            "caption": "The activity log keeps a record of approval decisions.",
            "alt": "Storyboard of approval activity and view logs",
            "storyboard": true
          }
        }
      ]

    },
    {
      id: 'centralized-task-management',
      title: 'Centralized Task Management',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      layout: 'case-study-v2',
      description:
        'Enterprise task orchestration for a SaaS intranet platform, built for a distributed front-line retail workforce',
      summary:
        'Fragmented store work pulled into one task model — create, assign, approve, and execute from the same system.',
      detailDescription:
        'V2 of centralised task orchestration — tracker-to-task automation, user-level distribution, and role-scoped execution for retail operations at scale.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Productivity',
      thumb: 'assets/work/tasks/thumb.webp',
      images: ['assets/work/tasks/hero-central.png'],
      scan: {
        "role": "Senior UI/UX Designer",
        "timeline": "2024",
        "team": "Product Manager, Engineering",
        "platform": "Web · Enterprise intranet · Distributed retail ops",
        "contribution": [
          "Task automation",
          "People and team assignment",
          "Role-based progress views"
        ],
        "challenge": "Retail teams relied on manual work to create tasks, assign them at scale, and track progress across stores.",
        "impact": "Tracker entries can create tasks automatically, while managers see progress for the locations they manage."
      },
      hero: {
        src: 'assets/work/tasks/hero-central.png',
        caption: 'Centralized Tasks — parent work on the left, completion and details on the right, scoped to the person looking.',
        alt: 'Centralized Tasks tab with a task list and a selected task’s execution details'
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Extend the existing model', body: 'The first version distributed tasks to store teams. I worked on the next version to support individuals, automation, and visibility across locations.' },
            { title: 'Reuse familiar workflows', body: 'Tracker entries already held structured operational data. Connecting them to the existing workflow engine avoided introducing a separate automation tool.' },
            { title: 'Respect each manager’s scope', body: 'The same central task view serves different roles, but each manager sees only the stores and people they are authorised to manage.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "A separate automation tool would duplicate workflows already in the product.",
          "decision": "I extended the existing workflow engine to create tasks from tracker entries.",
          "why": "The same task system supports both automated and manual creation.",
          "figure": {
            "src": "assets/work/tasks/create-workflow.png",
            "caption": "Create Workflow — Create/Publish Workflow hovered: “publishing posts / creating task based on tracker entries.”",
            "alt": "Create Workflow modal with Create/Publish Workflow option highlighted"
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Assign at scale",
              "body": "Choose individuals or store teams using existing filters. For large rollouts, admins can search, select multiple teams, or import a list."
            },
            {
              "title": "Track the right work",
              "body": "Managers can check completion by team or person without seeing locations outside their scope. Store teams can still find the work in their own familiar space."
            },
            {
              "title": "Review before creating",
              "body": "Approvers can preview a task before the workflow creates it."
            }
          ],
          "figure": {
            "src": "assets/work/tasks/add-user-task.png",
            "caption": "Add Task as User Task — more than one user makes it centralised. The permission note is on the screen, not in a help article.",
            "alt": "Add Task modal set to User Task with a note about creating centralized tasks by adding multiple users"
          },
          "figures": [
            {
              "src": "assets/work/tasks/add-team-task.png",
              "caption": "Team Task with Browse — the store path, still using the same parent–child model.",
              "alt": "Add Task modal set to Team Task with a Browse control for store teams"
            },
            {
              "src": "assets/work/tasks/select-teams.png",
              "caption": "Select Teams — find, add, remove, import from CSV. Nine stores selected, not typed one by one.",
              "alt": "Select Teams dual-list dialog over an Add Task modal"
            }
          ]
        }
      ]

    },
    {
      id: 'buuzz-app',
      title: 'Buuzz App',
      meta: 'MOBILE · PRODUCT DESIGN',
      size: 'wide',
      layout: 'case-study-v2',
      description: 'Dock-free e-bike sharing app for Indian cities.',
      summary:
        'A dock-free e-bike app for Indian cities. I designed onboarding, pricing, range, and parking so riders know the rules before they unlock.',
      detailDescription:
        'A one-handed last-mile app — staged onboarding, price and range before unlock, parking rules before you stop.',
      year: '2022',
      category: 'Mobile Design',
      area: 'Mobility / Consumer App',
      thumb: 'assets/work/buuzz/thumb.webp',
      images: ['assets/work/buuzz/hero-map.png'],
      scan: {
        "role": "Product Designer",
        "timeline": "2022",
        "team": "Product, Engineering",
        "platform": "iOS / Android",
        "contribution": [
          "Onboarding and identity verification",
          "Bike discovery and ride flow",
          "Pricing and parking guidance"
        ],
        "challenge": "Riders needed to understand registration, cost, battery range, and parking rules before committing to a ride.",
        "impact": "The design makes onboarding, pricing, bike range, and parking guidance visible throughout the ride."
      },
      hero: {
        src: 'assets/work/buuzz/hero-map.png',
        caption: 'Map — nearby Buuzz zones with live counts, and Unlock Ride as the one next step.',
        alt: 'Buuzz map home screen showing scooter zone markers and an Unlock Ride button',
        phone: true
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Reduce uncertainty before a ride', body: 'A rider needs more than a nearby bike: they need to know its range, what the ride will cost, and where they can park before committing.' },
            { title: 'Break onboarding into steps', body: 'Phone verification, identity checks, and wallet setup are presented separately, with progress visible as the rider moves through them.' },
            { title: 'Design for the whole journey', body: 'I connected discovery, the active ride, parking guidance, and the final summary so important information appears when it is needed.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "Registration and payment can feel overwhelming when presented as one long form.",
          "decision": "I separated phone verification, identity checks, and wallet setup into clear steps.",
          "why": "Riders see what comes next before moving on.",
          "figure": {
            "src": "assets/work/buuzz/onboarding.png",
            "caption": "Sign up → OTP → KYC. Identity is a step, not a wall at the start of a ride.",
            "alt": "Three Buuzz screens: mobile sign-up, OTP verification, and KYC details"
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Find a bike",
              "body": "See nearby bikes, battery level, and estimated range before choosing."
            },
            {
              "title": "Ride with confidence",
              "body": "A live ride screen shows time, distance, and running cost."
            },
            {
              "title": "Park and finish",
              "body": "If a rider tries to end outside a designated zone, the app explains the parking rule before they finish. A summary then shows the ride time, distance, and fare."
            }
          ],
          "figures": [
            {
              "src": "assets/work/buuzz/zone-list.png",
              "caption": "A zone list — bike ID, battery, and range before the rider commits.",
              "alt": "Buuzz zone sheet listing bikes with battery percent and estimated range",
              "phone": true
            },
            {
              "src": "assets/work/buuzz/active-ride.png",
              "caption": "Ride ON — time, distance, and a running rupee total.",
              "alt": "Buuzz active ride with live timer, distance, and fare",
              "phone": true
            },
            {
              "src": "assets/work/buuzz/parking.png",
              "caption": "End-at-zone alert before a penalty — pick a Buuzz zone, or end here anyway.",
              "alt": "Buuzz modal asking the rider to end the ride in a designated zone",
              "phone": true
            }
          ],
          "figureGrid": true
        }
      ]

    },
    {
      id: 'yugen-brand-identity',
      title: 'Yugen',
      meta: 'BRANDING · VISUAL IDENTITY',
      size: 'wide',
      layout: 'case-study-v2',
      description: 'Brand identity for a full-stack AI and ML services company',
      detailDescription:
        'A complete brand system from zero — wordmark, type, illustration, and a website that leads with proof, not AI cliché.',
      year: '2024',
      category: 'Brand Identity',
      area: 'Branding / AI Services',
      thumb: 'assets/work/yugen/thumb.webp',
      images: ['assets/work/yugen/home.jpg'],
      scan: {
        "role": "Brand & Web Designer",
        "timeline": "2024",
        "team": "Founding team",
        "platform": "Identity + website",
        "contribution": [
          "Brand identity",
          "Illustration and visual system",
          "Website structure"
        ],
        "challenge": "Yugen needed an identity and website that could explain its machine-learning services to enterprise buyers.",
        "impact": "A consistent brand and website bring together the company’s services, case studies, and careers content."
      },
      hero: {
        src: 'assets/work/yugen/home.jpg',
        caption: 'Homepage — positioning first, then who they are. Restraint instead of the default AI-startup look.',
        alt: 'Yugen.ai homepage hero and approach section on a dark layout',
        page: true
      },
      sections: [
        {
          type: 'process', id: 'approach', title: 'The Approach', tocLabel: 'Approach',
          steps: [
            { title: 'Find a distinctive direction', body: 'Working with the founding team, I developed an identity that reflects the company’s technical depth without relying on familiar AI imagery.' },
            { title: 'Make complex work tangible', body: 'The visual language uses typography, colour, and illustration to explain machine-learning services consistently across the site.' },
            { title: 'Lead visitors to evidence', body: 'The website connects the company’s positioning to its services and case studies, helping potential clients find work relevant to their needs.' }
          ]
        },
        {
          "type": "decision",
          "id": "decision",
          "title": "The Key Decision",
          "tocLabel": "Decision",
          "problem": "The brand needed to communicate technical expertise clearly across more than a logo.",
          "decision": "I built a visual system around a clear website structure, with services and case studies as proof of the work.",
          "why": "The same visual language carries across the company’s pages.",
          "figure": {
            "src": "assets/work/yugen/services.jpg",
            "caption": "ML Services — the offer as architecture, not a slogan under a hero video.",
            "alt": "Yugen ML Services page showing service architecture",
            "page": true
          }
        },
        {
          "type": "split",
          "id": "solution",
          "title": "The Solution",
          "tocLabel": "Solution",
          "figureFirst": true,
          "items": [
            {
              "title": "Explain the offer",
              "body": "Service pages make the company’s machine-learning work easier to understand."
            },
            {
              "title": "Make proof easy to find",
              "body": "Case studies can be explored by industry and business goal."
            },
            {
              "title": "Support the team",
              "body": "A consistent design system extends from case studies to careers."
            }
          ],
          "figure": {
            "src": "assets/work/yugen/case-studies.jpg",
            "caption": "Case studies index — proof before claims.",
            "alt": "Yugen case studies listing page",
            "page": true
          },
          "figures": [
            {
              "src": "assets/work/yugen/case-filter.jpg",
              "caption": "Filter by industry and goal — structure that reflects buyer intent.",
              "alt": "Yugen case studies page with industry and goal filters open",
              "page": true
            },
            {
              "src": "assets/work/yugen/careers.jpg",
              "caption": "Careers — a different tone on the same system, aimed at people who could work anywhere.",
              "alt": "Yugen careers page",
              "page": true
            }
          ]
        }
      ]

    }
  ];

  // Expose on window for other scripts
  if (typeof window !== 'undefined') {
    window.PORTFOLIO_WORKS = WORKS;
  }
})();


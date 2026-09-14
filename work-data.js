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
      detailDescription:
        'A planning layer on an existing publishing system — calendar, Post Ideas, and a path from capture to publish.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      thumb: 'assets/work/post-planning/thumb.webp',
      images: ['assets/work/post-planning/hero-week.png'],
      scan: {
        role: 'Senior UI/UX Designer',
        timeline: '2024',
        team: 'Product Manager, Engineering',
        platform: 'Web · Enterprise intranet',
        contribution: [
          'Content-state model (Post Idea)',
          'Unified Planning filter',
          'Calendar, list, and unplanned panel',
          'Drag-and-drop scheduling',
          'Role-based visibility and CSV import'
        ],
        challenge:
          'Publishing worked. Planning did not — drafts, scheduled posts, and unwritten ideas were scattered across three surfaces.',
        impact:
          'One Planning filter replaced three Manage sections. Teams can capture an idea, place it on a calendar, warn on conflicts, and import a full plan.'
      },
      hero: {
        src: 'assets/work/post-planning/hero-week.png',
        caption: 'Weekly planning calendar — Idea, Draft, and Scheduled as distinct, colour-coded states.',
        alt: 'Weekly content planning calendar showing colour-coded Idea, Draft, and Scheduled post cards'
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'The Problem',
          tocLabel: 'Problem',
          lead: 'Publishing worked. Planning did not. Drafts and scheduled posts were buried in Manage — no calendar, no idea state, no shared week.',
          cards: [
            { title: 'No planning context', body: 'Drafts and scheduled posts lived in Manage — no calendar, no cadence.' },
            { title: 'No idea state', body: 'Only draft or published. Nowhere to capture an idea before writing it.' },
            { title: 'Three different Manages', body: 'Posts, Team Posts, and Company Posts each had their own Manage, with inconsistent behaviour.' },
            { title: 'Plans stayed in spreadsheets', body: 'No conflict warning, no shared week, no way to import a plan in bulk.' }
          ],
          figure: {
            src: 'assets/work/post-planning/spreadsheet-plan.png',
            caption: 'A typical content plan lived in a spreadsheet — titles, audiences, dates — before it could exist in the product.',
            alt: 'Spreadsheet of post ideas with titles, descriptions, audiences, and planned publish dates'
          }
        },
        {
          type: 'process',
          id: 'process',
          title: 'How I Approached It',
          tocLabel: 'Process',
          steps: [
            { title: 'Align', body: 'Where a planning layer should live when drafts and scheduled posts already existed on three surfaces.' },
            { title: 'Define the state', body: 'Post Idea as an upstream object — so the calendar had something to show before a draft existed.' },
            { title: 'Consolidate', body: 'One Planning filter everywhere. Permissions change what you see, not the structure.' },
            { title: 'Ship on existing publish', body: 'Calendar, list, unplanned panel, and import sit on top of create / edit / publish — those flows stay intact.' }
          ]
        },
        {
          type: 'decision',
          id: 'decision-idea',
          title: 'Key Design Decisions',
          tocLabel: 'Decisions',
          kicker: '01 · Content state',
          problem: 'The calendar could not be useful if the only states were draft and published. Unwritten ideas had nowhere to live.',
          insight: 'Planning starts before writing. The missing object was not a better Manage list — it was a lighter content state.',
          decision: 'Introduce Post Idea, upstream of Draft: title, description, audience, and an optional planned date. No template, no editor, no commitment.',
          why: 'Three visual states (Idea, Draft, Scheduled) made the calendar readable and gave a clear path from capture to publish without breaking existing flows.',
          result: 'Ideas with a date appear on the calendar. Ideas without a date sit in Unplanned. Convert-to-post pre-fills title and audience, then drops the idea from planning views.',
          figure: {
            src: 'assets/work/post-planning/new-idea-modal.png',
            caption: 'New Post Idea — a lightweight capture modal, separate from post creation.',
            alt: 'New Post Idea modal with title, description, audience, and optional planned publish date'
          }
        },
        {
          type: 'decision',
          id: 'decision-filter',
          kicker: '02 · Consolidation',
          inToc: false,
          problem: 'Manage duplicated itself across Posts, Team Posts, and Company Posts, each with slightly different behaviour.',
          insight: 'Users did not need three planning products. They needed one model whose visibility changed with role.',
          decision: 'Replace Manage with a unified Planning filter: All Planned for admins, My Planned for everyone, identical on every surface.',
          why: 'Domain admins, intranet admins, team admins, network users, and guests all needed different slices of the same data — not different structures.',
          result: 'One filter model everywhere. All Planned shows every draft, scheduled post, and idea. My Planned shows only what the logged-in user owns.'
        },
        {
          type: 'split',
          id: 'solution',
          title: 'The Solution',
          tocLabel: 'Solution',
          figureFirst: true,
          lead: 'Three coordinated views — calendar, unplanned panel, and list — plus a path from idea to post.',
          items: [
            { title: 'Calendar', body: 'Week default; day and month available. Fixed colours — yellow scheduled, grey draft, blue idea, red overdue — stay readable against any domain branding. Conflicts show a banner and a per-card warning.' },
            { title: 'Unplanned panel', body: 'Drafts and ideas without a date sit on the right. Drag onto week or day snaps to the nearest slot; drop on month assigns 8:00 AM.' },
            { title: 'Drag and drop', body: 'Cards move across views and into Unplanned. A scheduled post dropped there becomes a draft. A draft or idea dropped on the calendar gets a date, not a new state.' }
          ],
          figure: {
            src: 'assets/work/post-planning/calendar-unplanned.png',
            caption: 'Weekly calendar with the Unplanned panel open — backlog on the right, scheduled work on the grid.',
            alt: 'Weekly planning calendar beside an Unplanned panel of drafts and ideas'
          },
          figures: [
            {
              src: 'assets/work/post-planning/month-view.png',
              caption: 'Month view — the same three states, with overflow when a day fills up.',
              alt: 'Monthly planning calendar with Idea, Draft, and Scheduled cards and overflow counts'
            }
          ]
        },
        {
          type: 'split',
          id: 'solution-list',
          title: 'List view & conversion',
          tocLabel: 'List',
          figureFirst: true,
          items: [
            { title: 'List view', body: 'Title, status, audience, creator, date. Each row opens the edit path that matches its state. Bulk delete lives on Unplanned.' },
            { title: 'Idea to post', body: 'Convert is one action: post creation opens with title and audience pre-filled. The idea leaves planning views once the editor is reached.' },
            { title: 'CSV import', body: 'Admins import a plan. Only title is required. Invalid optional fields are skipped, not the file.' }
          ],
          figure: {
            src: 'assets/work/post-planning/planned-list.png',
            caption: 'Planned list — All Planned / My Planned in the sidebar, sortable rows, state-appropriate actions.',
            alt: 'Tabular planned-posts list with status, audience, creator, and date columns'
          },
          figures: [
            {
              src: 'assets/work/post-planning/idea-detail.png',
              caption: 'Inspect an idea on the calendar, then Create a Post — title and audience travel with it.',
              alt: 'Post idea detail modal with planned date, creator, audience, and Create a Post action'
            }
          ]
        },
        {
          type: 'cards',
          id: 'surfaces',
          title: 'Across the Product',
          inToc: false,
          cards: [
            { title: 'Posts & Team Posts', body: 'Calendar and list. Same Planning filter; permissions change the data, not the structure.' },
            { title: 'Company Posts', body: 'List only — no calendar. Company-wide publishing stays a different job than weekly planning.' },
            { title: 'Responsive rules', body: 'Above 1280px, panel and filters can stay open together. Below that, opening one closes the other.' }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'Working with PM & Engineering',
          inToc: false,
          items: [
            'PM owned scope. We aligned on approach before design — especially where planning should live when drafts and scheduled posts were already scattered.',
            'The Planning filter became the consolidation point; Post Ideas became the new upstream state.',
            'Engineering set branding-proof colours, breakpoint rules, and the unplanned panel as a togglable overlay — so the layer would not fight the product it had to live in.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'One Planning filter', body: 'Three Manage sections became one model across Posts, Team Posts, and Company Posts.' },
            { title: 'Post Ideas', body: 'Capture and plan before writing, then convert with title and audience already filled.' },
            { title: 'Calendar operations', body: 'Conflict warnings, drag-and-drop dates, overdue colour, and CSV import — without leaving Planning.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'The hard problem was the content state, not the calendar widget. Until Idea existed, any calendar was just a prettier Manage list.',
            'Consolidating three surfaces mattered more than adding a fourth place to plan.',
            'I would pressure-test conflict warnings with real overlapping calendars earlier — the rule is simple to state and easy to get wrong in edge audiences.'
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
        'Delivering personalized dashboard experiences for different employee groups within an enterprise intranet platform.',
      detailDescription:
        'Audience-targeted dashboards — one experience per user segment, with ownership, preview, and a governed publish.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      thumb: 'assets/work/dashboards/thumb.webp',
      images: ['assets/work/dashboards/hero-preview.png'],
      scan: {
        role: 'Senior UI/UX Designer',
        timeline: '2024',
        team: 'Product Manager, Engineering',
        platform: 'Web + mobile · Enterprise intranet',
        contribution: [
          'Dashboard-to-segment assignment',
          'Delegated ownership',
          'Preview as a segment',
          'Independent web / mobile publish',
          'First-match hierarchy'
        ],
        challenge:
          'One homepage cannot serve executives and frontline staff. There was no way to assign a dashboard to a segment, preview it, or publish it safely.',
        impact:
          'Admins create audience-specific dashboards, preview as that segment, and publish web and mobile independently — with a first-match rule when a user belongs to more than one group.'
      },
      hero: {
        src: 'assets/work/dashboards/hero-preview.png',
        caption: 'Preview of an Engaged Users dashboard, viewed as Finance Department — web and mobile in the same chrome.',
        alt: 'Admin preview of an engaged-users dashboard with View as Finance Department and Web/Mobile toggle'
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'The Problem',
          tocLabel: 'Problem',
          lead: 'Every employee landed on the same homepage. Widget visibility could hide a card. It could not give Finance a different dashboard from the warehouse floor.',
          cards: [
            { title: 'One layout for every role', body: 'Executives, office staff, and frontline workers shared a single dashboard experience.' },
            { title: 'No delegated ownership', body: 'Dashboard administration could not be handed to a specific admin without exposing every dashboard.' },
            { title: 'No preview before publish', body: 'Admins could not see what a segment would actually get before they shipped it.' },
            { title: 'Multi-segment users', body: 'People in more than one group needed a predictable assignment rule — not a merge of every matching layout.' }
          ]
        },
        {
          type: 'process',
          id: 'process',
          title: 'How I Approached It',
          tocLabel: 'Process',
          steps: [
            { title: 'Treat the dashboard as the object', body: 'Audience targeting happens at dashboard level. Widget visibility still applies inside, once the user has access.' },
            { title: 'One segment per dashboard', body: 'A clear contract: this dashboard is for this group. No blended audiences.' },
            { title: 'First match wins', body: 'Dashboards are evaluated top to bottom. The first match is assigned. Then widget rules run.' },
            { title: 'Preview, then publish', body: 'Web and mobile can be previewed as a segment and published independently.' }
          ]
        },
        {
          type: 'decision',
          id: 'decision-target',
          title: 'Key Design Decisions',
          tocLabel: 'Decisions',
          kicker: '01 · Audience object',
          problem: 'Widget-level visibility was already in the product. Using it as the only lever still left every role on the same homepage shell.',
          insight: 'The missing object was not another widget rule. It was the dashboard itself as an audience-targeted experience.',
          decision: 'One dashboard maps to one user segment. Name, description, ownership, and segment are set at create — not inferred from widgets.',
          why: 'Admins can reason about “the Finance dashboard” as a thing they own, preview, and publish — instead of a pile of hidden widgets.',
          result: 'New dashboards start inactive. They can be enabled when the layout is ready. Ownership can sit with all dashboard admins, a named set, or network admins only.',
          figure: {
            src: 'assets/work/dashboards/add-dashboard.png',
            caption: 'Add Dashboard — name, segment, and who can manage it. Ownership is a first-class field, not a later permission hunt.',
            alt: 'Add New Dashboard modal with user segment and management-permission options'
          }
        },
        {
          type: 'decision',
          id: 'decision-hierarchy',
          kicker: '02 · Assignment rule',
          inToc: false,
          problem: 'Users often belong to more than one segment. Merging layouts would be unpredictable. Asking them to pick every morning would not scale.',
          insight: 'The list order is the rule. What you see in admin is what the system will do.',
          decision: 'Evaluate dashboards from top to bottom. The first matching segment wins. Helper copy on the list states that in plain language.',
          why: 'A visible, ordered list is easier to govern than an invisible scoring model — and easier to explain to a customer admin.',
          result: 'The default system dashboard is assigned to All Network Users, cannot be deleted, and remains the fallback. Custom dashboards stack above it by segment.',
          figure: {
            src: 'assets/work/dashboards/dashboard-list.png',
            caption: 'The list is the hierarchy — “the dashboard at the top of the list for that user will be applied.”',
            alt: 'Dashboard admin list with helper text describing first-match assignment for users in multiple segments'
          }
        },
        {
          type: 'split',
          id: 'solution',
          title: 'The Solution',
          tocLabel: 'Solution',
          figureFirst: true,
          lead: 'Create, compose, preview as a segment, then publish — web and mobile as separate actions.',
          items: [
            { title: 'Create & own', body: 'Name, description, one segment, and an ownership mode. Edit later without changing the assignment contract.' },
            { title: 'Compose', body: 'Widget gallery on a live layout. Web and Mobile tabs keep the two surfaces in one builder.' },
            { title: 'Preview as', body: 'See the dashboard as Finance, Customers, or any assigned segment before it goes live.' }
          ],
          figure: {
            src: 'assets/work/dashboards/edit-dashboard.png',
            caption: 'Edit Dashboard — the same contract as create: name, segment, ownership.',
            alt: 'Edit Dashboard modal over a list of audience-specific dashboards'
          },
          figures: [
            {
              src: 'assets/work/dashboards/widget-gallery.png',
              caption: 'Add Web Widgets — compose the layout from a categorised gallery, then publish when it is ready.',
              alt: 'Add Web Widgets modal with recommended widget cards on a dashboard builder'
            }
          ]
        },
        {
          type: 'split',
          id: 'solution-publish',
          title: 'Preview & publish',
          tocLabel: 'Publish',
          figureFirst: true,
          items: [
            { title: 'Two audiences, two layouts', body: 'The same preview chrome. Change “View as” and the homepage changes with it.' },
            { title: 'Governed publish', body: 'Publish is a confirm, not a save. Web and mobile can ship on different clocks.' },
            { title: 'Override, or leave customisations', body: 'Admins choose whether a publish replaces user-customised layouts or only fills in the rest.' }
          ],
          figure: {
            src: 'assets/work/dashboards/preview-customers.png',
            caption: 'Same preview chrome, Customers Segment — the money comparison against the Finance view in the hero.',
            alt: 'Customer Satisfaction dashboard preview viewed as Customers Segment'
          },
          figures: [
            {
              src: 'assets/work/dashboards/publish.png',
              caption: 'Publish Web Dashboard — a confirm, because widget-heavy updates are not instant and should not be accidental.',
              alt: 'Publish Web Dashboard confirmation modal over a three-column dashboard builder'
            }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'Working with PM & Engineering',
          inToc: false,
          items: [
            'The requirement came from customers who needed role-based homepages. PM and I aligned on assignment, ownership, and publish before the builder UI.',
            'Several hierarchy models were explored. First-match on an ordered list won because admins could see the rule.',
            'Engineering constraints on the existing widget and publish systems kept this as a layer on top — not a second homepage product.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'Audience-specific homepages', body: 'Different employee groups can receive different dashboards from the same platform.' },
            { title: 'Ownership without a free-for-all', body: 'A dashboard can be managed by all admins, a named set, or network admins only.' },
            { title: 'Safer rollout', body: 'Preview as a segment, then publish web and mobile independently — with an explicit overwrite choice.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'Personalisation fails without an assignment rule. “Show the right widgets” is not the same as “give this group a homepage.”',
            'The admin list had to state the hierarchy in a sentence. If the rule is invisible, it will be misconfigured.',
            'I would pressure-test multi-segment edge cases with real org charts earlier — first-match is simple until two equally valid segments sit next to each other.'
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
        'Building a scalable content governance framework for enterprise content publishing.',
      detailDescription:
        'A reusable approval system on a generic workflow engine — authors keep their editors; governance lives once, not per module.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Governance',
      thumb: 'assets/work/approvals/thumb.webp',
      images: ['assets/work/approvals/hero-publish-flow.png'],
      scan: {
        role: 'Lead Product Designer',
        timeline: '2024',
        team: 'Product, Engineering',
        platform: 'Web · Posts, then Pages & Wikis',
        contribution: [
          'Discovery and workflow architecture',
          'Four-approach evaluation',
          'Admin, creator, and approver journeys',
          'Phased rollout from Posts outward'
        ],
        challenge:
          'Posts, Pages, Wikis, and Documents all needed review before publish — and there was no shared approval system that could govern them the same way.',
        impact:
          'One workflow engine. Authors keep their existing editors. Approvers act from a central request. Phase 1 shipped on Posts; Phase 2 reused the same framework for Pages and Wikis.'
      },
      hero: {
        src: 'assets/work/approvals/hero-publish-flow.png',
        caption: 'Approach 4, end to end — Submit for Approval, confirmation, approver actions, then a Published post.',
        alt: 'Storyboard of post approval: editor with Submit for Approval, sent-for-approval modal, approver card, published article',
        storyboard: true
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'The Problem',
          tocLabel: 'Problem',
          lead: 'Quality and compliance needed a gate. Building that gate once per content type would not scale.',
          cards: [
            { title: 'Admins', body: 'Configure once. Company-wide and team scopes. Mandatory and optional steps. A full audit trail.' },
            { title: 'Creators', body: 'Keep the editors they already use. Do not pick approvers by hand. See status and feedback.' },
            { title: 'Approvers', body: 'Review from one place. Preview as it will publish. Approve, decline, or request changes.' },
            { title: 'The platform', body: 'Posts first — but Pages, Wikis, Documents, and future types had to fit the same engine.' }
          ]
        },
        {
          type: 'split',
          id: 'exploration',
          title: 'Four Approaches',
          tocLabel: 'Exploration',
          figureFirst: true,
          lead: 'I evaluated four directions before committing. Approach 1 was the obvious settings page. Approach 4 is a platform capability.',
          items: [
            { title: '01 · Global settings', body: 'A Content Approval admin with type toggles. Simple — and coupled to modules. Limited chains. Duplicate config as types grew.' },
            { title: '02 · Reuse Trackers', body: 'Approvals as tracker workflows. Familiar, more flexible — still approval-centric, hard to extend past a yes/no gate.' },
            { title: '03 · Inform + approve', body: 'Broader notifications and non-approval paths. Flexible, but mixed two jobs and raised the admin learning curve.' },
            { title: '04 · Generic engine (selected)', body: 'Approvals as one action type on a workflow framework: routing, multiple approvers, escalations, future automation.' }
          ],
          figure: {
            src: 'assets/work/approvals/approach-1-settings.png',
            caption: 'Approach 1 — a dedicated Content Approval settings page. Clear, and too tightly bound to content modules.',
            alt: 'Content Approval administration settings with customize-message modal',
            storyboard: true
          },
          figures: [
            {
              src: 'assets/work/approvals/approach-4-config.png',
              caption: 'Approach 4 — configure the workflow once (approvers, routing, publish behaviour), then apply it to content.',
              alt: 'Storyboard of generic workflow configuration for post approval',
              storyboard: true
            }
          ]
        },
        {
          type: 'decision',
          id: 'decision-engine',
          title: 'Key Design Decisions',
          tocLabel: 'Decisions',
          kicker: '01 · Build the engine',
          problem: 'A Posts-only approval feature would have shipped faster — and been redesigned the first time Pages needed the same gate.',
          insight: 'The product already had Trackers as a workflow surface. Approvals could be an action on that engine, not a new product.',
          decision: 'Put approval on a generic workflow framework. Content type, approvers, routing, and publish behaviour are configuration — not hardcoded screens.',
          why: 'Single, multiple, sequential, parallel, mandatory, and optional approvals become data. The UX can stay stable as types are added.',
          result: 'Phase 1 validated the engine on Posts. Phase 2 extended to Pages and Wikis with minimal UX change.'
        },
        {
          type: 'decision',
          id: 'decision-author',
          kicker: '02 · Do not teach a new publish',
          inToc: false,
          problem: 'If authors had to assemble a workflow at create time, adoption would fail even if the admin model was elegant.',
          insight: 'Governance is an admin job. Creation is an author job. Mixing them in the editor is how you get abandoned settings.',
          decision: 'Authors stay in existing post, page, wiki, and document editors. Submit for Approval applies the matching workflow automatically.',
          why: 'Approvers get a central request with preview and in-review edit. Creators get status without becoming workflow designers.',
          result: 'Approve publishes when mandatory steps are done. Decline records a reason. Request Changes returns the object and keeps history.'
        },
        {
          type: 'split',
          id: 'solution',
          title: 'The Solution',
          tocLabel: 'Solution',
          figureFirst: true,
          lead: 'Admin configures the workflow. The author submits. The approver decides. The object publishes itself.',
          items: [
            { title: 'Author', body: 'Same editor. Submit for Approval. A confirmation — not a new publishing product.' },
            { title: 'Approver', body: 'Central request: preview, edit if needed, Approve / Decline / Request Changes.' },
            { title: 'Audit', body: 'Decisions and status stay on the object. Governance is visible after the fact, not only in the moment.' }
          ],
          figure: {
            src: 'assets/work/approvals/hero-publish-flow.png',
            caption: 'Creator submit → confirmation → approver card → published. The author never left the editor they already knew.',
            alt: 'Four-step storyboard from submit-for-approval through published post',
            storyboard: true
          },
          figures: [
            {
              src: 'assets/work/approvals/audit-trail.png',
              caption: 'Activity and view logs — the trail that makes a reusable engine trustworthy in an enterprise.',
              alt: 'Storyboard of approval activity and view logs',
              storyboard: true
            }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'Working with Product & Engineering',
          inToc: false,
          items: [
            'I led discovery and the four-approach evaluation, then designed admin configuration plus creator and approver journeys.',
            'Product and Engineering aligned on Trackers as the engine so we were not inventing a second workflow runtime.',
            'The first launch was Posts on purpose — a proving ground before Pages and Wikis reused the same architecture.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'One governance model', body: 'Approval is configured once and applied across content types — not rebuilt per module.' },
            { title: 'Familiar creation', body: 'Authors do not select approvers or learn a new publish path.' },
            { title: 'Reusable architecture', body: 'Phase 2 reused Phase 1. The next content type does not need a new approval product.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'The senior move was declining the settings page. Approach 1 would have looked finished and failed the second content type.',
            'Preserve the author’s existing flow, or the governance layer will be bypassed.',
            'I would still take a real multi-approver chain into usability earlier — sequential vs parallel is easy to draw and easy to get wrong in language.'
          ]
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
      detailDescription:
        'V2 of centralised task orchestration — tracker-to-task automation, user-level distribution, and role-scoped execution for retail operations at scale.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Productivity',
      thumb: 'assets/work/tasks/thumb.webp',
      images: ['assets/work/tasks/hero-central.png'],
      scan: {
        role: 'Senior UI/UX Designer',
        timeline: '2024',
        team: 'Product Manager, Engineering',
        platform: 'Web · Enterprise intranet · Distributed retail ops',
        contribution: [
          'Tracker-to-task automation',
          'User-level distribution',
          'Role-scoped execution views',
          'Approval preview',
          'Bulk audience selection'
        ],
        challenge:
          'V1 could broadcast a team task. There was no path from tracker data to a task, no user-level assignment at scale, and no scoped view for site managers.',
        impact:
          'A tracker entry can create a centralised task. Site managers see only their stores. Approvers can preview the task before they commit.'
      },
      hero: {
        src: 'assets/work/tasks/hero-central.png',
        caption: 'Centralized Tasks — parent work on the left, completion and details on the right, scoped to the person looking.',
        alt: 'Centralized Tasks tab with a task list and a selected task’s execution details'
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'Gaps in V1',
          tocLabel: 'Problem',
          lead: 'V1 solved broadcast to many store teams. It left the organisation coordinating the rest in spreadsheets and side channels.',
          cards: [
            { title: 'No automation', body: 'Structured tracker data still required a separate, manual task setup.' },
            { title: 'Teams only', body: 'Centralised tasks could not be assigned to individual users — no personal accountability at scale.' },
            { title: 'All or nothing visibility', body: 'Site managers could not see completion for only their stores.' },
            { title: 'Approvers worked blind', body: 'A workflow could create a task with no preview of what that task would contain.' }
          ]
        },
        {
          type: 'process',
          id: 'process',
          title: 'How I Approached It',
          tocLabel: 'Process',
          steps: [
            { title: 'Extend the engine', body: 'Do not build a second automation path. Add “Create a Task” next to “Publish a Post” on the tracker workflow they already use.' },
            { title: 'Map, don’t retype', body: 'Tracker columns become task fields. Admins see exactly what will carry over before they save.' },
            { title: 'Same screen, scoped data', body: 'Domain admins, site managers, and network users share the Centralized Tasks tab. Counts and lists respect role.' },
            { title: 'Preview before approve', body: 'If a workflow will create a task, the approver can open that task as it would be created.' }
          ]
        },
        {
          type: 'decision',
          id: 'decision-engine',
          title: 'Key Design Decisions',
          tocLabel: 'Decisions',
          kicker: '01 · The tracker is the source',
          problem: 'A standalone “create tasks from a spreadsheet” tool would have duplicated triggers, conditions, and branching the product already had.',
          insight: 'Admins who had built post workflows already knew this model. The missing action was Create a Task.',
          decision: 'Extend Create/Publish Workflow with a task action. Mapping is required. Success and failure each get their own follow-on block.',
          why: 'The cognitive model stays familiar. Title, teams/users, type, and from-user validate on save so a half-mapped workflow cannot silently ship empty tasks.',
          result: 'A matching tracker row can create the task, write the task URL back, and update a status column — without a second product.',
          figure: {
            src: 'assets/work/tasks/create-workflow.png',
            caption: 'Create Workflow — Create/Publish Workflow hovered: “publishing posts / creating task based on tracker entries.”',
            alt: 'Create Workflow modal with Create/Publish Workflow option highlighted'
          }
        },
        {
          type: 'decision',
          id: 'decision-scope',
          kicker: '02 · Scope the data, not the UI',
          inToc: false,
          problem: 'Three roles needed different slices of the same operational picture. Separate apps would drift. One unfiltered list would leak the organisation.',
          insight: 'The tab can be shared if every count, list, and export is scoped to the logged-in user.',
          decision: 'One Centralized Tasks surface. Execution Status — team lists, user lists, percentages — reflects only what that person is authorised to see.',
          why: 'Site managers get a role-appropriate view without a second export or an admin sitting in the middle.',
          result: 'User-level centralised tasks follow the same parent–child pattern as team tasks. Browse gained Persona and Sites filters so large audiences can be selected without error.'
        },
        {
          type: 'split',
          id: 'solution',
          title: 'The Solution',
          tocLabel: 'Solution',
          figureFirst: true,
          lead: 'Manual create at scale, and automated create from a tracker — both land in the same Centralized Tasks tab.',
          items: [
            { title: 'User or team', body: 'Multi-select users is net-new. Multi-select teams still creates a parent with child tasks per store.' },
            { title: 'Browse, don’t type', body: 'Persona filter for people. Sites filter for teams — reusing the hierarchy the product already had.' },
            { title: 'Local context', body: 'The same work appears inside a store team, so front-line execution does not require the org-wide tab.' }
          ],
          figure: {
            src: 'assets/work/tasks/add-user-task.png',
            caption: 'Add Task as User Task — more than one user makes it centralised. The permission note is on the screen, not in a help article.',
            alt: 'Add Task modal set to User Task with a note about creating centralized tasks by adding multiple users'
          },
          figures: [
            {
              src: 'assets/work/tasks/add-team-task.png',
              caption: 'Team Task with Browse — the store path, still using the same parent–child model.',
              alt: 'Add Task modal set to Team Task with a Browse control for store teams'
            }
          ]
        },
        {
          type: 'split',
          id: 'solution-ops',
          title: 'Operations at scale',
          tocLabel: 'Operations',
          figureFirst: true,
          items: [
            { title: 'Bulk audiences', body: 'Select Teams is a dual list with search, CSV import, and a running selected count — built for hundreds of locations, not five.' },
            { title: 'Execution status', body: 'Completion % and per-team or per-user actions, including a pre-filled DM to the person responsible.' },
            { title: 'Export respects scope', body: 'The XLS from Task Tools contains only the stores and people the logged-in user is allowed to see.' }
          ],
          figure: {
            src: 'assets/work/tasks/select-teams.png',
            caption: 'Select Teams — find, add, remove, import from CSV. Nine stores selected, not typed one by one.',
            alt: 'Select Teams dual-list dialog over an Add Task modal'
          },
          figures: [
            {
              src: 'assets/work/tasks/team-surface.png',
              caption: 'The same task inside a store team — org-wide orchestration, local execution.',
              alt: 'Store team tasks list with a selected task’s details panel'
            }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'Working with PM & Engineering',
          inToc: false,
          items: [
            'PM brought the full V2 scope. We aligned early on the tracker as the automation source and where visibility boundaries should fall.',
            'Extending the existing workflow engine beat a separate task-automation path — the mental model was already in the product.',
            'Engineering set what the Sites hierarchy, file follow-list, and workflow execution engine could support. Those conversations decided reuse over rebuild.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'Tracker to task', body: 'A matching entry can create the task, write the URL back, and update status without a manual pass.' },
            { title: 'User-level accountability', body: 'Centralised distribution is no longer teams-only.' },
            { title: 'Scoped operations', body: 'Site managers see their stores. Approvers can preview the task. Tab labels can match the customer’s language.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'Extend the model people already have. A second automation product would have been easier to draw and harder to run.',
            'Scoped data on one screen beats three specialised screens that drift.',
            'I would still get a real approval-preview in front of store managers earlier — the happy path is obvious; incomplete mappings are not.'
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
      detailDescription:
        'A one-handed last-mile app — staged onboarding, price and range before unlock, parking rules before you stop.',
      year: '2022',
      category: 'Mobile Design',
      area: 'Mobility / Consumer App',
      thumb: 'assets/work/buuzz/thumb.webp',
      images: ['assets/work/buuzz/hero-map.png'],
      scan: {
        role: 'Product Designer',
        timeline: '2022',
        team: 'Product, Engineering',
        platform: 'iOS / Android',
        contribution: [
          'Staged onboarding (OTP → KYC → wallet)',
          'Map-first discovery',
          'Ride + running cost meter',
          'Zone parking intervention',
          'Post-ride summary'
        ],
        challenge:
          'Existing shared-mobility apps failed Indian riders on registration, hidden pricing, unknown range, and surprise parking penalties.',
        impact:
          'Onboarding under 5 minutes including KYC. Pricing shown at 3 touchpoints before payment. Battery and range before unlock. Zone rules before a stop.'
      },
      hero: {
        src: 'assets/work/buuzz/hero-map.png',
        caption: 'Map — nearby Buuzz zones with live counts, and Unlock Ride as the one next step.',
        alt: 'Buuzz map home screen showing scooter zone markers and an Unlock Ride button',
        phone: true
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'User Pain Points',
          tocLabel: 'Problem',
          lead: 'Too far to walk, too expensive to cab — and the apps that promised a bike made the ride itself feel risky.',
          cards: [
            { title: 'KYC drop-off', body: 'Compliance had no step structure. People left before they were allowed to ride.' },
            { title: 'Bill shock', body: 'Price appeared after the rider had already committed.' },
            { title: 'Unknown range', body: 'Battery and estimated range were missing at selection.' },
            { title: 'Surprise penalties', body: 'Zone parking rules showed up as a violation, not as guidance.' }
          ]
        },
        {
          type: 'process',
          id: 'principles',
          title: 'Design Principles',
          tocLabel: 'Principles',
          steps: [
            { title: 'One-handed', body: 'Designed for a moving urban context — large targets, daylight contrast, progressive disclosure.' },
            { title: 'Stage the commitment', body: 'Identity (KYC) and money (wallet) are separate. Neither should feel like an ambush mid-flow.' },
            { title: 'OTP only', body: 'No password. Lower friction for low-digital-literacy riders.' },
            { title: 'Show the cost of a mistake early', body: 'Price, range, and parking rules appear before the action that would punish the rider.' }
          ]
        },
        {
          type: 'split',
          id: 'flows',
          title: 'End-to-end flows',
          tocLabel: 'Flows',
          figureFirst: true,
          figureGrid: true,
          lead: 'OTP, KYC, and wallet are separate steps. Then pick by battery and range, ride with a live fare, and get stopped before an out-of-zone end.',
          items: [
            { title: 'Onboarding', body: 'Sign up → OTP → KYC → Wallet. Progress and “what happens next” on every step.' },
            { title: 'Discovery', body: 'Zone map and a bike list. Battery and estimated range before the rider picks.' },
            { title: 'Ride → end → summary', body: 'Live track + cost meter. Parking guidance before stop. Time, distance, and fare on the way out.' }
          ],
          figure: {
            src: 'assets/work/buuzz/onboarding.png',
            caption: 'Sign up → OTP → KYC. Identity is a step, not a wall at the start of a ride.',
            alt: 'Three Buuzz screens: mobile sign-up, OTP verification, and KYC details'
          },
          figures: [
            {
              src: 'assets/work/buuzz/zone-list.png',
              caption: 'A zone list — bike ID, battery, and range before the rider commits.',
              alt: 'Buuzz zone sheet listing bikes with battery percent and estimated range',
              phone: true
            },
            {
              src: 'assets/work/buuzz/wallet.png',
              caption: 'Add funds — refundable deposit and wallet top-up before the first ride.',
              alt: 'Buuzz add-funds screen with refundable security deposit and wallet amount chips',
              phone: true
            },
            {
              src: 'assets/work/buuzz/active-ride.png',
              caption: 'Ride ON — time, distance, and a running rupee total.',
              alt: 'Buuzz active ride with live timer, distance, and fare',
              phone: true
            },
            {
              src: 'assets/work/buuzz/parking.png',
              caption: 'End-at-zone alert before a penalty — pick a Buuzz zone, or end here anyway.',
              alt: 'Buuzz modal asking the rider to end the ride in a designated zone',
              phone: true
            },
            {
              src: 'assets/work/buuzz/ride-summary.png',
              caption: 'Ride summary — time, distance, fare, then share feedback.',
              alt: 'Buuzz post-ride summary with duration, distance, and cost',
              phone: true
            }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'Working with Product & Engineering',
          inToc: false,
          items: [
            'Partnered on compliance checkpoints, pricing transparency, and map/zone constraints before the flows were drawn as final.',
            'Edge cases we pressure-tested: failed KYC, low wallet, out-of-zone parking, interrupted rides.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'Onboarding under 5 minutes', body: 'Including KYC — staged so identity and wallet are not one hostile form.' },
            { title: 'Price at 3 touchpoints', body: 'Shown before any payment, not after the ride starts.' },
            { title: 'Fewer regret unlocks', body: 'Battery + range before selection. Zone intervention before a penalty-triggering stop.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'Trust is designed before the ride starts. A beautiful map will not save hidden pricing or a surprise fine.',
            'Staging KYC and wallet separately was the difference between “compliant” and “finishable.”'
          ]
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
        role: 'Brand & Web Designer',
        timeline: '2024',
        team: 'Founding team',
        platform: 'Identity + website',
        contribution: [
          'Wordmark and lockup',
          'Colour and type',
          'Illustration system',
          'Site information architecture',
          'Careers voice'
        ],
        challenge:
          'An engineering-first ML company with no visual language, selling to technical buyers in a market full of glowing neural nets.',
        impact:
          'A complete system from zero — logo, colour, type, illustration, and a site whose architecture matches how an enterprise buyer actually looks for proof.'
      },
      hero: {
        src: 'assets/work/yugen/home.jpg',
        caption: 'Homepage — positioning first, then who they are. Restraint instead of the default AI-startup look.',
        alt: 'Yugen.ai homepage hero and approach section on a dark layout',
        page: true
      },
      sections: [
        {
          type: 'cards',
          id: 'problem',
          title: 'What Needed Solving',
          tocLabel: 'Problem',
          lead: 'The name references a Japanese sense of depth. The brand had to make that felt — and still pass a skeptical ML buyer.',
          cards: [
            { title: 'Technical, not sterile', body: 'Engineering rigour without the cold default of B2B tech brands.' },
            { title: 'One language, many surfaces', body: 'Long-form case studies, a technical blog, an industry navigator, and careers for senior engineers.' },
            { title: 'Abstract work, concrete pictures', body: 'Pipelines, anomaly detection, recommendations — without brains, robots, or clip art.' },
            { title: 'Startup, not costume', body: 'Enterprise clients, early-stage company. Mature without pretending to be a 2,000-person firm.' }
          ]
        },
        {
          type: 'process',
          id: 'direction',
          title: 'Creative Direction',
          tocLabel: 'Direction',
          steps: [
            { title: 'Not that AI look', body: 'Away from dark gradients, glowing nets, and circuit textures. Toward considered, precise, human.' },
            { title: 'The name as a constraint', body: 'Yugen suggested layered intelligence, not volume. Restraint in the mark. Depth in illustration. A site that rewards reading.' },
            { title: 'Earned visuals', body: 'Every choice had to come from what the company ships — production ML systems — not from what AI companies typically look like.' },
            { title: 'Philosophy, then proof', body: 'The homepage states the approach, then grounds it. Services and case studies do the selling.' }
          ]
        },
        {
          type: 'decision',
          id: 'decision-site',
          title: 'Key Design Decisions',
          tocLabel: 'Decisions',
          kicker: '01 · The site is the brand',
          problem: 'A logo sheet without an information architecture would have left the company looking like every other ML deck.',
          insight: 'Enterprise buyers do not skim a manifesto. They look for a system that has shipped in their industry, against their goal.',
          decision: 'Build the identity so it holds a homepage, a service architecture, filterable case studies, and a human careers tone — same grid, different jobs.',
          why: 'The “ai” lockup signals domain without reducing the brand to a technology sticker. Illustrations show flows and relationships, not metaphors.',
          result: 'A repeatable foundation: type, colour, spacing, and illustration rules the team can extend without a designer in every file.',
          figure: {
            src: 'assets/work/yugen/services.jpg',
            caption: 'ML Services — the offer as architecture, not a slogan under a hero video.',
            alt: 'Yugen ML Services page showing service architecture',
            page: true
          }
        },
        {
          type: 'split',
          id: 'system',
          title: 'Brand system in use',
          tocLabel: 'System',
          figureFirst: true,
          lead: 'Case studies filter by industry and business goal — the way a buyer actually arrives, not the way an agency likes to present work.',
          items: [
            { title: 'Proof, filterable', body: 'Industry and goal are first-class. Time-to-relevant-content is the point of the IA.' },
            { title: 'Depth holds', body: 'A case study detail page uses the same language as the index — no sudden theme change when someone clicks through.' },
            { title: 'Careers as contrast', body: 'Direct, human, specific enough to filter senior ML engineers. Startup culture, stated — not a stock “we’re a family.”' }
          ],
          figure: {
            src: 'assets/work/yugen/case-studies.jpg',
            caption: 'Case studies index — proof before claims.',
            alt: 'Yugen case studies listing page',
            page: true
          },
          figures: [
            {
              src: 'assets/work/yugen/case-filter.jpg',
              caption: 'Filter by industry and goal — structure that reflects buyer intent.',
              alt: 'Yugen case studies page with industry and goal filters open',
              page: true
            },
            {
              src: 'assets/work/yugen/case-detail.jpg',
              caption: 'Case study detail — the system still holds when the page gets long.',
              alt: 'Yugen individual case study detail page',
              page: true
            },
            {
              src: 'assets/work/yugen/careers.jpg',
              caption: 'Careers — a different tone on the same system, aimed at people who could work anywhere.',
              alt: 'Yugen careers page',
              page: true
            }
          ]
        },
        {
          type: 'learnings',
          id: 'collaboration',
          title: 'With the Founding Team',
          inToc: false,
          items: [
            'Worked directly with the founding team on brand strategy — positioning, what to show first, and what the site had to prove.'
          ]
        },
        {
          type: 'outcomes',
          id: 'outcome',
          title: 'Impact',
          tocLabel: 'Impact',
          items: [
            { title: 'System from zero', body: 'Wordmark, colour, type, illustration, and site — no prior visual identity to inherit or fight.' },
            { title: 'ML, made visible', body: 'Service categories are distinct without generic tech metaphors.' },
            { title: 'Built to be extended', body: 'A repeatable language, not a fixed set of pages the team cannot leave.' }
          ]
        },
        {
          type: 'learnings',
          id: 'learnings',
          title: 'What I Learned',
          tocLabel: 'Learned',
          items: [
            'For technical buyers, polish without substance is a liability. The IA had to do as much work as the wordmark.',
            'Restraint is harder to defend than a loud AI look — and it was the only direction that matched the name they chose.'
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


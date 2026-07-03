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
      description: 'Content planning feature for a SaaS intranet platform',
      detailDescription:
        'A full content planning layer on top of an existing publishing system — calendar view, Post Ideas, unplanned holding area, drag-and-drop scheduling, conflict warnings, and CSV import — without changing underlying publish behaviour.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      sections: [
        {
          title: 'Background',
          content:
            'The product is an enterprise intranet and employee communication platform where admins and team managers publish posts to specific audiences — company-wide, team-specific, or targeted user segments.\n\n' +
            'Content publishing was already supported, but there was no way to plan, visualise, or coordinate what was going out, when, and to whom. Drafts and scheduled posts were buried in a Manage section, with no unified view across content states or teams.\n\n' +
            'This feature introduced a full content planning layer on top of the existing publishing system — a calendar view, a new Post Ideas content type, an unplanned holding area, drag-and-drop scheduling, and bulk import — all without changing the underlying publishing behaviour users already relied on.'
        },
        {
          title: 'The Challenge',
          content:
            '<p>Admins and team managers publishing content across a large organisation had no way to see the full picture of what was going out. Drafts lived in one place, scheduled posts in another, and there was no concept of an idea that hadn&apos;t been written yet. The result was uncoordinated publishing — multiple posts targeting the same audience at the same time, no visual sense of content cadence, and no lightweight way to capture a content idea before it was ready to write.</p>' +
            '<p>Specific problems:</p>' +
            '<ul>' +
            '<li>Drafts and scheduled posts were accessible only through a Manage section with no calendar or planning context</li>' +
            '<li>No ability to capture a post idea before committing to writing it — the only options were draft or published</li>' +
            '<li>Admins had no visibility into what team-level posts were going out alongside company-wide content</li>' +
            '<li>No warning system to flag when multiple posts were targeting the same audience at the same time</li>' +
            '<li>No way to bulk-create a content plan — ideas had to be entered one at a time</li>' +
            '<li>The same content (the Manage section) was scattered across three different places in the product — the top-level Posts module, Team Posts, and the Company Posts page — with no consistent behaviour</li>' +
            '</ul>'
        },
        {
          title: 'Design Decisions',
          tocLabel: 'Decisions',
          content:
            '<p>The core design decision was to introduce a new content state — <strong>Post Idea</strong> — that sat upstream of Draft. This unlocked the planning layer without breaking existing publishing flows. A Post Idea has a title, description, audience, and optional planned publish date, but no post content yet. That single addition made the calendar meaningful: now there were three states to visualise (Idea, Draft, Scheduled), each with a distinct colour, and a clear progression from idea to published.</p>' +
            '<p>The second major decision was to consolidate. The existing Manage section — which duplicated itself across the Posts module, Team Posts, and the Company Posts page with slightly different behaviour each time — was replaced by a unified <strong>Planning</strong> filter that behaved consistently everywhere. Permissions determined what each user type could see rather than different structures for different contexts.</p>' +
            '<p>Role-based visibility was a significant constraint throughout. Domain admins, intranet admins, team admins, network users, and guest users all needed to see different subsets of the same data. The <strong>All Planned</strong> and <strong>My Planned</strong> filter split handled this cleanly: All Planned surfaces everything across the organisation for admins, My Planned surfaces only what the logged-in user owns, and both filters work identically in the top-level module, team module, and company posts page.</p>'
        },
        {
          title: 'What We Built',
          tocLabel: 'Solution',
          content:
            '<p><strong>Planning Filters</strong> — Two new filters replaced the Manage section across all three surfaces. All Planned is visible only to admins and shows the full picture: all drafts, all scheduled posts, and all post ideas. My Planned is visible to all users and shows only their own content in the same three states. The removal of the Manage section from the left-hand navigation tidied up a structural inconsistency that had existed across the product.</p>' +
            '<p><strong>Calendar View</strong> — Three view types: weekly (default), daily, and monthly. Weekly and daily views use 30-minute time slot intervals, with cards snapping to the nearest slot. Each content state has a fixed colour — yellow for scheduled, grey for draft, blue for ideas, red for overdue — independent of any branding settings, so the calendar is always legible regardless of how the domain is themed. A conflict warning system flags when two posts target the same audience at the same time, showing a red warning banner and per-card warning icons with a plain-language message explaining the issue.</p>' +
            '<p><strong>Post Ideas</strong> — A new lightweight content type created through a modal with title (mandatory), description, audience, and optional planned publish date. Ideas with a date appear on the calendar. Ideas without a date go into the Unplanned panel. Creating an idea is separate from creating a post — no template selection, no content editor, no commitment. Converting an idea to a post is a single action that opens the post creation flow with the title and audience pre-filled from the idea, and removes the idea from planning views once the editor is reached.</p>' +
            '<p><strong>Unplanned Panel</strong> — A right-hand side panel showing all drafts and ideas without a planned publish date. The count indicator at the top of the screen shows how many items are sitting unplanned. The panel supports drag-and-drop directly onto the calendar — dropping onto a weekly or daily view snaps to the nearest 30-minute slot, dropping onto the monthly view assigns 8:00 AM on the target date. Order within the unplanned panel is user-controlled and persists across sessions, so teams can prioritise ideas manually.</p>' +
            '<p><strong>Drag and Drop</strong> — Cards are draggable across all three calendar views and between the calendar and the unplanned panel. Dropping a scheduled post into the unplanned panel converts it to a draft and removes the scheduled date. Dropping a draft or idea onto the calendar assigns a planned publish date without changing its state. Dragging within the calendar updates the date and time only. The +x overflow indicator updates dynamically on every drop.</p>' +
            '<p><strong>List View</strong> — A tabular view of all planned content alongside the calendar, with sortable columns for title, status, audience, creator, and planned or scheduled date. Each row supports inline edit actions appropriate to the content state — drafts and scheduled posts open their existing edit flows, ideas open a lightweight edit modal. Bulk delete is available in the unplanned panel for clearing ideas in volume.</p>' +
            '<p><strong>CSV Import</strong> — Admins can bulk-import post ideas via a CSV file. Only the title is mandatory; all other fields (description, audience, planned publish date, planned publish time) are optional and silently ignored if invalid rather than failing the whole import. A sample template is downloadable. Import results show a plain-language summary of how many ideas were created and how many were skipped due to missing titles.</p>'
        },
        {
          title: 'Across the Product',
          tocLabel: 'Surfaces',
          content:
            'This feature spans three distinct surfaces within the same product — the top-level Posts module, the Team Posts module, and the Company Posts page — each with a different user base and permission model.\n\n' +
            'The calendar view is present in the first two but intentionally absent from the Company Posts page, which is list-only.\n\n' +
            'Responsive breakpoints were defined explicitly: above 1280px the unplanned panel and filter section can be open simultaneously, below 1280px opening one closes the other, below 1000px the calendar stops shrinking and the product follows its existing degraded behaviour. The Today button is hidden at or below 1200px to preserve calendar space.'
        },
        {
          title: 'Working with PM & Engineering',
          tocLabel: 'Collaboration',
          content:
            'The requirement came from the Product Manager, who owned the feature scope. Rather than moving straight to design, we went through several discussions to align on the right approach — particularly around where the planning layer should live within a product that already had drafts and scheduled posts scattered across three surfaces.\n\n' +
            'Multiple directions were considered before landing on the Planning filter as the consolidation point and Post Ideas as the new upstream content state.\n\n' +
            'Engineering was involved early to understand what was feasible within the existing UI. Those conversations directly shaped decisions like the fixed colour coding independent of branding, the responsive breakpoint behaviour, and the unplanned panel as a togglable overlay — ensuring the feature layered onto the existing product without disrupting what was already working.'
        },
        {
          title: 'Outcome',
          content:
            '<ul>' +
            '<li>Consolidates three separate Manage sections into a single consistent Planning filter that behaves identically across the Posts module, Team posts, and Company Posts page</li>' +
            '<li>Introduces Post Ideas as a net-new content state — enabling admins to capture and plan content before writing it, with a direct conversion path to a post that pre-fills all available fields</li>' +
            '<li>Conflict warning system proactively surfaces audience overlap before a post goes out, reducing uncoordinated publishing to the same user segment at the same time</li>' +
            '<li>Drag-and-drop scheduling removes the need to open and edit each post individually to change its planned date — a calendar drop updates date and time in a single interaction</li>' +
            '<li>CSV import allows bulk content planning — a full editorial calendar can be imported in one action rather than entered post by post</li>' +
            '<li>Overdue state (red) gives admins a passive signal that unactioned ideas and drafts are falling behind schedule, without requiring a separate audit</li>' +
            '</ul>'
        }
      ],
      images: [
        'assets/work/work-07.png',
        'assets/work/work-01.png',
        'assets/work/work-03.png',
        'assets/work/work-04.png',
        'assets/work/work-02.png',
        'assets/work/work-09.png',
        'assets/work/work-11.png',
        'assets/work/work-16.png'
      ]
    },
    {
      id: 'user-segment-based-dashboards',
      title: 'User Segment Based Dashboards',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      description:
        'Delivering personalized dashboard experiences for different employee groups within an enterprise intranet platform.',
      detailDescription:
        'A scalable dashboard management system — audience-targeted dashboards, delegated ownership, preview and publishing workflows, web and mobile experiences, and assignment hierarchy for users in multiple segments.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Intranet',
      sections: [
        {
          title: 'Background',
          content:
            'Enterprise organizations often have a diverse workforce made up of executives, leadership teams, office employees, and frontline workers. While all employees use the same platform, the information they need on a daily basis varies significantly based on their role and responsibilities.\n\n' +
            'On an enterprise intranet platform, this challenge is especially acute: one homepage experience cannot serve every employee group equally well.\n\n' +
            'The organization needed the ability to deliver different dashboard experiences to different groups of users. Leadership teams required access to strategic metrics and organizational insights, while frontline employees needed operational content, tasks, announcements, and resources relevant to their day-to-day work.\n\n' +
            'The goal was to create a scalable dashboard management system that allows administrators to create multiple dashboards, assign them to specific user segments, and ensure each employee receives the most relevant dashboard experience.'
        },
        {
          title: 'The Challenge',
          content:
            '<p>A single dashboard experience could not effectively serve the needs of every employee group across the organization. As organizations grow, different departments and user groups require different content, priorities, and layouts.</p>' +
            '<p>Specific problems:</p>' +
            '<ul>' +
            '<li>Executives, office employees, and frontline workers all received the same dashboard experience</li>' +
            '<li>Administrators had no way to create role-specific dashboard layouts</li>' +
            '<li>Dashboard ownership and management could not be delegated to specific administrators</li>' +
            '<li>Users belonging to multiple user segments required a clear dashboard assignment hierarchy</li>' +
            '<li>Organizations needed stronger governance around dashboard publishing and administration</li>' +
            '<li>Administrators lacked a way to preview dashboard experiences before publishing</li>' +
            '<li>Dashboard customization needed to support both web and mobile experiences</li>' +
            '<li>Enterprises required visibility into dashboard changes through audit logs and publishing records</li>' +
            '</ul>'
        },
        {
          title: 'Design Principles',
          tocLabel: 'Principles',
          content:
            '<p>The solution was built around the concept of dashboard-level audience targeting. Instead of creating a single universal dashboard, administrators can create multiple dashboards and assign each dashboard to a specific user segment.</p>' +
            '<p>A dashboard becomes the primary experience layer, while existing widget-level visibility controls continue to determine which content is shown inside that dashboard.</p>' +
            '<p>The design focused on four key principles:</p>' +
            '<ul>' +
            '<li><strong>Personalized experiences</strong> — Different employee groups should receive dashboards tailored to their needs and responsibilities</li>' +
            '<li><strong>Scalable administration</strong> — Organizations should be able to create, manage, publish, and govern multiple dashboards from a centralized location</li>' +
            '<li><strong>Flexible ownership</strong> — Dashboard administration should support delegated ownership without exposing every dashboard to every administrator</li>' +
            '<li><strong>Enterprise governance</strong> — Publishing, auditing, previewing, and dashboard assignment should provide transparency and control at scale</li>' +
            '</ul>'
        },
        {
          title: 'The System',
          tocLabel: 'Solution',
          content:
            '<p><strong>Dashboard Management</strong> — A dedicated dashboard management experience allows administrators to create and manage multiple dashboards from a single interface. Each dashboard includes a name, description, assigned user segment, ownership settings, status, and available actions. Administrators can create up to 25 dashboards within a domain.</p>' +
            '<p><strong>System Dashboard</strong> — A default system dashboard serves as the baseline experience for all users. The Default Network Users Dashboard is assigned to All Network Users, cannot be deleted or disabled, and cannot have its core properties modified — while still supporting widget management and publishing. This dashboard acts as the foundational experience across the platform.</p>' +
            '<p><strong>Custom Dashboards</strong> — Administrators can create audience-specific dashboards for different user groups — such as Executive, Finance, Customer Satisfaction, Sales Performance, Product Development, or Frontline Operations dashboards. Each dashboard is assigned to a single user segment, ensuring clear audience targeting and predictable behavior.</p>' +
            '<p><strong>Dashboard Ownership &amp; Permissions</strong> — A new ownership model controls who can manage individual dashboards: all dashboard administrators, specific dashboard administrators only, or network administrators only. This enables distributed ownership while maintaining centralized governance.</p>' +
            '<p><strong>Dashboard Creation Flow</strong> — Creating a dashboard includes name, description, user segment assignment, and ownership settings. User segment selection is limited to a single segment, ensuring a clear relationship between dashboards and their intended audience. New dashboards are created in an inactive state and can be enabled when ready.</p>' +
            '<p><strong>Widget Visibility</strong> — Dashboard visibility and widget visibility work together to determine the final user experience. A user must first have access to a dashboard before widget visibility rules are evaluated. Widgets can still define their own visibility conditions, allowing highly targeted experiences within a dashboard while maintaining clear access boundaries.</p>' +
            '<p><strong>Dashboard Preview</strong> — A dedicated preview mode allows administrators to validate dashboard experiences before publishing — including web and mobile previews, user segment simulation, and visibility validation — so admins understand exactly how dashboards will appear to different audiences.</p>' +
            '<p><strong>Publishing Experience</strong> — Publishing was redesigned for greater transparency and control. Administrators can review pending dashboard changes, view change summaries, publish web and mobile dashboards independently, and configure dashboard behavior settings — ensuring updates can be reviewed before rollout.</p>' +
            '<p><strong>Dashboard Configuration Modes</strong> — The system dashboard supports Fully Customizable mode (users can add, remove, resize, reposition, and duplicate widgets and customize titles) and Locked mode (only administrators can change layouts). Organizations choose the mode that matches their governance requirements.</p>' +
            '<p><strong>Override Dashboard Experience</strong> — Administrators can choose whether dashboard updates should override existing user customizations. When enabled, user customizations are replaced and updated layouts apply across all applicable users. When disabled, existing customizations remain intact and updates only affect users without customized dashboards.</p>' +
            '<p><strong>Dashboard Assignment Hierarchy</strong> — Users may belong to multiple user segments. Dashboards are evaluated from top to bottom; the first matching dashboard is assigned, then widget visibility rules are applied — creating a consistent assignment model across the platform.</p>' +
            '<p><strong>User Dashboard Overrides</strong> — Under My Settings → Branding, Navigation &amp; Dashboard, users can follow the assigned dashboard experience or select an alternative dashboard available to them — balancing administrative control with individual flexibility.</p>' +
            '<p><strong>Mobile Dashboard Experience</strong> — Dedicated support for mobile dashboards allows administrators to configure mobile-specific experiences, publish mobile updates independently, and preview mobile dashboards before publishing.</p>' +
            '<p><strong>Audit Logs</strong> — Dashboard activities are tracked through dedicated audit logs covering publishing, deletion, override actions, and administrative changes — providing visibility into dashboard lifecycle management.</p>'
        },
        {
          title: 'Platform Scope',
          tocLabel: 'Scope',
          content:
            'This feature spans several areas of the platform: Dashboard Administration, Dashboard Creation, Dashboard Management, Widget Configuration, Dashboard Preview, Dashboard Publishing, Mobile Dashboard Management, User Preferences, and Audit Logs.\n\n' +
            'The experience was designed to maintain consistency across both administrative and end-user workflows while supporting web and mobile dashboard experiences.'
        },
        {
          title: 'My Role',
          content:
            'The requirement was driven by customer needs around role-based dashboard experiences. I worked closely with the Product Manager to define how dashboard assignment, ownership, publishing, and visibility should function across different user groups.\n\n' +
            'Multiple approaches were explored before finalizing the dashboard hierarchy and administration model.\n\n' +
            'Throughout the process, I collaborated with engineering teams to understand platform constraints and ensure the solution integrated seamlessly with existing dashboard, widget, and publishing systems.'
        },
        {
          title: 'Outcome',
          content:
            '<ul>' +
            '<li>Enables personalized dashboard experiences for different employee groups</li>' +
            '<li>Allows organizations to create role-specific dashboard strategies at scale</li>' +
            '<li>Improves content relevance by delivering dashboards tailored to specific audiences</li>' +
            '<li>Provides flexible ownership and administration controls for dashboard governance</li>' +
            '<li>Supports both web and mobile dashboard experiences through a unified management system</li>' +
            '<li>Reduces publishing risk through preview and validation workflows</li>' +
            '<li>Establishes a predictable dashboard assignment model for users belonging to multiple user segments</li>' +
            '<li>Strengthens governance through audit logging and publishing controls</li>' +
            '<li>Creates a scalable framework for future personalization initiatives across the platform</li>' +
            '</ul>'
        }
      ],
      images: [
        'assets/work/work-08.png',
        'assets/work/work-10.png',
        'assets/work/work-05.png',
        'assets/work/work-06.png',
        'assets/work/work-12.png',
        'assets/work/work-15.png'
      ]
    },
    {
      id: 'object-review-approve-publish-workflow',
      title: 'Object Review, Approve & Publish Workflow',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      description:
        'Building a scalable content governance framework for enterprise content publishing.',
      detailDescription:
        'A reusable approval system on a generic workflow engine — centralized governance for Posts, Pages, Wikis, and Documents while preserving familiar creation flows for authors and approvers.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Governance',
      sections: [
        {
          title: 'Overview',
          content:
            'Organizations often require content to be reviewed and approved before publication to ensure quality, accuracy, and compliance. While the platform supported creating Posts, Pages, Wikis, Documents, and other content types, there was no unified approval framework that could govern all content consistently.\n\n' +
            'The objective was to design a reusable approval system that could be configured once and applied across multiple content types while keeping the content creation experience simple for authors and efficient for approvers.'
        },
        {
          title: 'The Challenge',
          content:
            '<p>Administrators needed the ability to configure approval workflows centrally, assign approvers for company-wide and team-specific content, support mandatory and optional approvals, ensure content could not be published without required approvals, automatically publish approved content, and maintain a complete audit trail of approvals and decisions.</p>' +
            '<p>Content creators needed to continue using existing editors and templates, create content without selecting approvers manually, track approval status, and receive feedback when changes were requested.</p>' +
            '<p>Approvers needed to review requests from a centralized location, preview content before making decisions, edit content when necessary, and approve, reject, or request changes.</p>' +
            '<p>The solution also needed to scale beyond Posts and support Pages, Wikis, Documents, and future content types.</p>'
        },
        {
          title: 'Design Exploration',
          tocLabel: 'Exploration',
          content:
            '<p>Before arriving at the final solution, four approaches were explored.</p>' +
            '<p><strong>Approach 1 — Global Content Approval Configuration</strong> — A dedicated Content Approval administration area where admins could enable approval for specific content types, configure settings globally, customize messages, and define user and team scopes. This was not selected: although simple administratively, approval rules were tightly coupled to content modules, offered limited flexibility for complex chains, and introduced duplicate configuration patterns.</p>' +
            '<p><strong>Approach 2 — Content Approval via Existing Trackers</strong> — Leveraged Trackers as the approval engine, allowing admins to create approval workflows from tracker workflows with approvers and routing. Benefits included reusing an existing system and greater flexibility than Approach 1. Challenges included workflow setup remaining heavily approval-centric, limited future extensibility, and difficulty supporting richer patterns beyond approvals.</p>' +
            '<p><strong>Approach 3 — Inform Workflow</strong> — Expanded beyond approvals to a broader workflow model supporting notifications, informational messages, and non-approval use cases. More flexible and broadly applicable, but introduced additional complexity, mixed approval with communication workflows, and increased the administrator learning curve.</p>' +
            '<p><strong>Approach 4 — Generic Workflow Engine (selected)</strong> — Built approval capabilities on top of a generic workflow framework powered by Trackers. Approvals became one type of workflow action within a larger ecosystem supporting approval actions, inform actions, conditional routing, multiple approvers, escalations, and future automation. This provided scalability across Posts, Pages, Wikis, Documents, Tasks, and future content types; flexibility for single, multiple, sequential, parallel, mandatory, and optional approvals; reusability as a platform capability; and future readiness for automation without major redesign.</p>'
        },
        {
          title: 'The Final Solution',
          tocLabel: 'Solution',
          content:
            '<p><strong>Workflow Configuration</strong> — Administrators create approval workflows through Trackers. Workflows define content type, approver assignments, approval requirements, routing conditions, notifications, and publish behavior. Approvers can be configured for company content, team content, and specific organizational groups.</p>' +
            '<p><strong>Content Creation Experience</strong> — Authors continue creating content through existing post editors, page builders, wiki editors, and document experiences. No workflow configuration is required during creation — the workflow is applied automatically behind the scenes.</p>' +
            '<p><strong>Approval Submission</strong> — When content is submitted, workflow rules are evaluated, approvers are identified, approval requests are generated automatically, and content enters a pending state.</p>' +
            '<p><strong>Approval Center</strong> — Approvers receive requests through a centralized experience where they can view pending requests, access approval history, review workflow status, and take action directly — without navigating back to the original content module.</p>' +
            '<p><strong>Preview Before Approval</strong> — Approvers can preview content exactly as it will appear after publication, supporting layout validation, content review, metadata verification, and final quality checks before making a decision.</p>' +
            '<p><strong>Edit Before Approval</strong> — Approvers can edit content directly during review — reducing approval cycles, back-and-forth communication, and minor revision requests while improving publishing speed. Designed consistently across Posts, Pages, Wikis, and Documents.</p>' +
            '<p><strong>Approval Actions</strong> — Approve moves content to the next workflow step or publishes automatically. Decline rejects content and records the reason. Request Changes returns content to the creator while preserving workflow history.</p>' +
            '<p><strong>Automatic Publishing</strong> — When all mandatory approvals are completed, workflow status is updated and content publishes automatically with no additional action required from the creator.</p>' +
            '<p><strong>Rollout Strategy</strong> — Phase 1 launched for Posts to validate workflow architecture, routing, approver experience, and publishing automation. Phase 2 expanded to Pages and Wikis using the same content-agnostic framework with minimal UX changes.</p>' +
            '<p><strong>Key Design Decisions</strong> — Preserve existing creation flows so authors do not learn a new publishing process; centralize governance administratively rather than at creation time; allow editing during review; design for expansion to future content types; and build once, reuse everywhere through a single workflow framework.</p>'
        },
        {
          title: 'Outcome',
          content:
            '<p>The final solution established a scalable content governance framework across the platform.</p>' +
            '<p><strong>Business impact</strong></p>' +
            '<ul>' +
            '<li>Standardized content approval processes across the platform</li>' +
            '<li>Improved compliance and governance</li>' +
            '<li>Reduced publishing errors</li>' +
            '<li>Faster review cycles</li>' +
            '<li>Centralized workflow management</li>' +
            '<li>Reusable architecture for future capabilities</li>' +
            '</ul>' +
            '<p><strong>User impact</strong></p>' +
            '<ul>' +
            '<li>Familiar content creation experience with no manual approver selection</li>' +
            '<li>Clear approval visibility for creators</li>' +
            '<li>Faster publishing turnaround</li>' +
            '<li>Consistent experience across multiple content types</li>' +
            '</ul>'
        },
        {
          title: 'My Role',
          content:
            'As Lead Product Designer, I led discovery and workflow architecture exploration, evaluated four different workflow approaches, and designed administrative workflow configuration experiences.\n\n' +
            'I defined creator, approver, and reviewer journeys and designed approval, rejection, request changes, and publishing flows.\n\n' +
            'I collaborated closely with Product and Engineering teams and helped establish the workflow framework that was first launched for Posts and later extended to Pages and Wikis using the same architecture.'
        }
      ],
      images: [
        'assets/work/work-01.png',
        'assets/work/work-03.png',
        'assets/work/work-04.png',
        'assets/work/work-07.png',
        'assets/work/work-09.png',
        'assets/work/work-11.png',
        'assets/work/work-14.png'
      ]
    },
    {
      id: 'centralized-task-management',
      title: 'Centralized Task Management',
      meta: 'SAAS · FEATURE CASE STUDY',
      size: 'wide',
      description:
        'Enterprise task orchestration for a SaaS intranet platform, built for a distributed front-line retail workforce',
      detailDescription:
        'V2 expansion of centralized task orchestration — tracker-to-task automation, user-level distribution, approval previews, role-scoped execution visibility, bulk audience selection, and admin-configurable task tabs — for distributed retail operations at scale.',
      year: '2024',
      category: 'Product Design',
      area: 'Enterprise SaaS / Productivity',
      sections: [
        {
          title: 'Background',
          content:
            'The platform is an enterprise intranet used by large organisations with distributed workforces. A major retail client with thousands of store locations uses it to coordinate operations across their front-line teams.\n\n' +
            'V1 of Centralized Task Management introduced the ability to push tasks to multiple store teams simultaneously from a central admin view. V2 was a significant expansion of that foundation, adding automation, user-level task distribution, approval workflows, richer visibility controls, bulk management, and a tracker-to-task pipeline that could eliminate manual task creation entirely.'
        },
        {
          title: 'Gaps in V1',
          tocLabel: 'Challenge',
          content:
            '<p>Coordinating operational tasks across hundreds of store locations required admins to either create tasks manually one team at a time, or work around the system using spreadsheets and messages. V1 solved the broadcast problem for team tasks but left critical gaps: there was no way to assign tasks to individual users at scale, no automation pipeline from tracker entries to tasks, no way to preview a task before approving a workflow that would create it, and site managers had no scoped visibility — they either saw everything or nothing.</p>' +
            '<p>Specific problems:</p>' +
            '<ul>' +
            '<li>No automated path from tracker entries to task creation — every task required manual setup regardless of how much structured data already existed in the tracker</li>' +
            '<li>Centralized tasks could only be assigned to teams, not to individual users, limiting use cases for user-specific accountability</li>' +
            '<li>The &quot;Create Workflow&quot; option in trackers only supported posting content — task creation required a separate, manual process</li>' +
            '<li>Site managers and area heads had no role-appropriate view — they couldn&apos;t see completion status for only the stores under their hierarchy without seeing the entire organisation&apos;s data</li>' +
            '<li>Bulk user and team selection had no segment or site-based filtering, making large-scale task assignment slow and error-prone</li>' +
            '<li>No way to preview what a task would look like before approving it through an approval workflow — approvers were working blind</li>' +
            '<li>Tab names, ordering, and visibility were fixed — large enterprise customers with custom naming conventions had no way to adapt the interface to their terminology</li>' +
            '</ul>'
        },
        {
          title: 'Key Decisions',
          tocLabel: 'Decisions',
          content:
            '<p>The central design decision was to make the tracker the source of truth for task creation. Rather than building a separate task-creation interface, the existing tracker workflow engine was extended with a new <strong>Create a Task</strong> action alongside the existing <strong>Publish a Post</strong> action. This meant the entire existing trigger, condition, and branching infrastructure was available for task automation immediately, and the cognitive model was already familiar to admins who had built post workflows.</p>' +
            '<p>The Setup Mapping dialog was the key interaction — it needed to translate structured tracker column data into task fields cleanly, handle both optional and required fields, auto-map by column name where possible, and surface validation errors clearly when required mappings were missing. The design had to communicate that only mapped fields would carry over, so admins understood exactly what the resulting task would contain before saving.</p>' +
            '<p>Role-based visibility was the other major constraint. Three distinct user groups — domain admins and authorised users, site managers and admins, and general network users — needed different scopes of the same data without any of those scopes leaking into each other. The Execution Status panel on the right-hand side became the place where this scoping was applied visibly: completion counts, team lists, and user lists all reflect only what the logged-in user is authorised to see.</p>' +
            '<p>Engineering was involved early to understand constraints on the existing workflow execution engine, the follow-list and file permission model for centralized task attachments, and how the existing Sites hierarchy could be reused for the new team selection filter rather than rebuilt.</p>'
        },
        {
          title: 'The V2 System',
          tocLabel: 'Solution',
          content:
            '<p><strong>Admin Settings</strong> — A new Centralized Tasks toggle in the Tasks admin settings controls the entire feature surface. When on, it exposes three permission tiers for who can create and manage centralised tasks: domain admins only, domain and intranet admins, or a specific set of users and user segments. A second new setting separately controls who can set up the &quot;Create a Task&quot; workflow action in trackers. Both settings default to domain and intranet admins. The Manage Tabs section gained a new dedicated tab, allowing admins to rename, reorder, enable, or disable all task tabs — including the new Centralized Tasks tab — with custom labels that apply across both global and team task views.</p>' +
            '<p><strong>Create a Task Workflow Action</strong> — The tracker workflow engine&apos;s Create/Publish Workflow type now surfaces &quot;Create a Task&quot; as an action option alongside &quot;Publish a Post.&quot; Selecting it reveals a required Mapping field with a Setup button that opens the Setup Mapping dialog. The dialog maps ten tracker columns to task fields — Title, Description, Teams/Users, Type, From User, Priority, Start Date, End Date, Checklist, and Attachments — with auto-matching by column name where possible. Required fields (Title, Description, Teams/Users, Type, From User) are validated on save. The workflow then branches into &quot;If Task Creation Successful&quot; and &quot;If Task Creation Failed&quot; blocks, each supporting Update Column Value, Send Message, and Perform Row Action as follow-on actions. A Task URL value option in URL-type columns lets admins write the created task&apos;s link back into the tracker automatically on success.</p>' +
            '<p><strong>Centralized Team and User Tasks</strong> — Users with permission to create centralised tasks now see a Browse button in the task creation dialog for both team and user selection, enabling multi-select. Selecting multiple teams creates a centralised team task with child tasks linked to a parent. Selecting multiple users creates a centralised user task — a net-new capability — following the same parent-child structure. The Browse dialog for users gained a Persona (user segment) filter. The Browse dialog for teams gained a Sites filter that surfaces the existing site hierarchy, replacing the previous Site Task radio button which has been removed from the creation flow.</p>' +
            '<p><strong>Centralized Tasks Tab</strong> — The tab shows all centralised tasks in the left-hand list with title, status, start date, due date, and a completion percentage that reflects the scope of the logged-in user. Clicking a task opens the right-hand panel with two tabs: Execution Status and Details. Execution Status for team tasks shows the team count, completion percentage, and a searchable list of teams with per-team actions. Execution Status for user tasks shows the user count, completion percentage, and a searchable list of users with per-user actions including a direct message action that opens a pre-populated DM to the responsible user. Site managers see only the teams and users under their site hierarchy in all counts, lists, and percentages — their view is automatically scoped without any additional configuration.</p>' +
            '<p><strong>Task Preview in Approval Workflows</strong> — When a Create a Task workflow is connected to an approval workflow, a Preview Task button appears in both the DM approval message and the tracker entry approval popup, alongside the existing Approve and Decline actions. Clicking Preview opens a structured preview popup showing the task as it would be created, populated from the tracker values mapped in the workflow. This gives approvers full context before committing. If any required mapped field is missing in the tracker entry, clicking Preview shows an error dialog rather than an incomplete preview.</p>' +
            '<p><strong>Export Insights</strong> — All users with access to the Centralized Tasks tab can export an XLS report from the Task Tools menu. The export respects the logged-in user&apos;s scope — site managers receive data only for teams and users under their sites, domain admins receive data for all. The report includes task title, ID, type, priority, dates, creator details, team and user counts, pending and completed counts, and execution percentage. A notification is sent when the report is ready for download.</p>'
        },
        {
          title: 'Across Modules',
          tocLabel: 'Surfaces',
          content:
            'The feature spans the admin portal (settings), the tracker module (workflow creation and approval), the tasks module (centralized tab, task creation, execution status), and the messaging module (approval DMs and task update notifications).\n\n' +
            'Each surface had different interaction density and user roles — the admin portal needed to expose complex permission logic cleanly, the workflow builder needed to extend an existing familiar pattern without disrupting it, and the tasks tab needed to serve three distinct user roles from the same screen through scoped data rather than separate views.\n\n' +
            'Responsive behaviour below 1000px followed existing platform degradation patterns.'
        },
        {
          title: 'Working with PM & Engineering',
          tocLabel: 'Collaboration',
          content:
            'The requirement came from the Product Manager, who brought the full feature scope and worked closely throughout to align on approach — particularly around how the tracker-to-task automation pipeline should be structured and where role-based visibility boundaries should fall.\n\n' +
            'Multiple directions were discussed before settling on extending the existing workflow engine rather than building a separate task automation path.\n\n' +
            'Engineering was involved early to understand the constraints of the existing file permission model, the Sites hierarchy data structure, and what was feasible within the tracker workflow execution engine. Those conversations shaped decisions like the Follow List behaviour for centralised task attachments, the decision to reuse the Sites filter rather than rebuild site selection, and the branching structure of the If Successful / If Failed workflow blocks.'
        },
        {
          title: 'Outcome',
          content:
            '<ul>' +
            '<li>Automates task creation end-to-end: a tracker entry matching a workflow condition can now create a centralised task, write the task URL back to the tracker, and update a status column — without any manual intervention</li>' +
            '<li>Extends centralised task distribution from teams only to individual users — enabling user-level accountability at scale across hundreds of locations</li>' +
            '<li>Site managers and area heads gain a scoped, role-appropriate view of completion data without requiring separate data exports or admin intervention</li>' +
            '<li>Task preview in approval workflows gives approvers full context before committing — reducing misapproved tasks created from incomplete tracker entries</li>' +
            '<li>Persona and Sites filters in bulk selection dialogs reduce the time to select the right audiences for large-scale task rollouts</li>' +
            '<li>Admin-configurable tab names and ordering allows enterprise customers to align the task module&apos;s language with their own operational terminology</li>' +
            '</ul>'
        }
      ],
      images: [
        'assets/work/work-14.png',
        'assets/work/work-17.png',
        'assets/work/work-18.png',
        'assets/work/work-16.png',
        'assets/work/work-12.png',
        'assets/work/work-13.png',
        'assets/work/work-15.png',
        'assets/work/work-19.png'
      ]
    },
    {
      id: 'buuzz-app',
      title: 'Buuzz App',
      meta: 'MOBILE · PRODUCT DESIGN',
      size: 'wide',
      description: 'Dock-free e-bike sharing app for Indian cities.',
      year: '2022',
      category: 'Mobile Design',
      area: 'Mobility / Consumer App',
      sections: [
        {
          title: 'The Brief',
          content:
            'Urban Indians face a broken last-mile commute — too far to walk, too expensive to cab.\n\n' +
            'Buuzz is a dock-free electric bike sharing platform targeting dense city neighbourhoods in India, where affordability and regulatory compliance both matter.'
        },
        {
          title: 'User Pain Points',
          tocLabel: 'Pain Points',
          content:
            'Existing shared-mobility apps failed Indian users through complicated registration, no real-time bike visibility, opaque pricing that caused bill shock, and zero guidance on where to park — leading to penalties users did not expect.\n\n' +
            'Specific problems:\n\n' +
            '- KYC compliance had no clear step structure, causing drop-off\n' +
            '- Pricing was revealed only after committing to a ride\n' +
            '- Bike battery and range were not shown before selection\n' +
            '- Zone-based parking rules were not communicated until violation'
        },
        {
          title: 'Design Principles',
          tocLabel: 'Principles',
          content:
            'Designed for one-handed use in a moving urban context.\n\n' +
            'Broke onboarding into two psychologically distinct stages — identity (KYC) and commitment (wallet funding) — so users never felt ambushed.\n\n' +
            'Chose OTP-only auth to remove password friction for low-digital-literacy users.'
        },
        {
          title: 'End-to-End Flows',
          tocLabel: 'Flows',
          content:
            'Onboarding — Sign up → OTP → KYC → Wallet\n\n' +
            'Structured KYC into explicit steps with progress and “what happens next” copy, then separated wallet funding so pricing never felt like a surprise mid-ride.\n\n' +
            'Discovery — Zone map → Bike list → QR unlock\n\n' +
            'Map-first discovery with live availability, plus a bike list that surfaces battery and estimated range before selection so riders can choose confidently.\n\n' +
            'Active Ride — Live tracking + cost meter\n\n' +
            'During the ride, live route tracking pairs with a running cost meter and clear next actions, keeping riders oriented while moving.\n\n' +
            'End Ride — Zone guidance + penalty prevention\n\n' +
            'Parking guidance is proactive: zone rules surface before riders commit to a stop, with interventions that prevent penalty-triggering misparks.\n\n' +
            'Post-ride — Summary + chip-based feedback\n\n' +
            'A concise ride summary reinforces what was charged and why, with lightweight chip feedback to capture sentiment without a heavy survey.'
        },
        {
          title: 'Mobile-First Design',
          tocLabel: 'Mobile',
          content:
            'Mobile-first experience tuned for dense urban contexts: bright daylight readability, large tap targets, and progressive disclosure for complex rules.\n\n' +
            'Designed map-first discovery with a fast path to unlock once a rider has confidence in cost, range, and parking expectations.'
        },
        {
          title: 'Working with Product & Engineering',
          tocLabel: 'Collaboration',
          content:
            'Partnered closely with product and engineering to align on compliance checkpoints, pricing transparency, and map/zone constraints early.\n\n' +
            'Pressure-tested edge cases around failed KYC, low wallet balance, out-of-zone parking, and interrupted rides.'
        },
        {
          title: 'Results',
          content:
            '- Onboarding reduced to under 5 minutes including KYC\n' +
            '- Pricing shown at 3 touchpoints before any payment\n' +
            '- Zone parking intervention prevents penalty-triggering misparks\n' +
            '- Battery + range shown pre-selection, reducing post-unlock regret'
        }
      ],
      images: [
        'assets/work/work-14.png',
        '',
        'assets/work/work-04.png',
        'assets/work/work-11.png',
        'assets/work/work-17.png',
        'assets/work/work-09.png',
        'assets/work/work-16.png',
        'assets/work/work-02.png',
        'assets/work/work-18.png'
      ]
    },
    {
      id: 'yugen-brand-identity',
      title: 'Yugen',
      meta: 'BRANDING · VISUAL IDENTITY',
      size: 'wide',
      description: 'Brand identity for a full-stack AI and ML services company',
      detailDescription:
        'Delivered a complete brand system from zero — wordmark, colour, type, illustration system, and website architecture — for an engineering-first ML company shipping models to production.',
      year: '2024',
      category: 'Brand Identity',
      area: 'Branding / AI Services',
      sections: [
        {
          title: 'Brand Context',
          tocLabel: 'Context',
          content:
            'Yugen is an early-stage AI and machine learning services company founded in 2020. They build and deploy full-stack ML systems for enterprises across fintech, retail, adtech, supply chain, edtech, and more. Their positioning is deliberate and specific — they are an engineering company that ships models to production, not a consultancy that stops at prototypes.\n\n' +
            'The name "Yugen" references a Japanese concept describing a profound, mysterious sense of the universe — chosen to reflect the depth and possibility that AI unlocks. The brand needed to make that philosophy felt, not just stated.'
        },
        {
          title: 'What Needed Solving',
          tocLabel: 'Challenge',
          content:
            '<p>An early-stage B2B tech company in the ML space faces a specific credibility problem: the market is saturated with firms making similar claims, the buyers are highly technical and skeptical of surface-level polish, and the company had no existing visual language to distinguish itself. Everything — the logo, the site, the illustration system, the design language — needed to be built from zero.</p>' +
            '<p>Specific problems the branding had to solve:</p>' +
            '<ul>' +
            '<li>Yugen needed to feel simultaneously technical and thoughtful — engineering rigour without the cold sterility common in B2B tech brands</li>' +
            '<li>The identity had to work across a website with deeply varied content types: long-form ML case studies, a technical blog, an industry navigator, and a careers section targeting senior engineers</li>' +
            '<li>Illustrations were needed to make abstract ML concepts (data pipelines, anomaly detection, recommendation engines, fraud prevention) visually communicable without being reductive or clip-art generic</li>' +
            '<li>The company serves enterprise clients but operates as a startup — the brand had to project maturity without pretending to be something it wasn&apos;t yet</li>' +
            '</ul>'
        },
        {
          title: 'Creative Direction',
          tocLabel: 'Direction',
          content:
            'The central brand question was: what does a company that believes in responsible, engineering-first AI actually look like? The answer drove every decision — away from the aggressive, futuristic visual language common in AI branding (dark gradients, glowing neural nets, circuit-board textures) and toward something more considered, precise, and human.\n\n' +
            'The name itself became a design constraint. Yugen — the Japanese aesthetic of profound, mysterious awareness — suggested a brand that was intelligent and layered rather than loud. That meant restraint in the wordmark, depth in the illustration system, and a site architecture that rewarded careful reading rather than skimming.\n\n' +
            'The target audience being technical meant the brand couldn’t rely on vague aspiration. Every visual choice needed to feel earned — grounded in what the company actually does rather than what AI companies typically look like.'
        },
        {
          title: 'Brand System',
          tocLabel: 'System',
          content:
            '<p><strong>Logo</strong> — The wordmark was built to be clean and precise, reflecting the engineering-first identity. The "ai" lockup sits as a distinct element alongside the Yugen name — present enough to signal the company&apos;s domain without reducing the entire brand to a technology label. The mark needed to hold up at small sizes across the site, in favicons, document headers, and social contexts.</p>' +
            '<p><strong>Colour and Typography</strong> — The palette and type system were chosen to feel authoritative without being corporate. The visual language needed to carry both a long-form ML research article and a homepage hero without feeling inconsistent across those two extremes.</p>' +
            '<p><strong>Illustration System</strong> — The most distinctive brand challenge. Abstract ML concepts — fraud detection, recommendation engines, demand forecasting, data pipelines — needed visual expression that was explanatory without being literal. The illustration style was built to communicate process and intelligence: showing relationships, flows, and patterns rather than metaphors like brains or robots. These illustrations appear throughout the website, within case study pages, and in the insights section.</p>' +
            '<p><strong>Website</strong> — The site was the primary brand expression surface. Navigation architecture, section hierarchy, and content layout all carried the brand thinking: philosophy before services, proof before claims, depth over decoration. The homepage leads with the positioning statement and immediately grounds it in four named production ML systems. The case studies section is filterable by industry and business goal — a structural choice that reflects how an enterprise buyer actually thinks. The careers section breaks from B2B convention entirely, using a direct and human tone that signals the startup culture deliberately.</p>' +
            '<p><strong>Look and Feel</strong> — The overall system was built to scale. A company publishing ML case studies, technical insights, job descriptions, and industry-specific content simultaneously needs a visual language that holds coherence across wildly different content types. The grid system, spacing, component patterns, and illustration usage were all defined to give the team a repeatable foundation rather than a fixed set of pages.</p>'
        },
        {
          title: 'Applied Across Surfaces',
          tocLabel: 'Surfaces',
          content:
            'The brand system was applied across three distinct surfaces, each with different constraints. The website was the primary surface — desktop-first for enterprise buyers doing deep evaluation, with a mobile experience that needed to preserve the positioning clarity at reduced information density.\n\n' +
            'The illustration system was designed to function both at full-page scale on the website and at smaller card or thumbnail scale within case study listings and the insights blog.\n\n' +
            'The logo and wordmark were built to function across digital-first contexts: site header, favicon, social profiles, and document use.'
        },
        {
          title: 'With the Founding Team',
          tocLabel: 'Collaboration',
          content: "Worked directly with Yugen's founding team on brand strategy."
        },
        {
          title: 'Outcome',
          content:
            '<ul>' +
            '<li>Delivered a complete brand system from zero — logo, colour, type, illustration style, and site — for a company with no prior visual identity</li>' +
            '<li>Illustration system made abstract ML service categories visually distinct and communicable without reducing them to generic tech metaphors</li>' +
            '<li>Website architecture reflects buyer intent: case studies filterable across 12 industries and multiple business goals, reducing time-to-relevant-content for enterprise visitors</li>' +
            '<li>Careers section tone and design directly targets senior ML engineers — specific enough in technical requirements to filter quality, human enough in culture writing to attract people who could work anywhere</li>' +
            '<li>Brand system was built to scale with the company — a repeatable visual language rather than a fixed deliverable, giving the team a foundation to extend independently</li>' +
            '</ul>'
        }
      ],
      images: [
        'assets/work/work-19.png',
        'assets/work/work-15.png',
        'assets/work/work-13.png',
        'assets/work/work-12.png',
        'assets/work/work-10.png',
        'assets/work/work-08.png',
        'assets/work/work-06.png',
        'assets/work/work-05.png'
      ]
    }
  ];

  // Expose on window for other scripts
  if (typeof window !== 'undefined') {
    window.PORTFOLIO_WORKS = WORKS;
  }
})();


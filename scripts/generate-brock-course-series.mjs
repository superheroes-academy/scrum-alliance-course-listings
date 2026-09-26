import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const trainerCopy = `
  <section class="section white" aria-labelledby="trainer-heading">
    <div class="wrap trainer-layout">
      <img class="trainer-photo" src="images/BrockArgue1.jpg" alt="Brock Argue">
      <div class="trainer-copy">
        <p class="section-label">Meet your trainer</p>
        <h2 id="trainer-heading">Brock Argue</h2>
        <p>Brock is a Scrum Alliance Certified Scrum Trainer, Certified Enterprise Coach, and Certified Team Coach, as well as an ICF Professional Certified Coach and ORSC-trained systems coach. He brings more than two decades of experience in software development, leadership, facilitation, training, and organizational coaching.</p>
        <p>He has supported agile journeys at organizations including the Federal Reserve Bank of New York, WestJet Airlines, ADP, Suncor Energy, Benevity, and the Calgary Public Library. His courses combine clear models, realistic decisions, and deliberate practice so learners can transfer the work into their own context.</p>
        <div class="trainer-links">
          <a href="https://superheroes.academy/" target="_blank" rel="noopener">Superheroes Academy</a>
          <a href="https://www.fusefacilitation.ca/" target="_blank" rel="noopener">FUSE Facilitation</a>
        </div>
      </div>
    </div>
  </section>`;

const courses = [
  {
    slug: "agile-okrs-brock",
    title: "Agile OKRs",
    titleAccent: "Align strategy, teams, and outcomes.",
    eyebrow: "Scrum Alliance microcredential · 4 live hours",
    description: "Turn strategy into measurable outcomes without turning OKRs into another command-and-control scorecard.",
    badge: "images/microcredentials/sa-agile_okrs-300.png",
    theme: "gold",
    store: "https://www.superheroes.academy/store/p/okrs",
    official: "https://www.scrumalliance.org/microcredentials/agile-okrs",
    promise: "Build OKRs that align teams, invite ownership, and remain useful when conditions change.",
    outcomes: [
      ["Separate ambition from activity", "Distinguish objectives, outcomes, outputs, and key results so measures describe progress rather than busyness."],
      ["Connect strategy to teams", "Translate strategic direction into aligned team-level goals without cascading tasks or removing autonomy."],
      ["Write and test an OKR set", "Create an OKR set from a realistic scenario, compare its quality, and improve the alignment and evidence."],
      ["Use OKRs with Scrum", "Explore how OKRs can support empiricism, Product Goals, and planning without becoming a competing framework."],
      ["Spot common antipatterns", "Recognize vanity metrics, output targets, overloaded scorecards, and incentive traps before they distort behaviour."],
      ["Create a practical cadence", "Leave with a lightweight approach for reviewing progress, learning, and adapting goals."],
    ],
    modules: [["Frame", "Clarify the strategy, context, and difference between activity and impact."], ["Create", "Write objectives and measurable key results using a shared scenario."], ["Challenge", "Stress-test alignment, ambition, evidence, and unintended behaviour."], ["Adapt", "Integrate OKRs with Scrum and build a sustainable review rhythm."]],
    audience: ["Product owners and product managers", "Scrum masters and agile coaches", "Leaders and managers", "Strategy and transformation professionals", "Cross-functional teams", "Anyone responsible for turning priorities into outcomes"],
    advanced: false,
  },
  {
    slug: "agile-consulting-brock",
    title: "Coaching High-Performance Teams That Deliver",
    titleAccent: "Increase your impact by coaching the team system.",
    eyebrow: "Scrum Alliance Agile Consulting microcredential · 8 live hours",
    description: "Practice professional coaching and systemic team interventions that help teams see their own patterns and choose their next move.",
    badge: "images/microcredentials/sa-coaching_high-performing_teams-300.png",
    theme: "violet",
    store: "https://www.superheroes.academy/store/p/agile-consulting",
    official: "https://www.scrumalliance.org/microcredentials/agile-consulting-coaching-high-performance-teams-that-deliver",
    promise: "Move beyond process advice and learn to reveal the forces shaping team performance.",
    outcomes: [
      ["Coach with intent", "Practice individual coaching skills, purposeful questions, and accountability that preserve client ownership."],
      ["See the whole team", "Diagram a team system to make relationships, roles, feedback loops, and hidden dynamics discussable."],
      ["Intervene without taking over", "Use professional coaching techniques that help a team reflect, learn, and choose its own response."],
      ["Give empowering feedback", "Deliver specific, non-judgmental observations that increase awareness without prescribing the answer."],
      ["Turn patterns into options", "Facilitate team sense-making so multiple perspectives become a co-owned set of possible moves."],
      ["Build a consulting stance", "Know when to coach, when to offer expertise, and how to contract clearly before shifting stance."],
    ],
    modules: [["Observe", "Notice behaviour and system signals without rushing to diagnosis."], ["Map", "Make team dynamics visible through systemic diagramming."], ["Coach", "Practice conversations that create reflection and accountability."], ["Integrate", "Choose an ethical intervention and connect it to measurable team learning."]],
    audience: ["Agile practitioners moving into coaching", "Scrum masters ready to deepen their impact", "Agile coaches preparing for the future CAC", "Team coaches and facilitators", "Agile leaders working with team systems", "Consultants supporting sustainable team performance"],
    advanced: true,
  },
  {
    slug: "organizational-agility-brock",
    title: "Organizational Agility",
    titleAccent: "Choose your stance. Build capability.",
    eyebrow: "Advanced Scrum Alliance microcredential · 8 live hours",
    description: "Develop the self-mastery to move fluidly between coaching, mentoring, teaching, and advising while protecting trust and client agency.",
    badge: "images/microcredentials/sa-coaching_adaptive_systems-300.png",
    theme: "blue",
    store: "https://www.superheroes.academy/store/p/organizational-agility",
    official: "https://www.scrumalliance.org/microcredentials/organizational-agility-coaching-adaptive-systems-in-complex-environments",
    promise: "Replace autopilot interventions with conscious choices grounded in context, ethics, and productive struggle.",
    outcomes: [
      ["Master the stance dance", "Move between coaching, mentoring, teaching, and advising without breaking rapport or creating confusion."],
      ["Contract before directing", "Establish explicit agreements and professional boundaries before offering a more directive intervention."],
      ["Give actionable feedback", "Turn observed behaviour into non-judgmental feedback that protects psychological safety."],
      ["Diagnose struggle", "Distinguish productive struggle from destructive struggle and respond proportionately."],
      ["Build capability", "Choose interventions that help people learn to solve problems rather than becoming dependent on the coach."],
      ["Plan your development", "Create a measurable professional growth plan tied to the capabilities you most need to strengthen."],
    ],
    modules: [["Notice", "Identify your default stance and what triggers it."], ["Contract", "Make purpose, boundaries, and permission explicit."], ["Practice", "Work through continuous scenarios and receive behavioural feedback."], ["Develop", "Translate insight into a focused coaching development plan."]],
    audience: ["Practicing agile coaches", "Scrum masters expanding their coaching range", "Product owners supporting team growth", "Managers and leaders in complex environments", "Agile coaches preparing for the future CAC", "Facilitators who want stronger intervention judgment"],
    advanced: true,
  },
  {
    slug: "optimizing-value-streams-brock",
    title: "Optimizing Value Streams",
    titleAccent: "Turn friction into flow.",
    eyebrow: "Advanced Scrum Alliance microcredential · 8 live hours",
    description: "Stop guessing what to improve. Use value streams, flow evidence, and outcome measures to identify constraints and prove impact.",
    badge: "images/microcredentials/sa-optimizing_value_stream_updated-300.png",
    theme: "green",
    store: "https://www.superheroes.academy/store/p/optimizing-value-streams",
    official: "https://www.scrumalliance.org/microcredentials/optimizing-value-streams-turn-friction-into-flow",
    promise: "Connect team work to customer and business outcomes, then design experiments around the friction that matters most.",
    outcomes: [
      ["Focus on outcomes", "Distinguish outputs from outcomes and select evidence that reflects customer and business impact."],
      ["Map actual flow", "Analyze current and future value streams across teams and functions to surface delays and handoffs."],
      ["Find the constraint", "Use Lean principles and flow metrics to identify where work waits, ages, and loses value."],
      ["Match the strategy", "Apply a complexity lens so the improvement approach fits the nature of the problem."],
      ["Validate hypotheses", "Use meaningful value measures instead of vanity metrics to test whether an intervention helped."],
      ["Tell the story with data", "Communicate technical quality, flow health, and business impact in language stakeholders can use."],
    ],
    modules: [["Purpose", "Clarify the outcomes and value the system exists to create."], ["Flow", "Map work across boundaries and expose friction."], ["Experiment", "Choose an improvement strategy suited to the context."], ["Evidence", "Measure impact and tell a credible story with data."]],
    audience: ["Agile coaches measuring organizational value", "Product owners and product managers", "Scrum masters using Lean thinking", "Leaders connecting delivery to strategy", "Continuous-improvement professionals", "Agile coaches preparing for the future CAC"],
    advanced: true,
  },
  {
    slug: "enterprise-agility-brock",
    title: "Enterprise Agility",
    titleAccent: "Align culture and structure to deliver results.",
    eyebrow: "Advanced Scrum Alliance microcredential · 8 live hours",
    description: "Use systems thinking, organizational assessment, and adaptive change strategies to address the structures and patterns that constrain agility.",
    badge: "images/microcredentials/sa-enterprise_agility-300.png",
    theme: "coral",
    store: "https://www.superheroes.academy/store/p/enterprise-agility",
    official: "https://www.scrumalliance.org/microcredentials/enterprise-agility-aligning-culture-structure-to-deliver-results",
    promise: "Move beyond transformation recipes and learn to design interventions that respond to evidence from the whole system.",
    outcomes: [
      ["Assess the system", "Apply systems-thinking principles to design an organizational assessment and identify meaningful patterns."],
      ["Connect culture and structure", "Analyze how formal structures, incentives, policies, and everyday behaviour reinforce one another."],
      ["Work with resistance", "Treat resistance as information and formulate interventions that address the source rather than the symptom."],
      ["Plan adaptively", "Design an iterative change roadmap with experiments, feedback loops, and useful measures."],
      ["Balance autonomy and alignment", "Examine organizational boundaries and product alignment to improve value delivery."],
      ["Sustain the change", "Develop learning structures such as communities of practice and internal coaching capability."],
    ],
    modules: [["Assess", "Gather evidence about patterns, constraints, and feedback loops."], ["Interpret", "Connect structure, culture, safety, and value delivery."], ["Intervene", "Design targeted experiments and resistance-aware strategies."], ["Sustain", "Build learning structures that continue without external dependence."]],
    audience: ["Agile coaches and consultants", "Leaders navigating organizational friction", "Change agents designing adaptive strategies", "Scrum masters and product owners influencing systems", "Organizational designers", "Agile coaches preparing for the future CAC"],
    advanced: true,
  },
  {
    slug: "coaching-for-change-brock",
    title: "Coaching for Change",
    titleAccent: "Make agility work across the system.",
    eyebrow: "Scrum Alliance microcredential · 4 live hours",
    description: "Learn to coach relationships, roles, and patterns across a team or organization rather than treating each person as an isolated problem.",
    badge: "images/microcredentials/coaching-for-change_300-x-300.png",
    theme: "plum",
    store: "https://www.superheroes.academy/store/p/coaching-for-change",
    official: "https://www.scrumalliance.org/microcredentials/coaching-for-change",
    promise: "Use systems coaching to reveal what the system cannot yet see and help it choose healthier ways of working.",
    outcomes: [
      ["Define the system", "Clarify who and what belongs in the system you are coaching and what sits outside the current boundary."],
      ["Enter with intention", "Create agreements and a coaching stance that serve the whole system rather than one person’s preferred story."],
      ["Reveal patterns", "Help the system notice recurring dynamics, communication loops, and assumptions without assigning blame."],
      ["Work with roles", "Explore how formal, informal, and hidden roles shape behaviour and decision-making."],
      ["Navigate conflict", "Use conflict as information and support more direct, constructive conversation across differences."],
      ["Serve the whole", "Design next steps that strengthen adaptability, alignment, and shared ownership."],
    ],
    modules: [["Define", "Name the system, boundaries, stakeholders, and purpose."], ["Reveal", "Surface patterns and relationships the system cannot easily see."], ["Explore", "Work with roles, power, and conflict as system data."], ["Serve", "Help the system choose an experiment it owns."]],
    audience: ["Scrum masters supporting multiple teams", "Agile coaches deepening systems practice", "Team leads and engineering managers", "Product owners improving cross-team collaboration", "HR and transformation professionals", "Leaders sponsoring systemic change"],
    advanced: false,
  },
  {
    slug: "coaching-for-transformation-brock",
    title: "Coaching for Transformation",
    titleAccent: "Sustain change after the launch.",
    eyebrow: "Scrum Alliance microcredential · 4 live hours",
    description: "Explore change management, systems thinking, culture, structure, and capability-building through the lens of sustainable agile transformation.",
    badge: "images/microcredentials/sa-coaching_for_transformation-300.png",
    theme: "blue",
    store: "https://www.superheroes.academy/store/p/coaching-for-transformation",
    official: "https://www.scrumalliance.org/microcredentials/coaching-for-transformation-sustaining-change",
    promise: "Design change that becomes part of how the organization learns, rather than a temporary initiative that fades when attention moves on.",
    outcomes: [
      ["Frame change realistically", "Connect change-management concepts with transparency, inspection, adaptation, and evidence of success."],
      ["Think systemically", "Map stakeholders, structures, mindsets, practices, and culture as an interconnected change system."],
      ["Work with culture", "Assess cultural patterns and create conditions for experimentation, diverse perspectives, and learning."],
      ["Redesign enabling structures", "Explore how finance, HR, policies, team boundaries, and funding choices influence behaviour."],
      ["Use practices for complexity", "Shift from prediction and imposition toward experiments, feedback, and co-created solutions."],
      ["Build internal capacity", "Coach people and communities of practice so the organization can sustain learning without dependence."],
    ],
    modules: [["Understand", "Connect agile transformation with practical change-management foundations."], ["Map", "See culture, structure, policy, and stakeholder concerns as one system."], ["Evolve", "Design experiments and enabling conditions for complex change."], ["Sustain", "Build client ownership and internal capability."]],
    audience: ["Agile coaches and practitioners", "Teams involved in agile transformation", "Leaders supporting system-wide change", "HR, finance, and operations professionals", "Change agents and transformation leads", "Anyone responsible for sustaining agility"],
    advanced: false,
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCourse(course) {
  const outcomeCards = course.outcomes.map(([title, description]) => `
        <article class="outcome-card"><strong>${esc(title)}</strong><span>${esc(description)}</span></article>`).join("");
  const learningSteps = course.modules.map(([title, description]) => `
        <article class="learning-step"><h3>${esc(title)}</h3><p>${esc(description)}</p></article>`).join("");
  const audience = course.audience.map((item) => `<li>${esc(item)}</li>`).join("");
  const series = course.advanced ? `
      <div class="series-callout">
        <div><h3>Part of our CAC-ready advanced consulting series</h3><p>This course develops capabilities aligned with Scrum Alliance's emerging Certified Agility Consultant direction. CAC eligibility, assessment, and final pathway requirements remain subject to Scrum Alliance.</p></div>
        <span class="pill">CAC-ready</span>
      </div>` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(course.description)} Live online with Brock Argue and Superheroes Academy.">
  <title>${esc(course.title)} with Brock Argue | Superheroes Academy</title>
  <link rel="stylesheet" href="css/brock-course-series.css">
</head>
<body data-theme="${course.theme}">
<div class="page-shell">
  <header class="credential-banner">
    <img src="images/BrockArgue-csm-header-v3.png" alt="Brock Argue, Certified Scrum Trainer, with professional coaching and agile training credentials. Superheroes Academy: Practice. Reflect. Grow. Repeat.">
  </header>

  <main>
    <section class="hero" aria-labelledby="course-title">
      <div class="wrap hero-grid">
        <div>
          <p class="eyebrow">${esc(course.eyebrow)}</p>
          <h1 id="course-title">${esc(course.title)}<br><span>${esc(course.titleAccent)}</span></h1>
          <p class="lead">${esc(course.description)}</p>
          <div class="cta-row">
            <a class="cta" href="${course.store}" target="_blank" rel="noopener">Explore dates and register</a>
            <a class="cta secondary" href="${course.official}" target="_blank" rel="noopener">View the Scrum Alliance credential</a>
          </div>
        </div>
        <aside class="badge-panel">
          <img src="${course.badge}" alt="${esc(course.title)} microcredential badge">
          <p class="fact-line">Live online · English · No formal prerequisites</p>
        </aside>
      </div>
    </section>

    <section class="section white" aria-labelledby="promise-heading">
      <div class="wrap">
        <p class="section-label">Practical by design</p>
        <h2 id="promise-heading">${esc(course.promise)}</h2>
        <p class="intro">Expect a highly interactive learning experience built around decisions, practice, feedback, and reflection. You will work with realistic situations, compare approaches with peers, and leave with tools you can use immediately.</p>
        <div class="outcome-grid">${outcomeCards}
        </div>
        ${series}
      </div>
    </section>

    <section class="section tint" aria-labelledby="experience-heading">
      <div class="wrap">
        <p class="section-label">The learning experience</p>
        <h2 id="experience-heading">Learn the model. Test it. Make it yours.</h2>
        <div class="learning-path">${learningSteps}
        </div>
      </div>
    </section>

    <section class="section dark" aria-labelledby="audience-heading">
      <div class="wrap audience-layout">
        <div>
          <p class="section-label">Who it is for</p>
          <h2 id="audience-heading">Built for people who influence how work gets done.</h2>
          <p>You do not need a particular job title. Bring a real context, curiosity, and a willingness to practise.</p>
        </div>
        <ul class="audience-list">${audience}</ul>
      </div>
    </section>

    ${trainerCopy}

    <section class="section" aria-labelledby="guarantee-heading">
      <div class="wrap guarantee">
        <div class="guarantee-mark" aria-hidden="true">◎</div>
        <div><h2 id="guarantee-heading">100% money-back guarantee.</h2><p>Participate fully and complete the course. If the experience does not deliver meaningful value, tell us before the session ends and we will refund your course fee.</p></div>
      </div>
    </section>

    <section class="section white" aria-labelledby="faq-heading">
      <div class="wrap">
        <p class="section-label">Questions</p>
        <h2 id="faq-heading">Frequently asked questions</h2>
        <div class="faq-list">
          <details><summary>What is included?</summary><p>Live instruction, collaborative practice, course materials, the Scrum Alliance microcredential upon successful completion, and a two-year Scrum Alliance membership or membership extension.</p></details>
          <details><summary>Is the course lecture-based?</summary><p>No. Short teaching moments are followed by scenarios, paired or small-group practice, reflection, and facilitated debriefs.</p></details>
          <details><summary>Do I need prior experience?</summary><p>There are no formal prerequisites. For advanced courses, prior agile coaching experience or earlier Scrum Alliance coaching learning is strongly recommended so you can work at depth.</p></details>
          <details><summary>What do I need for the virtual class?</summary><p>A computer with a camera and microphone, stable internet, and the ability to use Zoom and Mural. A second monitor is helpful but not required.</p></details>
          <details><summary>Can my organization register a private group?</summary><p>Yes. Contact <a href="mailto:info@superheroes.academy">info@superheroes.academy</a> for private delivery, group pricing, invoices, or accessibility needs.</p></details>
        </div>
      </div>
    </section>

    <section class="section dark final-cta" aria-labelledby="final-heading">
      <div class="wrap">
        <p class="section-label">Practice. Reflect. Grow. Repeat.</p>
        <h2 id="final-heading">Ready to turn insight into action?</h2>
        <p>Choose a live cohort and build capability through practice with Brock Argue and Superheroes Academy.</p>
        <a class="cta" href="${course.store}" target="_blank" rel="noopener">Explore dates and register</a>
      </div>
    </section>
  </main>

  <footer class="footer">Superheroes Academy · Calgary, Alberta, Canada · <a href="mailto:info@superheroes.academy">info@superheroes.academy</a></footer>
</div>
</body>
</html>`.replace(/[ \t]+$/gm, "");
}

for (const course of courses) {
  fs.writeFileSync(path.join(root, `${course.slug}.html`), renderCourse(course), "utf8");
}

console.log(`Generated ${courses.length} Brock course listing pages.`);

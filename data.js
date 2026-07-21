/* =============================================================
   EDIT EVERYTHING ABOUT YOUR SITE HERE — this is the only file
   you need to touch to change your name, projects, or contacts.
   ============================================================= */

/* ---------- 0. DEFAULTS ----------
   What a first-time visitor sees (they can still toggle either from the nav bar).
   theme:     "dark" or "light"
   particles: true  -> falling particles start ON
              false -> start OFF */
const SETTINGS = {
  theme: "light",
  particles: true,
};

/* ---------- 1. YOU ---------- */
const PROFILE = {
  name: "Ikram Jeelani",
  initials: "IJ", // shown top-left AND as the browser-tab icon (kept in sync)
  role: "Engineering Portfolio",
  bio: "",
};

/* ---------- 1b. RESUME / CV ----------
   A button in the nav bar (between the theme and particles toggles), always
   present from the first load. Clicking it opens the SAME in-page PDF viewer
   used for certifications — visitors see it without leaving the site.
   `show`:  true -> button appears. false -> hidden, no button at all.
   `label`: the text shown next to the icon.
   `url`:   path to your resume PDF. Put the file in assets/ (e.g.
            "assets/Resume.pdf") and point url at it — same as a certification's
            `url`, a GitHub "blob" link also works and is resolved automatically. */
const RESUME = {
  show: true,
  label: "Résumé", // text shown next to the icon
  url: "assets/Resume.pdf",
};

/* ============================================================================
   PAGE LAYOUT  (order + visibility)

   This single list controls BOTH the order the sections appear in AND which
   ones show up:
     • REORDER the page → just reorder the lines below.
     • HIDE a section   → delete (or comment out) its line.
     • A section also hides automatically if it has no content yet, so you can
       leave a line here and it simply won't appear until you fill that section.

   Valid keys: "about", "experience", "projects", "skills",
               "certifications", "education", "contact"
   ============================================================================ */
const SECTIONS = [
  "about",
  "experience",
  "projects",
  "skills",
  "certifications",
  "education",
  "contact",
];

/* ---------- 2. ABOUT ----------
   A short intro paragraph shown near the top. Plain text (you may use simple
   HTML like <strong>…</strong> if you want). */
const ABOUT =
  "I started engineering for the freedom it offers. With enough " +
  "knowledge, you're limited only by your own imagination. That pursuit of " +
  "capability is what drew me to mechatronics and the challenge of building " +
  "complete systems from the ground up. " +
  "Today, I enjoy working across the full stack of a system: mechanical design, " +
  "electronics, control systems, and software. " +
  "My goal is to become a design engineer in the robotics and automation industry, developing " +
  "intelligent systems that bridge mechanical, electrical, and software engineering. Away from engineering, " +
  "you'll usually find me gaming, watching cricket, or searching for great food.";

/* ---------- 3. EXPERIENCE ----------
   ADD/REMOVE a role by copying or deleting a { ... } block.
   `location` + `date` show on the left of the timeline (like education).
   `points` is optional — leave it as [] for none.
   `tech`   is optional — tags for the tech used in the job (shown under the details).
   `logo`   is optional — a company logo (put the file in assets/). "" = none. */
const EXPERIENCE = [
  {
    role: "Engineering Intern",
    company: "Acme Robotics",
    location: "Dubai, UAE",
    date: "Summer 2024",
    logo: "assets/Logos/siemens_logo.jpg", // e.g. "assets/acme.png"
    points: [
      "Built automated test fixtures that cut QA time by ~30%.Built automated test fixtures that cut QA time by ~30%.",
      "Wrote firmware for a sensor-calibration rig used across the team.",
    ],
    tech: ["C", "Python", "STM32"],
  },
  {
    role: "Undergraduate Researcher",
    company: "University Lab",
    location: "Burnaby, BC",
    date: "2023 - 2024",
    logo: "assets/Logos/siemens_logo.jpg", // e.g. "assets/lab.png"
    points: [
      "Investigated low-power wireless protocols for distributed sensor networks.",
    ],
    tech: ["LoRa", "Python", "Embedded C"],
  },
];

/* ---------- 4. SKILLS ----------
   Each group is a category with a list of items (shown as tags).
   ADD/REMOVE a category or an item by editing the arrays. */
const SKILLS = [
  {
    category: "Programming",
    items: ["C", "C++", "Python", "MATLAB"],
  },
  {
    category: "Mechanical Design, Analysis & Manufacturing",
    items: ["SOLIDWORKS", "Fusion 360", "Cura", "FDM 3D Printing"],
  },
  {
    category: "Electronics & Embedded Systems",
    items: [
      "Arduino",
      "PCB design (KiCad/Altium)",
      "LTspice",
      "Soldering",
      "Multimeter",
      "Oscilloscopes",
    ],
  },
  {
    category: "Controls & Automations",
    items: ["PID Control", "Sensors & Actuators", "Simulink"],
  },
  {
    category: "Tools",
    items: ["Git/Github", "MS Office"],
  },
];

/* ---------- 5. CERTIFICATIONS ----------
   Shown as a responsive card grid.
   `logo` (optional): an issuer/company logo shown on the card (no certificate scan
       is displayed). Put the file in assets/, e.g. "assets/siemens.png". "" = none.
   `url`  (optional): link to the credential ("View Credential"). "" = none. */
const CERTIFICATIONS = [
  {
    name: "Siemens Mechatronic Systems Certification Program (SMSCP) Assistant",
    issuer: "Siemens",
    date: "Sep 2024",
    logo: "assets/Logos/siemens_logo.jpg", // e.g. "assets/siemens.png"
    url: "assets/Certifications/SMSCP-Assistant.pdf",
  },
  {
    name: "Altium Education - PCB Basic Design Course",
    issuer: "Altium",
    date: "Nov 2025",
    logo: "assets/Logos/altium_logo.jpg",
    url: "assets/Certifications/Altium Education - PCB Basic Design Course.pdf",
  },
  {
    name: "Certified SOLIDWORKS Design Associate (CSWA)",
    issuer: "Dassault Systèmes",
    date: "May 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    url: "assets/Certifications/CSWA.pdf",
  },
  {
    name: "Certified SOLIDWORKS Design Professional (CSWP)",
    issuer: "Dassault Systèmes",
    date: "Jun 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    url: "assets/Certifications/CSWP.pdf",
  },
  {
    name: "Certified SOLIDWORKS Additive Manufacturing Associate (CSWA-AM)",
    issuer: "Dassault Systèmes",
    date: "Jun 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    url: "assets/Certifications/CSWA_AM.pdf",
  },
  {
    name: "MATLAB Onramp",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    url: "assets/Certifications/MATLAB Onramp.pdf",
  },
];

/* ---------- 5b. EDUCATION ----------
   `school`            the university name (shown as the heading)
   `location` + `date` shown together under the school, e.g. "Surrey, BC · 2021 - 2025"
   `degree`            normal lead-in text, e.g. "Bachelor of Engineering (Honours) in"
   `major`             the field of study — shown with a glowing gradient effect
   `details`           optional list of bullet points (one string per point)
   `logo`              optional university logo. */
const EDUCATION = [
  {
    school: "University of Wollongong in Dubai",
    location: "Dubai, UAE",
    date: "2026 - 2027",
    degree: "Bachelor of Engineering (Honours) in",
    major: "Mechatronic Engineering",
    details: ["Transfer student from Simon Fraser University."],
    logo: "assets/Logos/university_of_wollongong_in_dubai_logo.jpg",
  },
  {
    school: "Simon Fraser University",
    location: "Burnaby, BC",
    date: "2024 - 2025",
    degree: "Bachelor of Applied Science (Honours) in",
    major: "Mechatronic Systems Engineering",
    details: [
      "Dean's Honours List - Fall 2025",
      "President's Honours List - Fall 2025",
    ],
    logo: "assets/Logos/simon_fraser_university_logo.jpg",
  },
];

/* ============================================================================
   6. PROJECTS

   Each project has two parts:
   • CARD/HEADER fields:  id, title, image, date, tagline, tech, links
        (date is a free-text string, e.g. "Jan 24 - May 24" — omit it to hide it)
   • body:  the free-form "in-depth" content shown on the project page.
            Write whatever you want here using the building blocks below.

   --- BODY BUILDING BLOCKS (copy/paste these into a project's `body`) ---------
   Text:
     <h2>Section heading</h2>
     <h3>Smaller heading</h3>
     <p>A paragraph. Use <strong>bold</strong>, <em>italic</em>,
        a <a href="https://...">link</a>, or <code>inline code</code>.</p>
     <ul><li>Bullet point</li><li>Another</li></ul>
     <ol><li>First step</li><li>Second step</li></ol>
     <blockquote>A pulled-out quote or key takeaway.</blockquote>
     <div class="callout">A highlighted note / tip box.</div>

   Images (put image files in the assets/ folder):
     <img src="assets/my-photo.jpg" alt="What it shows">          (normal, centered)
     <img class="full" src="assets/my-photo.jpg" alt="...">       (edge-to-edge)
     <figure>
       <img src="assets/my-photo.jpg" alt="...">
       <figcaption>A caption under the image.</figcaption>
     </figure>
     <div class="gallery">                                         (grid of images)
       <img src="assets/a.jpg" alt=""><img src="assets/b.jpg" alt="">
     </div>

   Video (YouTube/Vimeo embed — use the "embed" URL):
     <div class="video">
       <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
     </div>
   Or a local video file:
     <video class="full" controls src="assets/demo.mp4"></video>

   Side-by-side blocks:
     <div class="two-col">
       <div><h3>Left</h3><p>...</p></div>
       <div><h3>Right</h3><p>...</p></div>
     </div>

   TIP: write the body between the backticks ` ... `. Just avoid typing a lone
   backtick (`) or the characters ${ inside it, since those have special meaning.
   ----------------------------------------------------------------------------

   ADD a project:    copy a whole { ... } block and edit it.
   REMOVE a project:  delete its { ... } block.
   Each project needs a unique `id` (used in the URL, no spaces).
   ============================================================================ */
const PROJECTS = [
  {
    id: "smart-thermostat",
    title: "Smart Thermostat Controller",
    image: "assets/project1.svg",
    date: "Jan 24 - May 24",
    tagline: "Embedded firmware for an energy-aware HVAC system",
    tech: ["C", "STM32", "FreeRTOS", "PID Control"],
    links: [
      {
        label: "View Code",
        url: "https://github.com/IkramJeelani/smart-thermostat",
      },
    ],
    // ↓↓↓ This is your free-form "Notion-like" page. Edit it however you like. ↓↓↓
    body: `
      <p>A low-power thermostat that learns occupancy patterns and reduces energy
      use by up to <strong>20%</strong>. This page shows the building blocks you can
      use — replace it all with your own content.</p>

      <div class="callout">
        Tip: drop your real photos into the <code>assets/</code> folder and point the
        <code>src</code> at them, e.g. <code>assets/thermostat.jpg</code>.
      </div>

      <h2>The hardware</h2>
      <figure>
        <img src="assets/project1.svg" alt="Thermostat prototype">
        <figcaption>Replace this with a photo of your build.</figcaption>
      </figure>

      <h2>How it works</h2>
      <p>Designed the firmware on an STM32 microcontroller running FreeRTOS, with a
      PID control loop for precise temperature regulation.</p>
      <ul>
        <li>Scheduling engine that adapts to household routines</li>
        <li>Wi-Fi module for remote control and OTA firmware updates</li>
        <li>Aggressive low-power modes to minimise standby draw</li>
      </ul>

      <h2>Demo</h2>
      <div class="video">
        <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Demo" allowfullscreen></iframe>
      </div>

      <h2>Results</h2>
      <div class="two-col">
        <div>
          <h3>Before</h3>
          <p>Manual schedule, ~15% wasted heating overnight.</p>
        </div>
        <div>
          <h3>After</h3>
          <p>Learned schedule cut overnight waste to near zero.</p>
        </div>
      </div>

      <blockquote>"The best project teaches you something you didn't expect." — me, probably.</blockquote>
    `,
  },
  {
    id: "bridge-sensor-net",
    title: "Bridge Structural Sensor Network",
    image: "assets/project2.svg",
    date: "Jun 24 - Sep 24",
    tagline: "Wireless strain monitoring for civil infrastructure",
    tech: ["Python", "LoRa", "Raspberry Pi", "InfluxDB", "Grafana"],
    links: [
      {
        label: "View Code",
        url: "https://github.com/IkramJeelani/bridge-sensor-net",
      },
      { label: "Live Demo", url: "#" },
    ],
    body: `
      <p>A distributed sensor network that monitors structural strain on bridges and
      flags anomalies in real time.</p>

      <h2>Architecture</h2>
      <ul>
        <li>Mesh of LoRa-connected strain-gauge nodes</li>
        <li>Raspberry Pi gateway running a Python ingestion pipeline</li>
        <li>Time-series storage in InfluxDB, live dashboards in Grafana</li>
      </ul>

      <img src="assets/project2.svg" alt="System diagram">

      <h2>Alerting</h2>
      <p>Threshold-based alerts notify maintenance teams the moment readings exceed
      safe limits.</p>
    `,
  },
  {
    id: "robotic-arm",
    title: "6-DOF Robotic Arm",
    image: "assets/project3.svg",
    date: "Oct 24 - Dec 24",
    tagline: "Inverse kinematics and motion planning from scratch",
    tech: ["C++", "ROS", "OpenCV", "Arduino"],
    links: [
      {
        label: "View Code",
        url: "https://github.com/IkramJeelani/robotic-arm",
      },
    ],
    body: `
      <p>A six-degree-of-freedom robotic arm capable of picking and placing objects
      identified by a camera.</p>

      <h2>What I built</h2>
      <ul>
        <li>Inverse-kinematics solver written in C++</li>
        <li>Computer vision with OpenCV to detect and locate objects</li>
        <li>ROS coordinating perception, planning, and Arduino motor control</li>
      </ul>

      <div class="gallery">
        <img src="assets/project3.svg" alt="">
        <img src="assets/project1.svg" alt="">
      </div>
    `,
  },
  {
    id: "robotic-armm",
    title: "6-DOF Robotic Armm",
    image: "assets/project3.svg",
    date: "Oct 24 - Dec 24",
    tagline: "Inverse kinematics and motion planning from scratch",
    tech: ["C++", "ROS", "OpenCV", "Arduino"],
    links: [
      {
        label: "View Code",
        url: "https://github.com/IkramJeelani/robotic-arm",
      },
    ],
    body: `
      <p>A six-degree-of-freedom robotic arm capable of picking and placing objects
      identified by a camera.</p>

      <h2>What I built</h2>
      <ul>
        <li>Inverse-kinematics solver written in C++</li>
        <li>Computer vision with OpenCV to detect and locate objects</li>
        <li>ROS coordinating perception, planning, and Arduino motor control</li>
      </ul>

      <div class="gallery">
        <img src="assets/project3.svg" alt="">
        <img src="assets/project1.svg" alt="">
      </div>
    `,
  },
  {
    id: "robotic-armmm",
    title: "6-DOF Robotic Armmmm",
    image: "assets/project3.svg",
    date: "Oct 24 - Dec 24",
    tagline: "Inverse kinematics and motion planning from scratch",
    tech: ["C++", "ROS", "OpenCV", "Arduino"],
    links: [
      {
        label: "View Code",
        url: "https://github.com/IkramJeelani/robotic-arm",
      },
    ],
    body: `
      <p>A six-degree-of-freedom robotic arm capable of picking and placing objects
      identified by a camera.</p>

      <h2>What I built</h2>
      <ul>
        <li>Inverse-kinematics solver written in C++</li>
        <li>Computer vision with OpenCV to detect and locate objects</li>
        <li>ROS coordinating perception, planning, and Arduino motor control</li>
      </ul>

      <div class="gallery">
        <img src="assets/project3.svg" alt="">
        <img src="assets/project1.svg" alt="">
      </div>
    `,
  },
];

/* ---------- 7. CONTACTS ----------
   ADD a contact:    copy a { ... } line and edit it.
   REMOVE a contact:  delete its line.
   Use a "mailto:" url for email; https links open in a new tab.   */
const CONTACTS = [
  { label: "Email", url: "mailto:ikram.jeelani05@hotmail.com" },
  { label: "GitHub", url: "https://github.com/IkramJeelani" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/ikramjeelani/" },
];

/* ---- (no need to edit below this line) ---- */
window.SETTINGS = SETTINGS;
window.SECTIONS = SECTIONS;
window.PROFILE = PROFILE;
window.RESUME = RESUME;
window.ABOUT = ABOUT;
window.EXPERIENCE = EXPERIENCE;
window.SKILLS = SKILLS;
window.CERTIFICATIONS = CERTIFICATIONS;
window.EDUCATION = EDUCATION;
window.PROJECTS = PROJECTS;
window.CONTACTS = CONTACTS;

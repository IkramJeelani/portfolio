/* =============================================================
   EDIT EVERYTHING ABOUT YOUR SITE HERE — this is the only file
   you need to touch to change your name, projects, or contacts.
   ============================================================= */

/* ---------- 0. DEFAULTS ----------
   What a first-time visitor sees (they can still toggle the theme from the nav bar).
   theme: "dark" or "light" */
const SETTINGS = {
  theme: "light",
};

/* ---------- 1. YOU ---------- */
const PROFILE = {
  name: "Ikram Jeelani",
  initials: "IJ", // shown top-left AND as the browser-tab icon (kept in sync)
  role: "Mechatronic Engineering Student",
  bio: "",
  // Shown beside the About text under your name. Put the file in assets/,
  // e.g. "assets/me.jpg". "" (or false) = no photo — About is then centered
  // instead of split into a left text / right photo layout.
  photo: "assets/my_image.jpeg",
};

/* ---------- 1b. RESUME / CV ----------
   A button in the nav bar, next to the theme toggle, always present from
   the first load. Clicking it opens the SAME in-page PDF viewer
   used for certifications — visitors see it without leaving the site.
   `show`:  true -> button appears. false -> hidden, no button at all.
   `label`: the text shown next to the icon.
   `url`:   path to your resume PDF. Put the file in assets/ (e.g.
            "assets/Resume.pdf") and point url at it — same as a certification's
            `url`, a GitHub "blob" link also works and is resolved automatically. */
const RESUME = {
  show: false,
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

   Valid keys: "experience", "projects", "skills",
               "certifications", "education", "contact"
   (About isn't listed here — it's shown in the hero, under your name, not
   as its own section; see ABOUT + PROFILE.photo below.)
   ============================================================================ */
const SECTIONS = [
  //"experience",
  "projects",
  "skills",
  "certifications",
  "education",
  "contact",
];

/* ---------- 2. ABOUT ----------
   Shown in the hero, right under your name — text on the left, PROFILE.photo
   on the right (or centered if you haven't set a photo). Plain text (you may
   use simple HTML like <strong>…</strong> if you want). Leave it "" to hide
   this block entirely. */
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
    items: ["Python", "MATLAB"],
  },
  {
    category: "Mechanical Design, Analysis & Manufacturing",
    items: ["SOLIDWORKS", "Fusion 360", "FDM 3D Printing"],
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
   `logo`    (optional): an issuer/company logo shown on the card. Put the file in
       assets/, e.g. "assets/siemens.png". "" = none.
   `preview` (optional): an image of the certificate itself, shown across the top of
       the card like a project thumbnail. "" = card just shows the logo/name/date, no
       preview strip. A screenshot of the credential's first page works well — put it
       in assets/, e.g. "assets/Certifications/previews/cswa.jpg".
   `url`  (optional): link to the credential PDF. "" = none.
   `hasPdf` (boolean): set true if you have the credential PDF (in `url`). When true,
       a small open-in icon shows in the card's top-right corner, the card is
       clickable (opens the PDF), and it gets the hover/tilt effect. Set false for a
       cert you earned but don't have a PDF for yet — the icon and interactivity are
       hidden and the card is just a static tile. */
const CERTIFICATIONS = [
  {
    name: "Siemens Mechatronic Systems Certification Program (SMSCP) Assistant",
    issuer: "Siemens",
    date: "Sep 2024",
    logo: "assets/Logos/siemens_logo.jpg", // e.g. "assets/siemens.png"
    preview: "assets/Certifications/previews/SMSCP-Assistant.jpg",
    url: "assets/Certifications/SMSCP-Assistant.pdf",
    hasPdf: true,
  },
  {
    name: "Altium Education - PCB Basic Design Course",
    issuer: "Altium",
    date: "Nov 2025",
    logo: "assets/Logos/altium_logo.jpg",
    preview: "assets/Certifications/previews/Altium Education - PCB Basic Design Course.jpg",
    url: "assets/Certifications/Altium Education - PCB Basic Design Course.pdf",
    hasPdf: true,
  },
  {
    name: "Certified SOLIDWORKS Design Associate (CSWA)",
    issuer: "Dassault Systèmes",
    date: "May 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    preview: "assets/Certifications/previews/CSWA.jpg",
    url: "assets/Certifications/CSWA.pdf",
    hasPdf: true,
  },
  {
    name: "Certified SOLIDWORKS Design Professional (CSWP)",
    issuer: "Dassault Systèmes",
    date: "Jun 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    preview: "assets/Certifications/previews/CSWP.jpg",
    url: "assets/Certifications/CSWP.pdf",
    hasPdf: true,
  },
  {
    name: "Certified SOLIDWORKS Additive Manufacturing Associate (CSWA-AM)",
    issuer: "Dassault Systèmes",
    date: "Jun 2026",
    logo: "assets/Logos/Dassault_Systèmes_logo.jpg",
    preview: "assets/Certifications/previews/CSWA_AM.jpg",
    url: "assets/Certifications/CSWA_AM.pdf",
    hasPdf: true,
  },
  {
    name: "MATLAB Onramp",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    preview: "assets/Certifications/previews/MATLAB Onramp.jpg",
    url: "assets/Certifications/MATLAB Onramp.pdf",
    hasPdf: true,
  },
  {
    name: "Simulink Onramp",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    preview: "assets/Certifications/previews/Simulink Onramp.jpg",
    url: "assets/Certifications/Simulink Onramp.pdf",
    hasPdf: true,
  },
  {
    name: "Control Design Onramp with Simulink",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    preview: "assets/Certifications/previews/Control Design Onramp with Simulink.jpg",
    url: "assets/Certifications/Control Design Onramp with Simulink.pdf",
    hasPdf: true,
  },
  {
    name: "Simscape Onramp",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    preview: "assets/Certifications/previews/Simscape Onramp.jpg",
    url: "assets/Certifications/Simscape Onramp.pdf",
    hasPdf: true,
  },
  {
    name: "Multibody Simulation Onramp",
    issuer: "MathWorks",
    date: "Jul 2026",
    logo: "assets/Logos/MathWorks_logo.jpg",
    preview: "assets/Certifications/previews/Multibody Simulation Onramp.jpg",
    url: "assets/Certifications/Multibody Simulation Onramp.pdf",
    hasPdf: true,
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

   A project's actual data (title, image, tech, links, body, etc.) does NOT
   live in this file — each project has its own folder under assets/Projects/
   with a project-data.js file that registers itself into window.PROJECT_DATA.
   This keeps data.js from ballooning as more projects (and longer write-ups)
   get added.

   This array is the ONLY thing about projects that lives in data.js: it's
   just a list of ids controlling which projects appear and in what order.

   ADD a project:
     1. Copy an existing folder under assets/Projects/ (e.g. the one below)
        and edit its project-data.js (field docs are there — id, title,
        image, date, tagline, tech, links, share, body). See the BODY
        BUILDING BLOCKS below for what to write in `body`.
     2. Add a <script src="assets/Projects/<your-folder>/project-data.js">
        tag in BOTH index.html and project.html, next to the existing one
        (must load before main.js / project.js).
     3. Add its id to the array below.
   REORDER:  reorder the ids below.
   REMOVE:   delete its id below (and, if you want it fully gone, its script
             tag + folder too).

   --- BODY BUILDING BLOCKS (copy/paste these into a project's body) --------
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

   TIP: in an inline `body` string (not a bodyFile), avoid typing a lone
   backtick (`) or the characters ${ — they have special meaning there.
   ----------------------------------------------------------------------------
   ============================================================================ */
const PROJECT_ORDER = ["dc-motor-speed-controller-using-8051-mcu"];

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
window.PROJECT_ORDER = PROJECT_ORDER;
window.CONTACTS = CONTACTS;

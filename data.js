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

   Each project has two parts:
   • CARD/HEADER fields:  id, title, image, date, tagline, tech, links, share
        (id is OPTIONAL — leave it out and it's generated from title
         automatically, lowercased with dashes instead of spaces, e.g.
         "My Cool Project" -> "my-cool-project". This is also the project's
         URL (project.html?id=...), so only set id by hand if you want that
         URL to stay fixed even after you reword the title later — otherwise
         a title edit changes the URL, which breaks any link/bookmark to it.)
        (date is a free-text string, e.g. "Jan 24 - May 24" — omit it to hide it)
        (share: true/false — not tied to anything on the site yet, just a
         plain per-project flag for your own reference/future use.)
   • body / bodyFile:  the free-form "in-depth" content shown on the project page.
            Write whatever you want here using the building blocks below. Two ways
            to provide it:
              - `body`: an inline template string, right here in this file. Fine
                for a short write-up.
              - `bodyFile`: a path to an external .html file (e.g. put it at
                assets/Projects/<your-folder>/body.html) containing just the body
                markup — no <html>/<body> wrapper needed. Keeps this file from
                growing huge once you have a longer write-up or several projects.
                Fetched at page-load time, so it only works when served over
                http(s) (e.g. via a local dev server or GitHub Pages) — opening
                project.html directly as a file:// URL won't load it.
            If both are set, `body` wins.

   --- BODY BUILDING BLOCKS (copy/paste these into a project's `body`/bodyFile) ---------
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
   Each project needs a unique `title` (its `id` — and URL — come from that,
   see above, unless you set an explicit `id`).
   ============================================================================ */
const PROJECTS = [
  {
    id: "dc-motor-speed-controller-using-8051-mcu",
    title: "DC Motor Speed Controller using 8051 MCU",
    image: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/display.jpg",
    date: "Nov 25 - Dec 25",
    tagline: "Closed-loop PWM fan-speed control on an 8051 microcontroller",
    tech: ["8051", "PWM", "Closed-Loop Control", "C"],
    links: [
      { label: "View Report", url: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/report.pdf" },
      { label: "View Code", url: "https://github.com/IkramJeelani/portfolio/blob/main/assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/dc-motor-speed-controller.c" },
    ],
    share: true,
    // Long-form body content lives in body.html next to the project's other
    // assets instead of inline here — keeps this file from ballooning as
    // more projects with long write-ups get added. project.js fetches it.
    bodyFile: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/body.html",
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

// Fills in any project's missing `id` from its `title` — lowercased, with
// runs of anything that isn't a letter/number collapsed to a single dash
// (leading/trailing dashes trimmed). Runs before main.js/project.js, so
// they only ever see the final id and don't need to know it was derived.
(function fillProjectIds() {
  const slugify = (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  (PROJECTS || []).forEach((p) => {
    if (!p.id) p.id = slugify(p.title);
  });
})();

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

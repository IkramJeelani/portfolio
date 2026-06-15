/* =============================================================
   EDIT EVERYTHING ABOUT YOUR SITE HERE — this is the only file
   you need to touch to change your name, projects, or contacts.
   ============================================================= */

/* ---------- 1. YOU ---------- */
const PROFILE = {
  name: "Ikram Jeelani",
  initials: "IJ", // shown top-left AND as the browser-tab icon (kept in sync)
  role: "Engineering Portfolio",
  bio:
    "Engineer building thoughtful hardware & software. Below are a few projects " +
    "I'm proud of — click any card to dive deeper.",
};

/* ---------- 2. ABOUT ----------
   A short intro paragraph shown near the top. Plain text (you may use simple
   HTML like <strong>…</strong> if you want). */
const ABOUT =
  "I'm an engineer who enjoys taking ideas from a schematic all the way to working " +
  "hardware. I care about clean, reliable systems and understanding the 'why' behind " +
  "every design decision.";

/* ---------- 3. EXPERIENCE ----------
   ADD/REMOVE a role by copying or deleting a { ... } block.
   `points` is optional — leave it as [] for none. */
const EXPERIENCE = [
  {
    role: "Engineering Intern",
    company: "Acme Robotics",
    date: "Summer 2024",
    points: [
      "Built automated test fixtures that cut QA time by ~30%.",
      "Wrote firmware for a sensor-calibration rig used across the team.",
    ],
  },
  {
    role: "Undergraduate Researcher",
    company: "University Lab",
    date: "2023 - 2024",
    points: [
      "Investigated low-power wireless protocols for distributed sensor networks.",
    ],
  },
];

/* ---------- 4. SKILLS ----------
   Each group is a category with a list of items (shown as tags).
   ADD/REMOVE a category or an item by editing the arrays. */
const SKILLS = [
  { category: "Languages", items: ["C", "C++", "Python", "JavaScript"] },
  { category: "Tools & Frameworks", items: ["ROS", "FreeRTOS", "Git", "Grafana"] },
  { category: "Hardware", items: ["STM32", "Arduino", "Raspberry Pi", "PCB Design"] },
];

/* ---------- 5. CERTIFICATIONS ----------
   `url` is optional — set it to "" for no link. */
const CERTIFICATIONS = [
  { name: "Certified LabVIEW Associate Developer", issuer: "NI", date: "2024", url: "" },
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon", date: "2023", url: "" },
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
      { label: "View Code", url: "https://github.com/IkramJeelani/smart-thermostat" },
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
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Demo" allowfullscreen></iframe>
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
      { label: "View Code", url: "https://github.com/IkramJeelani/bridge-sensor-net" },
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
      { label: "View Code", url: "https://github.com/IkramJeelani/robotic-arm" },
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
window.PROFILE = PROFILE;
window.ABOUT = ABOUT;
window.EXPERIENCE = EXPERIENCE;
window.SKILLS = SKILLS;
window.CERTIFICATIONS = CERTIFICATIONS;
window.PROJECTS = PROJECTS;
window.CONTACTS = CONTACTS;

/* =============================================================
   EDIT EVERYTHING ABOUT YOUR SITE HERE — this is the only file
   you need to touch to change your name, projects, or contacts.
   ============================================================= */

/* ---------- 1. YOU ---------- */
const PROFILE = {
  name: "Ikram ",
  initials: "SIJ", // shown top-left AND as the browser-tab icon (kept in sync)
  role: "Engineering Portfolio",
  bio:
    "Engineer building thoughtful hardware & software. Below are a few projects " +
    "I'm proud of — click any card to dive deeper.",
};

/* ---------- 2. PROJECTS ----------
   ADD a project:    copy a { ... } block and edit it.
   REMOVE a project:  delete its { ... } block.
   Each project needs a unique `id` (used in the URL, no spaces).
   With 3+ projects you get the looping carousel; with 1–2 they
   simply show side by side.                                       */
const PROJECTS = [
  {
    id: "smart-thermostat",
    title: "Smart Thermostat Controller",
    image: "assets/project1.svg",
    tagline: "Embedded firmware for an energy-aware HVAC system",
    tech: ["C", "STM32", "FreeRTOS", "PID Control"],
    overview:
      "A low-power thermostat that learns occupancy patterns and reduces energy use by up to 20%.",
    details: [
      "Designed and built the firmware for a connected thermostat running on an STM32 microcontroller with FreeRTOS.",
      "Implemented a PID control loop for precise temperature regulation and a scheduling engine that adapts to household routines.",
      "Added a Wi-Fi module for remote control and over-the-air firmware updates, with a focus on minimizing standby power draw.",
    ],
    links: [
      { label: "View Code", url: "https://github.com/your-username/smart-thermostat" },
    ],
  },
  {
    id: "bridge-sensor-net",
    title: "Bridge Structural Sensor Network",
    image: "assets/project2.svg",
    tagline: "Wireless strain monitoring for civil infrastructure",
    tech: ["Python", "LoRa", "Raspberry Pi", "InfluxDB", "Grafana"],
    overview:
      "A distributed sensor network that monitors structural strain on bridges and flags anomalies in real time.",
    details: [
      "Deployed a mesh of LoRa-connected strain-gauge nodes feeding data to a Raspberry Pi gateway.",
      "Built a Python ingestion pipeline storing time-series data in InfluxDB and visualized live readings in Grafana.",
      "Implemented threshold-based alerting so maintenance teams are notified the moment readings exceed safe limits.",
    ],
    links: [
      { label: "View Code", url: "https://github.com/your-username/bridge-sensor-net" },
      { label: "Live Demo", url: "#" },
    ],
  },
  {
    id: "robotic-arm",
    title: "6-DOF Robotic Arm",
    image: "assets/project3.svg",
    tagline: "Inverse kinematics and motion planning from scratch",
    tech: ["C++", "ROS", "OpenCV", "Arduino"],
    overview:
      "A six-degree-of-freedom robotic arm capable of picking and placing objects identified by a camera.",
    details: [
      "Built the full motion-planning stack including an inverse-kinematics solver written in C++.",
      "Integrated computer vision with OpenCV to detect and locate target objects on a work surface.",
      "Used ROS to coordinate perception, planning, and the Arduino-based motor control layer.",
    ],
    links: [
      { label: "View Code", url: "https://github.com/your-username/robotic-arm" },
    ],
  },
];

/* ---------- 3. CONTACTS ----------
   ADD a contact:    copy a { ... } line and edit it.
   REMOVE a contact:  delete its line.
   Use a "mailto:" url for email; https links open in a new tab.   */
const CONTACTS = [
  { label: "Email", url: "mailto:ikram.jeelani05@hotmail.com" },
  { label: "GitHub", url: "https://github.com/your-username" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
];

/* ---- (no need to edit below this line) ---- */
window.PROFILE = PROFILE;
window.PROJECTS = PROJECTS;
window.CONTACTS = CONTACTS;

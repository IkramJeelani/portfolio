/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears.

   Fields:
     id       REQUIRED, unique, and must match its entry in data.js's
              PROJECT_ORDER. Also becomes the URL: project.html?id=...
              — changing it later breaks any existing link/bookmark.
     title    shown on the card and the project page.
     image    card thumbnail + page hero background.
     date     free-text, e.g. "Jan 24 - May 24" — omit to hide it.
     tagline  short one-line description shown under the title.
     tech     array of tag strings shown on the card and page.
     links    array of { label, url } buttons on the project page.
     share    true/false — not tied to anything on the site yet, just a
              plain per-project flag for your own reference/future use.
     body / bodyFile   the free-form "in-depth" page content. `body` is an
              inline template string right here; `bodyFile` is a path to an
              external .html file (e.g. body.html next to this file) with
              just the body markup — see data.js §6 for the building blocks.
              bodyFile is fetched at page-load time, so it only works when
              served over http(s) (a local dev server or GitHub Pages), not
              opened directly as a file:// URL. If both are set, body wins. */
window.PROJECT_DATA = window.PROJECT_DATA || {};
window.PROJECT_DATA["dc-motor-speed-controller-using-8051-mcu"] = {
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
  bodyFile: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/body.html",
};

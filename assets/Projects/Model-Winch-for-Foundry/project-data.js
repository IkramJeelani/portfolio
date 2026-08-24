/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears.
   See assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/project-data.js
   for the full field docs. */
window.PROJECT_DATA = window.PROJECT_DATA || {};
window.PROJECT_DATA["model-winch-for-foundry"] = {
  id: "model-winch-for-foundry",
  title: "Model Winch for Foundry",
  image: "",
  date: "Spring 2026",
  tagline: "3-stage reduction gearbox and shaft design for a crucible-lifting winch",
  tech: ["Gear Design", "Shaft Design", "Fusion 360", "Mechanical Design"],
  links: [],
  share: true,
  body: `
  <p>A model winch system for lifting crucibles in a metal foundry, designed and built for my
  Engineering Design and Build (MMMB215) course. The system must lift a 1kg mass 120cm in
  strictly 10-20 seconds — fast enough to be practical, slow enough that molten metal in the
  crucible doesn't slosh or solidify. Driven by an 11000rpm/2.1W motor through a 3-stage
  reduction gearbox, sized within a 200x200mm housing.</p>
  `,
};

/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears.
   See assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/project-data.js
   for the full field docs. */
window.PROJECT_DATA = window.PROJECT_DATA || {};
window.PROJECT_DATA["model-winch-for-foundry"] = {
  id: "model-winch-for-foundry",
  title: "Model Winch for Foundry",
  image: "assets/Projects/Model-Winch-for-Foundry/display.jpg",
  date: "Apr - July 2026",
  tagline: "Designing a 3-stage reduction gearbox and shaft for a crucible-lifting winch",
  tech: ["Gear Design", "Shaft Design", "Fusion 360", "Mechanical Design"],
  links: [],
  share: true,
  body: `
  <p>A model winch system for lifting crucibles in a metal foundry, being designed for my
  Engineering Design and Build (MMMB215) course. The system must lift a 1kg mass 120cm in
  strictly 10-20 seconds — fast enough to be practical, slow enough that molten metal in the
  crucible doesn't slosh or solidify. Driven by an 11000rpm/2.1W motor through a 3-stage
  reduction gearbox, sized within a 200x200mm housing.</p>

  <h2>Problem Statement</h2>
  <p>A foundry crucible needs to be lifted by a winch at a speed that's neither too fast nor too
  slow: too fast, and the molten metal inside sloshes around, a major safety hazard; too slow,
  and the metal solidifies and fuses to the crucible, ruining it. The task is to design a gearbox
  and shaft system that takes a small, high-speed motor (11000rpm, 2.1W) and reliably reduces
  it to lift a 1kg mass 120cm within a strict 10-20 second window, while fitting inside a
  200x200mm housing, using an 8mm shaft, and staying within a 250Dhs budget.</p>
  <img src="assets/Projects/Model-Winch-for-Foundry/initial_model.png" alt="Initial model concept of the winch and gearbox system">
  `,
};

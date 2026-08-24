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
  tech: ["Gear Design", "Shaft Design", "Fusion 360", "Mechanical Design"],
  links: [],
  share: true,
  body: `
  <h2>Problem Statement</h2>
  <p>A foundry crucible needs to be lifted by a winch at a speed that's neither too fast nor too
  slow: too fast, and the molten metal inside sloshes around, a major safety hazard; too slow,
  and the metal solidifies and fuses to the crucible, ruining it. The task is to design a gearbox
  and shaft system that takes a high-speed motor (11000rpm, 2.1W) and reliably reduces
  it to lift a 1kg mass 120cm within a strict 10-20 second window, while fitting inside a
  200x200mm housing, using an 8mm shaft, and staying within a 250Dhs budget.</p>
  <img src="assets/Projects/Model-Winch-for-Foundry/initial_model.png" alt="Initial model concept of the winch and gearbox system">

  <h2>Initial Design &amp; Calculations</h2>

  <h3>Concept selection</h3>
  <p>Two concept layouts were sketched, both using the same 3-stage helical gear reduction
  (5:4:3) and materials sourced from a morphological chart: PLA-printed gears on aluminum
  shafts. Concept 1 laid the three gear stages out horizontally; Concept 2 stacked them
  vertically instead, using supporting walls for the shafts. Scored against each other with a
  weighted Pugh matrix (functionality, strength, size, manufacturability, cost, etc.), Concept 2
  won 149 to 126 — mainly for its smaller footprint, lower material cost, and the extra
  structural rigidity gained from the added shaft-support walls, with no difference in gear
  performance between the two layouts.</p>

  <h3>Gear ratio</h3>
  <p>The required output shaft speed was derived from the lift constraints: lifting the 1kg mass
  120cm in the midpoint of the allowed window (t = 15s) at a drum radius of 4mm works out to
  an output speed of about 191 RPM. Against the motor's 11,000 RPM input, that's a required
  total reduction of roughly 58:1, split across the 3 stages as 5:4:3.</p>
  <table>
    <thead>
      <tr><th>Stage</th><th>Pinion teeth</th><th>Gear teeth</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>17</td><td>85</td></tr>
      <tr><td>2</td><td>17</td><td>68</td></tr>
      <tr><td>3</td><td>17</td><td>51</td></tr>
    </tbody>
  </table>

  <h3>Force analysis</h3>
  <p>Working back from the 1kg lifting load, the torque and angular velocity at every stage were
  calculated, then used to find the tangential, radial, and axial forces each gear experiences —
  needed to size the shafts and check the bearings later on. As a sanity check, the output
  shaft's pitch-line velocity was converted back into a lifting time: about 15.6 seconds, comfortably
  inside the 10-20 second requirement.</p>

  <h3>Shaft &amp; key design</h3>
  <p>Square keys were chosen for most shaft-to-gear connections — simple, cheap, and able to
  handle higher torque — while a Woodruff key was used on the high-speed input shaft instead,
  since its deeper, self-aligning seat suits high-RPM applications better despite being weaker
  under heavy torque.</p>
  `,
};

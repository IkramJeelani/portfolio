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

  <h3>Gear ratio</h3>
  <img src="assets/Projects/Model-Winch-for-Foundry/gear_ratio_FBD.png" alt="Free body diagram of the output shaft and hanging mass used to derive the required gear ratio">
  <p>The required output shaft speed was derived from the lifting constraint. With the mass's
  linear velocity <code>v = rω = x/t</code>, taking the lift height x = 1.2m at the midpoint of the
  allowed window (t = 15s) and a drum/shaft radius r = 4mm:</p>
  <blockquote>0.004 × ω = 1.2 / 15 → ω = 20 rad/s ≈ 191 RPM</blockquote>
  <p>Against the motor's 11,000 RPM input, that's a required total reduction of
  G = 11000 / 191 ≈ 58, split across the 3 stages as G1 = 3, G2 = 4, G3 = 5.</p>

  <h3>Gear specifications</h3>
  <p>All 3 stages use a normal module of 1.5mm, 20° pressure angle, and 30° helix angle
  (chose helical gears as spur would be too noisy/vibration-prone at the higher-speed stages).
  Pitch diameter (d), center distance (a), and addendum (ha) were computed per stage from
  the tooth counts:</p>
  <table>
    <thead>
      <tr><th>Stage</th><th>Pinion teeth</th><th>Gear teeth</th><th>Pinion d (mm)</th><th>Gear d (mm)</th><th>Center distance a (mm)</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>17</td><td>51</td><td>29.44</td><td>88.33</td><td>58.89</td></tr>
      <tr><td>2</td><td>17</td><td>68</td><td>29.44</td><td>117.78</td><td>73.61</td></tr>
      <tr><td>3</td><td>17</td><td>85</td><td>29.44</td><td>147.22</td><td>88.33</td></tr>
    </tbody>
  </table>
  <p>Addendum (ha) is 1.5mm for every gear and pinion across all 3 stages</p>

  <h3>Force analysis</h3>
  <table>
    <thead>
      <tr><th>Shaft</th><th>Speed (RPM)</th><th>Torque (Nm)</th><th>Bearing radial force Fr (N)</th></tr>
    </thead>
    <tbody>
      <tr><td>Motor input</td><td>11,000</td><td>0.001823</td><td>—</td></tr>
      <tr><td>Shaft A</td><td>3,666.67</td><td>0.005469</td><td>—</td></tr>
      <tr><td>Shaft B</td><td>916.67</td><td>0.021876</td><td>—</td></tr>
      <tr><td>Output (critical) — Bearing 1</td><td>183.33</td><td>0.109380</td><td>11.63</td></tr>
      <tr><td>Output (critical) — Bearing 2</td><td>183.33</td><td>0.109380</td><td>19.35</td></tr>
    </tbody>
  </table>
  <p>The output shaft is critical: static factor of safety n = 2.44 (Von Mises), fatigue factor
  n<sub>f</sub> = 3.35 (infinite life), and its selected 608 bearing (3.45kN rated) far exceeds the
  15,000-hour target life.</p>

  <h3>Shaft &amp; key design</h3>
  <p>Square keys were chosen for most shaft-to-gear connections — simple, cheap, and able to
  handle higher torque — while a Woodruff key was used on the high-speed input shaft instead,
  since its deeper, self-aligning seat suits high-RPM applications better despite being weaker
  under heavy torque and harder to install.</p>
  `,
};

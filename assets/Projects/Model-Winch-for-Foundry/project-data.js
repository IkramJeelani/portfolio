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
  G = 11000 / 191 ≈ 58, split across the 3 stages as G1 = 5, G2 = 4, G3 = 3.</p>

  <h3>Gear specifications</h3>
  <p>All 3 stages use a normal module of 1.5mm, 20° pressure angle, and 30° helix angle
  (helical gears — spur would be too noisy/vibration-prone at the higher-speed stages).
  Pitch diameter (d), center distance (a), and addendum (ha) were computed per stage from
  the tooth counts:</p>
  <table>
    <thead>
      <tr><th>Stage</th><th>Pinion teeth</th><th>Gear teeth</th><th>Center distance a (mm)</th><th>Pinion d (mm)</th><th>Gear d (mm)</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>17</td><td>85</td><td>88.33</td><td>29.44</td><td>147.22</td></tr>
      <tr><td>2</td><td>17</td><td>68</td><td>73.61</td><td>29.44</td><td>117.78</td></tr>
      <tr><td>3</td><td>17</td><td>51</td><td>58.89</td><td>29.44</td><td>88.33</td></tr>
    </tbody>
  </table>
  <p>Addendum (ha) is 1.5mm for every gear and pinion across all 3 stages. From the resulting
  2D sketches, the gearbox needed to be roughly 195mm wide, 160mm tall, and 105mm deep —
  within the 200x200mm housing limit.</p>

  <h3>Force analysis</h3>
  <p>Working backward from the 1kg lifting load at the output shaft (τ = F×r = 9.81N × 0.004m
  = 0.03924 Nm), the transmitted load, then the resulting shaft torque, was calculated stage by
  stage back up to the motor input:</p>
  <table>
    <thead>
      <tr><th>Stage</th><th>Torque (Nm)</th><th>Angular velocity (rad/s)</th></tr>
    </thead>
    <tbody>
      <tr><td>1 (input, helical)</td><td>0.00065</td><td>230.38</td></tr>
      <tr><td>2 (helical)</td><td>0.00327</td><td>57.6</td></tr>
      <tr><td>3 (output)</td><td>0.012308</td><td>19.2</td></tr>
    </tbody>
  </table>
  <p>From the transmitted load at each stage, the radial (Wr) and axial (Wa) forces on the
  helical gears were found using <code>Wr = Wt·tan(φ)/cos(ψ)</code> and
  <code>Wa = Wt·tan(ψ)</code> (φ = 20° pressure angle, ψ = 30° helix angle):</p>
  <table>
    <thead>
      <tr><th>Stage</th><th>Tangential Wt (N)</th><th>Radial Wr (N)</th><th>Pitch-line velocity (m/s)</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>1.026</td><td>0.373</td><td>16.96</td></tr>
      <tr><td>2</td><td>0.222</td><td>0.093</td><td>3.39</td></tr>
      <tr><td>3</td><td>0.044</td><td>0.019</td><td>0.73</td></tr>
    </tbody>
  </table>
  <p>As a sanity check, the output shaft's surface speed was converted back into a lifting time:
  <code>V<sub>lift</sub> = ω<sub>out</sub> × r<sub>shaft</sub> = 19.2 × 0.004 = 0.0768 m/s</code>, giving
  1.2 / 0.0768 ≈ 15.6 seconds to lift the full height — comfortably inside the 10-20 second
  requirement.</p>

  <h3>Shaft &amp; key design</h3>
  <p>Square keys were chosen for most shaft-to-gear connections — simple, cheap, and able to
  handle higher torque — while a Woodruff key was used on the high-speed input shaft instead,
  since its deeper, self-aligning seat suits high-RPM applications better despite being weaker
  under heavy torque and harder to install.</p>
  `,
};

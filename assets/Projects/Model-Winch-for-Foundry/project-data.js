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
  <p>A 4-person team project for MMMB215 (Mechanical Design 1) at the University of Wollongong
  in Dubai. A foundry crucible needs to be lifted by a winch at a speed that's neither too fast
  nor too slow: too fast, and the molten metal inside sloshes around, a major safety hazard; too
  slow, and the metal solidifies and fuses to the crucible, ruining it. The task is to design a
  gearbox and shaft system that takes a high-speed motor (11000rpm, 2.1W) and reliably reduces
  it to lift a 1kg mass 120cm within a strict 10-20 second window, while fitting inside a
  200x200mm housing, using an 8mm shaft, and staying within a 250Dhs budget.</p>
  <img src="assets/Projects/Model-Winch-for-Foundry/initial_model.png" alt="Initial model concept of the winch and gearbox system">

  <h2>Gearbox Parameters</h2>

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
  <div class="gallery">
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/stage_1_2D.png" alt="2D sketch of Stage 1 gear pair" style="width:308px;object-fit:fill;">
      <figcaption>Stage 1</figcaption>
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/stage_2_2D.png" alt="2D sketch of Stage 2 gear pair">
      <figcaption>Stage 2</figcaption>
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/stage_3_2D.png" alt="2D sketch of Stage 3 gear pair">
      <figcaption>Stage 3</figcaption>
    </figure>
  </div>

  <h2>CAD Modelling</h2>
  <p>The full assembly was modelled in Fusion 360, shown in the following views:</p>
  <div class="gallery cols-2">
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/isometric.png" alt="Isometric CAD render of the full gearbox assembly">
      <figcaption>Isometric</figcaption>
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/front.png" alt="Front view CAD render of the gearbox assembly">
      <figcaption>Front</figcaption>
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/top.png" alt="Top view CAD render of the gearbox assembly">
      <figcaption>Top</figcaption>
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/right.png" alt="Right side view CAD render of the gearbox assembly">
      <figcaption>Right</figcaption>
    </figure>
  </div>

  <h2>Force Analysis</h2>
  <img src="assets/Projects/Model-Winch-for-Foundry/force_analysis_shaft_label.png" alt="Labelled diagram of the shafts used in the force analysis">
  <table>
    <thead>
      <tr>
        <th rowspan="2">Shaft</th>
        <th rowspan="2">Speed (RPM)</th>
        <th rowspan="2">Torque (Nm)</th>
        <th colspan="2">Bearing radial force Fr (N)</th>
      </tr>
      <tr><th>Bearing 1</th><th>Bearing 2</th></tr>
    </thead>
    <tbody>
      <tr><td>Shaft 1 (input)</td><td>11,000</td><td>0.001823</td><td>0.15</td><td>0.04</td></tr>
      <tr><td>Shaft 2</td><td>3,666.67</td><td>0.005469</td><td>0.14</td><td>0.24</td></tr>
      <tr><td>Shaft 3</td><td>916.67</td><td>0.021876</td><td>0.22</td><td>1.48</td></tr>
      <tr><td>Shaft 4 (output, critical)</td><td>183.33</td><td>0.109380</td><td>11.63</td><td>19.35</td></tr>
    </tbody>
  </table>
  <p>The output shaft is critical: static factor of safety n = 2.44 (Von Mises), fatigue factor
  n<sub>f</sub> = 3.35 (infinite life), and its selected 608 bearing (3.45kN rated) far exceeds the
  15,000-hour target life.</p>
  <p><em>Full worked calculations for all of the above are in Project Submission 2.</em></p>

  <h2>Manufacturing</h2>

  <h3>Shafts</h3>
  <p>3D-printed on an ELEGOO Neptune Pro 4 at 25% infill, printed horizontally so the print
  extrusions run along the shaft's length which makes it stronger against the bending and shear the shafts
  actually experience than a vertical print would be.</p>
  <div class="gallery">
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/shaft_1.png" alt="3D-printed shaft, first example">
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/shaft_2.png" alt="3D-printed shaft, second example">
    </figure>
  </div>

  <h3>Casing</h3>
  <p>Laser-cut from 6mm acrylic. Fusion 360 drawings were exported to .dxf, and tolerances for
  the bearing and press-fit holes were tested on a small offcut sheet first.</p>
  <div class="gallery">
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/case_1.png" alt="Laser-cut acrylic casing, first example">
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/case_2.jpg" alt="Laser-cut acrylic casing, second example">
    </figure>
  </div>

  <h3>Gears</h3>
  <p>3D-printed at 25% infill on the ELEGOO Neptune Pro 4 and a Creality K2 Plus, initially with
  rafts for bed adhesion. The rafts proved difficult to remove cleanly, so later reprints skipped
  them.</p>
  <div class="gallery">
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/gears_1.png" alt="3D-printed helical gear, first example">
    </figure>
    <figure>
      <img src="assets/Projects/Model-Winch-for-Foundry/gears_2.jpg" alt="3D-printed helical gear, second example">
    </figure>
  </div>

  <h2>Assembly</h2>
  <figure>
    <img src="assets/Projects/Model-Winch-for-Foundry/assembly_1.png" alt="Threading a bolt by hand into a hole drilled in a 3D-printed shaft">
    <figcaption>Threading a bolt into the shaft. It cuts its own thread, no tapping needed.</figcaption>
  </figure>
  <figure>
    <img src="assets/Projects/Model-Winch-for-Foundry/assembly_2.png" alt="Drilling out a gear hub hole while clamped in a vise">
    <figcaption>Drilling out a gear hub hole so the bolt can pass through.</figcaption>
  </figure>
  <figure>
    <img src="assets/Projects/Model-Winch-for-Foundry/assembly_3.png" alt="Pressing a bearing into the acrylic casing and securing it with glue">
    <figcaption>Pressing a bearing into the casing and securing it with acrylic glue.</figcaption>
  </figure>
  <figure>
    <img src="assets/Projects/Model-Winch-for-Foundry/assembly_4.png" alt="Two helical gears mounted on their shafts atop the casing base, checked for mesh alignment before final assembly">
    <figcaption>Gears mounted on their shafts and checked for mesh alignment before committing to final assembly.</figcaption>
  </figure>
  <figure>
    <img src="assets/Projects/Model-Winch-for-Foundry/assembly_5.jpg" alt="Fully enclosed acrylic casing with the complete gear train assembled inside">
    <figcaption>Fully assembled: shaft ends taped at the bearings, plus a taped-in 3D-printed
    sleeve stiffening the output shaft against bending.</figcaption>
  </figure>

  <h2>Bill of Materials</h2>
  <p>Several parts were revised after the first version (v1), notably switching the shafts from
  aluminum to 3D-printed PLA. Final cost came in well under the 250Dhs budget:</p>
  <img class="full" src="assets/Projects/Model-Winch-for-Foundry/BOM.png" alt="Finalised Bill of Materials table from Project Submission 3, listing every part, material, version, quantity, and cost">

  <h3>Results</h3>
  <p>Tested by tying a string to the output shaft with the 1kg mass attached, then running the
  motor (11,000 RPM input) until the mass was fully lifted. The gearbox lifted the mass 120cm in
  roughly 14.5 seconds, which is close to the 15-second theoretical prediction, comfortably inside the
  10-20 second requirement (the slight difference is likely from the thicker output shaft added
  to counter bending). The assembly stayed structurally sound throughout: no bearings or shafts
  came loose, no gear teeth broke, the casing held together, and vibration was minimal despite
  the high input RPM.</p>
  <img src="assets/Projects/Model-Winch-for-Foundry/final_result.png" alt="The lifting test in progress: the assembled gearbox raising the 1kg mass on a string">
  <p>The project component of the course was graded 95/100.</p>
  <img class="full" src="assets/Projects/Model-Winch-for-Foundry/grade.png" alt="Final grade for the project component: 95 out of 100">

  <h3>Challenges faced</h3>
  <ul>
    <li>The first batch of 10mm aluminum shafts, sawn and then lathed to size, came out unusable
    as the lathe was faulty and kept bending them, and with the digital measuring tool also broken,
    diameter had to be checked manually after every rotation.</li>
    <li>The output shaft bent under the 1kg load, so an extra 3D-printed sleeve was added outside
    it and taped in place to stiffen it.</li>
    <li>Initial gear and shaft bolt-holes were printed too small, requiring redrilling before the
    bolts would fit.</li>
    <li>5mm acrylic wasn't available, forcing a late switch to 6mm for the casing walls; heavy lab
    and 3D-printer demand also limited how much testing could happen before final assembly.</li>
  </ul>
  `,
};

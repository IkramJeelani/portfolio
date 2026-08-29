/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears.

   TODO before this project is finished:
   - Drop a thumbnail/hero image into this folder and point `image` at it.
   - Fill in `date`, `tech`, `links` as needed.
   - Write the real `body` content — see data.js's own comment block for
     the supported building blocks (headings, images, galleries, tables). */
window.PROJECT_DATA = window.PROJECT_DATA || {};
window.PROJECT_DATA["stapler-cad-model"] = {
  id: "stapler-cad-model",
  title: "Stapler CAD Model",
  image: "assets/Projects/Stapler-CAD-Model/display.png",
  date: "Nov - Dec 2024",
  tech: ["SolidWorks", "Reverse Engineering"],
  links: [],
  share: true,
  body: `
  <h2>1. Introduction</h2>
  <p>A full reverse-engineering of a standard office stapler: disassembling it down to its individual
  parts, measuring each one by hand to &plusmn;0.1 mm, and rebuilding all 15+ components as a fully
  functional, dimensionally accurate SolidWorks assembly. Beyond just matching geometry, the assembly
  models proper mating constraints. Built as an individual project for my Engineering Graphics
  &amp; Design (MSE 100) course.</p>

  <figure>
    <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/amazon_basics_stapler.jpg" width="3000" height="2856"
        alt="AmazonBasics stapler product photo, the physical unit that was reverse-engineered">
    <figcaption>The physical stapler (AmazonBasics) that was disassembled and reverse-engineered for this project.</figcaption>
  </figure>

  <h2>2. Individual Components</h2>

  <h3>2.1 Part 1</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/isometric.png" width="1186" height="889"
          alt="Part 1, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/front.png" width="1070" height="802"
          alt="Part 1, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/top.png" width="940" height="705"
          alt="Part 1, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/right.png" width="1112" height="834"
          alt="Part 1, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/bottom.png" width="1131" height="848"
          alt="Part 1, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/section.png" width="964" height="723"
          alt="Part 1, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <!-- Copy the 2.1 block above for each additional part (2.2 Part 2, 2.3
       Part 3, ...), pointing at that part's own folder. -->

  <h2>3. Assembly</h2>

  <figure>
    <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/display.jpg" width="2580" height="2500"
        alt="SolidWorks assembly render of the stapler, shown open with the top cover raised">
    <figcaption>SolidWorks assembly of the reverse-engineered stapler, shown open.</figcaption>
  </figure>
  `,
};

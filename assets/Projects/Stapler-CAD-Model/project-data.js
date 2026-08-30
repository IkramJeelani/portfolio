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
  <p>A full reverse-engineering of a standard office stapler. This individual project for my Engineering Graphics &amp; 
  Design (MSE 100) course required us to
  order an AmazonBasics stapler, disassemble it down to its individual parts, measure each one by hand to
  &plusmn;0.1 mm, and model all 10+ components as a fully functional, dimensionally accurate SolidWorks
  assembly.</p>

  <figure>
    <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/amazon_basics_stapler.jpg" width="3000" height="2856"
        alt="AmazonBasics stapler product photo, the physical unit that was reverse-engineered">
    <figcaption>The physical stapler (AmazonBasics) that was disassembled and reverse-engineered for this project.</figcaption>
  </figure>

  <h2>2. Individual Components</h2>
  <p><em>Note: springs were not modeled.</em></p>

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

  <h3>2.2 Part 2</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/isometric.png" width="1229" height="922"
          alt="Part 2, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/front.png" width="648" height="486"
          alt="Part 2, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/top.png" width="1105" height="829"
          alt="Part 2, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/right.png" width="1072" height="804"
          alt="Part 2, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/bottom.png" width="1115" height="836"
          alt="Part 2, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/section.png" width="988" height="741"
          alt="Part 2, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.3 Part 3</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/isometric.png" width="1068" height="801"
          alt="Part 3, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/front.png" width="800" height="600"
          alt="Part 3, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/top.png" width="1072" height="804"
          alt="Part 3, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/right.png" width="1074" height="805"
          alt="Part 3, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/bottom.png" width="1075" height="806"
          alt="Part 3, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/section.png" width="1015" height="762"
          alt="Part 3, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.4 Part 4</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/isometric.png" width="742" height="556"
          alt="Part 4, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/front.png" width="553" height="415"
          alt="Part 4, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/top.png" width="1072" height="804"
          alt="Part 4, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/right.png" width="745" height="559"
          alt="Part 4, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/bottom.png" width="1070" height="802"
          alt="Part 4, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/section.png" width="804" height="603"
          alt="Part 4, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.5 Part 5</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/isometric.png" width="1099" height="824"
          alt="Part 5, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/front.png" width="633" height="475"
          alt="Part 5, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/top.png" width="752" height="564"
          alt="Part 5, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/right.png" width="895" height="671"
          alt="Part 5, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/bottom.png" width="1076" height="807"
          alt="Part 5, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/section.png" width="1040" height="780"
          alt="Part 5, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.6 Part 6</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/isometric.png" width="724" height="545"
          alt="Part 6, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/front.png" width="1076" height="807"
          alt="Part 6, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/top.png" width="779" height="590"
          alt="Part 6, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/right.png" width="434" height="325"
          alt="Part 6, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/bottom.png" width="544" height="408"
          alt="Part 6, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/section.png" width="423" height="317"
          alt="Part 6, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.7 Part 7</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/isometric.png" width="560" height="420"
          alt="Part 7, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/front.png" width="431" height="323"
          alt="Part 7, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/top.png" width="1500" height="897"
          alt="Part 7, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/right.png" width="429" height="322"
          alt="Part 7, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/bottom.png" width="620" height="465"
          alt="Part 7, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/section.png" width="1546" height="902"
          alt="Part 7, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <!-- Copy the 2.1 block above for each additional part (2.8 Part 8, 2.9
       Part 9, ...), pointing at that part's own folder. -->

  <h2>3. Assembly</h2>


  `,
};

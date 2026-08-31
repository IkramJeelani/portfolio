/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears. */
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
  &plusmn;0.1 mm, and model all 13 components as a fully functional, dimensionally accurate SolidWorks
  assembly.</p>

  <figure>
    <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/amazon_basics_stapler.jpg" width="3000" height="2856"
        alt="AmazonBasics stapler product photo, the physical unit that was reverse-engineered">
    <figcaption>The physical stapler (AmazonBasics) that was disassembled and reverse-engineered for this project.</figcaption>
  </figure>

  <h2>2. Individual Components</h2>
  <p><em>Note: springs were not modeled, nor are part of the assembly.</em></p>

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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_1/bottom.png" width="1148" height="860"
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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_2/front.png" width="1166" height="875"
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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_3/front.png" width="1440" height="1080"
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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/isometric.png" width="1336" height="1001"
          alt="Part 4, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/front.png" width="995" height="747"
          alt="Part 4, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/top.png" width="1072" height="804"
          alt="Part 4, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/right.png" width="1341" height="1006"
          alt="Part 4, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/bottom.png" width="1070" height="802"
          alt="Part 4, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_4/section.png" width="1447" height="1085"
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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/front.png" width="1139" height="855"
          alt="Part 5, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/top.png" width="1354" height="1015"
          alt="Part 5, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_5/right.png" width="1611" height="1208"
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
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/isometric.png" width="1303" height="981"
          alt="Part 6, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/front.png" width="1076" height="807"
          alt="Part 6, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/top.png" width="1402" height="1062"
          alt="Part 6, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/right.png" width="781" height="585"
          alt="Part 6, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/bottom.png" width="979" height="734"
          alt="Part 6, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_6/section.png" width="761" height="571"
          alt="Part 6, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.7 Part 7</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/isometric.png" width="1008" height="756"
          alt="Part 7, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/front.png" width="776" height="581"
          alt="Part 7, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/top.png" width="936" height="702"
          alt="Part 7, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/right.png" width="772" height="580"
          alt="Part 7, right view">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/bottom.png" width="1116" height="837"
          alt="Part 7, bottom view">
      <figcaption>Bottom view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_7/section.png" width="1350" height="1012"
          alt="Part 7, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.8 Part 8</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_8/isometric.png" width="1060" height="795"
          alt="Part 8, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_8/front.png" width="668" height="502"
          alt="Part 8, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_8/top.png" width="509" height="382"
          alt="Part 8, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <h3>2.9 Part 9</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_9/isometric.png" width="1055" height="791"
          alt="Part 9, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_9/front.png" width="841" height="630"
          alt="Part 9, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_9/top.png" width="1067" height="800"
          alt="Part 9, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <h3>2.10 Part 10</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_10/isometric.png" width="934" height="700"
          alt="Part 10, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_10/front.png" width="1161" height="871"
          alt="Part 10, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_10/top.png" width="664" height="499"
          alt="Part 10, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <h3>2.11 Part 11</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_11/isometric.png" width="1112" height="835"
          alt="Part 11, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_11/front.png" width="1170" height="877"
          alt="Part 11, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_11/top.png" width="945" height="709"
          alt="Part 11, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <h3>2.12 Part 12</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_12/isometric.png" width="938" height="702"
          alt="Part 12, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_12/top.png" width="938" height="704"
          alt="Part 12, top view">
      <figcaption>Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_12/section.png" width="1458" height="1094"
          alt="Part 12, section view">
      <figcaption>Section view</figcaption>
    </figure>
  </div>

  <h3>2.13 Part 13</h3>
  <div class="gallery cols-3">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_13/isometric.png" width="1264" height="949"
          alt="Part 13, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_13/front.png" width="835" height="626"
          alt="Part 13, front view">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Part_13/top.png" width="963" height="722"
          alt="Part 13, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <!-- Copy the 2.1 block above for each additional part (2.14 Part 14, 2.15
       Part 15, ...), pointing at that part's own folder. -->

  <h2>3. Assembly</h2>

  <h3>3.1 Closed</h3>
  <div class="gallery cols-2">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/isometric_closed.png" width="976" height="733"
          alt="Assembly, closed, isometric view">
      <figcaption>Isometric view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/right_closed.png" width="1118" height="838"
          alt="Assembly, closed, right view">
      <figcaption>Right view</figcaption>
    </figure>
  </div>

  <h3>3.2 Open</h3>
  <div class="gallery cols-2">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/front_top_open.png" width="985" height="739"
          alt="Assembly, open, front-top view">
      <figcaption>Front-Top view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/top_open.png" width="959" height="719"
          alt="Assembly, open, top view">
      <figcaption>Top view</figcaption>
    </figure>
  </div>

  <h3>3.3 Section</h3>
  <div class="gallery cols-2">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/section_iso1.png" width="1557" height="1168"
          alt="Assembly, section view, isometric 1">
      <figcaption>Isometric view 1</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/section_iso2.png" width="1024" height="768"
          alt="Assembly, section view, isometric 2">
      <figcaption>Isometric view 2</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/section_right.png" width="1151" height="864"
          alt="Assembly, section view, right">
      <figcaption>Right view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/section_right_back.png" width="1039" height="779"
          alt="Assembly, section view, right-back">
      <figcaption>Right-Back view</figcaption>
    </figure>
  </div>

  <h3>3.4 Exploded</h3>
  <div class="gallery cols-2">
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/exploded_front.png" width="677" height="902"
          alt="Assembly, exploded view, front">
      <figcaption>Front view</figcaption>
    </figure>
    <figure>
      <img loading="lazy" src="assets/Projects/Stapler-CAD-Model/Assembly/exploded_right.png" width="1134" height="1512"
          alt="Assembly, exploded view, right">
      <figcaption>Right view</figcaption>
    </figure>
  </div>
  `,
};

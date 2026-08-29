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
  image: "assets/Projects/Stapler-CAD-Model/display.jpg",
  date: "",
  tech: ["SolidWorks"],
  links: [],
  share: true,
  body: `
  <h2>1. Introduction</h2>
  <p>TODO: write an intro for the stapler CAD model.</p>
  `,
};

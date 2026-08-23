/* This project's full card + page data. Registers itself into
   window.PROJECT_DATA — data.js's PROJECT_ORDER array (and a matching
   <script> tag in index.html + project.html) decide if/where it appears.

   Fields:
     id       REQUIRED, unique, and must match its entry in data.js's
              PROJECT_ORDER. Also becomes the URL: project.html?id=...
              — changing it later breaks any existing link/bookmark.
     title    shown on the card and the project page.
     image    card thumbnail + page hero background.
     date     free-text, e.g. "Jan 24 - May 24" — omit to hide it.
     tagline  short one-line description shown under the title.
     tech     array of tag strings shown on the card and page.
     links    array of { label, url } buttons on the project page.
     share    true/false — not tied to anything on the site yet, just a
              plain per-project flag for your own reference/future use.
     body     the free-form "in-depth" page content — an inline template
              string, right here. See data.js §6 for the building blocks
              (headings, images, galleries, tables, video, etc.). Avoid
              typing a lone backtick (`) or the characters ${ inside it —
              they have special meaning in a template string. */
window.PROJECT_DATA = window.PROJECT_DATA || {};
window.PROJECT_DATA["dc-motor-speed-controller-using-8051-mcu"] = {
  id: "dc-motor-speed-controller-using-8051-mcu",
  title: "DC Motor Speed Controller using 8051 MCU",
  image: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/display.jpg",
  date: "Nov 25 - Dec 25",
  tagline: "Closed-loop PWM fan-speed control on an 8051 microcontroller",
  tech: ["8051", "PWM", "Closed-Loop Control", "C"],
  links: [
    { label: "View Report", url: "assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/report.pdf" },
    { label: "View Code", url: "https://github.com/IkramJeelani/portfolio/blob/main/assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/dc-motor-speed-controller.c" },
  ],
  share: true,
  body: `
    <p>A closed-loop speed controller for a DC fan using an 8051 development board
    for my Digital Logic &amp; Microcontroller (MSE 352) course. A 3-bit DIP switch
    selects one of 8 target speeds (0-2400 RPM). The controller measures the fan's actual
    speed from its tachometer output and drives a PWM signal to a MOSFET so the fan
    converges on whatever speed was selected. Only 3 significant figures of RPM
    are shown, on a multiplexed 3-digit seven-segment display. Built as a 3-person team project.</p>

    <h2>How it works</h2>
    <figure>
      <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/schematic.jpg" alt="Schematic: 8051, DIP switch, three 7-segment displays, and the MOSFET PWM driver stage">
      <figcaption>Full schematic — DIP switch input, 8051, multiplexed 7-segment displays, and the MOSFET gate-drive stage for the fan.</figcaption>
    </figure>
    <ul>
      <li><strong>Speed selection:</strong> the DIP switch (P1.0-P1.2, active-low) indexes a lookup table mapping 8 levels to 0-100% target speed, linearly scaled to a 0-2400 RPM reference.</li>
    </ul>
    <table>
      <thead>
        <tr><th>Input</th><th>PWM %</th><th>Desired RPM</th></tr>
      </thead>
      <tbody>
        <tr><td>000</td><td>0</td><td>0</td></tr>
        <tr><td>001</td><td>40</td><td>960</td></tr>
        <tr><td>010</td><td>50</td><td>1200</td></tr>
        <tr><td>011</td><td>60</td><td>1440</td></tr>
        <tr><td>100</td><td>70</td><td>1680</td></tr>
        <tr><td>101</td><td>80</td><td>1920</td></tr>
        <tr><td>110</td><td>90</td><td>2160</td></tr>
        <tr><td>111</td><td>100</td><td>2400</td></tr>
      </tbody>
    </table>
    <ul>
      <li><strong>Speed measurement:</strong> Timer1 free-runs as a 16-bit tick counter; each rising edge of the tachometer signal (P2.4) gives an instantaneous RPM from the tick delta, smoothed with a 3-sample moving average.</li>
      <li><strong>Control loop:</strong> a proportional controller compares reference vs. measured RPM each time a new sample lands, with a deadband to stop hunting near the setpoint and a max step size per update to keep it from overshooting.</li>
      <li><strong>PWM generation:</strong> Timer0 runs in interrupt mode, toggling the output pin (P2.3) and reloading its interval on every overflow — high and low times are computed from the current duty value, so the ISR itself <em>is</em> the PWM signal.</li>
      <li><strong>Display:</strong> the measured RPM is reduced to its top 3 significant figures and multiplexed across three common-anode 7-segment displays via NPN transistor switches, refreshed once per main-loop pass.</li>
    </ul>

    <h2>Results</h2>
    <p>The controller tracked every DIP-selected setpoint with a small, repeatable
    steady-state error. This happened for two reasons:</p>
    <ol>
      <li>The speed reading from the tachometer wasn't perfectly steady.</li>
      <li>For the sake of simplicity, the controller only used a P term (no I or D), so it couldn't eliminate permanent steady-state errors or control overshoot and oscillations.</li>
    </ol>
    <div class="gallery">
      <figure>
        <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-140.jpg" alt="Breadboard showing the display reading 140 RPM/10">
        <figcaption>Input: 100, Desired Output: 144, Actual Output: 140</figcaption>
      </figure>
      <figure>
        <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-186.jpg" alt="Breadboard showing the display reading 186 RPM/10">
        <figcaption>Input: 101, Desired Output: 192, Actual Output: 186</figcaption>
      </figure>
      <figure>
        <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-245.jpg" alt="Breadboard showing the display reading 245 RPM/10">
        <figcaption>Input: 111, Desired Output: 240, Actual Output: 245</figcaption>
      </figure>
    </div>
  `,
};

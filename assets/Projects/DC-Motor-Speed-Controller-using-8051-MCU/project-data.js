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
    { label: "View Code", url: "https://github.com/IkramJeelani/portfolio/blob/main/assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/code.c" },
  ],
  share: true,
  body: `
  <p>A closed-loop speed controller for a DC motor/fan using an 8051 development board. A 3-bit DIP switch
  selects one of 8 desired speeds (0-2400 RPM). The controller measures the fan's actual
  speed from its tachometer output and adjusts a PWM signal driving a MOSFET so the fan
  converges toward the selected desired speed. The measured RPM is displayed on a multiplexed 3-digit seven-segment display
  with 10 RPM resolution. Built as a
  3-person team project for my Digital Logic &amp; Microcontroller (MSE 352) course.</p>
  <p><strong>Note:</strong> The course permitted unrestricted use of generative AI for writing the C code. However, each team member was individually questioned on the code and the project's functionality as part of the assessment, requiring a thorough understanding of the implementation.</p>

  <h2>How it works</h2>

  <figure>
    <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/schematic.jpg"
        alt="Schematic: 8051, DIP switch, three 7-segment displays, and the MOSFET PWM driver stage">
    <figcaption>Full schematic — DIP switch input, 8051, multiplexed 7-segment displays, and the MOSFET gate-drive stage for the fan.</figcaption>
  </figure>

  <ul>
    <li><strong>Speed selection:</strong> The DIP switch (P1.0-P1.2, active-low) indexes a lookup table mapping 8 input levels to desired speeds from 0-2400 RPM.</li>
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
    <li><strong>Speed measurement:</strong> Timer1 operates as a free-running 16-bit timer; consecutive rising edges of the tachometer signal (P2.4) are used to measure the pulse period, which is converted to RPM and smoothed with a 3-sample moving average.</li>

    <li><strong>Control loop:</strong> A proportional controller compares the reference RPM with the measured RPM whenever a new sample is available. A &plusmn;20 RPM deadband prevents small errors from causing unnecessary corrections, while a maximum duty change of 3 counts per update limits the controller's response and reduces the tendency to overshoot.</li>

    <li><strong>PWM generation/drive:</strong> Timer0 generates the PWM waveform on P2.3 using interrupts, with the high- and low-time intervals determined by the controller's duty-cycle command. P2.3 drives a MOSFET that switches the fan's supply, converting the controller's output into a variable fan speed.</li>

    <li><strong>Display:</strong> The measured RPM is rounded to the nearest 10 RPM and displayed on a multiplexed 3-digit common-anode seven-segment display. Transistor switches independently enable each digit during multiplexing.</li>
  </ul>

  <h2>Results</h2>

  <p>The controller tracked all DIP-selected setpoints with a small, repeatable
  steady-state error. The remaining error was primarily due to variation in the
  tachometer measurement and the use of a proportional-only controller. Without
  an integral term, the controller cannot fully eliminate steady-state error.
  The limited duty change size also helps reduce overshoot and oscillation during
  speed adjustments.</p>

  <div class="gallery">
    <figure>
      <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-140.jpg"
          alt="Breadboard showing a displayed value of 140, representing 1400 RPM">
      <figcaption>Input: 100<br>Desired Output: 1440 RPM<br>Actual Output: 1400 RPM</figcaption>
    </figure>

    <figure>
      <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-186.jpg"
          alt="Breadboard showing a displayed value of 186, representing 1860 RPM">
      <figcaption>Input: 101<br>Desired Output: 1920 RPM<br>Actual Output: 1860 RPM</figcaption>
    </figure>

    <figure>
      <img src="assets/Projects/DC-Motor-Speed-Controller-using-8051-MCU/result-245.jpg"
          alt="Breadboard showing a displayed value of 245, representing 2450 RPM">
      <figcaption>Input: 111<br>Desired Output: 2400 RPM<br>Actual Output: 2450 RPM</figcaption>
    </figure>
  </div>
  `,
};

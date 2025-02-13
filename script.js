// Wait until the window is fully loaded (fonts, images, GSAP, etc.)
window.addEventListener('load', function() {
  // Get references to the text elements
  var container = document.getElementById('nameContainer');
  var kaaya = document.getElementById('kaaya');
  var edo = document.getElementById('edo');
  var overlapA = document.getElementById('overlapA');
  var rdo = document.getElementById('rdo');

  // Check that all elements are found
  if (!container || !kaaya || !edo || !overlapA || !rdo) {
    console.error("One or more required text elements are missing. Animation aborted.");
    return;
  }

  // Confirm GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error("GSAP library failed to load. Please check your local GSAP file.");
    return;
  }
  
  // Register the Physics2DPlugin (if loaded)
  try {
    gsap.registerPlugin(Physics2DPlugin);
  } catch (e) {
    console.error("Physics2DPlugin failed to load or register.", e);
    // You can choose to continue without physics if needed
  }

  // Measure the natural positions of each text span before animation.
  // (The container is hidden via visibility:hidden but still occupies space.)
  var kaayaLeft = kaaya.offsetLeft;
  var edoLeft = edo.offsetLeft;
  var overlapALeft = overlapA.offsetLeft;
  var rdoLeft = rdo.offsetLeft;
  var kaayaTop = kaaya.offsetTop;
  var edoTop = edo.offsetTop;
  var overlapATop = overlapA.offsetTop;
  var rdoTop = rdo.offsetTop;
  var totalWidth = container.offsetWidth;
  var totalHeight = container.offsetHeight;

  // Set the container's width and height to prevent collapse once children become absolute
  container.style.width = totalWidth + "px";
  container.style.height = totalHeight + "px";

  // Position each span absolutely at its measured position
  kaaya.style.left = kaayaLeft + "px";
  kaaya.style.top = kaayaTop + "px";

  edo.style.left = edoLeft + "px";
  edo.style.top = edoTop + "px";

  overlapA.style.left = overlapALeft + "px";
  overlapA.style.top = overlapATop + "px";

  rdo.style.left = rdoLeft + "px";
  rdo.style.top = rdoTop + "px";

  // Now that positions are set, reveal the container
  container.style.visibility = "visible";

  // Calculate off-screen offsets for animation (no magic numbers)
  // These offsets push the text far offscreen initially.
  var offscreenOffset = window.innerWidth / 2 + totalWidth / 2 + 100;
  var offLeft = -offscreenOffset;  // far to the left
  var offRight = offscreenOffset;  // far to the right

  // Create the GSAP timeline for the animation sequence
  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Slide "KAAYA" in from the left
  tl.from(kaaya, {
    duration: 1.0,
    x: offLeft  // starting far left; ends at natural position (x: 0)
  });

  // 2. Slide "EDO", the overlapping "A", and "RDO" in from the right at the same time
  tl.from([edo, overlapA, rdo], {
    duration: 1.0,
    x: offRight  // starting far right; ends at natural positions
  }, "<");  // "<" means start simultaneously with the previous tween

  // 3. Collision impact: a quick, subtle scale pulse on all letters when they meet
  tl.to([kaaya, edo, overlapA, rdo], {
    duration: 0.2,
    scale: 1.05,
    ease: "power1.inOut",
    yoyo: true,
    repeat: 1    // scale up then back to normal
  });

  // 4. Post-collision physics-based reactions:
  //    - "EDO" bounces upward with physics and fades out.
  //    - Overlapping "A" shifts left and fades out.
  //    - "RDO" shifts left to close the gap.
  tl.to(edo, {
    duration: 1.5,
    physics2D: { 
      velocity: 300,    // initial throw speed
      angle: -80,       // angle: nearly upward and slightly left
      gravity: 500      // gravity for a realistic arc
    },
    autoAlpha: 0,       // fade out while moving
    ease: "none"
  }, "+=0.1");  // slight delay after pulse

  tl.to(overlapA, {
    duration: 0.5,
    x: "-=30",    // shift left by approximately 30px
    autoAlpha: 0, // fade out
    ease: "power2.out"
  }, "<");        // start at the same time as "EDO" bounce

  tl.to(rdo, {
    duration: 0.5,
    x: "-=" + (edo.offsetWidth + overlapA.offsetWidth),  // shift left to close the gap
    ease: "power2.out"
  }, "<");

  // 5. Final highlight effect: a subtle glow to emphasize the merged "KAAYARDO"
  tl.to([kaaya, rdo], {
    duration: 0.4,
    textShadow: "0 0 10px rgba(255,255,255,0.8)",  // white glow
    ease: "power1.inOut",
    yoyo: true,
    repeat: 1,
    delay: 0.2
  });

  console.log("KAAYARDO animation timeline started successfully.");
});

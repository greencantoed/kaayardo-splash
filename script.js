document.addEventListener("DOMContentLoaded", function() {
  console.log("Script loaded. DOMContentLoaded fired.");

  // Register GSAP's Physics2DPlugin
  gsap.registerPlugin(Physics2DPlugin);

  // Get references to our text elements
  const leftName = document.getElementById("left-name");
  const rightName = document.getElementById("right-name");

  // Calculate an offset that will push the texts off-screen
  const offset = window.innerWidth * 1.2; // 120% of viewport width

  // Immediately set initial positions and reveal them (visibility: visible)
  gsap.set(leftName, {
    x: -offset,
    visibility: "visible"
  });
  gsap.set(rightName, {
    x: offset,
    visibility: "visible"
  });

  // Create a GSAP timeline for the full animation sequence
  const tl = gsap.timeline();

  // 1) Sprint the texts into the center
  tl.to(leftName, {
    duration: 0.8,
    x: 0, // back to center (x: 0 means no additional horizontal offset)
    ease: "power2.out"
  }, 0);
  tl.to(rightName, {
    duration: 0.8,
    x: 0,
    ease: "power2.out"
  }, 0);

  // 2) Add a subtle scale pulse at the moment of collision
  tl.to([leftName, rightName], {
    duration: 0.3,
    scale: 1.05,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  }, "+=0.1");

  // 3) Trigger the collision effect (bounce/fade)
  tl.add(() => {
    console.log("Collision effect triggered.");
    collisionEffect();
  }, "+=0.1");

  // 4) Optional: Final highlight of the combined "KAAYARDO"
  tl.add(() => {
    console.log("Final highlight triggered.");
    finalHighlight();
  }, "+=0.5");

  // Define the collision effect:
  function collisionEffect() {
    // Bounce "EDO" upward using a physics-based animation
    gsap.to(".bounce-out", {
      duration: 0.8,
      physics2D: {
        velocity: 600,  // initial speed in pixels/second
        angle: -90,     // straight up
        gravity: 1200   // gravity force
      },
      opacity: 0,       // fade it out as it bounces
      ease: "power2.in"
    });

    // Shift the overlapping "A" to merge with "KAAYA" and then fade it out
    gsap.to(".overlap", {
      duration: 0.4,
      x: -30,          // adjust this value as needed for a perfect merge
      ease: "power2.out",
      onComplete: function() {
        gsap.to(".overlap", { duration: 0.2, opacity: 0 });
      }
    });
  }

  // Define a final highlight effect to draw attention to "KAAYARDO"
  function finalHighlight() {
    gsap.fromTo(
      [leftName, rightName],
      { scale: 1, color: "#fff" },
      {
        duration: 0.5,
        scale: 1.1,
        color: "#f2f2f2",
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  }
});

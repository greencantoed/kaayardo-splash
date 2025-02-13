// Wait for the DOM to load fully
document.addEventListener("DOMContentLoaded", function() {
    // Register the GSAP Physics2DPlugin
    gsap.registerPlugin(Physics2DPlugin);
  
    // Grab the text elements
    const leftName = document.getElementById("left-name");
    const rightName = document.getElementById("right-name");
  
    // Calculate an offset so that texts start off-screen.
    // Here we use 120% of the viewport width.
    const offset = window.innerWidth * 1.2;
  
    // Set initial positions:
    // Left text starts shifted left by "offset"
    // Right text starts shifted right by "offset"
    gsap.set(leftName, { x: -offset });
    gsap.set(rightName, { x: offset });
  
    // Create a timeline for a fully structured animation sequence
    const tl = gsap.timeline();
  
    // 1. Sprint both texts into the center (x: 0 returns them to their original, centered positions)
    tl.to(leftName, {
      duration: 0.8,
      x: 0,
      ease: "power2.out"
    }, 0);
    tl.to(rightName, {
      duration: 0.8,
      x: 0,
      ease: "power2.out"
    }, 0);
  
    // 2. At the moment of collision, add a subtle scale pulse for extra impact
    tl.to([leftName, rightName], {
      duration: 0.3,
      scale: 1.05,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "+=0.1");
  
    // 3. Trigger the collision effect after a brief delay
    tl.add(collisionEffect, "+=0.1");
  
    // Define the collision effect function
    function collisionEffect() {
      // Bounce the "EDO" part upward using a physics-based animation
      gsap.to(".bounce-out", {
        duration: 0.8,
        physics2D: {
          velocity: 600,    // Starting velocity (pixels per second)
          angle: -90,       // Launch straight upward
          gravity: 1200     // Gravity for a natural arc
        },
        opacity: 0,         // Fade out during the bounce
        ease: "power2.in"
      });
  
      // Animate the overlapping "A" to shift left and fade out,
      // so that the duplicate "A" merges with "KAAYA" seamlessly.
      gsap.to(".overlap", {
        duration: 0.4,
        x: -30,           // Adjust this value to perfectly merge the letter
        ease: "power2.out",
        onComplete: function() {
          gsap.to(".overlap", { duration: 0.2, opacity: 0 });
        }
      });
    }
  });
  
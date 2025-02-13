// Wait for the window to load all assets
window.onload = function() {
    // Register GSAP's Physics2DPlugin
    gsap.registerPlugin(Physics2DPlugin);
  
    // Grab the wrapper elements and the collision sound element
    const leftWrapper = document.getElementById("left-wrapper");
    const rightWrapper = document.getElementById("right-wrapper");
    const collisionSound = document.getElementById("collision-sound");
  
    // Get the viewport width to calculate off-screen positions
    const viewportWidth = window.innerWidth;
  
    /* 
      Initial positioning:
      - The left wrapper starts completely off-screen to the left.
      - The right wrapper starts completely off-screen to the right.
      (Since each wrapper occupies 50% of the width,
       moving them by half the viewport width will hide them.)
    */
    gsap.set(leftWrapper, { x: -viewportWidth / 2 });
    gsap.set(rightWrapper, { x: viewportWidth / 2 });
  
    // Create a GSAP timeline to sequence the entrance and collision animations
    const tl = gsap.timeline();
  
    // Animate the left half from off-screen to its natural position (x: 0)
    tl.to(leftWrapper, {
      duration: 1.5,
      x: 0,
      ease: "power2.out"
    }, 0);
  
    // Animate the right half from off-screen to its natural position (x: 0)
    tl.to(rightWrapper, {
      duration: 1.5,
      x: 0,
      ease: "power2.out",
      onComplete: collisionEffect  // Trigger collision effect when they meet
    }, 0);
  
    // Optional: add a subtle scale pulse at the moment of impact
    tl.to([leftWrapper, rightWrapper], {
      duration: 0.5,
      scale: 1.05,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "+=0.2");
  
    // Function to handle the collision effect
    function collisionEffect() {
      // Play the twinkle sound effect (adjust volume as needed)
      collisionSound.volume = 0.5;
      collisionSound.play();
  
      // Bounce away the "EDO" part with a physics-based animation
      gsap.to(".bounce-out", {
        duration: 1.5,
        physics2D: {
          velocity: 600,  // pixels per second
          angle: -90,     // Launch straight upward
          gravity: 800    // Gravity for a natural arc
        },
        opacity: 0,       // Fade out while bouncing
        ease: "power2.in"
      });
  
      // Animate the overlapping "A" so that it shifts to merge with "KAAYA"
      gsap.to(".overlap", {
        duration: 0.3,
        x: -20,  // Shift left (adjust as needed for a perfect merge)
        ease: "power2.out",
        onComplete: function() {
          // Fade out the duplicate "A" after shifting
          gsap.to(".overlap", { duration: 0.2, opacity: 0 });
        }
      });
    }
  };
  
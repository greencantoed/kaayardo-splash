document.addEventListener("DOMContentLoaded", function() {
    // Debugging log
    console.log("Script loaded. DOMContentLoaded fired.");
  
    // Register GSAP's Physics2DPlugin
    gsap.registerPlugin(Physics2DPlugin);
  
    // Grab references to our elements
    const leftName  = document.getElementById("left-name");
    const rightName = document.getElementById("right-name");
  
    // We'll push each name off-screen by 120% of viewport width
    // so they're fully hidden initially.
    const offset = window.innerWidth * 1.2;
  
    // ============== STEP 1: Immediate Setup ==============
    // Immediately place them off-screen & make them visible (but off-canvas).
    gsap.set(leftName, {
      x: -offset,
      visibility: "visible"
    });
    gsap.set(rightName, {
      x: offset,
      visibility: "visible"
    });
  
    // ============== STEP 2: Create Main Timeline ==============
    const tl = gsap.timeline();
  
    // 2a) Sprint both texts from off-screen to center
    tl.to(leftName, {
      duration: 0.8,
      x: 0,            // "0" means back to its default transform (center screen)
      ease: "power2.out"
    }, 0);
  
    tl.to(rightName, {
      duration: 0.8,
      x: 0,
      ease: "power2.out"
    }, 0);
  
    // 2b) Subtle scale pulse at the collision moment
    tl.to([leftName, rightName], {
      duration: 0.3,
      scale: 1.05,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, "+=0.1");
  
    // 2c) Trigger the collision effect in the timeline
    tl.add(() => {
      console.log("Collision effect triggered.");
      collisionEffect();
    }, "+=0.1");
  
    // 2d) After collision, highlight final “KAAYARDO” (optional)
    // We wait a bit so "EDO" has time to bounce away and "A" to fade
    tl.add(() => {
      console.log("Final highlight triggered.");
      finalHighlight();
    }, "+=0.5");
  
    // ============== STEP 3: Collision Effect ==============
    function collisionEffect() {
      // A) Bounce “EDO” upward with physics
      gsap.to(".bounce-out", {
        duration: 0.8,
        physics2D: {
          velocity: 600,   // The initial speed (px/sec)
          angle: -90,      // Straight up
          gravity: 1200    // Gravity pulling it back down
        },
        opacity: 0,        // Fade as it flies
        ease: "power2.in"
      });
  
      // B) Shift the overlapping “A” left, then fade it
      gsap.to(".overlap", {
        duration: 0.4,
        x: -30,            // Adjust for best visual merge with “KAAYA”
        ease: "power2.out",
        onComplete: function() {
          gsap.to(".overlap", { duration: 0.2, opacity: 0 });
        }
      });
    }
  
    // ============== STEP 4: Final Highlight ==============
    // This step draws subtle attention to the newly formed "KAAYARDO"
    function finalHighlight() {
      // For a subtle effect, let's do a quick scale-up and fade to a lighter color
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
  
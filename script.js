// Wait for the DOM to load completely
document.addEventListener("DOMContentLoaded", function() {
    // Register GSAP's Physics2DPlugin
    gsap.registerPlugin(Physics2DPlugin);
  
    // Grab the text elements
    const leftName = document.getElementById("left-name");
    const rightName = document.getElementById("right-name");
  
    // Define an offset to position texts off-screen.
    // Here we use 75% of the viewport width.
    const offset = window.innerWidth * 0.75;
  
    // Set the initial positions:
    // leftName is shifted left; rightName is shifted right.
    gsap.set(leftName, { x: -offset });
    gsap.set(rightName, { x: offset });
  
    // Create a timeline to sequence the animation.
    const tl = gsap.timeline({
      onComplete: collisionEffect  // Trigger the collision effect once they meet
    });
  
    // Animate both texts into the center (x: 0 returns them to their original centered position)
    tl.to(leftName, { duration: 0.8, x: 0, ease: "power2.inOut" }, 0);
    tl.to(rightName, { duration: 0.8, x: 0, ease: "power2.inOut" }, 0);
  
    // Optional: add a subtle scale pulse at the moment of collision
    tl.to([leftName, rightName], { duration: 0.3, scale: 1.05, yoyo: true, repeat: 1, ease: "power2.inOut" }, "+=0.1");
  
    // Collision effect: bounce "EDO" upward and shift/fade the overlapping "A"
    function collisionEffect() {
      // Bounce the "EDO" part upward with a physics-based animation
      gsap.to(".bounce-out", {
        duration: 0.8,
        physics2D: {
          velocity: 500,   // Starting speed in pixels per second
          angle: -90,      // Launch straight upward
          gravity: 1000    // Gravity for a natural arc
        },
        opacity: 0,
        ease: "power2.in"
      });
  
      // Animate the overlapping "A" to shift left and then fade out,
      // so that the final result reads "KAAYARDO".
      gsap.to(".overlap", {
        duration: 0.3,
        x: -20,  // Adjust this value to achieve the perfect merge with "KAAYA"
        ease: "power2.out",
        onComplete: function() {
          gsap.to(".overlap", { duration: 0.2, opacity: 0 });
        }
      });
    }
  });
  
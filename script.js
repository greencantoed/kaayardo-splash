window.addEventListener('load', function() {
    // Ensure GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error("GSAP failed to load.");
        return;
    }

    // References for left and right name containers
    const nameLeft = document.getElementById('name-left');
    const nameRight = document.getElementById('name-right');
    
    // Calculate center position for better planning
    const centerX = window.innerWidth / 2;

    // Make containers visible before animation
    nameLeft.style.visibility = "visible";
    nameRight.style.visibility = "visible";
    
    // PHASE 1: Synchronized Slide-In Animation
    const slideTl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: gentleFall
    });
    
    // Set the same duration for both movements
    const slideDuration = 2;
    
    // Calculate precise stopping positions that are equidistant from center
    // These will be adjusted based on container widths
    const initialOffset = 150; // Distance from center (in px)
    
    // Slide left container from offscreen to left of center
    slideTl.fromTo(nameLeft,
        { left: "-100%" },
        { 
            duration: slideDuration, 
            left: centerX - initialOffset - nameLeft.offsetWidth + "px"
        },
        0 // Start at the same time
    );
    
    // Slide right container from offscreen to right of center
    slideTl.fromTo(nameRight,
        { right: "-100%" }, // Using right instead of left for symmetry
        { 
            duration: slideDuration, 
            right: "auto", // Remove right positioning
            left: centerX + initialOffset + "px" 
        },
        0 // Start at the same time
    );

    // PHASE 2: Gentle Fall of Designated Letters
    function gentleFall() {
        // Get all falling letters
        const fallingLetters = document.querySelectorAll('.letter.fall');
        
        // Create a timeline for synchronized falling
        const fallTl = gsap.timeline({
            defaults: { ease: "power1.in" },
            onComplete: () => {
                // Hide fallen letters completely after animation
                fallingLetters.forEach(letter => {
                    letter.style.display = "none";
                });
                
                // Start reassembly after all letters have fallen
                reassembleFinal();
            }
        });
        
        // Animate each falling letter
        fallingLetters.forEach((letter, index) => {
            // Get current position
            const rect = letter.getBoundingClientRect();
            
            // Add to timeline with staggered starts
            fallTl.to(letter, {
                duration: 2.5,
                delay: index * 0.15,
                top: window.innerHeight,
                left: rect.left + (Math.random() * 30 - 15), // Smaller random drift
                rotation: Math.random() * 8 - 4, // Subtle rotation
                opacity: 0
            }, index * 0.15); // Staggered start times
        });
    }

    // PHASE 3: Properly Reassemble Final Letters
    function reassembleFinal() {
        // Get all final letters
        const leftFinalLetters = nameLeft.querySelectorAll('.letter.final');
        const rightFinalLetters = nameRight.querySelectorAll('.letter.final');
        
        // Measure the complete width of each group accounting for letter spacing
        const getGroupWidth = (letterGroup) => {
            let width = 0;
            letterGroup.forEach(letter => {
                // Get the full width including any margin/padding
                const style = window.getComputedStyle(letter);
                const letterWidth = letter.offsetWidth + 
                                   parseFloat(style.marginLeft) + 
                                   parseFloat(style.marginRight);
                width += letterWidth;
            });
            return width;
        };
        
        // Get widths
        const leftWidth = getGroupWidth(leftFinalLetters);
        const rightWidth = getGroupWidth(rightFinalLetters);
        const totalWidth = leftWidth + rightWidth;
        
        // Calculate target positions for perfect centering
        // The left group should end exactly where the right group begins
        const leftGroupTarget = centerX - (totalWidth / 2);
        const rightGroupTarget = centerX - (totalWidth / 2) + leftWidth;
        
        // Create a timeline for synchronized reassembly
        const assembleTl = gsap.timeline({
            defaults: { 
                ease: "power2.inOut",
                duration: 1.5
            },
            onComplete: addGlow
        });
        
        // Move both groups simultaneously
        assembleTl.to(nameLeft, { left: leftGroupTarget + "px" }, 0);
        assembleTl.to(nameRight, { left: rightGroupTarget + "px" }, 0);
    }

    // Add glow effect to final letters
    function addGlow() {
        const finalLetters = document.querySelectorAll('.letter.final');
        
        // Create timeline for staggered glow effect
        const glowTl = gsap.timeline();
        
        // Add glow to each letter with a slight stagger
        glowTl.to(finalLetters, {
            duration: 0.3,
            stagger: 0.05,
            onComplete: function() {
                this.targets()[0].classList.add("glow");
            },
            onCompleteParams: ["{self}"]
        });
    }
});
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Art pieces data
const artPieces = [
  {
    src: '/images/art1.jpg',
    title: 'Mineral Genesis',
    year: '2024',
    medium: 'Iron Ore, Manganese & Acrylic on Canvas',
    description: 'An exploration of the primordial forces that shaped the earth\'s crust, using the very minerals of Jharkhand.',
    technique: 'Mixed mineral pigments with dimensional texturing',
    size: '120 × 90 cm'
  },
  {
    src: '/images/art2.jpg',
    title: 'Chotanagpur Dreams',
    year: '2024',
    medium: 'Bauxite, Mica & Coal Dust on Canvas',
    description: 'A tribute to the mining heritage of Jharkhand, where ancient earth meets contemporary expression.',
    technique: 'Layered mineral application with coarse texturing',
    size: '150 × 100 cm'
  },
  {
    src: '/images/art3.jpg',
    title: 'Prehistoric Echoes',
    year: '2023',
    medium: 'Ochre, Kaolin & Earth Dust on Canvas',
    description: 'Inspired by the ancient rock paintings of Jharkhand, bridging millennia through mineral art.',
    technique: 'Traditional ochre pigments with modern acrylic binding',
    size: '100 × 120 cm'
  },
  {
    src: '/images/art4.jpg',
    title: 'Chakradharpur Memories',
    year: '2023',
    medium: 'Hematite, Chrome & Wooden Dust on Canvas',
    description: 'A nostalgic journey to the artist\'s birthplace, rendered in the minerals of his homeland.',
    technique: 'Natural hematite with dimensional wood dust integration',
    size: '110 × 85 cm'
  },
  {
    src: '/images/art5.jpg',
    title: 'Industrial Meditation',
    year: '2024',
    medium: 'Manganese, Graphite & Ash on Canvas',
    description: 'The intersection of industry and nature, where mining landscapes become abstract poetry.',
    technique: 'Graphite layering with manganese oxide patination',
    size: '140 × 95 cm'
  },
  {
    src: '/images/art6.jpg',
    title: 'Tribal Abstractions',
    year: '2023',
    medium: 'Mica, Cadmium & Coir on Canvas',
    description: 'Ancient tribal motifs reimagined through the lens of contemporary mineral artistry.',
    technique: 'Mica flake integration with natural fiber textures',
    size: '130 × 100 cm'
  }
];

// Enhanced scroll progress
// Enhanced scroll progress (Corrected)
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  useLayoutEffect(() => {
    // This creates a ScrollTrigger instance that spans the entire page
    const pageTrigger = ScrollTrigger.create({
      start: 0, // Start at the very top
      end: "max", // End at the very bottom
      onUpdate: (self) => {
        // 'self' is the ScrollTrigger instance with all the progress data
        setProgress(self.progress * 100);
        
        const sectionHeight = window.innerHeight;
        const scrolled = self.scroll();
        const currentSectionIndex = Math.floor(scrolled / sectionHeight);
        setCurrentSection(Math.min(currentSectionIndex, artPieces.length));
      }
    });

    // Cleanup when the component unmounts
    return () => {
      if (pageTrigger) pageTrigger.kill();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="scroll-system">
      <div className="scroll-progress">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ height: `${progress}%` }}
          />
        </div>
        <div className="progress-text">{Math.round(progress)}%</div>
      </div>
      
      <div className="section-dots">
        {artPieces.map((_, index) => (
          <div 
            key={index}
            className={`dot ${currentSection === index + 1 ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

// Ultra-smooth art section with advanced transitions
const ArtSection = ({ art, index }) => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const contentElements = gsap.utils.toArray(content.querySelectorAll('.content-element'));

    if (!section || !imageContainer || !content || !overlay) return;

    // Set initial states for elements to be animated
    gsap.set(imageContainer, { autoAlpha: 0, scale: 0.8, y: 100 });
    gsap.set(contentElements, { autoAlpha: 0, y: 80, scale: 0.9 });
    
    // MatchMedia for responsive animations
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // -- DESKTOP ANIMATIONS --

      // 1. Entrance Animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(imageContainer, {
            autoAlpha: 1,
            scale: 1.15,
            y: 0,
            duration: 2.5,
            ease: 'power3.out'
          });
          gsap.to(contentElements, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 2,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.5
          });
        },
        onLeaveBack: () => {
           gsap.to(imageContainer, { autoAlpha: 0, scale: 0.8, y: 100, duration: 1.5, ease: 'power3.in' });
           gsap.to(contentElements, { autoAlpha: 0, y: 80, scale: 0.9, duration: 1.5, ease: 'power3.in' });
        },
        toggleActions: "play none none reverse"
      });
      
      // 2. Main Scroll-driven Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.5, // Smoothed out scrub
        }
      });

      tl.to(imageContainer, {
        scale: 0.6,
        y: 200,
        rotationX: 15,
        z: -300,
        ease: 'power1.inOut'
      }, 0)
      .to(content, {
        opacity: 0,
        y: 150,
        scale: 0.8,
        ease: 'power1.in'
      }, 0)
      .to(overlay, {
        opacity: 0.7,
        ease: 'none'
      }, 0);

      // 3. Mouse Parallax Effect
      let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
      const handleMouseMove = (e) => {
          const rect = section.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      
      const animateParallax = () => {
          mouseX += (targetX - mouseX) * 0.05;
          mouseY += (targetY - mouseY) * 0.05;
          gsap.set(imageContainer, {
              x: mouseX * 20, y: mouseY * 20,
              rotationY: mouseX * 5, rotationX: -mouseY * 5,
              transformPerspective: 1000,
          });
          requestAnimationFrame(animateParallax);
      };
      
      section.addEventListener('mousemove', handleMouseMove);
      animateParallax();

      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
      };
    });

    mm.add("(max-width: 768px)", () => {
      // -- MOBILE ANIMATIONS (Simplified) --

      // 1. Entrance Animation for Mobile
       ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(imageContainer, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.8,
            ease: 'power2.out'
          });
          gsap.to(contentElements, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 0.3
          });
        },
         onLeaveBack: () => {
           gsap.to(imageContainer, { autoAlpha: 0, scale: 0.8, y: 50, duration: 1, ease: 'power2.in' });
           gsap.to(contentElements, { autoAlpha: 0, y: 40, scale: 0.9, duration: 1, ease: 'power2.in' });
        },
        toggleActions: "play none none reverse"
      });

      // 2. Simplified Scroll-driven Animation for Mobile
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 2, // A bit more scrub for mobile
        }
      });

      tl.to(imageContainer, {
        scale: 0.7,
        y: 100,
        ease: 'power1.in'
      }, 0)
      .to(content, {
        opacity: 0,
        y: 80,
        ease: 'power1.in'
      }, 0);
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={sectionRef} className="art-section">
      <div ref={imageContainerRef} className="image-container">
        <div className="image-wrapper">
          <div 
            ref={imageRef}
            className={`artwork-image ${isLoaded ? 'loaded' : 'loading'}`}
          >
            <img 
              src={art.src}
              alt={art.title}
              onLoad={handleImageLoad}
            />
          </div>
          <div ref={overlayRef} className="image-overlay" />
          <div className="depth-layers">
            <div className="depth-layer layer-1"></div>
            <div className="depth-layer layer-2"></div>
            <div className="depth-layer layer-3"></div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="content-panel">
        <div className="panel-inner">
          <div className="content-header content-element">
            <div className="artwork-number">
              {String(index + 1).padStart(2, '0')} / {String(artPieces.length).padStart(2, '0')}
            </div>
            <div className="artwork-year">{art.year}</div>
          </div>
          
          <div className="content-main content-element">
            <h1 className="artwork-title">{art.title}</h1>
            <p className="artwork-medium">{art.medium}</p>
            <p className="artwork-size">{art.size}</p>
          </div>
          
          <div className="content-description content-element">
            <p>{art.description}</p>
          </div>
          
          <div className="content-technique content-element">
            <span className="technique-label">Technique</span>
            <p className="technique-description">{art.technique}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero section with smooth parallax
const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bioRef = useRef(null);
  const scrollHintRef = useRef(null);

  useLayoutEffect(() => {
    // Entrance animation
    const tl = gsap.timeline({ delay: 0.8 });
    
    tl.fromTo(titleRef.current.children, 
      { opacity: 0, y: 120, rotationX: 45 },
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0,
        duration: 2.5, 
        ease: 'power3.out',
        stagger: 0.15
      }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power2.out' },
      '-=1.8'
    )
    .fromTo(bioRef.current.children,
      { opacity: 0, y: 30, x: -30 },
      { 
        opacity: 1, 
        y: 0, 
        x: 0,
        duration: 1.8, 
        ease: 'power2.out',
        stagger: 0.1 
      },
      '-=1.5'
    )
    .fromTo(scrollHintRef.current,
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power2.out' },
      '-=1.2'
    );

    // Parallax
    gsap.to(titleRef.current, {
      y: 200,
      scale: 0.8,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
     gsap.to([subtitleRef.current, bioRef.current, scrollHintRef.current], {
      y: 150,
      opacity: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }, []);

  return (
    <div ref={heroRef} className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient" />
        <div className="hero-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }} />
          ))}
        </div>
      </div>
      
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          <span className="title-line">AJAY</span>
          <span className="title-line">CHAKRADHAR</span>
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          MINERAL ABSTRACT ARTIST
        </p>

        <div ref={bioRef} className="hero-bio">
          <p>Self-taught visionary from Chakradharpur, Jharkhand</p>
          <p>Transforming earth's minerals into contemporary art since 1999</p>
          <p>Pioneer of dimensional mineral painting techniques</p>
        </div>
      </div>

      <div ref={scrollHintRef} className="scroll-hint">
        <div className="hint-text">
          <span>EXPLORE COLLECTION</span>
        </div>
        <div className="hint-arrow">
          <div className="arrow-line" />
          <div className="arrow-head" />
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.from(footerRef.current.children, {
      opacity: 0,
      y: 80,
      stagger: 0.2,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-content">
        <div className="footer-header">
          <h2>Connect with the Artist</h2>
          <p>Discover more about mineral art and commission inquiries</p>
        </div>
        
        <div className="footer-grid">
          <div className="footer-section">
            <h3>About Ajay Chakradhar</h3>
            <p>
              Born in 1969 in Chakradharpur, Jharkhand, Ajay Chakradhar has been pioneering 
              mineral-based abstract art for over two decades. His innovative technique incorporates 
              iron ore, manganese, coal, bauxite, and mica from his native land.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Artistic Vision</h3>
            <p>
              Inspired by the Chotanagpur Plateau and its rich mining heritage, Chakradhar's work 
              explores the intersection of industry and nature, creating dimensional effects that 
              bridge ancient earth with contemporary expression.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <div className="contact-info">
              <a href="mailto:studio@ajaychakradhar.com">studio@ajaychakradhar.com</a>
              <span>Mumbai Studio, India</span>
              <span>+91 (0) 22 1234 5678</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Ajay Chakradhar — All Rights Reserved</p>
          <p>Mineral Art from the Heart of Jharkhand</p>
        </div>
      </div>
    </footer>
  );
};

// Enhanced cursor system
const CursorSystem = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Hide cursor on touch devices for better mobile experience
    if ('ontouchstart' in window) {
        if (cursorRef.current) cursorRef.current.style.display = 'none';
        if (followerRef.current) followerRef.current.style.display = 'none';
        return;
    }
    
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
};

// Main App
const App = () => {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    gsap.config({ 
      force3D: true,
      nullTargetWarn: false
    });
    
    // --- LENOIS SMOOTH SCROLL SETUP ---
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    // --- END LENOIS SETUP ---
    
    return () => {
      // Cleanup GSAP and Lenis on component unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&family=Playfair+Display:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Hide cursor for non-touch devices and let our custom cursor take over */
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
        
        ::-webkit-scrollbar { display: none; }

        html {
          scroll-behavior: auto; /* Let Lenis handle scroll behavior */
        }

        html.lenis {
          height: auto;
        }
        
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        
        .lenis.lenis-stopping iframe {
          pointer-events: none;
        }

        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #0a0a0a;
          color: #ffffff;
          overflow-x: hidden;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          will-change: scroll-position;
        }

        .cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background: #d4af37;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }

        .cursor-follower {
          position: fixed;
          top: 0;
          left: 0;
          width: 25px;
          height: 25px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        .scroll-system {
          position: fixed;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .scroll-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-track {
          width: 2px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 1px;
          position: relative;
        }

        .progress-fill {
          width: 100%;
          background: linear-gradient(180deg, #d4af37 0%, #f4d03f 100%);
          border-radius: 1px;
          transition: height 0.1s ease-out;
        }

        .progress-text {
          color: rgba(255,255,255,0.6);
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 1px;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .section-dots {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #d4af37;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
          transform: scale(1.2);
        }

        .artist-name {
          position: fixed;
          top: 40px;
          left: 50px;
          z-index: 1000;
          color: #d4af37;
          font-weight: 200;
          letter-spacing: 0.3em;
          font-size: 11px;
          text-transform: uppercase;
        }

        .hero-section {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1000px;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.12) 0%, transparent 70%),
            radial-gradient(circle at 75% 75%, rgba(244, 208, 63, 0.08) 0%, transparent 70%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1612 50%, #0a0a0a 100%);
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }

        .hero-content {
          text-align: center;
          z-index: 1;
          max-width: 900px;
          padding: 0 20px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(4rem, 12vw, 8rem);
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          line-height: 0.9;
          perspective: 800px;
        }

        .title-line {
          display: block;
          background: linear-gradient(135deg, #ffffff 0%, #d4af37 50%, #f4d03f 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transform-style: preserve-3d;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.6rem);
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.4em;
          margin-bottom: 2.5rem;
          font-weight: 200;
        }

        .hero-bio {
          margin-bottom: 5rem;
        }

        .hero-bio p {
          color: rgba(212, 175, 55, 0.9);
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          margin: 0.6rem 0;
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .scroll-hint {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .hint-text span {
          color: rgba(255,255,255,0.5);
          font-size: 9px;
          letter-spacing: 0.2em;
          font-weight: 300;
        }

        .hint-arrow {
          position: relative;
          animation: bounce 2.5s infinite ease-in-out;
        }

        .arrow-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, #d4af37, transparent);
        }

        .arrow-head {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 6px;
          height: 6px;
          border-right: 1px solid #d4af37;
          border-bottom: 1px solid #d4af37;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-12px);
          }
          60% {
            transform: translateY(-6px);
          }
        }

        .art-section {
          height: 100vh;
          width: 100vw;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          perspective: 2000px;
          transform-style: preserve-3d;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .image-wrapper {
          width: 85%;
          height: 80%;
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          transform-style: preserve-3d;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.05);
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .artwork-image.loading {
          background: linear-gradient(45deg, #1a1612, #2a2520);
        }

        .artwork-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transform-style: preserve-3d;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%);
          pointer-events: none;
          z-index: 2;
        }

        .depth-layers {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .depth-layer {
          position: absolute;
          top: -5%;
          left: -5%;
          right: -5%;
          bottom: -5%;
          border-radius: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .layer-1 {
          background: linear-gradient(45deg, rgba(212, 175, 55, 0.1), transparent);
          transform: translateZ(-10px);
        }

        .layer-2 {
          background: linear-gradient(135deg, rgba(244, 208, 63, 0.05), transparent);
          transform: translateZ(-20px);
        }

        .layer-3 {
          background: linear-gradient(225deg, rgba(255, 255, 255, 0.02), transparent);
          transform: translateZ(-30px);
        }

        .content-panel {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          width: 90%;
          max-width: 650px;
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          background: rgba(0,0,0,0.5);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }

        .panel-inner {
          padding: 35px 40px;
          text-align: center;
        }

        .content-element {
          will-change: transform, opacity;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .artwork-number {
          color: rgba(212, 175, 55, 0.8);
          font-size: 12px;
          letter-spacing: 0.1em;
          font-weight: 300;
        }

        .artwork-year {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          letter-spacing: 0.1em;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .content-main {
          margin-bottom: 25px;
        }

        .artwork-title {
          font-family: 'Playfair Display', serif;
          color: white;
          text-shadow: 2px 2px 15px rgba(0,0,0,0.8);
          margin-bottom: 15px;
          font-weight: 400;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .artwork-medium {
          color: #d4af37;
          text-shadow: 1px 1px 8px rgba(0,0,0,0.8);
          margin-bottom: 8px;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .artwork-size {
          color: rgba(255,255,255,0.7);
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .content-description {
          margin-bottom: 25px;
        }

        .content-description p {
          color: rgba(255,255,255,0.9);
          text-shadow: 1px 1px 8px rgba(0,0,0,0.8);
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          line-height: 1.6;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .content-technique {
          padding-top: 20px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          text-align: left;
        }

        .technique-label {
          color: rgba(212, 175, 55, 0.7);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .technique-description {
          color: rgba(255,255,255,0.7);
          font-size: clamp(0.9rem, 1.6vw, 1rem);
          font-style: italic;
          line-height: 1.4;
          font-weight: 300;
        }

        .footer {
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1612 50%, #0a0a0a 100%);
          padding: 120px 0 60px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          position: relative;
          z-index: 5;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 50px;
        }

        .footer-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .footer-header h2 {
          font-family: 'Playfair Display', serif;
          color: #d4af37;
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          margin-bottom: 15px;
          letter-spacing: 0.02em;
        }

        .footer-header p {
          color: rgba(255,255,255,0.7);
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 300;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 50px;
          margin-bottom: 60px;
        }

        .footer-section h3 {
          color: #d4af37;
          font-weight: 400;
          font-size: 1.3rem;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }

        .footer-section p {
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          font-size: 1rem;
          font-weight: 300;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-info a,
        .contact-info span {
          color: #d4af37;
          font-size: 1rem;
          font-weight: 300;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-info a:hover {
          color: #f4d03f;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .footer-bottom p {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          margin: 6px 0;
          font-weight: 300;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .artist-name {
            top: 25px;
            left: 25px;
            font-size: 10px;
          }

          .art-section {
            padding: 20px;
            height: 100vh;
            display: block; /* Change flex to block to stack elements */
            padding-top: 10vh;
          }

          .image-container {
            position: relative; /* Change from absolute for flow */
            width: 100%;
            height: 50%; /* Adjust height */
            top: auto;
            left: auto;
          }
          
          .image-wrapper {
            width: 95%;
            height: 100%;
          }

          .content-panel {
            position: relative; /* Change from absolute */
            bottom: auto;
            left: auto;
            transform: none;
            width: 100%;
            margin-top: -15%; /* Overlap the image slightly */
            backdrop-filter: none; /* Can be heavy on mobile */
            -webkit-backdrop-filter: none;
            background: rgba(0,0,0,0.7);
          }

          .panel-inner {
            padding: 25px 30px;
          }

          .footer-content {
            padding: 0 25px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .scroll-system {
            right: 15px;
            gap: 15px;
          }

          .progress-track {
            height: 150px;
          }

          .hero-bio {
            margin-bottom: 4rem;
          }

          .scroll-hint {
            bottom: 40px;
          }
        }

        @media (max-width: 480px) {
          .art-section {
            padding: 15px;
            padding-top: 8vh;
          }
          .image-container {
             height: 45%;
          }

          .panel-inner {
            padding: 20px 25px;
          }

          .content-header {
            margin-bottom: 20px;
          }

          .content-main {
            margin-bottom: 20px;
          }

          .content-technique {
            padding-top: 15px;
          }
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* GPU acceleration hints */
        .image-container,
        .content-panel,
        .hero-title {
          transform: translateZ(0);
        }
      `}</style>

      <div ref={mainRef} className="main-container">
        <CursorSystem />
        <ScrollProgress />

        <div className="artist-name">
          AJAY CHAKRADHAR
        </div>

        <HeroSection />

        {artPieces.map((art, index) => (
          <ArtSection key={index} art={art} index={index} />
        ))}

        <Footer />
      </div>
    </>
  );
};

export default App;
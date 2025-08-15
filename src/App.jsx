import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// Smooth scroll progress indicator
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const animationFrame = useRef(null);
  const currentProgress = useRef(0);
  const targetProgress = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current = Math.min((scrolled / maxScroll) * 100, 100);
      
      const sectionHeight = window.innerHeight;
      const currentSectionIndex = Math.floor(scrolled / sectionHeight);
      setCurrentSection(Math.min(currentSectionIndex, artPieces.length));
    };

    const animate = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.1;
      setProgress(currentProgress.current);
      animationFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    animate();
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

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

// Optimized art section with smooth animations
const ArtSection = ({ art, index }) => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;
    const content = contentRef.current;

    if (!section || !imageContainer || !content) return;

    // Smooth mouse parallax
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      mousePos.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mousePos.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const updateParallax = () => {
      mousePos.current.currentX += (mousePos.current.x - mousePos.current.currentX) * 0.1;
      mousePos.current.currentY += (mousePos.current.y - mousePos.current.currentY) * 0.1;
      
      gsap.set(imageContainer, {
        x: mousePos.current.currentX * 15,
        y: mousePos.current.currentY * 15,
        rotationY: mousePos.current.currentX * 2,
        rotationX: mousePos.current.currentY * 2,
      });
      
      gsap.set(content, {
        x: mousePos.current.currentX * 5,
        y: mousePos.current.currentY * 5,
      });

      rafId.current = requestAnimationFrame(updateParallax);
    };

    section.addEventListener('mousemove', handleMouseMove);
    updateParallax();

    // OPTIMIZED SCROLL ANIMATIONS
    
    // Simple fade in
    gsap.fromTo(imageContainer,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Main scroll effect - simplified for performance
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })
    .fromTo(imageContainer, 
      { y: -50 },
      { y: 100, ease: 'none' }
    )
    .fromTo(imageContainer,
      { scale: 1 },
      { scale: 1.1, ease: 'power1.inOut' },
      0
    );

    // Content animation - simplified
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    })
    .fromTo(content,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
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
              loading="lazy"
            />
          </div>
          <div className="image-overlay" />
        </div>
      </div>

      {/* Enhanced content panel with GUARANTEED visibility */}
      <div ref={contentRef} className="content-panel">
        <div className="panel-backdrop"></div>
        <div className="panel-inner">
          <div className="content-header">
            <div className="artwork-number">
              {String(index + 1).padStart(2, '0')} / {String(artPieces.length).padStart(2, '0')}
            </div>
            <div className="artwork-year">{art.year}</div>
          </div>
          
          <div className="content-main">
            <h1 className="artwork-title">{art.title}</h1>
            <p className="artwork-medium">{art.medium}</p>
            <p className="artwork-size">{art.size}</p>
          </div>
          
          <div className="content-description">
            <p>{art.description}</p>
          </div>
          
          <div className="content-technique">
            <span className="technique-label">Technique</span>
            <p className="technique-description">{art.technique}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero section
const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bioRef = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(titleRef.current.children, 
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1.5, 
        ease: 'power3.out',
        stagger: 0.2
      }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
      '-=1'
    )
    .fromTo(bioRef.current.children,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1, 
        ease: 'power2.out',
        stagger: 0.1 
      },
      '-=0.8'
    )
    .fromTo(scrollHintRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '-=0.5'
    );

    // Parallax on scroll
    gsap.to(titleRef.current, {
      y: 150,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to([subtitleRef.current, bioRef.current], {
      y: 100,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

  }, []);

  return (
    <div ref={heroRef} className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient" />
        <div className="hero-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
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

  useEffect(() => {
    gsap.fromTo(footerRef.current.children,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1.2, 
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
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

// Cursor system
const CursorSystem = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, followerX: 0, followerY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const animate = () => {
      pos.current.followerX += (pos.current.x - pos.current.followerX) * 0.1;
      pos.current.followerY += (pos.current.y - pos.current.followerY) * 0.1;
      
      cursor.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      follower.style.transform = `translate(${pos.current.followerX - 15}px, ${pos.current.followerY - 15}px)`;
      
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', moveCursor);
    animate();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      if (rafId.current) cancelAnimationFrame(rafId.current);
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
  useEffect(() => {
    // Configure GSAP for performance
    gsap.config({ 
      force3D: true,
      nullTargetWarn: false
    });
    
    // Setup ScrollTrigger
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 40
    });
    
    // Refresh on load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
          cursor: none !important;
        }

        ::-webkit-scrollbar { display: none; }

        html {
          scroll-behavior: auto;
        }

        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #0a0a0a;
          color: #ffffff;
          overflow-x: hidden;
          cursor: none !important;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Cursor styles */
        .cursor {
          position: fixed;
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: difference;
          will-change: transform;
        }

        .cursor-follower {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
        }

        /* Scroll progress */
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
          transition: none;
        }

        .progress-text {
          color: rgba(255,255,255,0.5);
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

        /* Hero section */
        .hero-section {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
            radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 70%),
            radial-gradient(circle at 75% 75%, rgba(244, 208, 63, 0.05) 0%, transparent 70%),
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
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
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
        }

        .title-line {
          display: block;
          background: linear-gradient(135deg, #ffffff 0%, #d4af37 50%, #f4d03f 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* Art section */
        .art-section {
          height: 100vh;
          width: 100vw;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          perspective: 1000px;
        }

        .image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .image-wrapper {
          width: 85%;
          height: 80%;
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,255,255,0.05);
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          position: relative;
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
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 2;
        }

        /* FIXED CONTENT PANEL - GUARANTEED VISIBILITY */
        .content-panel {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 90%;
          max-width: 650px;
          border-radius: 20px;
          overflow: hidden;
          will-change: transform;
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.9),
            0 10px 20px rgba(0,0,0,0.8),
            0 0 0 1px rgba(212, 175, 55, 0.2),
            inset 0 0 0 1px rgba(255,255,255,0.05);
        }

        .panel-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000000;
          opacity: 0.9;
        }

        .panel-inner {
          position: relative;
          padding: 35px 40px;
          text-align: center;
          background: linear-gradient(135deg, 
            rgba(10, 10, 10, 0.95) 0%, 
            rgba(20, 18, 15, 0.95) 50%, 
            rgba(10, 10, 10, 0.95) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .artwork-number {
          color: #d4af37;
          font-size: 12px;
          letter-spacing: 0.1em;
          font-weight: 400;
        }

        .artwork-year {
          background: rgba(212, 175, 55, 0.15);
          color: #f4d03f;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          letter-spacing: 0.1em;
          border: 1px solid rgba(212, 175, 55, 0.3);
          font-weight: 500;
        }

        .content-main {
          margin-bottom: 25px;
        }

        .artwork-title {
          font-family: 'Playfair Display', serif;
          color: #ffffff;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.8);
          margin-bottom: 15px;
          font-weight: 400;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .artwork-medium {
          color: #f4d03f;
          text-shadow: 1px 1px 5px rgba(0,0,0,0.8);
          margin-bottom: 8px;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .artwork-size {
          color: rgba(255,255,255,0.8);
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .content-description {
          margin-bottom: 25px;
        }

        .content-description p {
          color: rgba(255,255,255,0.95);
          text-shadow: 1px 1px 5px rgba(0,0,0,0.8);
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
          color: #d4af37;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .technique-description {
          color: rgba(255,255,255,0.8);
          font-size: clamp(0.9rem, 1.6vw, 1rem);
          font-style: italic;
          line-height: 1.4;
          font-weight: 300;
        }

        /* Footer */
        .footer {
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1612 50%, #0a0a0a 100%);
          padding: 120px 0 60px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .artist-name {
            top: 25px;
            left: 25px;
            font-size: 10px;
          }

          .art-section {
            padding: 20px;
          }

          .image-wrapper {
            width: 95%;
            height: 65%;
          }

          .content-panel {
            bottom: 30px;
            width: 95%;
            max-width: none;
          }

          .panel-inner {
            padding: 25px 30px;
          }

          .panel-backdrop {
            opacity: 0.95;
          }

          .artwork-title {
            font-size: clamp(1.8rem, 6vw, 2.5rem);
          }

          .artwork-medium {
            font-size: clamp(1rem, 3vw, 1.2rem);
          }

          .content-description p {
            font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          }

          .footer-content {
            padding: 0 25px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .scroll-system {
            right: 20px;
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

          .image-wrapper {
            height: 60%;
          }

          .content-panel {
            bottom: 20px;
          }

          .artwork-title {
            font-size: 1.8rem;
          }

          .artwork-medium {
            font-size: 1rem;
          }

          .artwork-size {
            font-size: 0.85rem;
          }

          .content-description p {
            font-size: 0.9rem;
          }

          .technique-description {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 360px) {
          .panel-inner {
            padding: 18px 22px;
          }

          .image-wrapper {
            width: 98%;
            height: 55%;
          }

          .artwork-title {
            font-size: 1.6rem;
          }
        }

        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .hint-arrow {
            animation: none;
          }

          .particle {
            animation: none;
          }
        }

        /* GPU acceleration */
        .image-container,
        .content-panel,
        .artwork-image,
        .hero-title {
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Touch devices */
        @media (hover: none) and (pointer: coarse) {
          .cursor,
          .cursor-follower {
            display: none;
          }
          
          * {
            cursor: auto !important;
          }
        }
      `}</style>

      <div className="main-container">
        <CursorSystem />
        <ScrollProgress />

        <div className="artist-name">
          AJAY CHAKRADHAR
        </div>

        <HeroSection />

        {artPieces.map((art, index) => (
          <div key={index} data-section={index + 1}>
            <ArtSection art={art} index={index} />
          </div>
        ))}

        <Footer />
      </div>
    </>
  );
};

export default App;
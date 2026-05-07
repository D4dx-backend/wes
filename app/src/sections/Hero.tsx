import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const wesRef = useRef<HTMLHeadingElement>(null);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLImageElement>(null);
  const shape2Ref = useRef<HTMLImageElement>(null);
  const shape3Ref = useRef<HTMLImageElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating shapes continuous animation
      gsap.to(shape1Ref.current, {
        y: -20,
        scale: 1.05,
        rotation: 2,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to(shape2Ref.current, {
        x: 15,
        scale: 1.1,
        duration: 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to(shape3Ref.current, {
        y: -15,
        scale: 1.08,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        badgeRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          wesRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          titleRefs.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          bannerRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          [shape1Ref.current, shape2Ref.current, shape3Ref.current],
          { opacity: 0 },
          { opacity: 0.7, stagger: 0.1, duration: 1.5, ease: 'power2.out' },
          0.5
        );

      // Particles animation
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        gsap.fromTo(
          particles,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.05,
            duration: 0.5,
            delay: 1.5,
            ease: 'power2.out',
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Generate random particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero"
    >
      {/* Floating Organic Shapes */}
      <img
        ref={shape1Ref}
        src="/shape-coral.png"
        alt=""
        className="absolute right-[-10%] top-[10%] w-[60vw] max-w-[700px] opacity-0 pointer-events-none mix-blend-screen"
        style={{ filter: 'blur(2px)' }}
      />
      <img
        ref={shape2Ref}
        src="/shape-gold.png"
        alt=""
        className="absolute right-[5%] bottom-[10%] w-[35vw] max-w-[400px] opacity-0 pointer-events-none mix-blend-soft-light"
        style={{ filter: 'blur(3px)' }}
      />
      <img
        ref={shape3Ref}
        src="/shape-magenta.png"
        alt=""
        className="absolute left-[-15%] top-[30%] w-[50vw] max-w-[550px] opacity-0 pointer-events-none mix-blend-screen"
        style={{ filter: 'blur(4px)' }}
      />

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Top Badge */}
        <div
          ref={badgeRef}
          className="flex items-center justify-center gap-3 mb-8 opacity-0"
        >
          <span className="text-primary text-xs">&#9670;</span>
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-foreground/80">
            Jamaat-e-Islami Hind · Women&apos;s Wing Kerala
          </span>
          <span className="text-primary text-xs">&#9670;</span>
        </div>

        {/* WES Logo */}
        <img
          ref={wesRef}
          src="/Wes.png"
          alt="WES"
          className="w-[200px] sm:w-[280px] lg:w-[350px] mx-auto mb-8 opacity-0 object-contain"
        />

        {/* Title Lines */}
        <h2
          ref={(el) => { if (el) titleRefs.current[0] = el; }}
          className="font-['Syne'] text-[48px] sm:text-[64px] lg:text-[80px] font-bold text-foreground leading-[1.0] opacity-0 uppercase tracking-tight"
        >
          Women
        </h2>
        <h2
          ref={(el) => { if (el) titleRefs.current[1] = el; }}
          className="font-['Syne'] text-[48px] sm:text-[64px] lg:text-[80px] font-bold text-foreground leading-[1.0] opacity-0 uppercase tracking-tight"
        >
          Entrepreneurs
        </h2>
        <h2
          ref={(el) => { if (el) titleRefs.current[2] = el; }}
          className="font-['Syne'] text-[48px] sm:text-[64px] lg:text-[80px] font-bold text-foreground leading-[1.0] mb-8 opacity-0 uppercase tracking-tight"
        >
          Summit
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl font-light italic text-foreground/70 mb-10 opacity-0"
        >
          Celebrating Innovation, Leadership &amp; Empowerment
        </p>

        {/* Date Banner */}
        <div
          ref={bannerRef}
          className="inline-flex items-center gap-4 sm:gap-6 bg-white/60 backdrop-blur-md border border-black/10 rounded-2xl px-6 sm:px-10 py-4 mb-10 opacity-0 shadow-sm"
        >
          <div className="flex items-center gap-2 text-foreground text-sm sm:text-base font-medium">
            <span className="text-primary">&#9670;</span>
            <span>JUNE 2026</span>
            <span className="text-primary">&#9670;</span>
          </div>
          <div className="text-foreground font-bold text-[64px] sm:text-[80px] leading-none font-['Syne'] tracking-tighter">
            20
          </div>
          <div className="flex items-center gap-2 text-foreground text-sm sm:text-base font-medium">
            <span>Saturday</span>
            <span className="text-primary">&#9670;</span>
            <span>Kozhikode</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}

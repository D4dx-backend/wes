import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import RegistrationForm from '../components/RegistrationForm';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const wesRef = useRef<HTMLImageElement>(null);
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

  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    }))
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden gradient-hero"
    >
      {/* Floating Organic Shapes */}
      <img
        ref={shape1Ref}
        src="/shape-coral.png"
        alt=""
        className="absolute right-[-18%] top-[8%] w-[72vw] max-w-[700px] opacity-0 pointer-events-none mix-blend-screen sm:right-[-10%] sm:top-[10%] sm:w-[60vw]"
        style={{ filter: 'blur(2px)' }}
      />
      <img
        ref={shape2Ref}
        src="/shape-gold.png"
        alt=""
        className="absolute right-[-4%] bottom-[10%] w-[44vw] max-w-[400px] opacity-0 pointer-events-none mix-blend-soft-light sm:right-[5%] sm:w-[35vw]"
        style={{ filter: 'blur(3px)' }}
      />
      <img
        ref={shape3Ref}
        src="/shape-magenta.png"
        alt=""
        className="absolute left-[-28%] top-[26%] w-[68vw] max-w-[550px] opacity-0 pointer-events-none mix-blend-screen sm:left-[-15%] sm:top-[30%] sm:w-[50vw]"
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
      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-24 text-center sm:px-6 sm:pb-24 sm:pt-32">
        {/* Top Badge */}
        <div
          ref={badgeRef}
          className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 opacity-0 sm:mb-8"
        >
          <span className="text-primary text-xs">&#9670;</span>
          <span className="max-w-[17rem] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/80 sm:max-w-none sm:text-sm sm:tracking-[0.15em]">
            Jamaat-e-Islami Hind · Women&apos;s Wing Kerala
          </span>
          <span className="text-primary text-xs">&#9670;</span>
        </div>

        {/* WES Logo */}
        <img
          ref={wesRef}
          src="/Wes.png"
          alt="WES"
          className="mx-auto mb-5 w-[148px] object-contain opacity-0 sm:mb-8 sm:w-[280px] lg:w-[350px]"
        />

        {/* Title Lines */}
        <h2
          ref={(el) => { if (el) titleRefs.current[0] = el; }}
          className="mx-auto max-w-[16rem] px-1 font-['Syne'] text-[clamp(1.8rem,7.5vw,2.3rem)] font-bold uppercase tracking-[-0.04em] text-foreground opacity-0 leading-[0.92] sm:max-w-none sm:px-0 sm:text-[64px] sm:tracking-tight lg:text-[80px]"
        >
          Women
        </h2>
        <h2
          ref={(el) => { if (el) titleRefs.current[1] = el; }}
          className="mx-auto max-w-[16rem] px-1 font-['Syne'] text-[clamp(1.55rem,6.6vw,2rem)] font-bold uppercase tracking-[-0.035em] text-foreground opacity-0 leading-[0.94] sm:max-w-none sm:px-0 sm:text-[64px] sm:tracking-tight lg:text-[80px]"
        >
          Entrepreneurs
        </h2>
        <h2
          ref={(el) => { if (el) titleRefs.current[2] = el; }}
          className="mx-auto mb-5 max-w-[16rem] px-1 font-['Syne'] text-[clamp(1.8rem,7.5vw,2.3rem)] font-bold uppercase tracking-[-0.04em] text-foreground opacity-0 leading-[0.92] sm:mb-8 sm:max-w-none sm:px-0 sm:text-[64px] sm:tracking-tight lg:text-[80px]"
        >
          Summit
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mb-7 max-w-[16rem] px-1 text-[0.95rem] font-light italic text-foreground/70 opacity-0 sm:mb-10 sm:max-w-xl sm:px-0 sm:text-xl"
        >
          Empowering Women Entrepreneurs
        </p>

        {/* Date Banner */}
        <div
          ref={bannerRef}
          className="inline-flex max-w-full flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-4 opacity-0 shadow-sm backdrop-blur-md sm:mb-10 sm:flex-row sm:gap-6 sm:px-10 sm:py-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-medium text-foreground sm:text-base">
            <span className="text-primary">&#9670;</span>
            <span>JUNE 2026</span>
            <span className="text-primary">&#9670;</span>
          </div>
          <div className="font-['Syne'] text-[48px] font-bold leading-none tracking-tighter text-foreground sm:text-[80px]">
            20
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-medium text-foreground sm:text-base">
            <span>Saturday</span>
            <span className="text-primary">&#9670;</span>
            <span>10 AM</span>
            <span className="text-primary">&#9670;</span>
            <span>Kozhikode</span>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <RegistrationForm
            trigger={
              <button className="pill-button pill-button-primary mx-auto inline-flex w-full max-w-[16rem] items-center justify-center gap-2 border border-black/10 bg-white text-foreground shadow-sm hover:bg-gray-50 sm:w-auto sm:max-w-none">
                Register Now
                <ArrowRight size={16} />
              </button>
            }
          />
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

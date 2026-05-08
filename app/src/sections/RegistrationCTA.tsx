import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

gsap.registerPlugin(ScrollTrigger);

export default function RegistrationCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          bodyRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          priceRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          infoRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="register"
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32 gradient-hero"
    >
      {/* Decorative background shapes */}
      <img
        src="/shape-coral.png"
        alt=""
        className="absolute -left-[20%] top-[10%] w-[50%] opacity-20 pointer-events-none mix-blend-screen animate-float-slow"
        style={{ filter: 'blur(20px)' }}
      />
      <img
        src="/shape-gold.png"
        alt=""
        className="absolute -right-[15%] bottom-[5%] w-[40%] opacity-15 pointer-events-none mix-blend-soft-light animate-float"
        style={{ filter: 'blur(25px)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          ref={headingRef}
          className="font-['Syne'] text-3xl sm:text-5xl lg:text-[64px] font-bold text-foreground leading-[1.1] tracking-tight mb-4 sm:mb-6 opacity-0"
        >
          Secure Your Place Today
        </h2>

        <p
          ref={bodyRef}
          className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-foreground/70 opacity-0 sm:mb-10 sm:text-lg"
        >
          Registration Fee: ₹1,000 per participant. Limited seats available. 
          Confirm your participation and be part of this transformative experience.
        </p>

        {/* Price Display */}
        <div
          ref={priceRef}
          className="mb-8 opacity-0 sm:mb-10"
        >
          <span
            className="font-['Syne'] text-[52px] sm:text-[80px] font-bold tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #1A0033, #E91E63)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 10px 24px rgba(233, 30, 99, 0.18))',
            }}
          >
            ₹1,000
          </span>
          <span className="mt-2 block text-sm uppercase tracking-wider text-foreground/55">
            per participant
          </span>
        </div>

        {/* CTA Button */}
        <RegistrationForm
          trigger={
            <button
              ref={ctaRef}
              className="pill-button pill-button-primary mb-7 inline-flex w-full max-w-[18rem] items-center justify-center gap-3 px-8 py-4 text-base opacity-0 animate-pulse-glow sm:mb-8 sm:max-w-none sm:px-12 sm:py-5 sm:text-xl"
            >
              Register Now
              <ArrowRight size={22} />
            </button>
          }
        />

        {/* Event Info */}
        <p
          ref={infoRef}
          className="mx-auto max-w-[20rem] text-sm text-foreground/60 opacity-0 sm:text-base"
        >
          Saturday, June 20, 2026 · Manuelsons Malabar Palace, Kozhikode
        </p>
      </div>
    </section>
  );
}

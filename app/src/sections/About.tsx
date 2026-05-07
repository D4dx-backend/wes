import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Mic, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, number: '500+', label: 'Women Entrepreneurs' },
  { icon: Mic, number: '10+', label: 'Expert Speakers' },
  { icon: Calendar, number: '1', label: 'Day of Inspiration' },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label reveal
      gsap.fromTo(
        labelRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Paragraphs reveal
      if (parasRef.current) {
        gsap.fromTo(
          parasRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: parasRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Stats cards stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-background py-24 lg:py-32"
    >
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full rotate-180">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H0Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left">
            {/* Section Label */}
            <span
              ref={labelRef}
              className="section-label text-primary block mb-6 opacity-0"
            >
              About the Summit
            </span>

            {/* Section Heading */}
            <h2
              ref={headingRef}
              className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 opacity-0 leading-[1.1] tracking-tight"
            >
              A Premier Gathering for <span className="text-primary">Visionary Women</span>
            </h2>

            {/* Body Paragraphs */}
            <div
              ref={parasRef}
              className="space-y-6"
            >
              <p className="text-base lg:text-lg text-foreground/80 leading-relaxed font-light">
                We are delighted to invite you to the Women Entrepreneurs Summit, a premier gathering 
                dedicated to celebrating and empowering the spirit of female innovation and leadership.
              </p>
              <p className="text-base lg:text-lg text-foreground/80 leading-relaxed font-light">
                This inspiring event will be held on Saturday, June 20, 2026, at the elegant 
                Manuelsons Malabar Palace, offering a refined and sophisticated setting for visionary 
                women to connect, exchange ideas, and grow together.
              </p>
              <p className="text-base lg:text-lg text-foreground/80 leading-relaxed font-light">
                Join us for a day of meaningful conversations, knowledge sharing, and networking with 
                like-minded entrepreneurs and leaders. The summit aims to inspire, support, and 
                strengthen the journey of women in business by creating opportunities for collaboration 
                and professional growth.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`glass-card glass-card-hover p-6 lg:p-8 flex flex-col items-start cursor-default relative overflow-hidden ${i === 2 ? 'sm:col-span-2' : ''}`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                <div className="w-14 h-14 mb-6 rounded-2xl bg-primary/5 border border-black/10 flex items-center justify-center backdrop-blur-md">
                  <stat.icon size={28} className="text-primary" />
                </div>
                <div className="font-['Syne'] text-4xl lg:text-5xl font-bold text-foreground mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

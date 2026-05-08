import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Star, Award, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Star, label: 'Elegant Banquet Hall' },
  { icon: Award, label: 'Premium Hospitality' },
  { icon: MapPin, label: 'Central Location' },
];

export default function Venue() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column parallax scale
      gsap.fromTo(
        leftRef.current,
        { scale: 1.05, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Right column content stagger
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current.querySelectorAll('.venue-reveal'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rightRef.current,
              start: 'top 75%',
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
      id="venue"
      ref={sectionRef}
      className="relative bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-24">
        <div className="grid min-h-[60vh] grid-cols-1 overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:grid-cols-2">
          {/* Left Column — Visual Map */}
          <div
            ref={leftRef}
            className="relative h-[280px] w-full sm:h-[360px] lg:h-auto"
          >
            <iframe 
              src="https://maps.google.com/maps?q=Manuelsons+Malabar+Palace,+Kozhikode&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              aria-hidden="false" 
              tabIndex={0}
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

        {/* Right Column — Content */}
        <div
          ref={rightRef}
          className="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-24"
        >
          <span className="venue-reveal section-label text-primary mb-4 sm:mb-6 opacity-0">
            The Venue
          </span>

          <h2 className="venue-reveal font-['Syne'] text-3xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.1] tracking-tight mb-3 sm:mb-4 opacity-0">
            Manuelsons Malabar Palace
          </h2>

          <p className="venue-reveal font-['Outfit'] text-base sm:text-xl font-light text-foreground/60 mb-5 sm:mb-6 opacity-0 uppercase tracking-[0.2em] sm:tracking-widest">
            Elegance Meets Inspiration
          </p>

          <p className="venue-reveal text-sm sm:text-base text-foreground/70 leading-relaxed mb-7 sm:mb-8 opacity-0">
            Located in the heart of Kozhikode, Manuelsons Malabar Palace offers a 
            refined and sophisticated setting for our summit. The venue&apos;s elegant 
            architecture and warm ambiance create the perfect environment for visionary 
            women to connect, exchange ideas, and grow together.
          </p>

          {/* Venue Features */}
          <div className="venue-reveal space-y-3 sm:space-y-4 mb-8 sm:mb-10 opacity-0">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 text-foreground/80"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/20 backdrop-blur-sm sm:h-12 sm:w-12">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <span className="text-sm sm:text-lg font-medium">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Get Directions Button */}
          <a
            href="https://maps.google.com/?q=Kozhikode+Kerala"
            target="_blank"
            rel="noopener noreferrer"
            className="venue-reveal pill-button flex items-center gap-2 border border-black/10 text-foreground bg-white hover:bg-gray-50 shadow-sm inline-flex w-fit opacity-0"
          >
            <Navigation size={18} />
            Get Directions
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}

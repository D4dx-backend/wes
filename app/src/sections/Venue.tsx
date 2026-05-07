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
      className="relative min-h-[70vh] bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5">
          {/* Left Column — Visual Map */}
          <div
            ref={leftRef}
            className="relative w-full h-[400px] lg:h-auto"
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
          className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-24"
        >
          <span className="venue-reveal section-label text-primary mb-6 opacity-0">
            The Venue
          </span>

          <h2 className="venue-reveal font-['Syne'] text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.1] tracking-tight mb-4 opacity-0">
            Manuelsons Malabar Palace
          </h2>

          <p className="venue-reveal font-['Outfit'] text-lg sm:text-xl font-light text-foreground/60 mb-6 opacity-0 uppercase tracking-widest">
            Elegance Meets Inspiration
          </p>

          <p className="venue-reveal text-base text-foreground/70 leading-relaxed mb-8 opacity-0">
            Located in the heart of Kozhikode, Manuelsons Malabar Palace offers a 
            refined and sophisticated setting for our summit. The venue&apos;s elegant 
            architecture and warm ambiance create the perfect environment for visionary 
            women to connect, exchange ideas, and grow together.
          </p>

          {/* Venue Features */}
          <div className="venue-reveal space-y-4 mb-10 opacity-0">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-foreground/80"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <span className="text-base sm:text-lg font-medium">
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

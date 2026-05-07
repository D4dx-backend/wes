import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scheduleItems = [
  {
    time: '09:00 AM',
    title: 'Registration & Welcome',
    description: 'Check-in, receive your welcome kit, and enjoy networking over refreshments.',
  },
  {
    time: '10:00 AM',
    title: 'Inaugural Session',
    description: 'Opening remarks by distinguished guests and introduction to the summit\'s vision.',
  },
  {
    time: '10:30 AM',
    title: 'Keynote Address',
    description: 'Inspiring keynote on women empowerment and entrepreneurship in today\'s world.',
  },
  {
    time: '11:30 AM',
    title: 'Panel Discussion',
    description: 'Expert panel on leadership, innovation, and building successful businesses.',
  },
  {
    time: '01:00 PM',
    title: 'Networking Lunch',
    description: 'A refined lunch experience at Manuelsons Malabar Palace with continued networking.',
  },
  {
    time: '02:30 PM',
    title: 'Workshop Sessions',
    description: 'Interactive workshops on business growth, digital marketing, and financial planning.',
  },
  {
    time: '04:30 PM',
    title: 'Closing Ceremony',
    description: 'Recognition of participants, closing remarks, and photo session.',
  },
];

export default function Schedule() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label and heading
      gsap.fromTo(
        [labelRef.current, headingRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Timeline line draws downward
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: itemsRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Timeline items
      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            item,
            { x: isLeft ? -50 : 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="relative bg-background py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Label */}
        <span
          ref={labelRef}
          className="section-label text-primary block text-center mb-6 opacity-0"
        >
          Event Schedule
        </span>

        {/* Section Heading */}
        <h2
          ref={headingRef}
          className="font-['Syne'] text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground text-center mb-16 opacity-0 leading-[1.1] tracking-tight"
        >
          A Day Designed for <span className="text-primary">Impact</span>
        </h2>

        {/* Timeline */}
        <div ref={itemsRef} className="relative">
          {/* Center Line */}
          <div
            ref={lineRef}
            className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-primary via-primary/30 to-transparent"
          />

          {/* Timeline Items */}
          <div className="space-y-10 lg:space-y-12">
            {scheduleItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`timeline-item relative flex items-start gap-6 lg:gap-0 opacity-0 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 animate-pulse-dot flex items-center justify-center bg-white border-2 border-primary shadow-[0_0_15px_rgba(233,30,99,0.3)]">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-14 lg:ml-0 lg:w-[45%] ${
                      isLeft ? 'lg:pr-12' : 'lg:pl-12'
                    }`}
                  >
                    <div className="glass-card bg-white border border-black/5 p-6 sm:p-8 group hover:border-primary/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/10" />
                      
                      {/* Time Badge */}
                      <span
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 bg-primary/5 text-primary border border-primary/20 backdrop-blur-md relative z-10"
                      >
                        {item.time}
                      </span>
                      <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight relative z-10">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground/65 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden lg:block lg:w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

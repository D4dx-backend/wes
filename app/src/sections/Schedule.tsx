import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scheduleItems = [
  {
    time: '09:00 AM',
    title: 'Registration & Welcome',
    description: 'Arrival, check-in, first conversations, and a warm opening to the summit atmosphere.',
  },
  {
    time: '10:00 AM',
    title: 'Inaugural Session',
    description: 'Opening reflections, the summit vision, and the tone for a day centred on women, enterprise, and impact.',
  },
  {
    time: '10:30 AM',
    title: 'Ethical & Value-Based Business',
    description: 'How principles, accountability, and values can strengthen business decisions and long-term growth.',
  },
  {
    time: '11:30 AM',
    title: 'Women Identity & Leadership',
    description: 'Conversations on self-belief, leadership presence, and building with clarity in different life stages.',
  },
  {
    time: '12:30 PM',
    title: 'Panel Discussion',
    description: 'Real stories from women entrepreneurs sharing honest lessons, turning points, and practical wisdom.',
  },
  {
    time: '01:30 PM',
    title: 'Networking Lunch',
    description: 'A relaxed midpoint to build connections, continue discussions, and meet peers from across sectors.',
  },
  {
    time: '02:30 PM',
    title: 'Digital Marketing & Branding',
    description: 'Sharper thinking on messaging, online presence, audience connection, and digital visibility.',
  },
  {
    time: '03:30 PM',
    title: 'Business Design Thinking',
    description: 'Creative tools to refine offers, solve business problems, and build more intentional growth paths.',
  },
  {
    time: '04:30 PM',
    title: 'Special Consultation Desks',
    description: 'Focused guidance and extended conversations for participants who want more tailored direction.',
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
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span
          ref={labelRef}
          className="section-label text-primary block text-center mb-4 sm:mb-6 opacity-0"
        >
          Program Flow
        </span>

        <h2
          ref={headingRef}
          className="font-['Syne'] text-3xl sm:text-5xl lg:text-[56px] font-bold text-white text-center mb-12 sm:mb-16 opacity-0 leading-[1.05] tracking-tight"
        >
          A full-day journey built to keep energy, insight, and connection moving.
        </h2>

        <div ref={itemsRef} className="relative">
          <div
            ref={lineRef}
            className="absolute left-4 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-[#ff77bd] via-[#d52fb2] to-transparent lg:left-1/2 lg:-translate-x-px"
          />

          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {scheduleItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`timeline-item relative flex items-start gap-4 sm:gap-6 lg:gap-0 opacity-0 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-4 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#ff7abd] bg-[#1a0727] shadow-[0_0_15px_rgba(255,97,170,0.45)] animate-pulse-dot lg:left-1/2 lg:h-5 lg:w-5">
                    <div className="w-1.5 h-1.5 bg-[#ff7abd] rounded-full"></div>
                  </div>

                  <div
                    className={`ml-10 sm:ml-14 lg:ml-0 lg:w-[45%] ${
                      isLeft ? 'lg:pr-12' : 'lg:pl-12'
                    }`}
                  >
                    <div className="glass-card relative overflow-hidden p-5 sm:p-8 transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl -mr-16 -mt-16 transition-all duration-500" />

                      <span
                        className="relative z-10 mb-4 inline-block rounded-full border border-white/14 bg-white/10 px-4 py-1.5 text-sm font-semibold text-[#ffd0e8] backdrop-blur-md"
                      >
                        {item.time}
                      </span>
                      <h3 className="relative z-10 font-['Syne'] text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

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

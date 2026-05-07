import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, BookOpen, TrendingUp, HeartHandshake } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Network,
    title: 'Networking & Collaboration',
    description:
      'Connect with fellow women entrepreneurs, share experiences, and build lasting professional relationships.',
  },
  {
    icon: BookOpen,
    title: 'Expert Talks & Knowledge Sharing',
    description:
      'Learn from industry leaders and successful entrepreneurs through insightful sessions and panel discussions.',
  },
  {
    icon: TrendingUp,
    title: 'Leadership & Business Insights',
    description:
      'Gain valuable strategies and insights to elevate your business and leadership skills to the next level.',
  },
  {
    icon: HeartHandshake,
    title: 'Meaningful Professional Connections',
    description:
      'Forge meaningful connections that support your entrepreneurial journey and open new opportunities.',
  },
];

export default function Highlights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column fade in
      gsap.fromTo(
        leftRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
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

      // Cards stagger in from right
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
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
      id="highlights"
      ref={sectionRef}
      className="relative py-24 lg:py-32 gradient-alt"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column — Sticky Heading */}
          <div
            ref={leftRef}
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start opacity-0"
          >
            <span className="section-label text-primary block mb-6">What to Expect</span>
            <h2 className="font-['Syne'] text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              An Inspiring Day of Growth &amp; Connection
            </h2>
            <p className="text-base lg:text-lg text-foreground/80 leading-relaxed font-light">
              Join us for an inspiring day of networking, expert talks, and 
              meaningful professional connections that will transform your 
              entrepreneurial journey.
            </p>
          </div>

          {/* Right Column — Highlight Cards */}
          <div
            ref={cardsRef}
            className="lg:col-span-8 space-y-6"
          >
            {highlights.map((item, i) => (
              <div
                key={i}
                className="glass-card bg-white p-6 sm:p-8 flex items-start gap-5 sm:gap-6 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] relative overflow-hidden border border-black/5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/10" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-md relative z-10">
                  <item.icon size={28} className="text-primary" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/65 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

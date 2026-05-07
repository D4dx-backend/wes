import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'About', id: 'about' },
  { label: 'Highlights', id: 'highlights' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Venue', id: 'venue' },
  { label: 'Register', id: 'register' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = footerRef.current?.querySelectorAll('.footer-reveal');
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative bg-gray-50 border-t border-black/5 pt-16 pb-8"
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), rgba(0,0,0,0.2), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 — Brand */}
          <div className="footer-reveal opacity-0">
            <img 
              src="/Wes.png" 
              alt="WES" 
              className="h-12 mb-4 object-contain"
            />
            <p className="text-sm text-foreground/60 mb-2">
              Women Entrepreneurs Summit 2026
            </p>
            <p className="text-sm text-foreground/50">
              Organized by Jamaat-e-Islami Hind
              <br />
              Women&apos;s Wing Kerala
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="footer-reveal opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">
              Quick Links
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-sm text-foreground/60 hover:text-primary hover:translate-x-1 transition-all duration-300"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3 — Contact */}
          <div className="footer-reveal opacity-0">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:womenwing.kerala@jih.in"
                className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary transition-colors group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                jihwomenkerala@gmail.com
              </a>
              <a
                href="tel:+9198XXXXXXXX"
                className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary transition-colors group"
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                +91 9947846195
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-reveal border-t border-black/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 opacity-0">
          <p className="text-xs text-foreground/50">
            © 2026 Women Entrepreneurs Summit. All rights reserved.
          </p>
          <p className="text-xs text-foreground/40 italic">
            Powered by <a href="https://d4dx.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">D4DX</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'Overview', id: 'about' },
  { label: 'Themes', id: 'highlights' },
  { label: 'Program', id: 'schedule' },
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
      className="relative border-t border-white/10 bg-[#12021d]/90 pt-12 pb-8 sm:pt-16"
    >
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(255,255,255,0.35), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3 mb-10 sm:mb-12">
          <div className="footer-reveal opacity-0 text-center md:text-left">
            <img 
              src="/Wes.png" 
              alt="WES" 
              className="h-12 mb-4 object-contain mx-auto md:mx-0"
            />
            <p className="text-sm text-white/76 mb-2">
              Women Entrepreneurs Summit 2026
            </p>
            <p className="text-sm text-white/52">
              Organized by Jamaat-e-Islami Hind
              <br />
              Women&apos;s Wing Kerala
            </p>
          </div>

          <div className="footer-reveal opacity-0 text-center md:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/82 mb-4">
              Quick Links
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-sm text-white/58 transition-all duration-300 hover:text-primary md:w-auto md:hover:translate-x-1"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-reveal opacity-0 text-center md:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/82 mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:womenwing.kerala@jih.in"
                className="group flex items-center justify-center gap-3 text-sm text-white/58 transition-colors hover:text-primary md:justify-start"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                jihwomenkerala@gmail.com
              </a>
              <a
                href="tel:+9198XXXXXXXX"
                className="group flex items-center justify-center gap-3 text-sm text-white/58 transition-colors hover:text-primary md:justify-start"
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                +91 7306057972
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 md:justify-start">
              <a
                href="https://www.instagram.com/wes_kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/wes_kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://chat.whatsapp.com/I98QTYi7ZxO4albqjXwSTj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp Group"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-reveal flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-center opacity-0 sm:flex-row sm:text-left">
          <p className="text-xs text-white/50">
            © 2026 Women Entrepreneurs Summit. All rights reserved.
          </p>
          <p className="text-xs text-white/40 italic">
            Powered by <a href="https://d4dx.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">D4DX</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

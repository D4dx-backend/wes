import { useEffect, useState, useRef } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import RegistrationForm from '../components/RegistrationForm';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current && mobileLinksRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        mobileLinksRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, delay: 0.1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Highlights', id: 'highlights' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'Venue', id: 'venue' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-[12px] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="transition-all hover:opacity-80 shrink-0"
            >
              <img src="/Wes.png" alt="WES" className="h-9 sm:h-10 md:h-12 object-contain" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative text-sm font-medium uppercase tracking-[0.1em] text-foreground/70 hover:text-foreground transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Register Button */}
            <div className="hidden md:block">
              <RegistrationForm
                trigger={
                  <button className="pill-button pill-button-primary flex items-center gap-2 border border-black/10 text-foreground bg-white hover:bg-gray-50">
                    Register Now
                    <ArrowRight size={16} />
                  </button>
                }
              />
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-foreground p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center px-6 py-24"
        >
          <div ref={mobileLinksRef} className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full rounded-2xl border border-black/5 bg-white px-5 py-4 font-['Outfit'] text-lg font-medium uppercase tracking-[0.1em] text-foreground/80 shadow-sm transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
            <RegistrationForm
              trigger={
                <button className="pill-button pill-button-primary mt-2 flex w-full items-center justify-center gap-2 border border-black/10 text-foreground bg-white hover:bg-gray-50">
                  Register Now
                  <ArrowRight size={16} />
                </button>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

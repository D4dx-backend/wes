import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import RegistrationForm from '../components/RegistrationForm';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current && mobileLinksRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 }
      );
      gsap.fromTo(
        mobileLinksRef.current.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, delay: 0.05, duration: 0.45, ease: 'power3.out' }
      );
    }
  }, [mobileOpen]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Overview', id: 'about' },
    { label: 'Themes', id: 'highlights' },
    { label: 'Program', id: 'schedule' },
    { label: 'Venue', id: 'venue' },
    { label: 'Register', id: 'register' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.07)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[76px] gap-3">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="transition-all hover:opacity-80 shrink-0"
            >
              <div className="flex items-center gap-2.5">
                <img src="/Wes.png" alt="WES" className="h-14 sm:h-16 lg:h-[70px] w-auto object-contain" />
                <div className="hidden text-left xl:block">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400">Women Entrepreneurs Summit</p>
                  <p className="text-[13px] font-semibold text-gray-700">Kozhikode · 20 June 2026</p>
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative text-sm font-medium uppercase tracking-[0.11em] text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              <a
                href="https://chat.whatsapp.com/I98QTYi7ZxO4albqjXwSTj"
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-sm font-medium uppercase tracking-[0.11em] text-[#25D366] hover:text-[#128C7E] transition-colors duration-300 group inline-flex items-center gap-1.5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Join Group
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-[#25D366] transition-all duration-300 group-hover:w-full" />
              </a>
            </div>

            {/* Desktop Register CTA */}
            <div className="hidden md:block shrink-0">
              <RegistrationForm
                trigger={
                  <button
                    className="pill-button inline-flex items-center gap-2 text-white"
                    style={{ background: 'linear-gradient(135deg, #c4187e 0%, #7318c4 100%)' }}
                  >
                    Register Now
                    <ArrowRight size={15} />
                  </button>
                }
              />
            </div>

            {/* Mobile: Register button + Hamburger */}
            <div className="md:hidden flex items-center gap-2 shrink-0">
              <RegistrationForm
                trigger={
                  <button
                    className="pill-button inline-flex items-center gap-1.5 text-sm text-white"
                    style={{ padding: '9px 16px', background: 'linear-gradient(135deg, #c4187e 0%, #7318c4 100%)' }}
                  >
                    Register
                  </button>
                }
              />
              <button
                className="rounded-full border border-black/10 bg-black/[0.04] p-2 text-gray-700"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white px-6 py-24"
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 rounded-full border border-black/8 bg-black/[0.04] p-2 text-gray-500 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
          <div ref={mobileLinksRef} className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full rounded-[22px] border border-black/8 bg-black/[0.03] px-5 py-4 font-['Outfit'] text-lg font-medium uppercase tracking-[0.1em] text-gray-600 transition-colors hover:bg-black/5 hover:text-gray-900"
              >
                {link.label}
              </button>
            ))}
            <RegistrationForm
              trigger={
                <button
                  className="pill-button mt-2 inline-flex w-full items-center justify-center gap-2 text-white"
                  style={{ background: 'linear-gradient(135deg, #c4187e 0%, #7318c4 100%)' }}
                >
                  Register Now
                  <ArrowRight size={16} />
                </button>
              }
            />
            <a
              href="https://chat.whatsapp.com/I98QTYi7ZxO4albqjXwSTj"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-button mt-1 inline-flex w-full items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join WhatsApp Group
            </a>
          </div>
        </div>
      )}
    </>
  );
}

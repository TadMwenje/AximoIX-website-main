import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`dark-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="dark-logo" onClick={() => scrollToSection('hero')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="AximoIX" style={{ height: '36px', width: '36px' }} />
          <span>AximoIX</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="dark-nav">
          <a 
            href="#hero" 
            className="dark-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
          >
            Home
          </a>
          <a 
            href="#services" 
            className="dark-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('services');
            }}
          >
            Services
          </a>
          <a 
            href="#about" 
            className="dark-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="dark-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
          >
            Contact
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px'
          }}
        >
          <a 
            href="#hero" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500'
            }}
          >
            Home
          </a>
          <a 
            href="#services" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('services');
            }}
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500'
            }}
          >
            Services
          </a>
          <a 
            href="#about" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500'
            }}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500'
            }}
          >
            Contact
          </a>
        </div>
      )}

      <style jsx>{`
        .scrolled {
          background: rgba(0, 0, 0, 0.9) !important;
          backdrop-filter: blur(20px);
        }

        @media (max-width: 768px) {
          .dark-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
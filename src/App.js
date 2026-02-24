import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import ServiceModal from "./components/ServiceModal";
import { useApi, apiService } from "./hooks/useApi";
import { 
  Monitor, 
  Brain, 
  Megaphone, 
  Code, 
  CreditCard, 
  ArrowRight,
  ArrowUp,
  Mail,
  Phone,
  MapPin,

  CheckCircle,
  Loader2,
  Shield,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';

// Lazy-loaded components for code splitting
const SplineComponent = lazy(() => import('./components/SplineComponent'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

// Icon mapping for services
const iconMap = {
  Monitor,
  Brain,
  Megaphone,
  Code,
  CreditCard
};

// Static images (can be moved to backend later)
const staticImages = {
  hero: "https://images.unsplash.com/photo-1672581437674-3186b17b405a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwwfHx8fDE3NTg1MzA2MTZ8MA&ixlib=rb-4.1.0&q=85",
  technology: "https://images.unsplash.com/photo-1485740112426-0c2549fa8c86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwwfHx8fDE3NTg1MzA2MTZ8MA&ixlib=rb-4.1.0&q=85",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4NDMzMDI1fDA&ixlib=rb-4.1.0&q=85"
};

function App() {
  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    service_interest: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [countersStarted, setCountersStarted] = useState(false);
  const [counters, setCounters] = useState({ projects: 0, clients: 0, countries: 0, uptime: 0 });
  const statsRef = useRef(null);

  // API hooks
  const { data: companyData, loading: companyLoading } = useApi('/company');
  const { data: servicesData, loading: servicesLoading } = useApi('/services');

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [companyLoading, servicesLoading]);

  // Typing effect for hero tagline
  const fullTagline = 'Where Vision Meets Velocity';
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullTagline.length) {
        setTypedText(fullTagline.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // Counter animation for stats
  const animateCounters = useCallback(() => {
    if (countersStarted) return;
    setCountersStarted(true);
    const targets = { projects: 150, clients: 50, countries: 12, uptime: 99.9 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCounters({
        projects: Math.round(targets.projects * eased),
        clients: Math.round(targets.clients * eased),
        countries: Math.round(targets.countries * eased),
        uptime: Math.round(targets.uptime * eased * 10) / 10,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  }, [countersStarted]);

  // Stats observer for counter trigger
  useEffect(() => {
    const ref = statsRef.current;
    if (!ref) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) animateCounters();
      },
      { threshold: 0.3 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [animateCounters, companyLoading, servicesLoading]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceLearnMore = async (serviceId) => {
    const result = await apiService.getServiceDetails(serviceId);
    if (result.success) {
      setSelectedService(result.data);
      setIsModalOpen(true);
    } else {
      alert('Unable to load service details. Please try again.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactMessage('');

    const result = await apiService.submitContact(contactForm);
    
    if (result.success) {
      setContactMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', service_interest: '', message: '' });
    } else {
      setContactMessage(`Error: ${result.error}`);
    }
    
    setContactSubmitting(false);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  // Loading state
  if (companyLoading || servicesLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <Loader2 size={48} style={{ color: 'var(--brand-primary)', animation: 'spin 1s linear infinite' }} />
        <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
          Loading AximoIX experience...
        </p>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Main page content
  const mainPageContent = (
    <div className="App">
      <Navigation />
      <main>
      
      {/* Hero Section */}
      <section id="hero" className="dark-full-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="hero-gradient-mesh" />
        <div className="grid-bg" />
        <div className="dark-content-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px', 
            alignItems: 'center',
            minHeight: '80vh'
          }}>
            {/* Left Content */}
            <div>
              <div className="reveal stagger-1">
                <p style={{ 
                  fontSize: '14px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '4px', 
                  color: 'var(--brand-primary)', 
                  marginBottom: '20px',
                  fontWeight: 500
                }}>
                  <span className="pulse-dot" />
                  Next-Generation Technology Partner
                </p>
              </div>
              <h1 className="display-huge glow-text reveal stagger-2" style={{ marginBottom: '24px' }}>
                {companyData?.name || 'AximoIX'}
              </h1>
              <p className="display-medium reveal stagger-3" style={{ 
                marginBottom: '16px', 
                color: 'var(--brand-primary)',
                textShadow: '0 0 10px var(--brand-glow)'
              }}>
                {companyData?.motto || 'Innovate. Engage. Grow.'}
              </p>
              <p className="body-large typing-cursor reveal stagger-4" style={{ marginBottom: '40px', maxWidth: '500px' }}>
                {typedText || (companyData?.tagline || 'Where Vision Meets Velocity')}
              </p>
              <p className="body-medium reveal stagger-5" style={{ marginBottom: '48px', maxWidth: '480px', opacity: 0.9 }}>
                {companyData?.description || 'Loading company information...'}
              </p>
              
              <div className="btn-container reveal" style={{ 
                display: 'flex', 
                gap: '20px', 
                flexWrap: 'wrap',
                transitionDelay: '0.6s'
              }}>
                <button 
                  className="btn-primary dark-button-animate"
                  onClick={() => scrollToSection('services')}
                >
                  Explore Services
                  <ArrowRight size={20} />
                </button>
                <button 
                  className="btn-secondary dark-button-animate"
                  onClick={() => scrollToSection('contact')}
                >
                  Get Started
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Right Content - Spline 3D */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SplineComponent 
                width="600px" 
                height="600px"
                fallbackContent={
                  <div style={{ textAlign: 'center', color: '#00FFD1' }}>
                    <img 
                      src={staticImages.hero}
                      alt="Futuristic Technology"
                      style={{
                        width: '400px',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '20px'
                      }}
                    />
                    <div style={{ fontSize: '18px', fontWeight: '500' }}>
                      Innovation at Light Speed
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Services Section */}
      <section id="services" className="dark-full-container" style={{ padding: '100px 0', position: 'relative' }}>
        <div className="grid-bg" />
        <div className="dark-content-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }} className="reveal">
            <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
              Our Services
            </h2>
            <p className="body-large" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              End-to-end technology solutions engineered to dominate your market and accelerate growth
            </p>
          </div>

          <div className="dark-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {servicesData?.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              return (
                <div 
                  key={service.id}
                  className={`service-card reveal stagger-${(index % 3) + 1}`}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '40px',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    const learnMore = e.currentTarget.querySelector('.learn-more-overlay');
                    if (learnMore) learnMore.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const learnMore = e.currentTarget.querySelector('.learn-more-overlay');
                    if (learnMore) learnMore.style.opacity = '0';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ 
                      color: 'var(--brand-primary)', 
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <IconComponent size={32} />
                      <h3 className="heading-2">{service.title}</h3>
                    </div>
                    
                    <p className="body-medium" style={{ marginBottom: '24px', opacity: 0.9 }}>
                      {service.description}
                    </p>
                    
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {service.features?.map((feature, idx) => (
                        <li key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          marginBottom: '8px',
                          color: 'var(--text-secondary)'
                        }}>
                          <CheckCircle size={16} style={{ color: 'var(--brand-primary)' }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Learn More Overlay */}
                  <div 
                    className="learn-more-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 255, 209, 0.1)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'all 0.3s ease-in-out',
                      zIndex: 10
                    }}
                    onClick={() => handleServiceLearnMore(service.id)}
                  >
                    <button 
                      className="btn-primary dark-button-animate"
                      style={{
                        background: 'var(--brand-primary)',
                        color: '#000000',
                        padding: '16px 32px',
                        fontSize: '18px',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 0 20px var(--brand-glow)'
                      }}
                    >
                      Learn More
                      <ArrowRight size={20} />
                    </button>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle, var(--brand-glow) 0%, transparent 70%)`,
                    opacity: 0.1,
                    zIndex: 1
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Stats Section */}
      <section className="dark-full-container" style={{ padding: '80px 0', position: 'relative' }}>
        <div className="dark-content-container">
          {/* Marquee background text */}
          <div className="marquee-wrapper" style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', zIndex: 0 }}>
            <span className="marquee-text">
              INNOVATE &nbsp; ENGAGE &nbsp; GROW &nbsp; INNOVATE &nbsp; ENGAGE &nbsp; GROW &nbsp;
              INNOVATE &nbsp; ENGAGE &nbsp; GROW &nbsp; INNOVATE &nbsp; ENGAGE &nbsp; GROW &nbsp;
            </span>
          </div>
          <div ref={statsRef} className="stats-grid reveal" style={{ position: 'relative', zIndex: 1 }}>
            <div className="stat-card reveal stagger-1">
              <div className="stat-number">{counters.projects}+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="stat-card reveal stagger-2">
              <div className="stat-number">{counters.clients}+</div>
              <div className="stat-label">Global Clients</div>
            </div>
            <div className="stat-card reveal stagger-3">
              <div className="stat-number">{counters.countries}+</div>
              <div className="stat-label">Countries Served</div>
            </div>
            <div className="stat-card reveal stagger-4">
              <div className="stat-number">{counters.uptime}%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why Choose Us / CTA Section */}
      <section className="dark-full-container" style={{ padding: '100px 0' }}>
        <div className="dark-content-container">
          <div className="cta-banner reveal-scale">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
                Why Industry Leaders Choose AximoIX
              </h2>
              <p className="body-large" style={{ maxWidth: '700px', margin: '0 auto 48px', opacity: 0.9 }}>
                We don't just build technology — we engineer competitive advantages that compound over time.
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '32px', 
                maxWidth: '900px', 
                margin: '0 auto 48px',
                textAlign: 'left'
              }}>
                <div className="reveal stagger-1" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Shield size={24} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Enterprise-Grade Security</h3>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>SOC 2 aligned processes and zero-trust architecture</p>
                  </div>
                </div>
                <div className="reveal stagger-2" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Zap size={24} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Rapid Delivery</h3>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>Agile sprints with 2-week deployment cycles</p>
                  </div>
                </div>
                <div className="reveal stagger-3" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Globe size={24} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Global Reach</h3>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>Operations spanning 4 continents and 12+ countries</p>
                  </div>
                </div>
                <div className="reveal stagger-4" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <TrendingUp size={24} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Measurable ROI</h3>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>Every engagement tied to KPIs that move the needle</p>
                  </div>
                </div>
              </div>
              <button 
                className="btn-primary dark-button-animate"
                onClick={() => scrollToSection('contact')}
              >
                Start a Conversation
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* About Section */}
      <section id="about" className="dark-full-container" style={{ padding: '100px 0' }}>
        <div className="dark-content-container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px', 
            alignItems: 'center' 
          }}>
            {/* Left - Content */}
            <div>
              <h2 className="display-large glow-text reveal-left" style={{ marginBottom: '40px' }}>
                About {companyData?.name || 'AximoIX'}
              </h2>
              
              <div className="reveal stagger-1" style={{ marginBottom: '40px' }}>
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Goal
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.goal || 'Loading...'}
                </p>
              </div>

              <div className="reveal stagger-2" style={{ marginBottom: '40px' }}>
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Vision
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.vision || 'Loading...'}
                </p>
              </div>

              <div className="reveal stagger-3">
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Mission
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.mission || 'Loading...'}
                </p>
              </div>
            </div>

            {/* Right - Images */}
            <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <img 
                src={staticImages.technology}
                alt="Technology Innovation"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              />
              <img 
                src={staticImages.business}
                alt="Business Growth"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Partners & Collaborators Section */}
      <section id="partners" className="dark-full-container" style={{ padding: '80px 0', overflow: 'hidden' }}>
        <div className="dark-content-container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
            <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
              Partners & Collaborators
            </h2>
            <p className="body-large" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              Trusted by industry-leading organizations worldwide
            </p>
          </div>
        </div>
        <div className="partners-carousel-wrapper">
          <div className="partners-carousel-track">
            {[
              { name: 'Expensify', logo: '/partners/expensify.svg' },
              { name: 'Pie Insurance', logo: '/partners/pie-insurance.svg' },
              { name: 'CloudTalk', logo: '/partners/cloudtalk.svg' },
              { name: 'Deskera', logo: '/partners/deskera.svg' },
              { name: 'Reserve Bank of New Zealand', logo: '/partners/rbnz.svg' },
              { name: 'Legal Ninjas', logo: '/partners/legal-ninjas.svg' },
              { name: 'GEM - Payment Services', logo: '/partners/gem.svg' },
              { name: 'TaxTim', logo: '/partners/taxtim.svg' },
            ].concat([
              { name: 'Expensify', logo: '/partners/expensify.svg' },
              { name: 'Pie Insurance', logo: '/partners/pie-insurance.svg' },
              { name: 'CloudTalk', logo: '/partners/cloudtalk.svg' },
              { name: 'Deskera', logo: '/partners/deskera.svg' },
              { name: 'Reserve Bank of New Zealand', logo: '/partners/rbnz.svg' },
              { name: 'Legal Ninjas', logo: '/partners/legal-ninjas.svg' },
              { name: 'GEM - Payment Services', logo: '/partners/gem.svg' },
              { name: 'TaxTim', logo: '/partners/taxtim.svg' },
            ]).map((partner, index) => (
              <div key={index} className="partner-logo-item">
                <img src={partner.logo} alt={partner.name} title={partner.name} width="120" height="40" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact Section */}
      <section id="contact" className="dark-full-container" style={{ padding: '100px 0' }}>
        <div className="dark-content-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }} className="reveal">
            <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
              Get in Touch
            </h2>
            <p className="body-large" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              Ready to accelerate your business? Let's architect the technology ecosystem that puts you ahead of the competition.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px', 
            alignItems: 'start' 
          }}>
            {/* Left - Contact Info */}
            <div>
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <Mail size={24} style={{ color: 'var(--brand-primary)' }} />
                  <h3 className="heading-3">Email</h3>
                </div>
                <p className="body-medium" style={{ marginLeft: '40px' }}>
                  {companyData?.contact?.email || 'hello@aximoix.com'}
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <Phone size={24} style={{ color: 'var(--brand-primary)' }} />
                  <h3 className="heading-3">Phone</h3>
                </div>
                <p className="body-medium" style={{ marginLeft: '40px' }}>
                  {companyData?.contact?.phone || '+1 470 506 4390'}
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <MapPin size={24} style={{ color: 'var(--brand-primary)' }} />
                  <h3 className="heading-3">Address</h3>
                </div>
                <p className="body-medium" style={{ marginLeft: '40px' }}>
                  {companyData?.contact?.address || '3rd Floor 120 West Trinity Place Decatur, GA 30030'}
                </p>
              </div>


            </div>

            {/* Right - Contact Form */}
            <div>
              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="contact-name" className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Name *
                  </label>
                  <input 
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="contact-email" className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Email *
                  </label>
                  <input 
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="contact-service" className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Service Interest
                  </label>
                  <select 
                    id="contact-service"
                    name="service_interest"
                    autoComplete="off"
                    value={contactForm.service_interest}
                    onChange={handleContactChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Select a service</option>
                    {servicesData?.map(service => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label htmlFor="contact-message" className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Message *
                  </label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    autoComplete="off"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      borderRadius: '4px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {contactMessage && (
                  <div style={{
                    marginBottom: '24px',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    backgroundColor: contactMessage.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 209, 0.1)',
                    border: `1px solid ${contactMessage.includes('Error') ? '#ff0000' : 'var(--brand-primary)'}`,
                    color: contactMessage.includes('Error') ? '#ff6b6b' : 'var(--brand-primary)'
                  }}>
                    {contactMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary dark-button-animate" 
                  style={{ width: '100%' }}
                  disabled={contactSubmitting}
                >
                  {contactSubmitting ? (
                    <>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="dark-full-container" style={{ 
        padding: '80px 0 40px', 
        borderTop: '1px solid var(--border-subtle)' 
      }}>
        <div className="dark-content-container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '48px',
            marginBottom: '60px'
          }}>
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/logo.svg" alt="AximoIX" style={{ height: '36px', width: '36px' }} width="36" height="36" />
                <span className="dark-logo" style={{ fontSize: '24px' }}>
                  {companyData?.name || 'AximoIX'}
                </span>
              </div>
              <p className="body-small" style={{ opacity: 0.7, marginBottom: '20px', maxWidth: '280px' }}>
                {companyData?.motto || 'Innovate. Engage. Grow.'}
              </p>

            </div>

            {/* Quick Links */}
            <div>
              <h3 className="heading-3" style={{ marginBottom: '20px', color: 'var(--brand-primary)' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="footer-link">Home</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }} className="footer-link">Services</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="footer-link">About Us</a></li>
                <li><a href="#partners" onClick={(e) => { e.preventDefault(); scrollToSection('partners'); }} className="footer-link">Partners</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="footer-link">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="heading-3" style={{ marginBottom: '20px', color: 'var(--brand-primary)' }}>Services</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {servicesData?.map(service => (
                  <li key={service.id}><span className="footer-link">{service.title}</span></li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="heading-3" style={{ marginBottom: '20px', color: 'var(--brand-primary)' }}>Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <span className="body-small" style={{ opacity: 0.8 }}>{companyData?.contact?.email || 'hello@aximoix.com'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <span className="body-small" style={{ opacity: 0.8 }}>{companyData?.contact?.phone || '+1 470 506 4390'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '3px' }} />
                  <span className="body-small" style={{ opacity: 0.8 }}>{companyData?.contact?.address || '3rd Floor 120 West Trinity Place Decatur, GA 30030'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div style={{ 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <p className="body-small" style={{ opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} {companyData?.name || 'AximoIX'}. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#/privacy" className="footer-link" style={{ fontSize: '14px' }}>Privacy Policy</a>
              <a href="#/terms" className="footer-link" style={{ fontSize: '14px' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      <ServiceModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
      />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top dark-button-animate"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          #hero > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          
          #about > div > div,
          #contact > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .display-huge {
            font-size: 40px !important;
          }
          
          .display-large {
            font-size: 32px !important;
          }
        }
      `}</style>
    </div>
  );

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={mainPageContent} />
      </Routes>
    </Suspense>
  );
}

export default App;
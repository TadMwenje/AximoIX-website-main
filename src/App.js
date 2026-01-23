import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import SplineComponent from "./components/SplineComponent";
import ServiceModal from "./components/ServiceModal";
import { useApi, apiService } from "./hooks/useApi";
import { 
  Monitor, 
  Brain, 
  Megaphone, 
  Code, 
  CreditCard, 
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle,
  Loader2
} from 'lucide-react';

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

  // API hooks
  const { data: companyData, loading: companyLoading } = useApi('/company');
  const { data: servicesData, loading: servicesLoading } = useApi('/services');

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

  return (
    <div className="App">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero" className="dark-full-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="dark-content-container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px', 
            alignItems: 'center',
            minHeight: '80vh'
          }}>
            {/* Left Content */}
            <div>
              <h1 className="display-huge glow-text" style={{ marginBottom: '24px' }}>
                {companyData?.name || 'AximoIX'}
              </h1>
              <p className="display-medium" style={{ 
                marginBottom: '16px', 
                color: 'var(--brand-primary)',
                textShadow: '0 0 10px var(--brand-glow)'
              }}>
                {companyData?.motto || 'Innovate. Engage. Grow.'}
              </p>
              <p className="body-large" style={{ marginBottom: '40px', maxWidth: '500px' }}>
                {companyData?.tagline || 'Empowering Business, Amplifying Success'}
              </p>
              <p className="body-medium" style={{ marginBottom: '48px', maxWidth: '480px', opacity: 0.9 }}>
                {companyData?.description || 'Loading company information...'}
              </p>
              
              {/* Replace the existing button container div with this: */}
<div className="btn-container" style={{ 
  display: 'flex', 
  gap: '20px', 
  flexWrap: 'wrap',
  flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
}}>
  <button 
    className="btn-primary dark-button-animate"
    onClick={() => scrollToSection('services')}
    style={{ flex: window.innerWidth <= 480 ? '1' : 'none' }}
  >
    Explore Services
    <ArrowRight size={20} />
  </button>
  <button 
    className="btn-secondary dark-button-animate"
    onClick={() => scrollToSection('contact')}
    style={{ flex: window.innerWidth <= 480 ? '1' : 'none' }}
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

      {/* Services Section */}
      <section id="services" className="dark-full-container" style={{ padding: '100px 0' }}>
        <div className="dark-content-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
              Our Services
            </h2>
            <p className="body-large" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              Comprehensive solutions tailored to drive your business forward in the digital age
            </p>
          </div>

          <div className="dark-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {servicesData?.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              return (
                <div 
                  key={service.id}
                  className="service-card"
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
              <h2 className="display-large glow-text" style={{ marginBottom: '40px' }}>
                About {companyData?.name || 'AximoIX'}
              </h2>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Goal
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.goal || 'Loading...'}
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Vision
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.vision || 'Loading...'}
                </p>
              </div>

              <div>
                <h3 className="heading-2" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }}>
                  Our Mission
                </h3>
                <p className="body-medium" style={{ opacity: 0.9 }}>
                  {companyData?.about?.mission || 'Loading...'}
                </p>
              </div>
            </div>

            {/* Right - Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

      {/* Contact Section */}
      <section id="contact" className="dark-full-container" style={{ padding: '100px 0' }}>
        <div className="dark-content-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="display-large glow-text" style={{ marginBottom: '24px' }}>
              Get in Touch
            </h2>
            <p className="body-large" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
              Ready to transform your business? Let's discuss how we can help you innovate, engage, and grow.
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
                  {companyData?.contact?.phone || '+1 (555) 123-4567'}
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <MapPin size={24} style={{ color: 'var(--brand-primary)' }} />
                  <h3 className="heading-3">Address</h3>
                </div>
                <p className="body-medium" style={{ marginLeft: '40px' }}>
                  {companyData?.contact?.address || '123 Innovation Drive, Tech City, TC 12345'}
                </p>
              </div>

              <div>
                <h3 className="heading-3" style={{ marginBottom: '20px' }}>Follow Us</h3>
                <div style={{ display: 'flex', gap: '16px', marginLeft: '40px' }}>
                  <a href={companyData?.contact?.social_media?.linkedin || '#'} style={{ color: 'var(--brand-primary)' }}>
                    <Linkedin size={24} />
                  </a>
                  <a href={companyData?.contact?.social_media?.twitter || '#'} style={{ color: 'var(--brand-primary)' }}>
                    <Twitter size={24} />
                  </a>
                  <a href={companyData?.contact?.social_media?.facebook || '#'} style={{ color: 'var(--brand-primary)' }}>
                    <Facebook size={24} />
                  </a>
                  <a href={companyData?.contact?.social_media?.instagram || '#'} style={{ color: 'var(--brand-primary)' }}>
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Name *
                  </label>
                  <input 
                    type="text"
                    name="name"
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
                  <label className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Email *
                  </label>
                  <input 
                    type="email"
                    name="email"
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
                  <label className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Service Interest
                  </label>
                  <select 
                    name="service_interest"
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
                  <label className="body-medium" style={{ display: 'block', marginBottom: '8px' }}>
                    Message *
                  </label>
                  <textarea 
                    name="message"
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

      {/* Footer */}
      <footer className="dark-full-container" style={{ 
        padding: '60px 0 40px', 
        borderTop: '1px solid var(--border-subtle)' 
      }}>
        <div className="dark-content-container">
          <div style={{ textAlign: 'center' }}>
            <div className="dark-logo" style={{ fontSize: '32px', marginBottom: '16px' }}>
              {companyData?.name || 'AximoIX'}
            </div>
            <p className="body-medium" style={{ marginBottom: '24px', opacity: 0.8 }}>
              {companyData?.motto || 'Innovate. Engage. Grow.'}
            </p>
            <p className="body-small" style={{ opacity: 0.6 }}>
              © 2025 {companyData?.name || 'AximoIX'}. All rights reserved.
            </p>
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
}

export default App;
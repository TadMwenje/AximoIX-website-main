import React from 'react';
import { X, CheckCircle, Star, Zap } from 'lucide-react';

const ServiceModal = ({ service, isOpen, onClose }) => {
  if (!isOpen || !service) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content"
        style={{
          background: 'var(--bg-secondary)',
          border: '2px solid var(--brand-primary)',
          borderRadius: '8px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 0 40px var(--brand-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '30px 40px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 className="display-medium glow-text">{service.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--brand-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          {/* Overview */}
          <section style={{ marginBottom: '40px' }}>
            <h3 className="heading-2" style={{ 
              color: 'var(--brand-primary)', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Star size={24} />
              Overview
            </h3>
            <p className="body-medium" style={{ opacity: 0.9, lineHeight: 1.6 }}>
              {service.detailed_info?.overview}
            </p>
          </section>

          {/* Benefits */}
          <section style={{ marginBottom: '40px' }}>
            <h3 className="heading-2" style={{ 
              color: 'var(--brand-primary)', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={24} />
              Key Benefits
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {service.detailed_info?.benefits?.map((benefit, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'rgba(0, 255, 209, 0.05)',
                  borderLeft: '3px solid var(--brand-primary)',
                  borderRadius: '4px'
                }}>
                  <CheckCircle size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                  <span className="body-medium" style={{ opacity: 0.9 }}>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Technologies */}
          <section style={{ marginBottom: '40px' }}>
            <h3 className="heading-2" style={{ 
              color: 'var(--brand-primary)', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Zap size={24} />
              Technologies & Tools
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px' 
            }}>
              {service.detailed_info?.technologies?.map((tech, index) => (
                <div key={index} style={{
                  padding: '12px 16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="body-small" style={{ fontWeight: '500' }}>{tech}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Case Studies */}
          {service.detailed_info?.case_studies?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h3 className="heading-2" style={{ 
                color: 'var(--brand-primary)', 
                marginBottom: '20px' 
              }}>
                Success Stories
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {service.detailed_info.case_studies.map((caseStudy, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--brand-primary)'
                  }}>
                    <p className="body-medium" style={{ 
                      opacity: 0.9, 
                      fontStyle: 'italic',
                      lineHeight: 1.5 
                    }}>
                      "{caseStudy}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div style={{
            marginTop: '40px',
            padding: '30px',
            background: 'rgba(0, 255, 209, 0.1)',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--brand-primary)'
          }}>
            <h4 className="heading-3" style={{ marginBottom: '16px' }}>
              Ready to Get Started?
            </h4>
            <p className="body-medium" style={{ marginBottom: '24px', opacity: 0.9 }}>
              Let's discuss how our {service.title.toLowerCase()} can transform your business.
            </p>
            <button 
              className="btn-primary dark-button-animate"
              onClick={() => {
                onClose();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us Now
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
            max-height: 95vh;
          }
          
          .modal-content > div {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceModal;
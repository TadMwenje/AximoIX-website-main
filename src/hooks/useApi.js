// useApi.js - ENHANCED WITH BETTER SERVICE DETAILS HANDLING
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

// Custom hook for API calls
export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${config.API_BASE_URL}${endpoint}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false
      });
      
      setData(response.data);
    } catch (err) {
      
      let errorMsg = 'Network error - cannot connect to server';
      
      if (err.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. Please check your connection.';
      } else if (err.response) {
        // Server responded with error status
        errorMsg = err.response.data?.detail || err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = 'No response from server. The backend might be down.';
      }
      
      setError(errorMsg);
      
      // Use mock data as fallback
      setMockData(endpoint, setData);
    } finally {
      setLoading(false);
    }
  }, [endpoint, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Mock data fallback for GitHub Pages
const setMockData = (endpoint, setData) => {
  console.log('📋 Using mock data for:', endpoint);
  
  if (endpoint === '/company') {
    setData({
      name: "AximoIX",
      motto: "Innovate. Engage. Grow.",
      tagline: "Where Vision Meets Velocity",
      description: "AximoIX is a next-generation technology partner engineering the future of business. We fuse enterprise ICT infrastructure, artificial intelligence, strategic marketing, custom software development, and financial technology into a single, powerful ecosystem — giving organizations the edge they need to outperform, outscale, and outlast the competition.",
      about: {
        goal: "To architect transformative technology ecosystems that accelerate growth, eliminate inefficiency, and position every client at the forefront of their industry — today and for the decades ahead.",
        vision: "To become the most trusted technology catalyst on the planet — the partner that enterprises, governments, and startups turn to when the stakes are high and the opportunity is now.",
        mission: "We engineer bespoke solutions at the intersection of AI, cloud infrastructure, fintech, and digital strategy. Every engagement is built on deep technical expertise, relentless innovation, and an unwavering commitment to measurable results that compound over time."
      },
      contact: {
        email: "hello@aximoix.com",
        phone: "+1 470 506 4390",
        address: "3rd Floor 120 West Trinity Place Decatur, GA 30030",
        social_media: {
          linkedin: "#",
          twitter: "#",
          facebook: "#",
          instagram: "#"
        }
      }
    });
  } else if (endpoint === '/services') {
    setData(getMockServices());
  }
};

// Helper function for mock services
const getMockServices = () => {
  return [
    {
      id: "1",
      title: "ICT Solutions",
      description: "Technology solutions for businesses - infrastructure, networking, and digital transformation services.",
      icon: "Monitor",
      features: ["Network Infrastructure", "Cloud Solutions", "Digital Transformation", "IT Consulting"],
      detailed_info: {
        overview: "Our ICT solutions provide comprehensive technology infrastructure and digital transformation services to modernize your business operations.",
        benefits: [
          "Improved operational efficiency and productivity",
          "Enhanced security and data protection",
          "Scalable infrastructure that grows with your business"
        ],
        technologies: [
          "Cloud Platforms (AWS, Azure, Google Cloud)",
          "Network Security Systems",
          "Enterprise Software Solutions"
        ],
        case_studies: [
          "Migrated 500+ employee company to cloud infrastructure, reducing IT costs by 40%"
        ]
      },
      is_active: true
    },
    {
      id: "2",
      title: "AI Solutions",
      description: "Artificial intelligence-powered solutions to automate processes and enhance decision-making.",
      icon: "Brain",
      features: ["Machine Learning", "Predictive Analytics", "Process Automation", "AI Consulting"],
      detailed_info: {
        overview: "Transform your business with cutting-edge AI solutions that automate complex processes and provide predictive insights.",
        benefits: [
          "Automated workflow processes saving 60% manual effort",
          "Predictive analytics for better business forecasting",
          "Enhanced customer experience through AI chatbots"
        ],
        technologies: [
          "Machine Learning Algorithms",
          "Natural Language Processing",
          "Computer Vision"
        ],
        case_studies: [
          "Developed AI chatbot reducing customer service response time by 75%"
        ]
      },
      is_active: true
    },
    {
      id: "3",
      title: "Advertising & Marketing",
      description: "Creative campaigns and strategies to amplify your brand and reach your target audience.",
      icon: "Megaphone",
      features: ["Digital Marketing", "Brand Strategy", "Creative Campaigns", "Social Media Marketing"],
      detailed_info: {
        overview: "Our comprehensive marketing and advertising services help businesses build strong brand presence and drive measurable growth.",
        benefits: [
          "Increased brand visibility and recognition",
          "Higher customer engagement and conversion rates",
          "Data-driven marketing strategies for better ROI"
        ],
        technologies: [
          "Marketing Automation Platforms",
          "Social Media Management Tools",
          "Analytics and Tracking Systems"
        ],
        case_studies: [
          "Increased client's social media engagement by 300% in 6 months"
        ]
      },
      is_active: true
    },
    {
      id: "4",
      title: "Programming & Coding",
      description: "Custom software development solutions tailored to your business needs and objectives.",
      icon: "Code",
      features: ["Web Development", "Mobile Apps", "Custom Software", "API Integration"],
      detailed_info: {
        overview: "Our expert development team creates custom software solutions specifically designed to meet your unique business requirements.",
        benefits: [
          "Custom solutions tailored to your specific needs",
          "Scalable architecture for future growth",
          "Modern, responsive user interfaces"
        ],
        technologies: [
          "React, Node.js, Python, Java",
          "Mobile Development (React Native, Flutter)",
          "Database Systems (MongoDB, PostgreSQL)"
        ],
        case_studies: [
          "Built e-commerce platform handling 10,000+ daily transactions"
        ]
      },
      is_active: true
    },
    {
      id: "5",
      title: "Financial Technology",
      description: "Innovative fintech solutions to streamline financial processes and enhance user experience.",
      icon: "CreditCard",
      features: ["Payment Systems", "Digital Banking", "Blockchain Solutions", "Financial Analytics"],
      detailed_info: {
        overview: "Our fintech solutions revolutionize financial operations through secure payment systems and advanced financial analytics.",
        benefits: [
          "Secure and compliant financial transactions",
          "Streamlined payment processing",
          "Advanced financial analytics and reporting"
        ],
        technologies: [
          "Payment Gateway Integration",
          "Blockchain Platforms",
          "Digital Wallet Systems"
        ],
        case_studies: [
          "Implemented payment system processing $1M+ monthly transactions"
        ]
      },
      is_active: true
    }
  ];
};

// Helper function to find mock service by ID
const getMockServiceById = (serviceId) => {
  const mockServices = getMockServices();
  return mockServices.find(service => service.id === serviceId) || null;
};

// API service functions
export const apiService = {
  submitContact: async (contactData) => {
    try {
      const apiUrl = `${config.API_BASE_URL}/contact`;
      console.log('📧 Submitting contact form to:', apiUrl);
      console.log('📝 Contact data:', contactData);
      
      const response = await axios.post(apiUrl, contactData, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Contact form submitted successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Contact form submission error:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.detail || error.message;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      
      // Still return success but with demo mode message
      return { 
        success: true, 
        data: {
          message: 'Message received (demo mode - not saved to database)',
          database: 'demo'
        }
      };
    }
  },

  getServices: async () => {
    try {
      const apiUrl = `${config.API_BASE_URL}/services`;
      const response = await axios.get(apiUrl, {
        timeout: 15000,
        withCredentials: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      
      // Return mock data as fallback
      const mockServices = getMockServices();
      console.log('📋 Using mock services data as fallback');
      return { success: true, data: mockServices };
    }
  },

  getServiceDetails: async (serviceId) => {
    try {
      const apiUrl = `${config.API_BASE_URL}/services/${serviceId}`;
      console.log(`🔍 Fetching service details for: ${serviceId} from ${apiUrl}`);
      const response = await axios.get(apiUrl, {
        timeout: 15000,
        withCredentials: false
      });
      
      console.log(`✅ Service details loaded:`, response.data);
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error(`❌ Error fetching service ${serviceId}:`, error);
      
      // Fallback to mock data
      const mockService = getMockServiceById(serviceId);
      
      if (mockService) {
        console.log(`📋 Using mock data for service: ${serviceId}`);
        return { success: true, data: mockService };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Service not found' 
      };
    }
  },

  getCompanyInfo: async () => {
    try {
      const apiUrl = `${config.API_BASE_URL}/company`;
      const response = await axios.get(apiUrl, {
        timeout: 15000,
        withCredentials: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching company info:', error);
      
      // Return mock data as fallback
      const mockCompany = {
        name: "AximoIX",
        motto: "Innovate. Engage. Grow.",
        tagline: "Where Vision Meets Velocity",
        description: "AximoIX is a next-generation technology partner engineering the future of business. We fuse enterprise ICT infrastructure, artificial intelligence, strategic marketing, custom software development, and financial technology into a single, powerful ecosystem — giving organizations the edge they need to outperform, outscale, and outlast the competition.",
        about: {
          goal: "To architect transformative technology ecosystems that accelerate growth, eliminate inefficiency, and position every client at the forefront of their industry — today and for the decades ahead.",
          vision: "To become the most trusted technology catalyst on the planet — the partner that enterprises, governments, and startups turn to when the stakes are high and the opportunity is now.",
          mission: "We engineer bespoke solutions at the intersection of AI, cloud infrastructure, fintech, and digital strategy. Every engagement is built on deep technical expertise, relentless innovation, and an unwavering commitment to measurable results that compound over time."
        },
        contact: {
          email: "hello@aximoix.com",
          phone: "+1 470 506 4390",
          address: "3rd Floor 120 West Trinity Place Decatur, GA 30030",
          social_media: {
            linkedin: "#",
            twitter: "#",
            facebook: "#",
            instagram: "#"
          }
        }
      };
      
      return { success: true, data: mockCompany };
    }
  },

  // Test connection function
  testConnection: async () => {
    try {
      const apiUrl = `${config.API_BASE_URL}/ping`;
      const response = await axios.get(apiUrl, {
        timeout: 10000,
        withCredentials: false
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        error: 'Cannot connect to backend server' 
      };
    }
  }
};
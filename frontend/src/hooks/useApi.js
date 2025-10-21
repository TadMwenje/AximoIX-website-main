// useApi.js - FIXED VERSION
import { useState, useEffect } from 'react';
import axios from 'axios';
import config, { API_BASE_URL } from '../config';

// Custom hook for API calls
export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🌐 Fetching from: ${API_BASE_URL}${endpoint}`);
      
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setData(response.data);
    } catch (err) {
      console.error(`❌ Error fetching ${endpoint}:`, err);
      setError(err.response?.data?.detail || err.message || 'An error occurred');
      
      // Set mock data as fallback for development only
      if (process.env.NODE_ENV === 'development') {
        setMockData(endpoint, setData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};


// Mock data fallback (development only)
const setMockData = (endpoint, setData) => {
  if (endpoint === '/company') {
    setData({
      name: "AximoIX",
      motto: "Innovate. Engage. Grow.",
      tagline: "Empowering Business, Amplifying Success",
      description: "AximoIX is a dynamic company offering a range of services, including ICT solutions, AI solutions, advertising and marketing, programming and coding, and financial technology. We partner with businesses to drive growth, improve efficiency, and achieve success.",
      about: {
        goal: "Empower businesses to thrive through innovative technology, creative marketing, and strategic financial solutions.",
        vision: "To be a leading provider of integrated ICT, AI, advertising, programming, and financial technology solutions, driving business growth and success.",
        mission: "At AximoIX, our mission is to deliver tailored solutions that combine technology, creativity, and innovation, fostering long-term partnerships and driving business success."
      },
      contact: {
        email: "hello@aximoix.com",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Drive, Tech City, TC 12345",
        social_media: {
          linkedin: "#",
          twitter: "#",
          facebook: "#",
          instagram: "#"
        }
      }
    });
  } else if (endpoint === '/services') {
    setData([
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
    ]);
  }
};

// API service functions
export const apiService = {
  // Contact form submission - FIXED for Azure Functions
  submitContact: async (contactData) => {
    try {
      console.log('📧 Submitting contact form to:', `${API_BASE_URL}/contact`);
      
      const response = await axios.post(`${API_BASE_URL}/contact`, contactData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Contact form submitted successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Contact form submission error:', error);
      
      if (error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          error: 'Request timeout. Please check your connection.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to send message. Please try again.' 
      };
    }
  },

  // Get services - FIXED error handling
  getServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`, {
        timeout: 10000
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to fetch services' 
      };
    }
  },

  // Get service details - FIXED for Azure Functions
  getServiceDetails: async (serviceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}`, {
        timeout: 10000
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`❌ Error fetching service ${serviceId}:`, error);
      
      // Return mock data only in development
      if (process.env.NODE_ENV === 'development') {
        const mockServices = {
          "1": {
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
            }
          }
        };
        return { success: true, data: mockServices[serviceId] || mockServices["1"] };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to fetch service details' 
      };
    }
  },

  // Get company information - FIXED for Azure Functions
  getCompanyInfo: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company`, {
        timeout: 10000
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching company info:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to fetch company information' 
      };
    }
  }
};

export { API_BASE_URL };
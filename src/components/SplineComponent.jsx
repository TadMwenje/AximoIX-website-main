import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const SplineComponent = ({ 
  scene = "https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode",
  width = "100%", // Changed from fixed px to percentage
  height = "400px", // Reduced height for mobile
  fallbackContent = null
}) => {
  const [isLowData, setIsLowData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check for low data connection
    if (navigator.connection) {
      const connection = navigator.connection;
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.saveData;
      setIsLowData(isSlowConnection);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Show fallback for low data connections or errors
  if (isLowData || hasError) {
    return (
      <div 
        style={{ 
        width, 
        height, 
        overflow: 'visible', 
        position: 'relative',
        border: '1px solid rgba(0, 255, 209, 0.2)',
        background: 'rgba(0, 0, 0, 0.5)',
        maxWidth: '600px', // Limit max width
        margin: '0 auto' // Center on desktop
      }}
      >
        {fallbackContent || (
          <div style={{ textAlign: 'center', color: '#00FFD1' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
              Optimized for your connection
            </div>
          </div>
        )}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 209, 0.05) 50%, transparent 70%)',
            animation: 'shimmer 2s infinite'
          }}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width, 
        height, 
        overflow: 'visible', 
        position: 'relative',
        border: '1px solid rgba(0, 255, 209, 0.2)',
        background: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10,
            color: '#00FFD1'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>Loading 3D Experience...</div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Preparing futuristic visuals</div>
          </div>
        </div>
      )}
      
      <Spline 
        scene={scene} 
        onLoad={handleLoad}
        onError={handleError}
        style={{ width: '100%', height: '100%' }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplineComponent;
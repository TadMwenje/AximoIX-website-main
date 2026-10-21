import React, { useState, useEffect, Suspense, lazy } from 'react';

// The Spline runtime is ~2MB of JS, so it is only fetched once the page has
// finished loading and only on devices that can comfortably run it.
const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE_TIMEOUT_MS = 15000;

const shouldSkip3D = () => {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(max-width: 900px)').matches) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const connection = navigator.connection;
  if (connection && (connection.saveData || /(^|-)(2g|3g)$/.test(connection.effectiveType || ''))) {
    return true;
  }
  return false;
};

const whenPageIsIdle = (callback) => {
  let idleId;
  const schedule = () => {
    idleId = window.requestIdleCallback
      ? window.requestIdleCallback(callback, { timeout: 3000 })
      : window.setTimeout(callback, 1500);
  };
  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
  return () => {
    window.removeEventListener('load', schedule);
    if (window.cancelIdleCallback && idleId) window.cancelIdleCallback(idleId);
    else window.clearTimeout(idleId);
  };
};

const SplineComponent = ({
  scene = "https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode",
  width = "100%",
  height = "400px",
  fallbackContent = null
}) => {
  const [skip3D] = useState(shouldSkip3D);
  const [ready, setReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (skip3D) return undefined;
    return whenPageIsIdle(() => setReady(true));
  }, [skip3D]);

  // Give up on the scene if it hasn't appeared in time and show the fallback
  useEffect(() => {
    if (!ready || isLoaded) return undefined;
    const timer = window.setTimeout(() => setHasError(true), SCENE_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [ready, isLoaded]);

  const frameStyle = {
    width,
    height,
    maxWidth: '100%',
    position: 'relative',
    border: '1px solid rgba(0, 255, 209, 0.2)',
    background: 'rgba(0, 0, 0, 0.5)',
    margin: '0 auto'
  };

  if (skip3D || hasError) {
    return (
      <div style={{ ...frameStyle, height: 'auto', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {fallbackContent || (
          <div style={{ textAlign: 'center', color: '#00FFD1', fontSize: '18px', fontWeight: '500' }}>
            Innovation at Light Speed
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            color: '#00FFD1',
            fontSize: '14px',
            opacity: 0.7
          }}
        >
          Loading 3D scene...
        </div>
      )}

      {ready && (
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default SplineComponent;

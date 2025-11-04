import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setLoadError(new Error('Google Maps API Key is not defined. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.'));
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      setIsLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      setIsLoaded(true);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.id = scriptId;
    script.async = true;
    script.onerror = () => setLoadError(new Error('Failed to load Google Maps script.'));
    document.head.append(script);

    return () => {
      // Clean up the script if the component unmounts before it loads
      if (document.getElementById(scriptId) && !isLoaded) {
        document.getElementById(scriptId)?.remove();
      }
      delete window.initGoogleMaps;
    };
  }, [isLoaded]);

  return { isLoaded, loadError, google: window.google };
};

export default useGoogleMaps;

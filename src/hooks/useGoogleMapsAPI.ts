
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";

const useGoogleMapsAPI = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      setIsLoaded(true);
    }).catch(e => {
      console.error("Failed to load Google Maps API", e);
    });
  }, []);

  return { isLoaded };
};

export default useGoogleMapsAPI;

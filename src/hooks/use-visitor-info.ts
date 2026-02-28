import { useState, useEffect } from "react";

interface GeoData {
  city: string;
  country: string;
}

export const useVisitorLocation = () => {
  const [location, setLocation] = useState<GeoData | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ip-api.com/json/?fields=city,country");
        if (res.ok) {
          const data = await res.json();
          setLocation({ city: data.city, country: data.country });
        }
      } catch {
        // Silently fail — location is a nice-to-have
      }
    };
    fetchLocation();
  }, []);

  return location;
};

export const useLiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
};

import { useEffect, useState } from "react";

interface GeoData {
  city: string;
  country: string;
}

const getTimezoneCity = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = timezone?.split("/").pop()?.replace(/_/g, " ");
  return city || "Unknown City";
};

export const useVisitorLocation = () => {
  const [location, setLocation] = useState<GeoData>({
    city: getTimezoneCity(),
    country: "",
  });

  useEffect(() => {
    let mounted = true;

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;

        const data = await res.json();
        if (!mounted) return;

        setLocation({
          city: data.city || getTimezoneCity(),
          country: data.country_name || "",
        });
      } catch {
        // Silently fail — location is a nice-to-have
      }
    };

    fetchLocation();

    return () => {
      mounted = false;
    };
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

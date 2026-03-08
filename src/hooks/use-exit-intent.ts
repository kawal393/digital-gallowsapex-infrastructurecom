import { useState, useEffect, useCallback } from "react";

const EXIT_SHOWN_KEY = "apex_exit_intent_shown";

export function useExitIntent() {
  const [showPopup, setShowPopup] = useState(false);

  const dismiss = useCallback(() => {
    setShowPopup(false);
    sessionStorage.setItem(EXIT_SHOWN_KEY, "true");
  }, []);

  useEffect(() => {
    // Don't show on mobile (no mouse leave) or if already shown
    if (sessionStorage.getItem(EXIT_SHOWN_KEY)) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 5 && e.relatedTarget === null) {
        // Wait at least 10 seconds on the page
        triggered = true;
        setShowPopup(true);
        sessionStorage.setItem(EXIT_SHOWN_KEY, "true");
      }
    };

    // Delay adding the listener so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { showPopup, dismiss };
}

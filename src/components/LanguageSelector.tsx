import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, changeLanguage } from "@/i18n";
import { Globe, Search, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language?.split('-')[0] || 'en';
  const currentConfig = LANGUAGES[i18n.language] || LANGUAGES[currentLang] || LANGUAGES.en;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLangs = Object.entries(LANGUAGES).filter(([code, lang]) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return lang.name.toLowerCase().includes(s) || lang.nativeName.toLowerCase().includes(s) || code.includes(s);
  });

  // Group by region
  const groups: Record<string, [string, typeof LANGUAGES[string]][]> = {
    "EU Official": [],
    "Asian": [],
    "Middle East & Central Asia": [],
    "African": [],
    "Other": [],
  };

  const euCodes = ['en','bg','cs','da','de','el','es','et','fi','fr','ga','hr','hu','it','lt','lv','mt','nl','pl','pt','ro','sk','sl','sv'];
  const asianCodes = ['zh','zh-TW','ja','ko','hi','bn','th','vi','id','ms','tl','my','km','ta','te','ml','kn','mr','gu','pa','ne','si'];
  const meCodes = ['ar','fa','he','tr','ur','kk','uz'];
  const africanCodes = ['sw','am','ha','yo','zu','af'];

  for (const entry of filteredLangs) {
    const code = entry[0];
    if (euCodes.includes(code)) groups["EU Official"].push(entry);
    else if (asianCodes.includes(code)) groups["Asian"].push(entry);
    else if (meCodes.includes(code)) groups["Middle East & Central Asia"].push(entry);
    else if (africanCodes.includes(code)) groups["African"].push(entry);
    else groups["Other"].push(entry);
  }

  const handleSelect = async (code: string) => {
    if (code === i18n.language) { setOpen(false); return; }
    setLoading(true);
    try {
      await changeLanguage(code);
    } catch (e) {
      console.error("Language change failed:", e);
    } finally {
      setLoading(false);
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentConfig.nativeName}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-72 max-h-[70vh] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-[100]"
          >
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("languageSelector.search")}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            {loading && (
              <div className="p-4 text-center">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs text-muted-foreground font-mono">Translating...</span>
              </div>
            )}

            {!loading && (
              <div className="overflow-y-auto max-h-[calc(70vh-50px)]">
                {Object.entries(groups).map(([group, langs]) => {
                  if (langs.length === 0) return null;
                  return (
                    <div key={group}>
                      <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0">
                        {group} ({langs.length})
                      </div>
                      {langs.map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => handleSelect(code)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer text-left ${
                            (i18n.language === code || currentLang === code) ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-foreground font-medium truncate">{lang.nativeName}</span>
                            <span className="text-muted-foreground text-[10px] shrink-0">{lang.name}</span>
                          </div>
                          {(i18n.language === code || currentLang === code) && (
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;

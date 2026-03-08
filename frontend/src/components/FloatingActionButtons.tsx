import { useState } from "react";
import { Button } from "../components/ui/button";
import { Zap, Users, TrendingUp, Rocket, X } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../lib/translations';

interface FABItem {
  id: string;
  icon: any;
  label: string;
  content: string;
  color: string;
}

const fabItems: FABItem[] = [
  {
    id: "schemes",
    icon: Zap,
    label: "Quick Schemes",
    content: "Searchable repository of government schemes with smart filters and instant eligibility check.",
    color: "text-yellow-400"
  },
  {
    id: "networking",
    icon: Users,
    label: "Networking Hub",
    content: "Connect with farmers, investors, and agri-entrepreneurs. Build partnerships and explore collaborations.",
    color: "text-blue-400"
  },
  {
    id: "market",
    icon: TrendingUp,
    label: "Market Trends",
    content: "Real-time price updates, demand forecasts, and market intelligence powered by AI analytics.",
    color: "text-green-400"
  },
  {
    id: "crops",
    icon: Rocket,
    label: "Crops Explorer",
    content: "District-specific crop recommendations and growing guides.",
    color: "text-orange-400"
  }
];

const FloatingActionButtons = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed right-3 md:right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-2 md:space-y-4">
        {fabItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActivePopup(item.id)}
            className="professional-card w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110 group shadow-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
            title={t(`floatingButtons.${item.id}.title`)}
          >
            <item.icon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute right-full mr-2 md:mr-3 top-1/2 transform -translate-y-1/2 bg-foreground text-background px-2 py-1 rounded text-xs md:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {t(`floatingButtons.${item.id}.title`)}
            </span>
          </button>
        ))}
      </div>

      {/* Popup Overlay */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
          <div className="professional-card max-w-2xl w-full mx-4 p-4 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="space-y-4 md:space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <h3 className="text-lg md:text-2xl font-bold text-foreground">{t(`floatingButtons.${activePopup}.title`)}</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setActivePopup(null)}
                  className="h-8 w-8 md:h-10 md:w-10"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-3 md:space-y-4">
                {(() => {
                  const content = t(`floatingButtons.${activePopup}.content`);
                  const points = content.split('\n\n').filter(point => point.trim());
                  
                  return points.map((point, index) => (
                    <div key={index} className="bg-green-100 text-green-800 p-3 md:p-4 rounded-lg">
                      <p className="text-sm md:text-lg leading-relaxed">
                        {point.trim()}
                      </p>
                    </div>
                  ));
                })()}
              </div>

              {/* Action Button */}
              <div className="pt-3 md:pt-4">
                <Button variant="professional" className="w-full h-10 md:h-12 text-sm md:text-base" onClick={() => setActivePopup(null)}>
                  {t('Ok')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButtons;
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../lib/translations";

const HighDemandCropsTeaser = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const handleExploreCrops = () => {
    navigate("/explore-crops");
  };

  return (
    <section className="section-container bg-gradient-to-br from-primary/5 to-surface/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="professional-card p-12 hover-card">
          <div className="space-y-8">
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('contact.lowSupplyHighDemand')}    
            </h2>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('contact.lowSupplyHighDemandDesc')}
            </p>
            
            {/* Explore Button */}
            <div className="pt-6">
              <Button 
                variant="professional" 
                size="lg" 
                className="px-6 py-3 md:px-12 md:py-4 text-base md:text-lg lg:text-xl font-semibold w-full md:w-auto min-w-[140px] md:min-w-[160px] break-words text-center"
                onClick={handleExploreCrops}
              >
                <span className="truncate">{t('contact.exploreCrops')}</span>
              </Button>
            </div>
            
            {/* Subtle Hint */}
            <p className="text-sm text-muted-foreground">
              {t('contact.cropInsightsInteractive')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighDemandCropsTeaser;

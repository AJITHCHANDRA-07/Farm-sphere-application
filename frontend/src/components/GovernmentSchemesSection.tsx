import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronDown } from "lucide-react";
import { ChevronRight, FileText, CreditCard, Users, Home } from "lucide-react";
import GovernmentSchemeModal from "./GovernmentSchemeModal";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../lib/translations";

interface Scheme {
  id: string;
  name: string;
  category: "agriculture" | "dairy" | "household";
  eligibility: string[];
  documents: string[];
  loanDetails: string;
  benefits: string[];
  icon: any;
}

const schemes: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    category: "agriculture",
    eligibility: [
      "Small & marginal farmers",
      "Land holding up to 2 hectares",
      "Indian citizen",
    ],
    documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
    loanDetails: "₹6,000 per year in 3 installments",
    benefits: [
      "Direct cash transfer",
      "No collateral required",
      "Online application",
    ],
    icon: CreditCard,
  },
  {
    id: "crop-insurance",
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "agriculture",
    eligibility: ["All farmers", "Tenant farmers", "Sharecroppers"],
    documents: [
      "Aadhaar Card",
      "Bank Account",
      "Land Documents",
      "Sowing Certificate",
    ],
    loanDetails: "Premium: 2% for Kharif, 1.5% for Rabi crops",
    benefits: [
      "Crop loss coverage",
      "Natural disaster protection",
      "Technology-based settlement",
    ],
    icon: FileText,
  },
  {
    id: "dairy-loan",
    name: "Dairy Entrepreneurship Development Scheme",
    category: "dairy",
    eligibility: ["Individual dairy farmers", "SHGs", "Cooperatives"],
    documents: [
      "Project Report",
      "Aadhaar Card",
      "Bank Account",
      "Land Documents",
    ],
    loanDetails: "Up to ₹50 Lakhs, 25% subsidy for general category",
    benefits: ["Subsidized loans", "Technical support", "Marketing assistance"],
    icon: Users,
  },
  {
    id: "rural-housing",
    name: "Pradhan Mantri Awaas Yojana",
    category: "household",
    eligibility: ["Rural families", "Below poverty line", "No pucca house"],
    documents: ["Aadhaar Card", "Job Card", "Bank Account", "Income Certificate"],
    loanDetails: "₹1.2 Lakhs for plain areas, ₹1.3 Lakhs for hilly areas",
    benefits: ["Financial assistance", "Toilet construction", "LPG connection"],
    icon: Home,
  },
];

const GovernmentSchemesSection = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "agriculture" | "dairy" | "household"
  >("agriculture");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScheme(null);
  };

  const categories = [
    {
      id: "agriculture",
      name: "Agriculture",
      icon: "🌾",
      description: "Farming loans & subsidies",
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: "🥛",
      description: "Dairy business support",
    },
    {
      id: "household",
      name: "Rural/Household",
      icon: "🏠",
      description: "Housing & welfare schemes",
    },
  ];

  const filteredSchemes = schemes.filter(
    (scheme) => scheme.category === selectedCategory
  );

  return (
<section className="section-container bg-gradient-to-br from-primary/5 to-surface/50 transition-transform duration-300 hover:translate-y-1">
      <div className="max-w-4xl mx-auto text-center">
        {/* Collapsed Teaser View */}
        {!isExpanded && (
          <div className="professional-card p-12">
            <div className="space-y-8">
              {/* Main Title */}
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('contact.governmentSchemes')}
              </h2>

              {/* Description */}
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('contact.governmentSchemesDesc')}
              </p>

              {/* Explore Button */}
              <div className="pt-6">
                <Button
                  variant="professional"
                  size="lg"
                  className="px-6 py-3 md:px-12 md:py-4 text-base md:text-lg lg:text-xl font-semibold w-full md:w-auto min-w-[140px] md:min-w-[160px] break-words text-center"
                  onClick={() => navigate('/explore-schemes')}
                >
                  <span className="flex items-center justify-center truncate">
                    {t('contact.browseSchemes')} 
                    <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  </span>
                </Button>
              </div>

              {/* Subtle Hint */}
              <p className="text-sm text-muted-foreground">
                {t('contact.governmentSupportDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-8">
            {/* Category Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`professional-card p-6 text-left transition-all duration-200 hover-card ${
                    selectedCategory === category.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Schemes List */}
            <div className="space-y-4">
              {filteredSchemes.map((scheme, index) => (
                <div
                  key={scheme.id}
                  className="professional-card p-6 cursor-pointer hover-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <scheme.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {scheme.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {scheme.loanDetails}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Scheme View */}
            {selectedScheme && (
              <div className="professional-card p-8 animate-scale-in">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <selectedScheme.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {selectedScheme.name}
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedScheme(null)}
                      className="px-4 py-2"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Loan Details */}
                  <div className="feature-card">
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      Loan/Benefit Details
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedScheme.loanDetails}
                    </p>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      Eligibility Criteria
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedScheme.eligibility.map((criteria, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-muted-foreground">
                            {criteria}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      Required Documents
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedScheme.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="feature-card text-center p-4"
                        >
                          <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
                          <span className="text-sm text-muted-foreground">
                            {doc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedScheme.benefits.map((benefit, index) => (
                        <div key={index} className="feature-card p-4">
                          <span className="text-sm text-muted-foreground">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      variant="professional"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://www.india.gov.in/apply-online?scheme=${selectedScheme?.id}`,
                          "_blank"
                        )
                      }
                    >
                      Apply Online
                    </Button>
                    <Button
                      variant="clean"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `/forms/${selectedScheme?.id}-application-form.pdf`,
                          "_blank"
                        )
                      }
                    >
                      Download Form
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewDetails(selectedScheme)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Collapse Button */}
            <div className="text-center pt-8">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(false)}
                className="px-8 py-3"
              >
                Collapse Section{" "}
                <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <GovernmentSchemeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        scheme={selectedScheme}
      />
    </section>
  );
};

export default GovernmentSchemesSection;

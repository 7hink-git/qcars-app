export interface Car {
  id: string;
  name: string;
  name_ar?: string;
  brand: string;
  brand_ar?: string;
  year: number;
  type: 'SUV' | 'Sedan' | 'Luxury' | 'Sport' | 'Electric';
  type_ar?: string;
  pricePerDay: number;
  image: string;
  gallery?: string[];
  seats: number;
  transmission: 'Automatic' | 'Manual';
  transmission_ar?: string;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  fuel_ar?: string;
  
  // Status
  isAvailable: boolean; 

  // Customizable Lists
  features: string[];
  features_ar?: string[];
  extraConditions?: string[]; 

  description: string;
  description_ar?: string;
  rating: number;
  highlight: string;
  highlight_ar?: string;
  color: string;
  color_ar?: string;
  colorHex?: string; // Hex code for custom colors
  
  // Individual Discounts
  weeklyDiscount?: number; 
  monthlyDiscount?: number; 

  specs: {
    engine: string;
    horsepower: number;
    acceleration: string;
    topSpeed: string;
  };
  rentalTerms: {
    mileageLimit: string;
    mileageLimit_ar?: string;
    deposit: number;
    insurance: string;
    insurance_ar?: string;
  };
}

export interface BookingExtra {
  id: string;
  name: string;
  name_ar?: string;
  price: number;
  description: string;
  description_ar?: string;
}

export interface DiscountRule {
  id: string;
  minDays: number;
  percentageOff: number; 
  label: string;
  label_ar?: string;
}

// CMS Types
export interface TrustFeature {
  id: string;
  icon: string; // Icon name e.g., 'Shield', 'Zap'
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
}

export interface CardConfiguration {
  showYear: boolean;
  showBrand: boolean;
  showRating: boolean;
  showPrice: boolean;
  showAvailability: boolean;
  showHighlight: boolean;
  showSpecs: boolean; // The fuel/seat/color row
}

export interface DetailsPageLabels {
  specsTitle: string;
  specsTitle_ar: string;
  featuresTitle: string;
  featuresTitle_ar: string;
  rentalConditionsTitle: string;
  rentalConditionsTitle_ar: string;
  bookingPanelTitle: string; // "Daily Rate" area
  bookingPanelTitle_ar: string;
}

export interface CompanySettings {
  companyName: string;
  logoUrl?: string; 
  primaryColor: string; 
  whatsappNumber: string;
  contactEmail: string;
  currency: string;
  
  // Home Page Hero
  heroTitle1: string;
  heroTitle1_ar: string;
  heroTitle2: string;
  heroTitle2_ar: string;
  heroSubtitle: string;
  heroSubtitle_ar: string;
  heroBadge: string;
  heroBadge_ar: string;

  // Home Page Trust Section
  trustTitle: string; // e.g. "Why Choose Us"
  trustTitle_ar: string;
  trustFeatures: TrustFeature[];

  // Component Configs
  cardConfig: CardConfiguration;
  detailsLabels: DetailsPageLabels;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'confirmed' | 'active' | 'completed';
  extras: string[];
  bookedAt: string;
  userName?: string;
  userEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

export interface AIRecommendation {
  recommendedCarIds: string[];
  message: string;
}

export enum ViewState {
  HOME = 'HOME',
  DETAILS = 'DETAILS',
  BOOKING = 'BOOKING',
  SUCCESS = 'SUCCESS'
}
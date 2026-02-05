-- =====================================================
-- Q-Cars Supabase Database Schema
-- =====================================================
-- This script creates the complete database schema for the Q-Cars platform
-- Run this in the Supabase SQL Editor after creating your project

-- =====================================================
-- 1. CARS TABLE
-- =====================================================
-- Stores all vehicle inventory with bilingual support

CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  
  -- Basic Information
  brand TEXT NOT NULL,
  brand_ar TEXT,
  name TEXT NOT NULL,
  name_ar TEXT,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SUV', 'Sedan', 'Luxury', 'Sport', 'Electric')),
  type_ar TEXT,
  
  -- Pricing
  price_per_day NUMERIC(10, 2) NOT NULL,
  weekly_discount NUMERIC(5, 2) DEFAULT 0, -- percentage
  monthly_discount NUMERIC(5, 2) DEFAULT 0, -- percentage
  
  -- Media
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  
  -- Vehicle Details
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Automatic', 'Manual')),
  transmission_ar TEXT,
  fuel TEXT NOT NULL CHECK (fuel IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  fuel_ar TEXT,
  color TEXT,
  color_ar TEXT,
  color_hex TEXT, -- Optional hex code
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  
  -- Features & Description
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  features_ar JSONB DEFAULT '[]'::jsonb,
  extra_conditions JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  description_ar TEXT,
  highlight TEXT,
  highlight_ar TEXT,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  
  -- Specifications (stored as JSONB)
  specs JSONB NOT NULL DEFAULT '{
    "engine": "",
    "horsepower": 0,
    "acceleration": "",
    "topSpeed": ""
  }'::jsonb,
  
  -- Rental Terms (stored as JSONB)
  rental_terms JSONB NOT NULL DEFAULT '{
    "mileageLimit": "",
    "mileageLimit_ar": "",
    "deposit": 0,
    "insurance": "",
    "insurance_ar": ""
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(is_available);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day);

-- =====================================================
-- 2. SETTINGS TABLE
-- =====================================================
-- Stores global company and CMS configuration (singleton table)

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  
  -- Company Information
  company_name TEXT NOT NULL DEFAULT 'Q Cars',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  whatsapp_number TEXT,
  contact_email TEXT,
  currency TEXT DEFAULT 'USD',
  
  -- Hero Section
  hero_title_1 TEXT DEFAULT 'Drive the',
  hero_title_1_ar TEXT DEFAULT 'قُد',
  hero_title_2 TEXT DEFAULT 'Extraordinary.',
  hero_title_2_ar TEXT DEFAULT 'الاستثنائي.',
  hero_subtitle TEXT,
  hero_subtitle_ar TEXT,
  hero_badge TEXT DEFAULT 'Premium Fleet 2024',
  hero_badge_ar TEXT DEFAULT 'أسطول النخبة ٢٠٢٤',
  
  -- Trust Section
  trust_title TEXT DEFAULT 'Why Choose Us',
  trust_title_ar TEXT DEFAULT 'لماذا تختارنا',
  trust_features JSONB DEFAULT '[]'::jsonb,
  
  -- Card Configuration
  card_config JSONB DEFAULT '{
    "showYear": true,
    "showBrand": true,
    "showRating": true,
    "showPrice": true,
    "showAvailability": true,
    "showHighlight": true,
    "showSpecs": true
  }'::jsonb,
  
  -- Details Page Labels
  details_labels JSONB DEFAULT '{
    "specsTitle": "Vehicle Specifications",
    "specsTitle_ar": "مواصفات المركبة",
    "featuresTitle": "Premium Features",
    "featuresTitle_ar": "ميزات مميزة",
    "rentalConditionsTitle": "Rental Conditions",
    "rentalConditionsTitle_ar": "شروط التأجير",
    "bookingPanelTitle": "Daily Rate",
    "bookingPanelTitle_ar": "السعر اليومي"
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one settings row exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_singleton ON settings(id);

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
-- Stores customer rental bookings

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Car Reference
  car_id TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  car_name TEXT NOT NULL,
  car_image TEXT NOT NULL,
  
  -- Booking Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Pricing
  total_price NUMERIC(10, 2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'active', 'completed', 'cancelled')),
  
  -- Extras
  extras JSONB DEFAULT '[]'::jsonb, -- Array of extra IDs
  
  -- User Information
  user_name TEXT,
  user_email TEXT,
  
  -- Timestamps
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON bookings(user_email);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Cars: Public read access (everyone can view cars)
CREATE POLICY "Cars are viewable by everyone"
  ON cars FOR SELECT
  TO public
  USING (true);

-- Cars: Allow inserts/updates for authenticated users (or service role)
-- You can customize this based on your admin authentication setup
CREATE POLICY "Cars are editable by authenticated users"
  ON cars FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings: Public read access
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  TO public
  USING (true);

-- Settings: Allow updates for authenticated users
CREATE POLICY "Settings are editable by authenticated users"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Bookings: Public read/write access (can be restricted later)
CREATE POLICY "Bookings are viewable by everyone"
  ON bookings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

-- Bookings: Allow updates/deletes for authenticated users
CREATE POLICY "Bookings are editable by authenticated users"
  ON bookings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next step: Run the supabase-seed.sql file to populate initial data

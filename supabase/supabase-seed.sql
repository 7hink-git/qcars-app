-- =====================================================
-- Q-Cars Supabase Seed Data
-- =====================================================
-- This script populates initial data for the Q-Cars platform
-- Run this AFTER running supabase-schema.sql

-- =====================================================
-- 1. INSERT CARS DATA
-- =====================================================

-- Tesla Model S Plaid
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c1',
  'Tesla',
  'تسلا',
  'Model S Plaid',
  'موديل S بلايد',
  2024,
  'Electric',
  'كهربائية',
  189.00,
  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1554744512-d6c603f27c54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  5,
  'Automatic',
  'أوتوماتيك',
  'Electric',
  'كهرباء',
  'Midnight Silver',
  'فضي ليلي',
  true,
  '["Autopilot", "Yoke Steering", "Premium Audio", "Gaming Rig", "Wireless Charging", "Glass Roof", "Heated Seats", "Sentry Mode"]'::jsonb,
  '["قيادة ذاتية", "مقود Yoke", "صوت ممتاز", "منصة ألعاب", "شحن لاسلكي", "سقف زجاجي", "مقاعد مدفأة", "وضع الحراسة"]'::jsonb,
  'Experience the future of driving with the 2024 Tesla Model S Plaid. Unmatched acceleration and range.',
  'جرب مستقبل القيادة مع تسلا موديل S بلايد 2024. تسارع ومدى لا مثيل لهما.',
  4.9,
  '0-60 in 1.99s',
  '٠-١٠٠ في ١.٩٩ث',
  '{"engine": "Tri-Motor AWD", "horsepower": 1020, "acceleration": "1.99s", "topSpeed": "200 mph"}'::jsonb,
  '{"mileageLimit": "250 km/day", "mileageLimit_ar": "٢٥٠ كم/يوم", "deposit": 2000, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- Mercedes-Benz G-Class AMG
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c2',
  'Mercedes-Benz',
  'مرسيدس بنز',
  'G-Class AMG',
  'جي كلاس AMG',
  2024,
  'SUV',
  'دفع رباعي',
  350.00,
  'https://images.unsplash.com/photo-1520050206274-2c545dea0816?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1553956543-6c715207127e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1570374922621-c454794fa82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  5,
  'Automatic',
  'أوتوماتيك',
  'Petrol',
  'بنزين',
  'Obsidian Black',
  'أسود بركاني',
  true,
  '["Off-road Capability", "Massage Seats", "Burmester 3D Sound", "Rear Entertainment", "Nappa Leather", "Ambient Lighting", "Diff Locks", "Sunroof"]'::jsonb,
  '["قدرات الطرق الوعرة", "مقاعد تدليك", "صوت Burmester 3D", "ترفيه خلفي", "جلد نابا", "إضاءة محيطة", "أقفال تفاضلية", "فتحة سقف"]'::jsonb,
  'The iconic 2024 G-Wagon. Combines rugged off-road capability with absolute luxury.',
  'سيارة G-Wagon الأيقونية لعام 2024. تجمع بين القدرات القوية للطرق الوعرة والفخامة المطلقة.',
  4.8,
  'Off-Road Icon',
  'أيقونة الطرق الوعرة',
  '{"engine": "4.0L V8 Biturbo", "horsepower": 577, "acceleration": "4.5s", "topSpeed": "137 mph"}'::jsonb,
  '{"mileageLimit": "200 km/day", "mileageLimit_ar": "٢٠٠ كم/يوم", "deposit": 3000, "insurance": "Premium Included", "insurance_ar": "شامل مميز"}'::jsonb
);

-- Porsche 911 Carrera
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c3',
  'Porsche',
  'بورش',
  '911 Carrera',
  '٩١١ كاريرا',
  2023,
  'Sport',
  'رياضية',
  420.00,
  'https://images.unsplash.com/photo-1503376763036-066120622c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1611651101297-302bc0f5010d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1585890784260-e8894df01235?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  2,
  'Automatic',
  'أوتوماتيك',
  'Petrol',
  'بنزين',
  'Guards Red',
  'أحمر الحرس',
  true,
  '["Sport Chrono Package", "Convertible Top", "Launch Control", "Bose Surround", "Sports Exhaust", "Paddle Shifters", "Ceramic Brakes", "Alcantara Wheel"]'::jsonb,
  '["حزمة كرونو الرياضية", "سقف قابل للكشف", "تحكم في الانطلاق", "صوت Bose", "عادم رياضي", "نواقل حركة", "فرامل سيراميك", "عجلة ألكانتارا"]'::jsonb,
  'The definitive sports car. Precision engineering and timeless design in this 2023 model.',
  'السيارة الرياضية المثالية. هندسة دقيقة وتصميم خالد في طراز 2023.',
  5.0,
  'Track Legend',
  'أسطورة الحلبات',
  '{"engine": "3.0L Twin-Turbo Flat-6", "horsepower": 379, "acceleration": "4.0s", "topSpeed": "182 mph"}'::jsonb,
  '{"mileageLimit": "150 km/day", "mileageLimit_ar": "١٥٠ كم/يوم", "deposit": 2500, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- BMW X5 M Competition
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c4',
  'BMW',
  'بي إم دبليو',
  'X5 M Competition',
  'X5 M كومبتيشن',
  2025,
  'SUV',
  'دفع رباعي',
  210.00,
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1556189250-72ba95452242?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1580274455191-1c62238fa995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  5,
  'Automatic',
  'أوتوماتيك',
  'Hybrid',
  'هجين',
  'Alpine White',
  'أبيض ألبي',
  true,
  '["M xDrive", "Laserlight Headlights", "Gesture Control", "Sky Lounge Roof", "Heated Armrests", "Head-up Display", "Park Assist Pro", "Carbon Fiber Trim"]'::jsonb,
  '["نظام M xDrive", "مصابيح ليزر", "تحكم بالإيماءات", "سقف سكاي لاونج", "مساند أذرع مدفأة", "عرض على الزجاج", "مساعد ركن", "ألياف الكربون"]'::jsonb,
  'A 2025 high-performance SUV that refuses to compromise on comfort or speed.',
  'سيارة دفع رباعي عالية الأداء لعام 2025 ترفض المساومة على الراحة أو السرعة.',
  4.7,
  'Hybrid Power',
  'قوة هجينة',
  '{"engine": "4.4L V8 Hybrid", "horsepower": 617, "acceleration": "3.7s", "topSpeed": "177 mph"}'::jsonb,
  '{"mileageLimit": "300 km/day", "mileageLimit_ar": "٣٠٠ كم/يوم", "deposit": 1500, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- Audi A6 e-tron
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c5',
  'Audi',
  'أودي',
  'A6 e-tron',
  'A6 إي-ترون',
  2024,
  'Sedan',
  'سيدان',
  145.00,
  'https://images.unsplash.com/photo-1606152421811-aa911018b54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  5,
  'Automatic',
  'أوتوماتيك',
  'Electric',
  'كهرباء',
  'Chronos Grey',
  'رمادي كرونوس',
  true,
  '["Quattro AWD", "Virtual Cockpit Plus", "Matrix LED", "Ambient Lighting", "Bang & Olufsen Sound", "Adaptive Cruise", "360 Camera", "Air Suspension"]'::jsonb,
  '["دفع رباعي كواترو", "قمرة قيادة افتراضية", "ماتريكس LED", "إضاءة محيطة", "صوت B&O", "تثبيت سرعة تكيفي", "كاميرا 360", "تعليق هوائي"]'::jsonb,
  'Sleek, efficient, and packed with technology. The perfect executive sedan.',
  'أنيقة، فعالة، ومليئة بالتكنولوجيا. السيدان التنفيذية المثالية.',
  4.6,
  'Executive EV',
  'EV تنفيذي',
  '{"engine": "Dual Motor Electric", "horsepower": 469, "acceleration": "3.8s", "topSpeed": "155 mph"}'::jsonb,
  '{"mileageLimit": "Unlimited", "mileageLimit_ar": "غير محدود", "deposit": 1000, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- Land Rover Range Rover Sport
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c6',
  'Land Rover',
  'لاند روفر',
  'Range Rover Sport',
  'رينج روفر سبورت',
  2023,
  'SUV',
  'دفع رباعي',
  280.00,
  'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1623877969854-3c66f91f37b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1609520505218-7421da4c3c7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  7,
  'Automatic',
  'أوتوماتيك',
  'Diesel',
  'ديزل',
  'Firenze Red',
  'أحمر فيرنز',
  true,
  '["7 Seats", "Electronic Air Suspension", "Meridian Sound System", "Pivi Pro Infotainment", "Cooler Box", "Wade Sensing", "Soft Close Doors", "Panoramic Roof"]'::jsonb,
  '["٧ مقاعد", "تعليق هوائي إلكتروني", "صوت ميريديان", "نظام Pivi Pro", "صندوق تبريد", "استشعار عمق الماء", "أبواب شفط", "سقف بانورامي"]'::jsonb,
  'Perfect for family trips where style and space are paramount.',
  'مثالية للرحلات العائلية حيث الأناقة والمساحة هي الأهم.',
  4.7,
  'Ultimate Luxury SUV',
  'قمة فخامة الـSUV',
  '{"engine": "3.0L I6 Turbo Diesel", "horsepower": 345, "acceleration": "5.9s", "topSpeed": "145 mph"}'::jsonb,
  '{"mileageLimit": "250 km/day", "mileageLimit_ar": "٢٥٠ كم/يوم", "deposit": 1500, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- Toyota Camry Hybrid
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c7',
  'Toyota',
  'تويوتا',
  'Camry Hybrid',
  'كامري هايبرد',
  2023,
  'Sedan',
  'سيدان',
  65.00,
  'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1595996956667-27a3c31828f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1589139850116-3e0474026330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  5,
  'Automatic',
  'أوتوماتيك',
  'Hybrid',
  'هجين',
  'Celestial Silver',
  'فضي سماوي',
  true,
  '["Economic Drive Mode", "Apple CarPlay", "Toyota Safety Sense", "Spacious Trunk", "Wireless Charging", "Dual Zone Climate", "Leather Trim", "Lane Trace Assist"]'::jsonb,
  '["وضع توفير", "Apple CarPlay", "أمان تويوتا", "صندوق واسع", "شحن لاسلكي", "تكييف مزدوج", "زخارف جلدية", "تتبع المسار"]'::jsonb,
  'Reliable, efficient, and comfortable. The smart choice for long drives.',
  'موثوقة، فعالة، ومريحة. الخيار الذكي للرحلات الطويلة.',
  4.5,
  'Top Efficiency',
  'أعلى كفاءة',
  '{"engine": "2.5L 4-Cyl Hybrid", "horsepower": 208, "acceleration": "7.4s", "topSpeed": "112 mph"}'::jsonb,
  '{"mileageLimit": "Unlimited", "mileageLimit_ar": "غير محدود", "deposit": 500, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- Ford Mustang GT
INSERT INTO cars (id, brand, brand_ar, name, name_ar, year, type, type_ar, price_per_day, image, gallery, seats, transmission, transmission_ar, fuel, fuel_ar, color, color_ar, is_available, features, features_ar, description, description_ar, rating, highlight, highlight_ar, specs, rental_terms)
VALUES (
  'c8',
  'Ford',
  'فورد',
  'Mustang GT',
  'موستانج GT',
  2024,
  'Sport',
  'رياضية',
  130.00,
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]'::jsonb,
  4,
  'Manual',
  'يدوي',
  'Petrol',
  'بنزين',
  'Velocity Blue',
  'أزرق السرعة',
  true,
  '["5.0L V8 Coyote", "Active Valve Exhaust", "Track Apps", "Recaro Bucket Seats", "Brembo Brakes", "Sync 4 Technology", "Line Lock", "MagnaRide"]'::jsonb,
  '["محرك 5.0L V8", "عادم نشط", "تطبيقات الحلبة", "مقاعد ريكارو", "فرامل بريمبو", "تقنية Sync 4", "قفل الخط", "تعليق ماجنا"]'::jsonb,
  'American muscle at its finest. Feel the roar of the V8.',
  'العضلات الأمريكية في أبهى صورها. اشعر بهدير الـ V8.',
  4.6,
  'V8 Muscle',
  'عضلات V8',
  '{"engine": "5.0L Ti-VCT V8", "horsepower": 480, "acceleration": "4.3s", "topSpeed": "155 mph"}'::jsonb,
  '{"mileageLimit": "250 km/day", "mileageLimit_ar": "٢٥٠ كم/يوم", "deposit": 1000, "insurance": "Standard Basic", "insurance_ar": "أساسي قياسي"}'::jsonb
);

-- =====================================================
-- 2. INSERT DEFAULT SETTINGS
-- =====================================================

INSERT INTO settings (
  id,
  company_name,
  primary_color,
  whatsapp_number,
  contact_email,
  currency,
  hero_title_1,
  hero_title_1_ar,
  hero_title_2,
  hero_title_2_ar,
  hero_subtitle,
  hero_subtitle_ar,
  hero_badge,
  hero_badge_ar,
  trust_title,
  trust_title_ar,
  trust_features
)
VALUES (
  'default',
  'Q Cars',
  '#000000',
  '+971501234567',
  'info@qcars.ae',
  'USD',
  'Drive the',
  'قُد',
  'Extraordinary.',
  'الاستثنائي.',
  'Experience the perfect blend of performance and luxury. Your journey begins with the perfect vehicle.',
  'استمتع بمزيج مثالي من الأداء والفخامة. رحلتك تبدأ بالسيارة المثالية.',
  'Premium Fleet 2024',
  'أسطول النخبة ٢٠٢٤',
  'Why Choose Us',
  'لماذا تختارنا',
  '[
    {
      "id": "t1",
      "icon": "Shield",
      "title": "Comprehensive Coverage",
      "title_ar": "تغطية شاملة",
      "description": "Drive with confidence knowing you are fully covered. Our zero-deductible plans ensure peace of mind.",
      "description_ar": "قُد بثقة مع العلم أنك مغطى بالكامل. خططنا الخالية من التحمل تضمن راحة البال."
    },
    {
      "id": "t2",
      "icon": "Star",
      "title": "Premium Condition",
      "title_ar": "حالة ممتازة",
      "description": "Every vehicle is meticulously detailed and inspected before delivery to ensure a showroom experience.",
      "description_ar": "يتم تفصيل وفحص كل مركبة بدقة قبل التسليم لضمان تجربة وكأنها جديدة."
    },
    {
      "id": "t3",
      "icon": "Clock",
      "title": "24/7 Concierge",
      "title_ar": "كونسيرج ٢٤/٧",
      "description": "More than just support. Our dedicated team is available round-the-clock for your every need.",
      "description_ar": "أكثر من مجرد دعم. فريقنا المخصص متاح على مدار الساعة لتلبية جميع احتياجاتك."
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================
-- Your Q-Cars database is now ready to use!
-- Next: Configure environment variables and deploy to Netlify

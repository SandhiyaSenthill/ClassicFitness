// ==========================================
//  CLASSIC FITNESS GYM — CALORIE CALCULATOR JS
//  File: assets/js/calorie.js
//  USDA API via Cloudflare Worker + Local Fallback
// ==========================================

(function () {
  'use strict';

  // ==========================================
  //  WORKER URL
  // ==========================================
  const WORKER_URL = 'https://classicfitness-api.sandhiyasenthill3.workers.dev';

  // ==========================================
  //  LOCAL FALLBACK FOOD DATABASE
  //  Used when API fails or query < 2 chars
  //  NOW includes: sugar field on every item
  // ==========================================
  const LOCAL_FOOD_DB = [
    // ---- BREAKFAST ----
    { id: 1,  name: 'Idli',                      category: 'breakfast', unit: '1 piece (40g)',       cal: 39,  protein: 1.7,  carbs: 8.0,  fat: 0.2,  fiber: 0.4, sugar: 0.1 , satFat: 0.05, polyFat: 0.05, monoFat: 0.05, transFat: 0.0, cholesterol: 0 },
    { id: 2,  name: 'Dosa (Plain)',               category: 'breakfast', unit: '1 medium (75g)',      cal: 133, protein: 3.0,  carbs: 24.0, fat: 3.0,  fiber: 0.5, sugar: 0.3 , satFat: 0.5, polyFat: 0.8, monoFat: 1.2, transFat: 0.0, cholesterol: 0 },
    { id: 3,  name: 'Dosa (Masala)',              category: 'breakfast', unit: '1 medium (130g)',     cal: 210, protein: 5.5,  carbs: 36.0, fat: 5.5,  fiber: 1.5, sugar: 0.8 , satFat: 1.0, polyFat: 1.2, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 4,  name: 'Uttapam',                    category: 'breakfast', unit: '1 piece (90g)',       cal: 132, protein: 3.8,  carbs: 22.0, fat: 3.2,  fiber: 1.2, sugar: 0.5 , satFat: 0.5, polyFat: 0.9, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 5,  name: 'Upma',                       category: 'breakfast', unit: '1 cup (160g)',        cal: 195, protein: 4.5,  carbs: 33.0, fat: 5.5,  fiber: 2.0, sugar: 1.0 , satFat: 0.8, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 6,  name: 'Poha',                       category: 'breakfast', unit: '1 cup (150g)',        cal: 180, protein: 3.5,  carbs: 34.0, fat: 3.5,  fiber: 1.2, sugar: 0.8 , satFat: 0.5, polyFat: 1.0, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 7,  name: 'Paratha (Plain)',             category: 'breakfast', unit: '1 piece (80g)',       cal: 200, protein: 4.5,  carbs: 30.0, fat: 6.5,  fiber: 2.5, sugar: 0.2 , satFat: 1.5, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 8,  name: 'Paratha (Aloo)',              category: 'breakfast', unit: '1 piece (110g)',      cal: 240, protein: 5.0,  carbs: 38.0, fat: 8.0,  fiber: 2.8, sugar: 0.5 , satFat: 2.0, polyFat: 1.8, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    { id: 9,  name: 'Puri',                       category: 'breakfast', unit: '1 piece (30g)',       cal: 105, protein: 2.0,  carbs: 14.0, fat: 4.5,  fiber: 0.6, sugar: 0.1 , satFat: 1.0, polyFat: 1.2, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 10, name: 'Idiyappam',                  category: 'breakfast', unit: '1 cup (100g)',        cal: 142, protein: 2.5,  carbs: 31.0, fat: 0.4,  fiber: 0.5, sugar: 0.2 , satFat: 0.1, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 11, name: 'Pesarattu',                  category: 'breakfast', unit: '1 piece (80g)',       cal: 120, protein: 7.0,  carbs: 18.0, fat: 2.5,  fiber: 2.2, sugar: 0.5 , satFat: 0.5, polyFat: 0.8, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 12, name: 'Appam',                      category: 'breakfast', unit: '1 piece (60g)',       cal: 82,  protein: 2.0,  carbs: 16.0, fat: 1.2,  fiber: 0.5, sugar: 0.3 , satFat: 0.3, polyFat: 0.3, monoFat: 0.5, transFat: 0.0, cholesterol: 0 },
    { id: 13, name: 'Medu Vada',                  category: 'breakfast', unit: '1 piece (50g)',       cal: 97,  protein: 4.0,  carbs: 13.0, fat: 3.5,  fiber: 1.5, sugar: 0.2 , satFat: 0.8, polyFat: 1.0, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 14, name: 'Aval (Poha) Upma',           category: 'breakfast', unit: '1 cup (160g)',        cal: 165, protein: 3.5,  carbs: 32.0, fat: 3.0,  fiber: 1.5, sugar: 0.5 , satFat: 0.5, polyFat: 0.8, monoFat: 1.2, transFat: 0.0, cholesterol: 0 },
    { id: 15, name: 'Oats Porridge',              category: 'breakfast', unit: '1 cup (200ml)',       cal: 150, protein: 5.5,  carbs: 27.0, fat: 3.0,  fiber: 4.0, sugar: 1.0 , satFat: 0.5, polyFat: 1.0, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 16, name: 'Rava Idli',                  category: 'breakfast', unit: '1 piece (50g)',       cal: 88,  protein: 2.5,  carbs: 15.0, fat: 2.5,  fiber: 0.8, sugar: 0.3 , satFat: 0.5, polyFat: 0.8, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 17, name: 'Kanda Poha',                 category: 'breakfast', unit: '1 cup (150g)',        cal: 195, protein: 4.0,  carbs: 36.0, fat: 4.0,  fiber: 1.5, sugar: 1.2 , satFat: 0.8, polyFat: 1.0, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 18, name: 'Sheera / Rava Halwa',        category: 'breakfast', unit: '1 cup (120g)',        cal: 280, protein: 4.0,  carbs: 45.0, fat: 9.0,  fiber: 1.0, sugar: 18.0 , satFat: 4.5, polyFat: 1.0, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 19, name: 'Bread Butter',               category: 'breakfast', unit: '2 slices (70g)',      cal: 210, protein: 5.5,  carbs: 28.0, fat: 8.5,  fiber: 1.0, sugar: 2.0 , satFat: 4.0, polyFat: 0.5, monoFat: 2.5, transFat: 0.0, cholesterol: 10 },
    // ---- RICE ----
    { id: 20, name: 'Steamed Rice (White)',        category: 'rice',      unit: '1 cup cooked (180g)', cal: 240, protein: 4.4,  carbs: 52.0, fat: 0.5,  fiber: 0.6, sugar: 0.1 , satFat: 0.1, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 21, name: 'Brown Rice',                 category: 'rice',      unit: '1 cup cooked (180g)', cal: 215, protein: 5.0,  carbs: 45.0, fat: 1.8,  fiber: 3.5, sugar: 0.3 , satFat: 0.3, polyFat: 0.5, monoFat: 0.5, transFat: 0.0, cholesterol: 0 },
    { id: 22, name: 'Biryani (Chicken)',           category: 'rice',      unit: '1 plate (350g)',      cal: 490, protein: 28.0, carbs: 56.0, fat: 16.0, fiber: 2.0, sugar: 2.5 , satFat: 4.5, polyFat: 3.5, monoFat: 6.0, transFat: 0.0, cholesterol: 75 },
    { id: 23, name: 'Biryani (Veg)',               category: 'rice',      unit: '1 plate (300g)',      cal: 380, protein: 9.0,  carbs: 62.0, fat: 10.0, fiber: 3.5, sugar: 3.0 , satFat: 2.0, polyFat: 2.5, monoFat: 4.5, transFat: 0.0, cholesterol: 0 },
    { id: 24, name: 'Curd Rice',                  category: 'rice',      unit: '1 cup (200g)',        cal: 200, protein: 6.0,  carbs: 34.0, fat: 5.0,  fiber: 0.5, sugar: 4.0 , satFat: 3.0, polyFat: 0.3, monoFat: 1.2, transFat: 0.0, cholesterol: 15 },
    { id: 25, name: 'Lemon Rice',                 category: 'rice',      unit: '1 cup (180g)',        cal: 250, protein: 4.0,  carbs: 43.0, fat: 6.0,  fiber: 1.2, sugar: 0.5 , satFat: 1.0, polyFat: 1.5, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    { id: 26, name: 'Tomato Rice',                category: 'rice',      unit: '1 cup (180g)',        cal: 220, protein: 4.0,  carbs: 40.0, fat: 5.0,  fiber: 1.5, sugar: 2.0 , satFat: 0.8, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 27, name: 'Sambar Rice',                category: 'rice',      unit: '1 cup (220g)',        cal: 255, protein: 8.5,  carbs: 44.0, fat: 4.5,  fiber: 3.0, sugar: 2.0 , satFat: 0.8, polyFat: 1.0, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 28, name: 'Fried Rice (Veg)',            category: 'rice',      unit: '1 plate (200g)',      cal: 290, protein: 6.0,  carbs: 46.0, fat: 8.5,  fiber: 1.8, sugar: 1.5 , satFat: 1.5, polyFat: 2.5, monoFat: 3.5, transFat: 0.0, cholesterol: 0 },
    { id: 29, name: 'Fried Rice (Egg)',            category: 'rice',      unit: '1 plate (220g)',      cal: 340, protein: 12.0, carbs: 46.0, fat: 10.0, fiber: 1.5, sugar: 1.5 , satFat: 2.0, polyFat: 2.5, monoFat: 4.0, transFat: 0.0, cholesterol: 120 },
    { id: 30, name: 'Coconut Rice',               category: 'rice',      unit: '1 cup (180g)',        cal: 295, protein: 4.5,  carbs: 45.0, fat: 10.5, fiber: 2.0, sugar: 1.0 , satFat: 8.0, polyFat: 0.5, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 31, name: 'Tamarind Rice (Puliyodarai)', category: 'rice',      unit: '1 cup (180g)',        cal: 270, protein: 4.0,  carbs: 48.0, fat: 7.0,  fiber: 2.5, sugar: 3.0 , satFat: 1.0, polyFat: 1.5, monoFat: 3.5, transFat: 0.0, cholesterol: 0 },
    { id: 32, name: 'Peas Pulao',                 category: 'rice',      unit: '1 cup (180g)',        cal: 260, protein: 6.5,  carbs: 44.0, fat: 6.0,  fiber: 3.5, sugar: 1.5 , satFat: 1.0, polyFat: 1.5, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    // ---- ROTI / BREAD ----
    { id: 40, name: 'Roti / Chapati',             category: 'roti',      unit: '1 piece (35g)',       cal: 80,  protein: 3.0,  carbs: 15.0, fat: 1.0,  fiber: 2.2, sugar: 0.2 , satFat: 0.2, polyFat: 0.3, monoFat: 0.3, transFat: 0.0, cholesterol: 0 },
    { id: 41, name: 'Phulka',                     category: 'roti',      unit: '1 piece (30g)',       cal: 68,  protein: 2.5,  carbs: 13.0, fat: 0.5,  fiber: 1.8, sugar: 0.1 , satFat: 0.1, polyFat: 0.2, monoFat: 0.2, transFat: 0.0, cholesterol: 0 },
    { id: 42, name: 'Tandoori Roti',              category: 'roti',      unit: '1 piece (45g)',       cal: 120, protein: 4.0,  carbs: 22.0, fat: 2.0,  fiber: 2.5, sugar: 0.2 , satFat: 0.4, polyFat: 0.4, monoFat: 0.8, transFat: 0.0, cholesterol: 0 },
    { id: 43, name: 'Naan',                       category: 'roti',      unit: '1 piece (90g)',       cal: 260, protein: 7.5,  carbs: 45.0, fat: 5.5,  fiber: 1.5, sugar: 1.5 , satFat: 1.5, polyFat: 1.0, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 44, name: 'Butter Naan',                category: 'roti',      unit: '1 piece (100g)',      cal: 310, protein: 7.5,  carbs: 46.0, fat: 9.0,  fiber: 1.5, sugar: 1.5 , satFat: 4.5, polyFat: 0.5, monoFat: 2.5, transFat: 0.2, cholesterol: 20 },
    { id: 45, name: 'White Bread',                category: 'roti',      unit: '1 slice (30g)',       cal: 79,  protein: 2.7,  carbs: 15.0, fat: 0.9,  fiber: 0.6, sugar: 1.5 , satFat: 0.2, polyFat: 0.2, monoFat: 0.3, transFat: 0.0, cholesterol: 0 },
    { id: 46, name: 'Brown Bread',                category: 'roti',      unit: '1 slice (30g)',       cal: 72,  protein: 3.0,  carbs: 13.0, fat: 1.0,  fiber: 1.8, sugar: 1.2 , satFat: 0.2, polyFat: 0.3, monoFat: 0.3, transFat: 0.0, cholesterol: 0 },
    { id: 47, name: 'Whole Wheat Bread',          category: 'roti',      unit: '1 slice (35g)',       cal: 81,  protein: 3.6,  carbs: 14.0, fat: 1.0,  fiber: 2.2, sugar: 1.0 , satFat: 0.2, polyFat: 0.3, monoFat: 0.3, transFat: 0.0, cholesterol: 0 },
    { id: 48, name: 'Missi Roti',                 category: 'roti',      unit: '1 piece (40g)',       cal: 105, protein: 4.5,  carbs: 16.0, fat: 2.5,  fiber: 2.8, sugar: 0.3 , satFat: 0.5, polyFat: 0.7, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 49, name: 'Thepla',                     category: 'roti',      unit: '1 piece (40g)',       cal: 115, protein: 3.5,  carbs: 17.0, fat: 3.5,  fiber: 2.0, sugar: 0.5 , satFat: 0.8, polyFat: 1.0, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    // ---- DAL / CURRY ----
    { id: 60, name: 'Sambar',                     category: 'dal',       unit: '1 cup (200ml)',       cal: 95,  protein: 5.5,  carbs: 14.0, fat: 2.5,  fiber: 3.5, sugar: 2.0 , satFat: 0.3, polyFat: 0.8, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 61, name: 'Dal Tadka',                  category: 'dal',       unit: '1 cup (180ml)',       cal: 185, protein: 10.0, carbs: 24.0, fat: 6.0,  fiber: 5.5, sugar: 1.5 , satFat: 1.0, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 62, name: 'Rajma',                      category: 'dal',       unit: '1 cup (200g)',        cal: 230, protein: 14.0, carbs: 36.0, fat: 3.5,  fiber: 8.0, sugar: 2.0 , satFat: 0.4, polyFat: 0.8, monoFat: 1.2, transFat: 0.0, cholesterol: 0 },
    { id: 63, name: 'Chhole (Chickpea Curry)',     category: 'dal',       unit: '1 cup (200g)',        cal: 270, protein: 14.5, carbs: 40.0, fat: 5.5,  fiber: 9.0, sugar: 3.0 , satFat: 0.8, polyFat: 1.5, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 64, name: 'Palak Paneer',               category: 'dal',       unit: '1 cup (200g)',        cal: 280, protein: 13.0, carbs: 10.0, fat: 20.0, fiber: 3.5, sugar: 2.5 , satFat: 12.0, polyFat: 1.0, monoFat: 5.0, transFat: 0.0, cholesterol: 50 },
    { id: 65, name: 'Paneer Butter Masala',       category: 'dal',       unit: '1 cup (200g)',        cal: 320, protein: 15.0, carbs: 12.0, fat: 24.0, fiber: 2.0, sugar: 4.0 , satFat: 14.0, polyFat: 1.5, monoFat: 6.0, transFat: 0.0, cholesterol: 60 },
    { id: 66, name: 'Aloo Curry',                 category: 'dal',       unit: '1 cup (200g)',        cal: 195, protein: 3.5,  carbs: 30.0, fat: 7.0,  fiber: 3.5, sugar: 2.0 , satFat: 1.0, polyFat: 2.0, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    { id: 67, name: 'Egg Curry',                  category: 'dal',       unit: '1 egg + gravy (150g)',cal: 145, protein: 8.0,  carbs: 6.0,  fat: 10.0, fiber: 1.0, sugar: 1.5 , satFat: 3.0, polyFat: 2.0, monoFat: 4.0, transFat: 0.0, cholesterol: 180 },
    { id: 68, name: 'Dal Makhani',                category: 'dal',       unit: '1 cup (180ml)',       cal: 250, protein: 12.0, carbs: 28.0, fat: 10.0, fiber: 6.0, sugar: 2.0 , satFat: 5.0, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 20 },
    { id: 69, name: 'Mix Vegetable Curry',        category: 'dal',       unit: '1 cup (200g)',        cal: 165, protein: 4.5,  carbs: 22.0, fat: 6.5,  fiber: 5.0, sugar: 3.5 , satFat: 1.0, polyFat: 2.0, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    { id: 70, name: 'Rasam',                      category: 'dal',       unit: '1 cup (200ml)',       cal: 45,  protein: 2.0,  carbs: 8.0,  fat: 1.0,  fiber: 1.5, sugar: 1.0 , satFat: 0.2, polyFat: 0.2, monoFat: 0.4, transFat: 0.0, cholesterol: 0 },
    { id: 71, name: 'Kootu (Veg+Dal)',            category: 'dal',       unit: '1 cup (180g)',        cal: 175, protein: 8.0,  carbs: 22.0, fat: 5.0,  fiber: 4.0, sugar: 1.5 , satFat: 1.0, polyFat: 1.2, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 72, name: 'Coconut Chutney',            category: 'dal',       unit: '2 tbsp (40g)',        cal: 65,  protein: 1.0,  carbs: 3.5,  fat: 5.5,  fiber: 1.5, sugar: 0.8 , satFat: 4.5, polyFat: 0.5, monoFat: 0.5, transFat: 0.0, cholesterol: 0 },
    { id: 73, name: 'Tomato Chutney',             category: 'dal',       unit: '2 tbsp (40g)',        cal: 35,  protein: 0.8,  carbs: 5.0,  fat: 1.0,  fiber: 1.0, sugar: 2.5 , satFat: 0.2, polyFat: 0.3, monoFat: 0.4, transFat: 0.0, cholesterol: 0 },
    { id: 74, name: 'Coconut Milk Curry (Gravy)', category: 'dal',       unit: '1 cup (200g)',        cal: 220, protein: 5.0,  carbs: 12.0, fat: 17.0, fiber: 2.0, sugar: 3.0 , satFat: 14.0, polyFat: 0.5, monoFat: 1.0, transFat: 0.0, cholesterol: 0 },
    { id: 75, name: 'Fish Curry (Meen Kuzhambu)', category: 'dal',       unit: '1 cup (200g)',        cal: 185, protein: 18.0, carbs: 8.0,  fat: 9.0,  fiber: 1.5, sugar: 2.0 , satFat: 2.0, polyFat: 2.5, monoFat: 3.5, transFat: 0.0, cholesterol: 60 },
    { id: 76, name: 'Avial',                      category: 'dal',       unit: '1 cup (150g)',        cal: 140, protein: 3.5,  carbs: 15.0, fat: 8.0,  fiber: 3.5, sugar: 2.5 , satFat: 5.0, polyFat: 0.8, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 77, name: 'Poriyal (Cabbage)',           category: 'dal',       unit: '1 cup (120g)',        cal: 85,  protein: 2.5,  carbs: 10.0, fat: 4.5,  fiber: 3.0, sugar: 3.0 , satFat: 0.5, polyFat: 1.5, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 78, name: 'Mutton Curry',               category: 'dal',       unit: '1 cup (200g)',        cal: 380, protein: 32.0, carbs: 5.0,  fat: 25.0, fiber: 0.5, sugar: 1.5 , satFat: 10.0, polyFat: 3.5, monoFat: 9.0, transFat: 0.5, cholesterol: 110 },
    { id: 79, name: 'Prawn Curry',                category: 'dal',       unit: '1 cup (200g)',        cal: 220, protein: 22.0, carbs: 8.0,  fat: 11.0, fiber: 1.0, sugar: 2.0 , satFat: 2.5, polyFat: 3.0, monoFat: 4.5, transFat: 0.0, cholesterol: 165 },
    // ---- CHICKEN ----
    { id: 80, name: 'Chicken Curry',              category: 'chicken',   unit: '1 cup (200g)',        cal: 310, protein: 28.0, carbs: 8.0,  fat: 18.0, fiber: 1.0, sugar: 2.0 , satFat: 5.0, polyFat: 3.5, monoFat: 7.5, transFat: 0.0, cholesterol: 85 },
    { id: 81, name: 'Tandoori Chicken',           category: 'chicken',   unit: '2 pieces (150g)',     cal: 220, protein: 30.0, carbs: 4.0,  fat: 9.0,  fiber: 0.5, sugar: 1.5 , satFat: 2.5, polyFat: 2.0, monoFat: 4.0, transFat: 0.0, cholesterol: 90 },
    { id: 82, name: 'Grilled Chicken Breast',     category: 'chicken',   unit: '1 piece (150g)',      cal: 195, protein: 36.0, carbs: 0.0,  fat: 5.0,  fiber: 0.0, sugar: 0.0 , satFat: 1.5, polyFat: 1.0, monoFat: 2.0, transFat: 0.0, cholesterol: 85 },
    { id: 83, name: 'Chicken Biryani',            category: 'chicken',   unit: '1 plate (350g)',      cal: 490, protein: 28.0, carbs: 56.0, fat: 16.0, fiber: 2.0, sugar: 2.5 , satFat: 4.5, polyFat: 3.5, monoFat: 6.0, transFat: 0.0, cholesterol: 75 },
    { id: 84, name: 'Butter Chicken',             category: 'chicken',   unit: '1 cup (200g)',        cal: 360, protein: 26.0, carbs: 10.0, fat: 24.0, fiber: 1.5, sugar: 5.0 , satFat: 10.0, polyFat: 4.0, monoFat: 8.0, transFat: 0.5, cholesterol: 95 },
    { id: 85, name: 'Chicken 65',                 category: 'chicken',   unit: '6 pieces (150g)',     cal: 320, protein: 28.0, carbs: 12.0, fat: 18.0, fiber: 0.5, sugar: 1.0 , satFat: 4.5, polyFat: 4.0, monoFat: 7.0, transFat: 0.0, cholesterol: 80 },
    { id: 86, name: 'Chicken Tikka',              category: 'chicken',   unit: '4 pieces (150g)',     cal: 265, protein: 30.0, carbs: 5.0,  fat: 13.0, fiber: 0.5, sugar: 1.5 , satFat: 3.5, polyFat: 2.5, monoFat: 5.5, transFat: 0.0, cholesterol: 90 },
    { id: 87, name: 'Chicken Leg Piece',          category: 'chicken',   unit: '1 piece (120g)',      cal: 200, protein: 22.0, carbs: 0.0,  fat: 12.0, fiber: 0.0, sugar: 0.0 , satFat: 3.5, polyFat: 2.5, monoFat: 5.0, transFat: 0.0, cholesterol: 75 },
    { id: 88, name: 'Boiled Chicken (plain)',     category: 'chicken',   unit: '100g',               cal: 165, protein: 31.0, carbs: 0.0,  fat: 3.6,  fiber: 0.0, sugar: 0.0 , satFat: 1.0, polyFat: 0.8, monoFat: 1.5, transFat: 0.0, cholesterol: 85 },
    { id: 89, name: 'Chicken Soup',               category: 'chicken',   unit: '1 bowl (250ml)',      cal: 100, protein: 12.0, carbs: 5.0,  fat: 3.5,  fiber: 0.5, sugar: 1.0 , satFat: 1.0, polyFat: 1.0, monoFat: 1.5, transFat: 0.0, cholesterol: 30 },
    // ---- EGGS ----
    { id: 90, name: 'Boiled Egg',                 category: 'egg',       unit: '1 large (50g)',       cal: 77,  protein: 6.3,  carbs: 0.5,  fat: 5.3,  fiber: 0.0, sugar: 0.3 , satFat: 1.6, polyFat: 0.7, monoFat: 2.0, transFat: 0.0, cholesterol: 186 },
    { id: 91, name: 'Egg White (only)',            category: 'egg',       unit: '1 white (33g)',       cal: 17,  protein: 3.6,  carbs: 0.2,  fat: 0.1,  fiber: 0.0, sugar: 0.2 , satFat: 0.0, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 92, name: 'Omelette (plain)',            category: 'egg',       unit: '2 egg omelette',      cal: 190, protein: 13.0, carbs: 1.0,  fat: 15.0, fiber: 0.0, sugar: 0.5 , satFat: 4.0, polyFat: 1.5, monoFat: 6.0, transFat: 0.0, cholesterol: 370 },
    { id: 93, name: 'Egg Bhurji',                 category: 'egg',       unit: '2 eggs (120g)',       cal: 210, protein: 14.0, carbs: 4.0,  fat: 16.0, fiber: 0.5, sugar: 1.0 , satFat: 4.5, polyFat: 1.8, monoFat: 7.0, transFat: 0.0, cholesterol: 420 },
    { id: 94, name: 'Fried Egg',                  category: 'egg',       unit: '1 egg (50g)',         cal: 90,  protein: 6.0,  carbs: 0.5,  fat: 7.0,  fiber: 0.0, sugar: 0.3 , satFat: 2.0, polyFat: 1.0, monoFat: 3.0, transFat: 0.0, cholesterol: 210 },
    // ---- SNACKS ----
    { id: 100, name: 'Samosa',                    category: 'snacks',    unit: '1 piece (80g)',       cal: 210, protein: 4.5,  carbs: 26.0, fat: 10.0, fiber: 2.0, sugar: 1.5 , satFat: 2.5, polyFat: 2.5, monoFat: 4.5, transFat: 0.0, cholesterol: 0 },
    { id: 101, name: 'Vada Pav',                  category: 'snacks',    unit: '1 piece (150g)',      cal: 290, protein: 7.0,  carbs: 44.0, fat: 9.5,  fiber: 2.5, sugar: 2.0 , satFat: 2.0, polyFat: 2.5, monoFat: 4.0, transFat: 0.0, cholesterol: 0 },
    { id: 102, name: 'Pakoda (Veg)',              category: 'snacks',    unit: '5 pieces (80g)',      cal: 200, protein: 4.0,  carbs: 22.0, fat: 11.0, fiber: 1.5, sugar: 0.8 , satFat: 1.5, polyFat: 3.0, monoFat: 5.0, transFat: 0.0, cholesterol: 0 },
    { id: 103, name: 'Bread Omelette',            category: 'snacks',    unit: '1 serving (120g)',    cal: 260, protein: 13.0, carbs: 24.0, fat: 12.0, fiber: 1.0, sugar: 1.5 , satFat: 3.5, polyFat: 2.5, monoFat: 5.5, transFat: 0.0, cholesterol: 200 },
    { id: 104, name: 'Peanuts (roasted)',         category: 'snacks',    unit: 'handful (30g)',       cal: 171, protein: 7.8,  carbs: 5.0,  fat: 14.5, fiber: 2.4, sugar: 0.5 , satFat: 2.0, polyFat: 4.5, monoFat: 6.5, transFat: 0.0, cholesterol: 0 },
    { id: 105, name: 'Murukku',                   category: 'snacks',    unit: '3 pieces (30g)',      cal: 155, protein: 3.0,  carbs: 20.0, fat: 7.0,  fiber: 0.8, sugar: 0.3 , satFat: 1.5, polyFat: 2.0, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    { id: 106, name: 'Kachori',                   category: 'snacks',    unit: '1 piece (60g)',       cal: 175, protein: 3.5,  carbs: 22.0, fat: 8.0,  fiber: 1.2, sugar: 0.5 , satFat: 1.5, polyFat: 2.0, monoFat: 3.5, transFat: 0.0, cholesterol: 0 },
    { id: 107, name: 'Banana Chips',              category: 'snacks',    unit: '1 small pack (30g)',  cal: 155, protein: 1.0,  carbs: 17.0, fat: 9.5,  fiber: 1.0, sugar: 4.0 , satFat: 4.0, polyFat: 0.5, monoFat: 0.5, transFat: 0.0, cholesterol: 0 },
    { id: 108, name: 'Dhokla',                    category: 'snacks',    unit: '3 pieces (90g)',      cal: 140, protein: 6.5,  carbs: 22.0, fat: 3.0,  fiber: 1.5, sugar: 2.5 , satFat: 1.0, polyFat: 0.5, monoFat: 1.2, transFat: 0.0, cholesterol: 0 },
    { id: 109, name: 'Boiled Chana',              category: 'snacks',    unit: '1 cup (160g)',        cal: 270, protein: 15.0, carbs: 40.0, fat: 4.0,  fiber: 10.0, sugar: 2.0 , satFat: 0.4, polyFat: 1.5, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 110, name: 'Pani Puri / Golgappa',      category: 'snacks',    unit: '6 pieces (120g)',     cal: 195, protein: 4.0,  carbs: 32.0, fat: 6.0,  fiber: 2.5, sugar: 3.5 , satFat: 1.0, polyFat: 1.5, monoFat: 2.5, transFat: 0.0, cholesterol: 0 },
    { id: 111, name: 'Bhel Puri',                 category: 'snacks',    unit: '1 cup (100g)',        cal: 165, protein: 4.0,  carbs: 28.0, fat: 4.5,  fiber: 2.0, sugar: 4.0 , satFat: 0.8, polyFat: 1.2, monoFat: 2.0, transFat: 0.0, cholesterol: 0 },
    { id: 112, name: 'Masala Peanuts',            category: 'snacks',    unit: 'handful (40g)',       cal: 200, protein: 8.5,  carbs: 14.0, fat: 13.0, fiber: 3.0, sugar: 0.5 , satFat: 2.0, polyFat: 3.5, monoFat: 6.0, transFat: 0.0, cholesterol: 0 },
    // ---- DAIRY ----
    { id: 120, name: 'Milk (Full Fat)',           category: 'dairy',     unit: '1 glass (250ml)',     cal: 150, protein: 8.0,  carbs: 12.0, fat: 8.0,  fiber: 0.0, sugar: 12.0 , satFat: 5.0, polyFat: 0.3, monoFat: 2.0, transFat: 0.0, cholesterol: 24 },
    { id: 121, name: 'Milk (Toned/Low Fat)',      category: 'dairy',     unit: '1 glass (250ml)',     cal: 115, protein: 8.0,  carbs: 12.0, fat: 3.5,  fiber: 0.0, sugar: 12.0 , satFat: 2.0, polyFat: 0.2, monoFat: 1.0, transFat: 0.0, cholesterol: 12 },
    { id: 122, name: 'Curd / Dahi',              category: 'dairy',     unit: '1 cup (200g)',        cal: 120, protein: 6.5,  carbs: 9.5,  fat: 5.0,  fiber: 0.0, sugar: 9.0 , satFat: 3.0, polyFat: 0.2, monoFat: 1.5, transFat: 0.0, cholesterol: 17 },
    { id: 123, name: 'Paneer (raw)',              category: 'dairy',     unit: '100g',               cal: 265, protein: 18.0, carbs: 3.5,  fat: 20.0, fiber: 0.0, sugar: 3.0 , satFat: 13.0, polyFat: 0.5, monoFat: 5.5, transFat: 0.0, cholesterol: 66 },
    { id: 124, name: 'Greek Yogurt',             category: 'dairy',     unit: '1 cup (170g)',        cal: 100, protein: 17.0, carbs: 6.0,  fat: 0.7,  fiber: 0.0, sugar: 4.0 , satFat: 0.4, polyFat: 0.1, monoFat: 0.2, transFat: 0.0, cholesterol: 10 },
    { id: 125, name: 'Butter',                   category: 'dairy',     unit: '1 tsp (5g)',          cal: 36,  protein: 0.0,  carbs: 0.0,  fat: 4.0,  fiber: 0.0, sugar: 0.0 , satFat: 2.5, polyFat: 0.1, monoFat: 1.0, transFat: 0.1, cholesterol: 12 },
    { id: 126, name: 'Ghee',                     category: 'dairy',     unit: '1 tsp (5g)',          cal: 45,  protein: 0.0,  carbs: 0.0,  fat: 5.0,  fiber: 0.0, sugar: 0.0 , satFat: 3.2, polyFat: 0.1, monoFat: 1.0, transFat: 0.0, cholesterol: 13 },
    { id: 127, name: 'Buttermilk (Chaas)',        category: 'dairy',     unit: '1 glass (250ml)',     cal: 50,  protein: 3.5,  carbs: 5.5,  fat: 1.5,  fiber: 0.0, sugar: 5.0 , satFat: 0.9, polyFat: 0.1, monoFat: 0.4, transFat: 0.0, cholesterol: 5 },
    { id: 128, name: 'Whey Protein (scoop)',      category: 'dairy',     unit: '1 scoop (30g)',       cal: 120, protein: 24.0, carbs: 3.0,  fat: 1.5,  fiber: 0.0, sugar: 2.0 , satFat: 0.5, polyFat: 0.2, monoFat: 0.3, transFat: 0.0, cholesterol: 10 },
    { id: 129, name: 'Condensed Milk',           category: 'dairy',     unit: '1 tbsp (20g)',        cal: 64,  protein: 1.5,  carbs: 11.0, fat: 1.7,  fiber: 0.0, sugar: 11.0 , satFat: 1.1, polyFat: 0.1, monoFat: 0.5, transFat: 0.0, cholesterol: 7 },
    // ---- FRUITS ----
    { id: 140, name: 'Banana',                   category: 'fruits',    unit: '1 medium (100g)',     cal: 89,  protein: 1.1,  carbs: 23.0, fat: 0.3,  fiber: 2.6, sugar: 12.0 , satFat: 0.1, polyFat: 0.1, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 141, name: 'Apple',                    category: 'fruits',    unit: '1 medium (150g)',     cal: 78,  protein: 0.4,  carbs: 21.0, fat: 0.2,  fiber: 2.7, sugar: 16.0 , satFat: 0.0, polyFat: 0.1, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 142, name: 'Mango',                    category: 'fruits',    unit: '1 medium (200g)',     cal: 130, protein: 1.0,  carbs: 33.0, fat: 0.5,  fiber: 3.0, sugar: 29.0 , satFat: 0.1, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 143, name: 'Papaya',                   category: 'fruits',    unit: '1 cup (150g)',        cal: 62,  protein: 0.7,  carbs: 15.7, fat: 0.4,  fiber: 2.5, sugar: 11.0 , satFat: 0.1, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 144, name: 'Watermelon',               category: 'fruits',    unit: '1 slice (250g)',      cal: 75,  protein: 1.5,  carbs: 18.0, fat: 0.3,  fiber: 1.0, sugar: 15.0 , satFat: 0.0, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 145, name: 'Orange',                   category: 'fruits',    unit: '1 medium (130g)',     cal: 62,  protein: 1.2,  carbs: 15.5, fat: 0.2,  fiber: 3.1, sugar: 12.0 , satFat: 0.0, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 146, name: 'Guava',                    category: 'fruits',    unit: '1 medium (100g)',     cal: 68,  protein: 2.6,  carbs: 14.3, fat: 1.0,  fiber: 5.4, sugar: 9.0 , satFat: 0.3, polyFat: 0.4, monoFat: 0.2, transFat: 0.0, cholesterol: 0 },
    { id: 147, name: 'Grapes',                   category: 'fruits',    unit: '1 cup (150g)',        cal: 104, protein: 1.1,  carbs: 27.0, fat: 0.2,  fiber: 1.4, sugar: 23.0 , satFat: 0.1, polyFat: 0.1, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 148, name: 'Pomegranate',              category: 'fruits',    unit: '1 cup (180g)',        cal: 144, protein: 2.9,  carbs: 32.5, fat: 2.1,  fiber: 7.0, sugar: 24.0 , satFat: 0.2, polyFat: 0.5, monoFat: 0.3, transFat: 0.0, cholesterol: 0 },
    { id: 149, name: 'Pineapple',                category: 'fruits',    unit: '1 cup (165g)',        cal: 83,  protein: 0.9,  carbs: 21.6, fat: 0.2,  fiber: 2.3, sugar: 16.0 , satFat: 0.0, polyFat: 0.1, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 150, name: 'Chickoo / Sapodilla',      category: 'fruits',    unit: '1 medium (100g)',     cal: 83,  protein: 0.4,  carbs: 19.9, fat: 1.1,  fiber: 5.3, sugar: 14.0 , satFat: 0.3, polyFat: 0.0, monoFat: 0.5, transFat: 0.0, cholesterol: 0 },
    // ---- SWEETS ----
    { id: 160, name: 'Halwa (Rava)',             category: 'sweets',    unit: '1 cup (150g)',        cal: 380, protein: 5.0,  carbs: 55.0, fat: 14.0, fiber: 1.5, sugar: 30.0 , satFat: 8.0, polyFat: 1.0, monoFat: 3.0, transFat: 0.0, cholesterol: 25 },
    { id: 161, name: 'Gulab Jamun',              category: 'sweets',    unit: '2 pieces (80g)',      cal: 270, protein: 4.0,  carbs: 42.0, fat: 9.5,  fiber: 0.5, sugar: 32.0 , satFat: 4.5, polyFat: 0.8, monoFat: 3.5, transFat: 0.0, cholesterol: 10 },
    { id: 162, name: 'Rasgulla',                 category: 'sweets',    unit: '2 pieces (100g)',     cal: 186, protein: 5.0,  carbs: 38.0, fat: 1.0,  fiber: 0.0, sugar: 35.0 , satFat: 0.5, polyFat: 0.1, monoFat: 0.3, transFat: 0.0, cholesterol: 5 },
    { id: 163, name: 'Laddu (Besan)',            category: 'sweets',    unit: '1 piece (40g)',       cal: 175, protein: 3.5,  carbs: 22.0, fat: 8.0,  fiber: 1.0, sugar: 14.0 , satFat: 4.0, polyFat: 1.5, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 164, name: 'Kheer (Rice Payasam)',     category: 'sweets',    unit: '1 cup (200g)',        cal: 250, protein: 7.0,  carbs: 38.0, fat: 8.0,  fiber: 0.3, sugar: 28.0 , satFat: 4.5, polyFat: 0.5, monoFat: 2.5, transFat: 0.0, cholesterol: 20 },
    { id: 165, name: 'Jalebi',                   category: 'sweets',    unit: '2 pieces (40g)',      cal: 150, protein: 1.5,  carbs: 28.0, fat: 4.5,  fiber: 0.0, sugar: 22.0 , satFat: 1.0, polyFat: 1.5, monoFat: 1.5, transFat: 0.0, cholesterol: 0 },
    { id: 166, name: 'Mysore Pak',               category: 'sweets',    unit: '1 piece (50g)',       cal: 245, protein: 4.5,  carbs: 25.0, fat: 14.0, fiber: 1.0, sugar: 18.0 , satFat: 7.0, polyFat: 1.5, monoFat: 4.0, transFat: 0.0, cholesterol: 0 },
    { id: 167, name: 'Payasam (Semiya)',         category: 'sweets',    unit: '1 cup (200g)',        cal: 260, protein: 6.0,  carbs: 40.0, fat: 8.0,  fiber: 0.5, sugar: 30.0 , satFat: 4.5, polyFat: 0.5, monoFat: 2.5, transFat: 0.0, cholesterol: 20 },
    { id: 168, name: 'Kesari Bath',              category: 'sweets',    unit: '1 cup (120g)',        cal: 290, protein: 3.5,  carbs: 46.0, fat: 10.0, fiber: 0.5, sugar: 28.0 , satFat: 5.0, polyFat: 1.0, monoFat: 3.0, transFat: 0.0, cholesterol: 0 },
    // ---- DRINKS ----
    { id: 180, name: 'Tea (with milk+sugar)',    category: 'drinks',    unit: '1 cup (180ml)',       cal: 55,  protein: 1.5,  carbs: 10.0, fat: 1.0,  fiber: 0.0, sugar: 8.0 , satFat: 0.6, polyFat: 0.0, monoFat: 0.3, transFat: 0.0, cholesterol: 4 },
    { id: 181, name: 'Coffee (with milk)',       category: 'drinks',    unit: '1 cup (180ml)',       cal: 60,  protein: 2.0,  carbs: 9.0,  fat: 2.0,  fiber: 0.0, sugar: 7.0 , satFat: 1.2, polyFat: 0.1, monoFat: 0.6, transFat: 0.0, cholesterol: 8 },
    { id: 182, name: 'Black Coffee',             category: 'drinks',    unit: '1 cup (200ml)',       cal: 5,   protein: 0.3,  carbs: 0.5,  fat: 0.0,  fiber: 0.0, sugar: 0.0 , satFat: 0.0, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 183, name: 'Coconut Water',            category: 'drinks',    unit: '1 coconut (300ml)',   cal: 60,  protein: 0.8,  carbs: 14.0, fat: 0.5,  fiber: 1.0, sugar: 10.0 , satFat: 0.5, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 184, name: 'Mango Juice (fresh)',      category: 'drinks',    unit: '1 glass (250ml)',     cal: 128, protein: 0.5,  carbs: 32.0, fat: 0.2,  fiber: 1.5, sugar: 28.0 , satFat: 0.0, polyFat: 0.1, monoFat: 0.1, transFat: 0.0, cholesterol: 0 },
    { id: 185, name: 'Lassi (plain)',            category: 'drinks',    unit: '1 glass (250ml)',     cal: 150, protein: 8.0,  carbs: 18.0, fat: 5.0,  fiber: 0.0, sugar: 14.0 , satFat: 3.0, polyFat: 0.2, monoFat: 1.5, transFat: 0.0, cholesterol: 17 },
    { id: 186, name: 'Lassi (sweet)',            category: 'drinks',    unit: '1 glass (250ml)',     cal: 220, protein: 7.5,  carbs: 35.0, fat: 5.0,  fiber: 0.0, sugar: 28.0 , satFat: 3.0, polyFat: 0.2, monoFat: 1.5, transFat: 0.0, cholesterol: 17 },
    { id: 187, name: 'Protein Shake',            category: 'drinks',    unit: '1 serving (350ml)',   cal: 180, protein: 25.0, carbs: 8.0,  fat: 5.0,  fiber: 1.0, sugar: 4.0 , satFat: 1.5, polyFat: 0.5, monoFat: 1.5, transFat: 0.0, cholesterol: 30 },
    { id: 188, name: 'Tender Coconut Water',     category: 'drinks',    unit: '1 glass (250ml)',     cal: 50,  protein: 0.5,  carbs: 12.0, fat: 0.2,  fiber: 0.8, sugar: 9.0 , satFat: 0.2, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 189, name: 'Nimbu Pani / Lemonade',   category: 'drinks',    unit: '1 glass (250ml)',     cal: 60,  protein: 0.2,  carbs: 16.0, fat: 0.0,  fiber: 0.2, sugar: 14.0 , satFat: 0.0, polyFat: 0.0, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
    { id: 190, name: 'Badam Milk',               category: 'drinks',    unit: '1 glass (250ml)',     cal: 210, protein: 8.0,  carbs: 28.0, fat: 8.0,  fiber: 1.0, sugar: 22.0 , satFat: 1.0, polyFat: 2.5, monoFat: 3.5, transFat: 0.0, cholesterol: 0 },
    { id: 191, name: 'Sugarcane Juice',          category: 'drinks',    unit: '1 glass (250ml)',     cal: 115, protein: 0.3,  carbs: 28.0, fat: 0.2,  fiber: 0.0, sugar: 26.0 , satFat: 0.0, polyFat: 0.1, monoFat: 0.0, transFat: 0.0, cholesterol: 0 },
  ];


  // ==========================================
  //  MERGE EXTENDED FOODS (NEW)
  // ==========================================
  if (typeof EXTENDED_FOODS !== 'undefined') {
    EXTENDED_FOODS.forEach(f => {
      LOCAL_FOOD_DB.push(f);
    });
  }


  // ==========================================
  //  POPULAR FOODS (NEW)
  // ==========================================
  const POPULAR_FOODS = [
    'Idli',
    'Dosa (Plain)',
    'Chicken Biryani',
    'Curd Rice',
    'Paneer Butter Masala',
    'Roti / Chapati',
    'Boiled Egg',
    'Sambar',
    'Upma',
    'Vegetable Pulao'
  ];



  // ==========================================
  //  INDEX LOCAL DB FOR FAST SEARCH (NEW)
  // ==========================================
  const LOCAL_DB_INDEX = LOCAL_FOOD_DB.map(f => ({
    ...f,
    searchKey: f.name.toLowerCase()
  }));

  // ==========================================
  //  APP STATE
  // ==========================================
  const STORAGE_KEY = 'cfgym_calorie_log_v2';

  let state = {
    log:            { breakfast: [], lunch: [], dinner: [], snacks: [] },
    selectedFood:   null,
    searchQuery:    '',
    activeCategory: 'all',
    isLoading:      false,
    searchTimeout:  null,
    currentResults: [],
    recentFoods: []  // keep reference so click works by index
  
  };

  // ==========================================
  //  INIT
  // ==========================================
  function init() {
    setYear();
    setupLinks();
    initMobileNav();
    initNavbarScroll();
    initBackToTop();
    initDietBar();
    initJoinModal();
    loadFromStorage();
    bindSearchEvents();
    bindCategoryPills();
    bindAddFoodEvents();
    bindMealToggle();
    bindSaveReset();
    renderPopularChips();
    renderRecentSection();
    showPlaceholder();
    renderAll();
    bindCalorieGoal();
    updateCalorieGoalBar();
    initTabs();
  }

  // ==========================================
  //  TAB SWITCHING SYSTEM (NEW)
  // ==========================================
  function initTabs() {
    const tabBtns   = document.querySelectorAll('.cal-tab-btn');
    const tabPanels = document.querySelectorAll('.cal-tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
        if (target === 'summary') renderMacroChart();
      });
    });

    const gotoSearchBtn = document.getElementById('gotoSearchBtn');
    if (gotoSearchBtn) {
      gotoSearchBtn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        const searchBtn = document.querySelector('.cal-tab-btn[data-tab="search"]');
        if (searchBtn) searchBtn.classList.add('active');
        const searchPanel = document.getElementById('tab-search');
        if (searchPanel) searchPanel.classList.add('active');
        const input = document.getElementById('foodSearch');
        if (input) input.focus();
      });
    }
  }

  // Update badge count on meals tab
  function updateMealBadge() {
    const badge = document.getElementById('mealCountBadge');
    if (!badge) return;
    const total = state.log.breakfast.length + state.log.lunch.length +
                  state.log.dinner.length   + state.log.snacks.length;
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-block' : 'none';
  }


  function getFoodEmoji(name) {
    const n = name.toLowerCase();
  
    if (n.includes('chicken')) return '🍗';
    if (n.includes('egg')) return '🥚';
    if (n.includes('rice') || n.includes('biryani')) return '🍚';
    if (n.includes('dosa') || n.includes('idli')) return '🥞';
    if (n.includes('paneer')) return '🧀';
    if (n.includes('fruit') || n.includes('banana') || n.includes('mango')) return '🍎';
    if (n.includes('milk') || n.includes('lassi')) return '🥛';
    return '🍽️';
  }


  // ==========================================
  //  UTILITY
  // ==========================================
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function round1(n) { return Math.round(n * 10) / 10; }

  function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    const txt   = document.getElementById('toastText');
    if (!toast) return;
    if (txt) txt.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ==========================================
  //  STORAGE
  // ==========================================
  function saveToStorage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.log)); } catch (e) {}
  }

  function saveRecentFoods() {
    try {
      localStorage.setItem('cfgym_recent_foods', JSON.stringify(state.recentFoods));
    } catch(e){}
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        ['breakfast','lunch','dinner','snacks'].forEach(m => {
          if (Array.isArray(parsed[m])) state.log[m] = parsed[m];
        });
      }
      const recent = localStorage.getItem('cfgym_recent_foods');
      if (recent) {
        try { state.recentFoods = JSON.parse(recent); } catch(e){}
      }
    } catch (e) {}
  }

  function resetLog() {
    state.log = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    saveToStorage();
    renderAll();
    showToast('🗑 Day log cleared!');
    const notice = document.getElementById('savedNotice');
    if (notice) notice.style.display = 'none';
  }

  // ==========================================
  //  USDA API via Cloudflare Worker
  // ==========================================
  async function searchFoodAPI(query) {
    const res = await fetch(`${WORKER_URL}/search-food`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data; // array of { id, name, calories, protein, carbs, fat, fiber, sugar }
  }

  // ==========================================
//  AI NUTRITION — asks OpenAI via Worker
// ==========================================
async function fetchAINutrition(query) {
  const res = await fetch(`${WORKER_URL}/nutrition-ai`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('AI nutrition error ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

  // Convert USDA result to our standard food object (values are per 100g from USDA)
  function mapUSDAFood(f) {
    return {
      id:          'usda_' + f.id,
      name:        cleanName(f.name),
      category:    'usda',
      unit:        '100g',
      cal:         round1(f.calories     || 0),
      protein:     round1(f.protein      || 0),
      carbs:       round1(f.carbs        || 0),
      fat:         round1(f.fat          || 0),
      fiber:       round1(f.fiber        || 0),
      sugar:       round1(f.sugar        || 0),
      satFat:      round1(f.satFat       || f.saturatedFat       || 0),
      polyFat:     round1(f.polyFat      || f.polyunsaturatedFat || 0),
      monoFat:     round1(f.monoFat      || f.monounsaturatedFat || 0),
      transFat:    round1(f.transFat     || 0),
      cholesterol: round1(f.cholesterol  || 0),
      source:      'USDA'
    };
  }

  // USDA names come like "IDLI, STEAMED" — fix to "Idli, Steamed"
  function cleanName(name) {
    if (!name) return 'Unknown';
    return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  // ==========================================
  //  LOCAL SEARCH (fallback)
  // ==========================================
  function searchLocal(query, category) {
    const q = query.toLowerCase().trim();
  
    let results = LOCAL_DB_INDEX.filter(f => {
      const matchCat = category === 'all' || f.category === category;
      const matchQ   = !q || f.searchKey.includes(q);
      return matchCat && matchQ;
    });
  
    if (!q) return results;
  
    // Ranking logic
    results.sort((a, b) => {
      const aExact = a.searchKey === q ? 1 : 0;
      const bExact = b.searchKey === q ? 1 : 0;
  
      if (aExact !== bExact) return bExact - aExact;
  
      const aStarts = a.searchKey.startsWith(q) ? 1 : 0;
      const bStarts = b.searchKey.startsWith(q) ? 1 : 0;
  
      if (aStarts !== bStarts) return bStarts - aStarts;
  
      return a.searchKey.indexOf(q) - b.searchKey.indexOf(q);
    });
  
    return results.slice(0, 20); // limit to top 20
  }

  // ==========================================
  //  SEARCH EVENTS — debounced, API + local merge
  // ==========================================
  function bindSearchEvents() {
    const input    = document.getElementById('foodSearch');
    const clearBtn = document.getElementById('searchClear');

    if (input) {
      input.addEventListener('input', () => {
        state.searchQuery = input.value;
        setDiscoveryVisibility(true);
        if (clearBtn) clearBtn.style.display = input.value ? 'block' : 'none';

        clearTimeout(state.searchTimeout);

        if (!input.value.trim()) {
          setDiscoveryVisibility(false);
          showPlaceholder();
          return;
        }

        if (input.value.trim().length < 2) {
          // Short query: show local only immediately
          const local = searchLocal(input.value.trim(), state.activeCategory);
          renderResults(local.map(f => ({ ...f, source: 'Local' })));
          return;
        }

        // Debounce 400ms then hit API
        state.searchTimeout = setTimeout(() => {
          performSearch(input.value.trim());
        }, 400);
      });

      // ✅ FIX: Enter key triggers immediate search
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = input.value.trim();
          if (!q) return;
          clearTimeout(state.searchTimeout);
          setDiscoveryVisibility(true);
          if (clearBtn) clearBtn.style.display = 'block';
          performSearch(q);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value         = '';
        state.searchQuery   = '';
        clearBtn.style.display = 'none';
        clearTimeout(state.searchTimeout);
        setDiscoveryVisibility(false);
        showPlaceholder();
        input.focus();
      });
    }
  }

  async function performSearch(query) {
    setLoading(true);
  
    try {
      // Step 1: Check local Indian food DB first
      const localMatches = searchLocal(query, 'all');
      const localMapped  = localMatches.map(f => ({ ...f, source: 'Local' }));
  
      // If local has good results (3+), show immediately
      if (localMapped.length >= 3) {
        renderResults(localMapped);
        return;
      }
  
      // Step 2: Ask AI if local results are few
      try {
        const aiResults = await fetchAINutrition(query);
  
        if (aiResults && aiResults.length > 0) {
  
          // ✅ VERY IMPORTANT — map AI results first
          const aiMapped = aiResults.map(f => ({
            ...f,
            source: 'AI'
          }));
  
          const localNames = new Set(
            localMapped.map(f => f.name.toLowerCase())
          );
  
          // 1️⃣ Remove items already in local
          const aiFiltered = aiMapped.filter(
            f => !localNames.has(f.name.toLowerCase())
          );
  
          // 2️⃣ Remove duplicates inside AI results
          const seen = new Set();
          const aiUnique = aiFiltered.filter(f => {
            const key = f.name.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
  
          renderResults([...localMapped, ...aiUnique]);
          return;
        }
  
      } catch (aiErr) {
        console.warn('AI nutrition failed:', aiErr.message);
      }
  
      // Step 3: Fallback
      if (localMapped.length > 0) {
        renderResults(localMapped);
      } else {
        try {
          const usdaResults = await searchFoodAPI(query);
          const usdaMapped  = usdaResults
            .map(mapUSDAFood)
            .slice(0, 5);
  
          renderResults(usdaMapped);
        } catch {
          renderResults([]);
        }
      }
  
    } finally {
      setLoading(false);
    }
  }


  function bindCategoryPills() {
    const pills = document.querySelectorAll('.cal-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.getAttribute('data-cat');

        if (state.searchQuery.trim().length >= 2) {
          performSearch(state.searchQuery.trim());
        } else {
          // Category pill with no query → show local category items
          if (state.activeCategory === 'all') {
            showPlaceholder();
          } else {
            const local = searchLocal('', state.activeCategory);
            renderResults(local.map(f => ({ ...f, source: 'Local' })));
          }
        }
      });
    });
  }

  // ==========================================
  //  LOADING + PLACEHOLDER
  // ==========================================
  function setLoading(on) {
    state.isLoading = on;
    const container = document.getElementById('foodResults');
    if (!container || !on) return;
    container.innerHTML = `
      <div class="cal-loading">
        <div class="cal-spinner"></div>
        <div>Searching 10,000+ foods...</div>
      </div>`;
  }

  function showPlaceholder() {
    const container = document.getElementById('foodResults');
    if (!container) return;
  
    container.innerHTML = `
      <div class="cal-results-placeholder">
        <div class="cal-results-placeholder-icon">🥘</div>
        <div>Type a food name or pick a category above</div>
        <div class="cal-results-placeholder-sub">15,000+ Indian foods including Tamil dishes — powered by AI</div>
      </div>`;
  }

  function setDiscoveryVisibility(isSearching) {
    const recentSection  = document.getElementById('recentSection');
    const popularSection = document.getElementById('popularSection');
  
    if (isSearching) {
      if (recentSection) recentSection.style.display = 'none';
      if (popularSection) popularSection.style.display = 'none';
    } else {
      // restore
      renderRecentSection(); // this will show/hide based on recentFoods length
      if (popularSection) popularSection.style.display = 'block';
    }
  }
// ==========================================
//  CALORIE GOAL SYSTEM
// ==========================================
function bindCalorieGoal() {
const input = document.getElementById('calorieGoalInput');
if (!input) return;

const savedGoal = localStorage.getItem('cfgym_calorie_goal');
if (savedGoal) input.value = savedGoal;

input.addEventListener('input', () => {
  localStorage.setItem('cfgym_calorie_goal', input.value);
  updateCalorieGoalBar();
});
}

function updateCalorieGoalBar() {
const goalInput = document.getElementById('calorieGoalInput');
const bar       = document.getElementById('calorieProgressBar');
const text      = document.getElementById('calorieGoalText');

if (!goalInput || !bar || !text) return;

const goal = parseFloat(goalInput.value) || 2000;

const totalCalories = [
  ...state.log.breakfast,
  ...state.log.lunch,
  ...state.log.dinner,
  ...state.log.snacks
].reduce((sum, item) => sum + (item.cal || 0), 0);

const percent = Math.min((totalCalories / goal) * 100, 100);

bar.style.width = percent + '%';

text.innerHTML = `${Math.round(totalCalories)} / ${goal} kcal`;

if (percent > 100) {
  bar.style.background = '#E53935';
} else {
  bar.style.background = 'linear-gradient(90deg,#4CAF50,#8BC34A)';
}
}

  // ==========================================
  //  RENDER POPULAR CHIPS
  // ==========================================
  function renderPopularChips() {
    const container = document.getElementById('popularChips');
    if (!container) return;

    container.innerHTML = POPULAR_FOODS.map(name => `
      <button class="cal-pop-chip" data-name="${name}">
        ${getFoodEmoji(name)} ${name}
      </button>
    `).join('');

    container.querySelectorAll('.cal-pop-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const input = document.getElementById('foodSearch');
        input.value = name;
        state.searchQuery = name;
        performSearch(name);
      });
    });
  }

  // ==========================================
  //  RENDER RECENT SECTION
  // ==========================================
  function renderRecentSection() {
    const section = document.getElementById('recentSection');
    const list    = document.getElementById('recentList');

    if (!section || !list) return;

    if (state.recentFoods.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    list.innerHTML = state.recentFoods.map((food, i) => `
      <div class="cal-recent-item" data-index="${i}">
        ${getFoodEmoji(food.name)} ${food.name}
      </div>
    `).join('');

    list.querySelectorAll('.cal-recent-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'));
        const food = state.recentFoods[idx];
        if (food) selectFood(food);
      });
    });
  }
  // ==========================================
  //  RENDER RESULTS LIST
  // ==========================================
  function renderResults(foods) {
    const container = document.getElementById('foodResults');
    if (!container) return;

    state.currentResults = foods; // save for click-by-index

    if (!foods || foods.length === 0) {
      container.innerHTML = `
        <div class="cal-no-results">
          <div style="font-size:1.5rem;margin-bottom:8px">🔍</div>
          No foods found. Try a different search term.
        </div>`;
      return;
    }

    container.innerHTML = foods.map((food, idx) => `
    <div class="cal-result-item cal-animate-in ${state.selectedFood && state.selectedFood.id === food.id ? 'selected' : ''}"
           data-idx="${idx}">
        <div class="cal-result-left">
          <div class="cal-result-name">
            ${getFoodEmoji(food.name)} ${food.name}
          </div>
          <div class="cal-result-meta">
            Per ${food.unit}
            &nbsp;·&nbsp; P:&nbsp;${food.protein}g
            &nbsp;·&nbsp; C:&nbsp;${food.carbs}g
            &nbsp;·&nbsp; Fat:&nbsp;${food.fat}g
            &nbsp;·&nbsp; Fiber:&nbsp;${food.fiber}g
            &nbsp;·&nbsp; Sugar:&nbsp;${food.sugar}g
            
          </div>
        </div>
        <div class="cal-result-cal">${food.cal}<span class="cal-result-unit"> kcal</span></div>
      </div>
    `).join('');

    container.querySelectorAll('.cal-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx  = parseInt(item.getAttribute('data-idx'));
        const food = state.currentResults[idx];
        if (food) selectFood(food);
      });
    });
  }

  // ==========================================
  //  SELECT FOOD → SHOW ADD CARD
  // ==========================================
  function selectFood(food) {
    if (!food) return;
    state.selectedFood = food;

    // Highlight in list
    document.querySelectorAll('.cal-result-item').forEach(el => el.classList.remove('selected'));
    const idx = state.currentResults.indexOf(food);
    const el  = document.querySelector(`.cal-result-item[data-idx="${idx}"]`);
    if (el) el.classList.add('selected');

    // Show add card
    const addCard = document.getElementById('calAddCard');
    if (addCard) {
      addCard.style.display = 'block';
      addCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Fill selected food display — all 6 macros including sugar
    const display = document.getElementById('selectedFoodDisplay');
    if (display) {
      display.innerHTML = `
        <div class="cal-selected-name">${food.name}</div>
        <div class="cal-selected-unit">Per ${food.unit}${''}</div>
        <div class="cal-selected-macros">
          <div class="cal-sel-macro">
            <span class="cal-sel-val">${food.cal}</span>
            <span class="cal-sel-lbl">kcal</span>
          </div>
          <div class="cal-sel-macro">
            <span class="cal-sel-val">${food.protein}g</span>
            <span class="cal-sel-lbl">Protein</span>
          </div>
          <div class="cal-sel-macro">
            <span class="cal-sel-val">${food.carbs}g</span>
            <span class="cal-sel-lbl">Carbs</span>
          </div>
          <div class="cal-sel-macro">
            <span class="cal-sel-val">${food.fat}g</span>
            <span class="cal-sel-lbl">Fat</span>
          </div>
          <div class="cal-sel-macro">
            <span class="cal-sel-val">${food.fiber}g</span>
            <span class="cal-sel-lbl">Fiber</span>
          </div>
          <div class="cal-sel-macro cal-sel-sugar">
            <span class="cal-sel-val">${food.sugar}g</span>
            <span class="cal-sel-lbl">Sugar</span>
          </div>
        </div>
      `;
    }

    document.getElementById('foodQty').value = 1;
    updatePreview();
  }

  // ==========================================
  //  ADD FOOD EVENTS
  // ==========================================
  function bindAddFoodEvents() {
    const qtyInput = document.getElementById('foodQty');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus  = document.getElementById('qtyPlus');
    const addBtn   = document.getElementById('addFoodBtn');

    if (qtyInput) qtyInput.addEventListener('input', updatePreview);
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        const v = parseFloat(qtyInput.value) || 1;
        qtyInput.value = Math.max(0.5, round1(v - 0.5));
        updatePreview();
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        const v = parseFloat(qtyInput.value) || 1;
        qtyInput.value = Math.min(20, round1(v + 0.5));
        updatePreview();
      });
    }
    if (addBtn) addBtn.addEventListener('click', addFoodToLog);
  }

  function updatePreview() {
    const food = state.selectedFood;
    if (!food) return;
    let qty = parseFloat(document.getElementById('foodQty').value) || 1;

    const gramMode = document.getElementById('gramModeToggle');
    if (gramMode && gramMode.checked) {
      qty = qty / 100; // convert grams to per-100g logic
    }
    const preview = document.getElementById('addPreview');
    if (!preview) return;

    preview.innerHTML = `
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1(food.cal * qty)}</span>
        <span class="cal-preview-lbl">kcal</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1(food.protein * qty)}g</span>
        <span class="cal-preview-lbl">Protein</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1(food.carbs * qty)}g</span>
        <span class="cal-preview-lbl">Carbs</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1(food.fat * qty)}g</span>
        <span class="cal-preview-lbl">Fat</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1(food.fiber * qty)}g</span>
        <span class="cal-preview-lbl">Fiber</span>
      </div>
      <div class="cal-preview-item cal-preview-sugar">
        <span class="cal-preview-val">${round1((food.sugar || 0) * qty)}g</span>
        <span class="cal-preview-lbl">Sugar</span>
      </div>
      <div class="cal-preview-item cal-preview-satfat">
        <span class="cal-preview-val">${round1((food.satFat || 0) * qty)}g</span>
        <span class="cal-preview-lbl">Sat.Fat</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1((food.polyFat || 0) * qty)}g</span>
        <span class="cal-preview-lbl">Poly.Fat</span>
      </div>
      <div class="cal-preview-item">
        <span class="cal-preview-val">${round1((food.monoFat || 0) * qty)}g</span>
        <span class="cal-preview-lbl">Mono.Fat</span>
      </div>
      <div class="cal-preview-item cal-preview-trans">
        <span class="cal-preview-val">${round1((food.transFat || 0) * qty)}g</span>
        <span class="cal-preview-lbl">Trans Fat</span>
      </div>
      <div class="cal-preview-item cal-preview-chol">
        <span class="cal-preview-val">${round1((food.cholesterol || 0) * qty)}mg</span>
        <span class="cal-preview-lbl">Cholesterol</span>
      </div>
    `;
  }

  function addFoodToLog() {
    const food = state.selectedFood;
    if (!food) { showToast('⚠️ Please select a food first'); return; }

    const qty  = parseFloat(document.getElementById('foodQty').value) || 1;
    const meal = document.getElementById('mealTypeSelect').value;

    const entry = {
      id:          Date.now(),
      foodId:      food.id,
      name:        food.name,
      unit:        food.unit,
      qty:         qty,
      cal:         round1(food.cal              * qty),
      protein:     round1(food.protein          * qty),
      carbs:       round1(food.carbs            * qty),
      fat:         round1(food.fat              * qty),
      fiber:       round1(food.fiber            * qty),
      sugar:       round1((food.sugar       || 0) * qty),
      satFat:      round1((food.satFat      || 0) * qty),
      polyFat:     round1((food.polyFat     || 0) * qty),
      monoFat:     round1((food.monoFat     || 0) * qty),
      transFat:    round1((food.transFat    || 0) * qty),
      cholesterol: round1((food.cholesterol || 0) * qty),
      source:      food.source || 'Local'
    };

    state.log[meal].push(entry);

    // ===== UPDATE RECENT FOODS (NEW) =====
    state.recentFoods = state.recentFoods.filter(f => f.id !== food.id);
    state.recentFoods.unshift(food);
    if (state.recentFoods.length > 10) {
      state.recentFoods.pop();
    }
    saveRecentFoods();

    renderRecentSection();
    saveToStorage();
    renderAll();
    showToast(`✅ ${food.name} added to ${meal}!`);

    // Expand that meal section
    const sec = document.getElementById('meal' + meal.charAt(0).toUpperCase() + meal.slice(1));
    if (sec) sec.classList.remove('collapsed');

    // Reset UI
    document.getElementById('calAddCard').style.display = 'none';
    state.selectedFood = null;
    document.querySelectorAll('.cal-result-item').forEach(el => el.classList.remove('selected'));
  }

  // ==========================================
  //  RENDER MEAL LOG
  // ==========================================
  function renderMeal(meal) {
    const itemsEl = document.getElementById(meal + 'Items');
    const totalEl = document.getElementById(meal + 'Total');
    const entries = state.log[meal];
    if (!itemsEl) return;

    if (entries.length === 0) {
      itemsEl.innerHTML = '<div class="cal-meal-empty">No foods added yet</div>';
    } else {
      itemsEl.innerHTML = entries.map(entry => `
        <div class="cal-log-item" data-entry-id="${entry.id}" data-meal="${meal}">
          <div class="cal-log-info">
            <div class="cal-log-name">${entry.name} <span class="cal-log-qty">× ${entry.qty}</span></div>
            <div class="cal-log-sub cal-log-sub-row1">
              <span class="nl-p">P:&nbsp;${entry.protein}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-c">C:&nbsp;${entry.carbs}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-f">Fat:&nbsp;${entry.fat}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-fi">Fiber:&nbsp;${entry.fiber}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-su">Sugar:&nbsp;${entry.sugar}g</span>
            </div>
            <div class="cal-log-sub cal-log-sub-row2">
              <span class="nl-sf">Sat.Fat:&nbsp;${entry.satFat||0}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-pf">Poly.Fat:&nbsp;${entry.polyFat||0}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-mf">Mono.Fat:&nbsp;${entry.monoFat||0}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-tf">Trans:&nbsp;${entry.transFat||0}g</span>
              <span class="nl-sep">·</span>
              <span class="nl-ch">Chol:&nbsp;${entry.cholesterol||0}mg</span>
            </div>
          </div>
          <div class="cal-log-cal">${entry.cal} kcal</div>
          <button class="cal-log-delete" data-entry-id="${entry.id}" data-meal="${meal}" title="Remove">✕</button>
        </div>
      `).join('');

      itemsEl.querySelectorAll('.cal-log-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeEntry(btn.getAttribute('data-meal'), parseInt(btn.getAttribute('data-entry-id')));
        });
      });
    }

    const total = entries.reduce((s, e) => s + e.cal, 0);
    if (totalEl) totalEl.textContent = round1(total) + ' kcal';
  }

  function removeEntry(meal, entryId) {
    state.log[meal] = state.log[meal].filter(e => e.id !== entryId);
    saveToStorage();
    renderAll();
    showToast('🗑 Item removed');
  }

  // ==========================================
  //  RENDER SUMMARY — includes Sugar
  // ==========================================
  function renderSummary() {
    const allEntries = [
      ...state.log.breakfast,
      ...state.log.lunch,
      ...state.log.dinner,
      ...state.log.snacks
    ];

    const totals = allEntries.reduce((acc, e) => {
      acc.cal         += e.cal         || 0;
      acc.protein     += e.protein     || 0;
      acc.carbs       += e.carbs       || 0;
      acc.fat         += e.fat         || 0;
      acc.fiber       += e.fiber       || 0;
      acc.sugar       += e.sugar       || 0;
      acc.satFat      += e.satFat      || 0;
      acc.polyFat     += e.polyFat     || 0;
      acc.monoFat     += e.monoFat     || 0;
      acc.transFat    += e.transFat    || 0;
      acc.cholesterol += e.cholesterol || 0;
      return acc;
    }, { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, satFat: 0, polyFat: 0, monoFat: 0, transFat: 0, cholesterol: 0 });

    // Helper: safely set text
    const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // Daily sticky bar
    safe('totalCalDisplay',  Math.round(totals.cal));
    safe('totalProtDisplay', round1(totals.protein) + 'g');
    safe('totalCarbDisplay', round1(totals.carbs)   + 'g');
    safe('totalFatDisplay',  round1(totals.fat)     + 'g');

    // Summary card
    safe('summaryCalories', Math.round(totals.cal));
    safe('summaryProtein',  round1(totals.protein) + 'g');
    safe('summaryCarbs',    round1(totals.carbs)   + 'g');
    safe('summaryFat',      round1(totals.fat)     + 'g');
    safe('summaryFiber',       round1(totals.fiber)       + 'g');
    safe('summarySugar',       round1(totals.sugar)       + 'g');
    safe('summarySatFat',      round1(totals.satFat)      + 'g');
    safe('summaryPolyFat',     round1(totals.polyFat)     + 'g');
    safe('summaryMonoFat',     round1(totals.monoFat)     + 'g');
    safe('summaryTransFat',    round1(totals.transFat)    + 'g');
    safe('summaryCholesterol', Math.round(totals.cholesterol) + 'mg');

    // Macro bars (% of combined macros weight)
    const macroTotal = totals.protein + totals.carbs + totals.fat + totals.fiber;
    const pct = v => macroTotal > 0 ? Math.min(100, (v / macroTotal * 100)).toFixed(1) : 0;

    const setBar = (id, v) => { const el = document.getElementById(id); if (el) el.style.width = pct(v) + '%'; };
    setBar('proteinBar', totals.protein);
    setBar('carbsBar',   totals.carbs);
    setBar('fatBar',     totals.fat);
    setBar('fiberBar',   totals.fiber);
    // Sugar bar
    const sugarEl = document.getElementById('sugarBar');
    if (sugarEl) sugarEl.style.width = (macroTotal > 0 ? Math.min(100, (totals.sugar / macroTotal * 100)).toFixed(1) : 0) + '%';

    // Fat sub-type bars (% of total fat)
    const totalFatForPct = totals.fat || 1;
    const fatPct = v => Math.min(100, (v / totalFatForPct * 100)).toFixed(1);
    const setSatBar = (id, v) => { const el = document.getElementById(id); if (el) el.style.width = fatPct(v) + '%'; };
    setSatBar('satFatBar',  totals.satFat);
    setSatBar('polyFatBar', totals.polyFat);
    setSatBar('monoFatBar', totals.monoFat);
    setSatBar('transFatBar',totals.transFat);

    // Cholesterol bar (% of 300mg daily goal)
    const cholEl = document.getElementById('cholesterolBar');
    if (cholEl) cholEl.style.width = Math.min(100, (totals.cholesterol / 300 * 100)).toFixed(1) + '%';

    // ✅ Per-meal macro breakdown table
    const breakdownEl = document.getElementById('mealMacroBreakdown');
    if (breakdownEl) {
      const meals = [
        { key: 'breakfast', label: '🌅 Breakfast' },
        { key: 'lunch',     label: '☀️ Lunch' },
        { key: 'dinner',    label: '🌙 Dinner' },
        { key: 'snacks',    label: '🥪 Snacks' }
      ];
      const mealTotals = meals.map(({ key, label }) => {
        const t = state.log[key].reduce((acc, e) => {
          acc.cal         += e.cal         || 0;
          acc.protein     += e.protein     || 0;
          acc.carbs       += e.carbs       || 0;
          acc.fat         += e.fat         || 0;
          acc.fiber       += e.fiber       || 0;
          acc.sugar       += e.sugar       || 0;
          acc.satFat      += e.satFat      || 0;
          acc.polyFat     += e.polyFat     || 0;
          acc.monoFat     += e.monoFat     || 0;
          acc.transFat    += e.transFat    || 0;
          acc.cholesterol += e.cholesterol || 0;
          return acc;
        }, { cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, satFat:0, polyFat:0, monoFat:0, transFat:0, cholesterol:0 });
        return { label, ...t, count: state.log[key].length };
      });
      const hasData = mealTotals.some(m => m.count > 0);
      if (!hasData) { breakdownEl.innerHTML = ''; return; }
      breakdownEl.innerHTML = `
        <div class="cal-breakdown-section">
          <h3 class="cal-breakdown-title">📋 Meal-wise Macro Breakdown</h3>
          <div class="cal-breakdown-table-wrap">
            <table class="cal-breakdown-table">
              <thead>
                <tr>
                  <th>Meal</th><th>kcal</th><th>Protein</th><th>Carbs</th><th>Fat</th>
                  <th>Fiber</th><th>Sugar</th><th>Sat.Fat</th><th>Poly.Fat</th><th>Mono.Fat</th><th>Trans</th><th>Chol.</th>
                </tr>
              </thead>
              <tbody>
                ${mealTotals.filter(m => m.count > 0).map(m => `
                  <tr>
                    <td class="cal-bd-meal">${m.label}</td>
                    <td class="cal-bd-cal">${Math.round(m.cal)}</td>
                    <td>${round1(m.protein)}g</td>
                    <td>${round1(m.carbs)}g</td>
                    <td>${round1(m.fat)}g</td>
                    <td>${round1(m.fiber)}g</td>
                    <td>${round1(m.sugar)}g</td>
                    <td>${round1(m.satFat)}g</td>
                    <td>${round1(m.polyFat)}g</td>
                    <td>${round1(m.monoFat)}g</td>
                    <td>${round1(m.transFat)}g</td>
                    <td>${Math.round(m.cholesterol)}mg</td>
                  </tr>`).join('')}
              </tbody>
              <tfoot>
                <tr class="cal-bd-total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>${Math.round(totals.cal)}</strong></td>
                  <td><strong>${round1(totals.protein)}g</strong></td>
                  <td><strong>${round1(totals.carbs)}g</strong></td>
                  <td><strong>${round1(totals.fat)}g</strong></td>
                  <td><strong>${round1(totals.fiber)}g</strong></td>
                  <td><strong>${round1(totals.sugar)}g</strong></td>
                  <td><strong>${round1(totals.satFat)}g</strong></td>
                  <td><strong>${round1(totals.polyFat)}g</strong></td>
                  <td><strong>${round1(totals.monoFat)}g</strong></td>
                  <td><strong>${round1(totals.transFat)}g</strong></td>
                  <td><strong>${Math.round(totals.cholesterol)}mg</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>`;
    }
  }

  function renderAll() {
    ['breakfast','lunch','dinner','snacks'].forEach(renderMeal);
    renderSummary();
    updateCalorieGoalBar();
    renderMacroChart();
    updateMealBadge();
  }

  // ==========================================
  //  MEAL SECTION TOGGLE
  // ==========================================
  function bindMealToggle() {
    document.querySelectorAll('.cal-meal-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const meal = btn.getAttribute('data-meal');
        const sec  = document.getElementById('meal' + meal.charAt(0).toUpperCase() + meal.slice(1));
        if (sec) sec.classList.toggle('collapsed');
      });
    });

    document.querySelectorAll('.cal-meal-header').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.cal-meal-section').classList.toggle('collapsed');
      });
    });
  }

  // ==========================================
  //  SAVE & RESET
  // ==========================================
  function bindSaveReset() {
    const saveBtn   = document.getElementById('saveDayBtn');
    const resetBtn  = document.getElementById('resetDayBtn');
    const resetBtn2 = document.getElementById('resetDayBtn2');
    const notice    = document.getElementById('savedNotice');
    const waBtn     = document.getElementById('shareWhatsappBtn');
    const pdfBtn    = document.getElementById('downloadPdfBtn');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveToStorage();
        if (notice) { notice.style.display = 'block'; setTimeout(() => notice.style.display = 'none', 4000); }
        showToast('Log saved successfully!');
      });
    }
    if (resetBtn)  resetBtn.addEventListener('click',  resetLog);
    if (resetBtn2) resetBtn2.addEventListener('click', resetLog);
    if (waBtn)     waBtn.addEventListener('click',     shareToWhatsApp);
    if (pdfBtn)    pdfBtn.addEventListener('click',    downloadPDF);
  }

  // ==========================================
  //  SHARED UI (same pattern as bmi.js)
  // ==========================================
  function setupLinks() {
    const phone = '8668007901';
    const msg   = encodeURIComponent('Hello Classic Fitness Gym, I want to enquire about membership and timings.');
    const el    = document.getElementById('waFloat');
    if (el) el.href = `https://wa.me/91${phone}?text=${msg}`;
  }

  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) { e.preventDefault(); toggle.closest('.nav-dropdown').classList.toggle('open'); }
      });
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
        navLinks.classList.remove('show');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('show')) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
  }

  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.08)'
        : '0 2px 12px rgba(0,0,0,0.03)';
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initDietBar() {
    const bar      = document.getElementById('dietAnnounceBar');
    const closeBtn = document.getElementById('dietBarClose');
    const grabBtn  = document.getElementById('dietBarBtn');
    if (closeBtn && bar) closeBtn.addEventListener('click', () => bar.style.display = 'none');
    if (grabBtn) grabBtn.addEventListener('click', () => window.location.href = 'index.html#diet-plan');
  }

  function initJoinModal() {
    const joinNowBtn       = document.getElementById('joinNowBtn');
    const joinModal        = document.getElementById('joinModal');
    const joinModalClose   = document.getElementById('joinModalClose');
    const joinModalOverlay = document.getElementById('joinModalOverlay');

    if (joinNowBtn && joinModal)       joinNowBtn.addEventListener('click',       () => joinModal.classList.add('active'));
    if (joinModalClose && joinModal)   joinModalClose.addEventListener('click',   () => joinModal.classList.remove('active'));
    if (joinModalOverlay && joinModal) joinModalOverlay.addEventListener('click', () => joinModal.classList.remove('active'));

    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
      joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name   = document.getElementById('joinName').value;
        const mobile = document.getElementById('joinMobile').value;
        const goal   = document.getElementById('joinGoal').value;
        const time   = document.getElementById('joinTime').value;
        const msg    = document.getElementById('joinMessage').value;
        const text   = encodeURIComponent(`Hello Classic Fitness Gym!\nName: ${name}\nMobile: ${mobile}\nGoal: ${goal}\nPreferred Time: ${time}\nMessage: ${msg}`);
        window.open(`https://wa.me/918668007901?text=${text}`, '_blank');
      });
    }

    document.querySelectorAll('.custom-select').forEach(select => {
      const trigger  = select.querySelector('.custom-select-trigger');
      const options  = select.querySelectorAll('.custom-option');
      const hiddenEl = select.closest('.custom-select-wrapper')
        ? select.closest('.custom-select-wrapper').querySelector('input[type="hidden"]')
        : null;
      if (trigger) trigger.addEventListener('click', (e) => { e.stopPropagation(); select.classList.toggle('open'); });
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          if (trigger) trigger.innerHTML = `${opt.textContent} <span class="custom-arrow">▾</span>`;
          if (hiddenEl) hiddenEl.value = opt.getAttribute('data-value');
          select.classList.remove('open');
        });
      });
      document.addEventListener('click', (e) => {
          if (!select.contains(e.target)) select.classList.remove('open');
        });
    });
  }




  let macroChart = null;

function renderMacroChart() {
const ctx = document.getElementById('macroChart');
if (!ctx) return;

const totals = [
  ...state.log.breakfast,
  ...state.log.lunch,
  ...state.log.dinner,
  ...state.log.snacks
].reduce((acc, e) => {
  acc.protein += e.protein || 0;
  acc.carbs   += e.carbs   || 0;
  acc.fat     += e.fat     || 0;
  return acc;
}, { protein:0, carbs:0, fat:0 });

if (macroChart) macroChart.destroy();

macroChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [totals.protein, totals.carbs, totals.fat],
      backgroundColor: ['#4CAF50','#2196F3','#FF9800']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});
}



  // ==========================================
  //  WHATSAPP SHARE
  // ==========================================
  function shareToWhatsApp() {
    const allEntries = [
      ...state.log.breakfast, ...state.log.lunch,
      ...state.log.dinner,    ...state.log.snacks
    ];
    if (!allEntries.length) { showToast('No food logged yet!'); return; }

    const t = allEntries.reduce((a, e) => {
      a.cal     += e.cal     || 0; a.protein += e.protein || 0;
      a.carbs   += e.carbs   || 0; a.fat     += e.fat     || 0;
      a.fiber   += e.fiber   || 0; a.sugar   += e.sugar   || 0;
      a.satFat  += e.satFat  || 0; a.cholesterol += e.cholesterol || 0;
      return a;
    }, { cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, satFat:0, cholesterol:0 });

    const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

    function mealBlock(icon, label, entries) {
      if (!entries.length) return '';
      const cal = Math.round(entries.reduce((s, e) => s + (e.cal || 0), 0));
      const rows = entries.map(e =>
        '  - ' + e.name + ' x' + e.qty + ' (' + e.cal + ' kcal | P:' + e.protein + 'g C:' + e.carbs + 'g Fat:' + e.fat + 'g)'
      ).join('\n');
      return icon + ' *' + label + '* — ' + cal + ' kcal\n' + rows + '\n';
    }

    const lines = [
      '*Classic Fitness Gym — Daily Calorie Log*',
      'Date: ' + today,
      '─────────────────────────',
      mealBlock('Breakfast', 'Breakfast', state.log.breakfast),
      mealBlock('Lunch',     'Lunch',     state.log.lunch),
      mealBlock('Dinner',    'Dinner',    state.log.dinner),
      mealBlock('Snacks',    'Snacks',    state.log.snacks),
      '─────────────────────────',
      '*Daily Totals*',
      'Calories     : ' + Math.round(t.cal)         + ' kcal',
      'Protein      : ' + Math.round(t.protein)      + 'g',
      'Carbohydrates: ' + Math.round(t.carbs)        + 'g',
      'Total Fat    : ' + Math.round(t.fat)           + 'g',
      'Saturated Fat: ' + Math.round(t.satFat)        + 'g',
      'Fiber        : ' + Math.round(t.fiber)         + 'g',
      'Sugar        : ' + Math.round(t.sugar)         + 'g',
      'Cholesterol  : ' + Math.round(t.cholesterol)   + 'mg',
      '─────────────────────────',
      'Classic Fitness Gym, Griblispet, Arakkonam - 631002',
      'Ph: 8668007901 / 9789444997'
    ].filter(Boolean).join('\n');

    window.open('https://wa.me/918668007901?text=' + encodeURIComponent(lines), '_blank');
  }

  // ==========================================
  //  PDF DOWNLOAD  (jsPDF + autoTable)
  // ==========================================
  function downloadPDF() {
    const allEntries = [
      ...state.log.breakfast, ...state.log.lunch,
      ...state.log.dinner,    ...state.log.snacks
    ];
    if (!allEntries.length) { showToast('No food logged yet!'); return; }

    var lib = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!lib) { showToast('PDF library loading, please try again in a moment!'); return; }

    var doc   = new lib({ orientation:'portrait', unit:'mm', format:'a4' });
    var pW    = doc.internal.pageSize.getWidth();
    var pH    = doc.internal.pageSize.getHeight();
    var OR    = [249, 115, 22];   // orange
    var DARK  = [17,  24,  39];   // near-black
    var GRAY  = [100, 116, 139];  // slate
    var CREAM = [255, 247, 237];  // light orange tint
    var today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
    var y     = 0;

    /* ── HEADER ── */
    doc.setFillColor(OR[0], OR[1], OR[2]);
    doc.rect(0, 0, pW, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CLASSIC FITNESS GYM', pW / 2, 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 237, 213);
    doc.text('Unisex AC Gym  |  Griblispet, Arakkonam - 631002  |  8668007901 / 9789444997', pW / 2, 19, { align: 'center' });
    doc.text('classicfitnessgym.in', pW / 2, 25, { align: 'center' });

    y = 40;

    /* ── TITLE ── */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text('Daily Calorie & Nutrition Log', pW / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text('Date: ' + today, pW / 2, y, { align: 'center' });
    y += 8;

    doc.setDrawColor(OR[0], OR[1], OR[2]);
    doc.setLineWidth(0.5);
    doc.line(14, y, pW - 14, y);
    y += 7;

    /* ── MEAL SECTIONS ── */
    var meals = [
      { key:'breakfast', label:'Breakfast' },
      { key:'lunch',     label:'Lunch'     },
      { key:'dinner',    label:'Dinner'    },
      { key:'snacks',    label:'Snacks'    }
    ];

    meals.forEach(function(m) {
      var entries = state.log[m.key];
      if (!entries.length) return;

      var mealCal = Math.round(entries.reduce(function(s, e) { return s + (e.cal || 0); }, 0));

      /* Meal label strip */
      doc.setFillColor(CREAM[0], CREAM[1], CREAM[2]);
      doc.roundedRect(14, y - 3.5, pW - 28, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(OR[0], OR[1], OR[2]);
      doc.text(m.label, 18, y + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
      doc.text(mealCal + ' kcal', pW - 18, y + 2, { align: 'right' });
      y += 11;

      /* Food table */
      var rows = entries.map(function(e) {
        return [
          e.name, 'x' + e.qty,
          String(e.cal),
          e.protein + 'g', e.carbs + 'g', e.fat + 'g',
          e.fiber + 'g',   e.sugar + 'g'
        ];
      });

      doc.autoTable({
        startY: y,
        head: [['Food Item', 'Qty', 'kcal', 'Protein', 'Carbs', 'Fat', 'Fiber', 'Sugar']],
        body: rows,
        theme: 'grid',
        headStyles: {
          fillColor: OR, textColor: [255,255,255],
          fontStyle: 'bold', fontSize: 8, cellPadding: 2.5
        },
        bodyStyles:          { fontSize: 8, textColor: DARK, cellPadding: 2 },
        alternateRowStyles:  { fillColor: [255, 251, 247] },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 16, halign: 'right' },
          3: { cellWidth: 18, halign: 'right' },
          4: { cellWidth: 18, halign: 'right' },
          5: { cellWidth: 14, halign: 'right' },
          6: { cellWidth: 14, halign: 'right' },
          7: { cellWidth: 14, halign: 'right' }
        },
        margin: { left: 14, right: 14 }
      });

      y = doc.lastAutoTable.finalY + 8;
    });

    /* ── SUMMARY BOX ── */
    if (y + 60 > pH - 20) { doc.addPage(); y = 20; }

    doc.setDrawColor(OR[0], OR[1], OR[2]);
    doc.setLineWidth(0.4);
    doc.line(14, y, pW - 14, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text('Daily Nutrition Summary', 14, y);
    y += 8;

    var t2 = allEntries.reduce(function(a, e) {
      a.cal     += e.cal     || 0; a.protein     += e.protein     || 0;
      a.carbs   += e.carbs   || 0; a.fat         += e.fat         || 0;
      a.fiber   += e.fiber   || 0; a.sugar       += e.sugar       || 0;
      a.satFat  += e.satFat  || 0; a.polyFat     += e.polyFat     || 0;
      a.monoFat += e.monoFat || 0; a.transFat    += e.transFat    || 0;
      a.cholesterol += e.cholesterol || 0;
      return a;
    }, { cal:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, satFat:0, polyFat:0, monoFat:0, transFat:0, cholesterol:0 });

    var summaryRows = [
      ['Total Calories',    Math.round(t2.cal)         + ' kcal',  'Protein',           Math.round(t2.protein)     + 'g'],
      ['Carbohydrates',     Math.round(t2.carbs)       + 'g',      'Total Fat',          Math.round(t2.fat)         + 'g'],
      ['Saturated Fat',     Math.round(t2.satFat)      + 'g',      'Poly. Fat',          Math.round(t2.polyFat)     + 'g'],
      ['Mono. Fat',         Math.round(t2.monoFat)     + 'g',      'Trans Fat',          Math.round(t2.transFat)    + 'g'],
      ['Fiber',             Math.round(t2.fiber)       + 'g',      'Sugar',              Math.round(t2.sugar)       + 'g'],
      ['Cholesterol',       Math.round(t2.cholesterol) + 'mg',     '',                   '']
    ];

    doc.autoTable({
      startY: y,
      body: summaryRows,
      theme: 'grid',
      bodyStyles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: GRAY,         cellWidth: 42 },
        1: { fontStyle: 'bold', textColor: OR,           cellWidth: 36, halign: 'right' },
        2: { fontStyle: 'bold', textColor: GRAY,         cellWidth: 42 },
        3: { fontStyle: 'bold', textColor: OR,           cellWidth: 36, halign: 'right' }
      },
      alternateRowStyles: { fillColor: CREAM },
      margin: { left: 14, right: 14 }
    });

    /* ── FOOTER ── */
    doc.setDrawColor(OR[0], OR[1], OR[2]);
    doc.setLineWidth(0.3);
    doc.line(14, pH - 16, pW - 14, pH - 16);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text(
      'Generated by Classic Fitness Gym Calorie Calculator  |  classicfitnessgym.in  |  8668007901',
      pW / 2, pH - 10, { align: 'center' }
    );

    var fname = 'ClassicFitness_CalorieLog_' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(fname);
    showToast('PDF downloaded!');
  }

  // ==========================================
  //  START
  // ==========================================
  document.addEventListener('DOMContentLoaded', init);

})();
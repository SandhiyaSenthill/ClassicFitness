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
      { id: 1,  name: 'Idli',                      category: 'breakfast', unit: '1 piece (40g)',       cal: 39,  protein: 1.7,  carbs: 8.0,  fat: 0.2,  fiber: 0.4, sugar: 0.1 },
      { id: 2,  name: 'Dosa (Plain)',               category: 'breakfast', unit: '1 medium (75g)',      cal: 133, protein: 3.0,  carbs: 24.0, fat: 3.0,  fiber: 0.5, sugar: 0.3 },
      { id: 3,  name: 'Dosa (Masala)',              category: 'breakfast', unit: '1 medium (130g)',     cal: 210, protein: 5.5,  carbs: 36.0, fat: 5.5,  fiber: 1.5, sugar: 0.8 },
      { id: 4,  name: 'Uttapam',                    category: 'breakfast', unit: '1 piece (90g)',       cal: 132, protein: 3.8,  carbs: 22.0, fat: 3.2,  fiber: 1.2, sugar: 0.5 },
      { id: 5,  name: 'Upma',                       category: 'breakfast', unit: '1 cup (160g)',        cal: 195, protein: 4.5,  carbs: 33.0, fat: 5.5,  fiber: 2.0, sugar: 1.0 },
      { id: 6,  name: 'Poha',                       category: 'breakfast', unit: '1 cup (150g)',        cal: 180, protein: 3.5,  carbs: 34.0, fat: 3.5,  fiber: 1.2, sugar: 0.8 },
      { id: 7,  name: 'Paratha (Plain)',             category: 'breakfast', unit: '1 piece (80g)',       cal: 200, protein: 4.5,  carbs: 30.0, fat: 6.5,  fiber: 2.5, sugar: 0.2 },
      { id: 8,  name: 'Paratha (Aloo)',              category: 'breakfast', unit: '1 piece (110g)',      cal: 240, protein: 5.0,  carbs: 38.0, fat: 8.0,  fiber: 2.8, sugar: 0.5 },
      { id: 9,  name: 'Puri',                       category: 'breakfast', unit: '1 piece (30g)',       cal: 105, protein: 2.0,  carbs: 14.0, fat: 4.5,  fiber: 0.6, sugar: 0.1 },
      { id: 10, name: 'Idiyappam',                  category: 'breakfast', unit: '1 cup (100g)',        cal: 142, protein: 2.5,  carbs: 31.0, fat: 0.4,  fiber: 0.5, sugar: 0.2 },
      { id: 11, name: 'Pesarattu',                  category: 'breakfast', unit: '1 piece (80g)',       cal: 120, protein: 7.0,  carbs: 18.0, fat: 2.5,  fiber: 2.2, sugar: 0.5 },
      { id: 12, name: 'Appam',                      category: 'breakfast', unit: '1 piece (60g)',       cal: 82,  protein: 2.0,  carbs: 16.0, fat: 1.2,  fiber: 0.5, sugar: 0.3 },
      { id: 13, name: 'Medu Vada',                  category: 'breakfast', unit: '1 piece (50g)',       cal: 97,  protein: 4.0,  carbs: 13.0, fat: 3.5,  fiber: 1.5, sugar: 0.2 },
      { id: 14, name: 'Aval (Poha) Upma',           category: 'breakfast', unit: '1 cup (160g)',        cal: 165, protein: 3.5,  carbs: 32.0, fat: 3.0,  fiber: 1.5, sugar: 0.5 },
      { id: 15, name: 'Oats Porridge',              category: 'breakfast', unit: '1 cup (200ml)',       cal: 150, protein: 5.5,  carbs: 27.0, fat: 3.0,  fiber: 4.0, sugar: 1.0 },
      { id: 16, name: 'Rava Idli',                  category: 'breakfast', unit: '1 piece (50g)',       cal: 88,  protein: 2.5,  carbs: 15.0, fat: 2.5,  fiber: 0.8, sugar: 0.3 },
      { id: 17, name: 'Kanda Poha',                 category: 'breakfast', unit: '1 cup (150g)',        cal: 195, protein: 4.0,  carbs: 36.0, fat: 4.0,  fiber: 1.5, sugar: 1.2 },
      { id: 18, name: 'Sheera / Rava Halwa',        category: 'breakfast', unit: '1 cup (120g)',        cal: 280, protein: 4.0,  carbs: 45.0, fat: 9.0,  fiber: 1.0, sugar: 18.0 },
      { id: 19, name: 'Bread Butter',               category: 'breakfast', unit: '2 slices (70g)',      cal: 210, protein: 5.5,  carbs: 28.0, fat: 8.5,  fiber: 1.0, sugar: 2.0 },
      // ---- RICE ----
      { id: 20, name: 'Steamed Rice (White)',        category: 'rice',      unit: '1 cup cooked (180g)', cal: 240, protein: 4.4,  carbs: 52.0, fat: 0.5,  fiber: 0.6, sugar: 0.1 },
      { id: 21, name: 'Brown Rice',                 category: 'rice',      unit: '1 cup cooked (180g)', cal: 215, protein: 5.0,  carbs: 45.0, fat: 1.8,  fiber: 3.5, sugar: 0.3 },
      { id: 22, name: 'Biryani (Chicken)',           category: 'rice',      unit: '1 plate (350g)',      cal: 490, protein: 28.0, carbs: 56.0, fat: 16.0, fiber: 2.0, sugar: 2.5 },
      { id: 23, name: 'Biryani (Veg)',               category: 'rice',      unit: '1 plate (300g)',      cal: 380, protein: 9.0,  carbs: 62.0, fat: 10.0, fiber: 3.5, sugar: 3.0 },
      { id: 24, name: 'Curd Rice',                  category: 'rice',      unit: '1 cup (200g)',        cal: 200, protein: 6.0,  carbs: 34.0, fat: 5.0,  fiber: 0.5, sugar: 4.0 },
      { id: 25, name: 'Lemon Rice',                 category: 'rice',      unit: '1 cup (180g)',        cal: 250, protein: 4.0,  carbs: 43.0, fat: 6.0,  fiber: 1.2, sugar: 0.5 },
      { id: 26, name: 'Tomato Rice',                category: 'rice',      unit: '1 cup (180g)',        cal: 220, protein: 4.0,  carbs: 40.0, fat: 5.0,  fiber: 1.5, sugar: 2.0 },
      { id: 27, name: 'Sambar Rice',                category: 'rice',      unit: '1 cup (220g)',        cal: 255, protein: 8.5,  carbs: 44.0, fat: 4.5,  fiber: 3.0, sugar: 2.0 },
      { id: 28, name: 'Fried Rice (Veg)',            category: 'rice',      unit: '1 plate (200g)',      cal: 290, protein: 6.0,  carbs: 46.0, fat: 8.5,  fiber: 1.8, sugar: 1.5 },
      { id: 29, name: 'Fried Rice (Egg)',            category: 'rice',      unit: '1 plate (220g)',      cal: 340, protein: 12.0, carbs: 46.0, fat: 10.0, fiber: 1.5, sugar: 1.5 },
      { id: 30, name: 'Coconut Rice',               category: 'rice',      unit: '1 cup (180g)',        cal: 295, protein: 4.5,  carbs: 45.0, fat: 10.5, fiber: 2.0, sugar: 1.0 },
      { id: 31, name: 'Tamarind Rice (Puliyodarai)', category: 'rice',      unit: '1 cup (180g)',        cal: 270, protein: 4.0,  carbs: 48.0, fat: 7.0,  fiber: 2.5, sugar: 3.0 },
      { id: 32, name: 'Peas Pulao',                 category: 'rice',      unit: '1 cup (180g)',        cal: 260, protein: 6.5,  carbs: 44.0, fat: 6.0,  fiber: 3.5, sugar: 1.5 },
      // ---- ROTI / BREAD ----
      { id: 40, name: 'Roti / Chapati',             category: 'roti',      unit: '1 piece (35g)',       cal: 80,  protein: 3.0,  carbs: 15.0, fat: 1.0,  fiber: 2.2, sugar: 0.2 },
      { id: 41, name: 'Phulka',                     category: 'roti',      unit: '1 piece (30g)',       cal: 68,  protein: 2.5,  carbs: 13.0, fat: 0.5,  fiber: 1.8, sugar: 0.1 },
      { id: 42, name: 'Tandoori Roti',              category: 'roti',      unit: '1 piece (45g)',       cal: 120, protein: 4.0,  carbs: 22.0, fat: 2.0,  fiber: 2.5, sugar: 0.2 },
      { id: 43, name: 'Naan',                       category: 'roti',      unit: '1 piece (90g)',       cal: 260, protein: 7.5,  carbs: 45.0, fat: 5.5,  fiber: 1.5, sugar: 1.5 },
      { id: 44, name: 'Butter Naan',                category: 'roti',      unit: '1 piece (100g)',      cal: 310, protein: 7.5,  carbs: 46.0, fat: 9.0,  fiber: 1.5, sugar: 1.5 },
      { id: 45, name: 'White Bread',                category: 'roti',      unit: '1 slice (30g)',       cal: 79,  protein: 2.7,  carbs: 15.0, fat: 0.9,  fiber: 0.6, sugar: 1.5 },
      { id: 46, name: 'Brown Bread',                category: 'roti',      unit: '1 slice (30g)',       cal: 72,  protein: 3.0,  carbs: 13.0, fat: 1.0,  fiber: 1.8, sugar: 1.2 },
      { id: 47, name: 'Whole Wheat Bread',          category: 'roti',      unit: '1 slice (35g)',       cal: 81,  protein: 3.6,  carbs: 14.0, fat: 1.0,  fiber: 2.2, sugar: 1.0 },
      { id: 48, name: 'Missi Roti',                 category: 'roti',      unit: '1 piece (40g)',       cal: 105, protein: 4.5,  carbs: 16.0, fat: 2.5,  fiber: 2.8, sugar: 0.3 },
      { id: 49, name: 'Thepla',                     category: 'roti',      unit: '1 piece (40g)',       cal: 115, protein: 3.5,  carbs: 17.0, fat: 3.5,  fiber: 2.0, sugar: 0.5 },
      // ---- DAL / CURRY ----
      { id: 60, name: 'Sambar',                     category: 'dal',       unit: '1 cup (200ml)',       cal: 95,  protein: 5.5,  carbs: 14.0, fat: 2.5,  fiber: 3.5, sugar: 2.0 },
      { id: 61, name: 'Dal Tadka',                  category: 'dal',       unit: '1 cup (180ml)',       cal: 185, protein: 10.0, carbs: 24.0, fat: 6.0,  fiber: 5.5, sugar: 1.5 },
      { id: 62, name: 'Rajma',                      category: 'dal',       unit: '1 cup (200g)',        cal: 230, protein: 14.0, carbs: 36.0, fat: 3.5,  fiber: 8.0, sugar: 2.0 },
      { id: 63, name: 'Chhole (Chickpea Curry)',     category: 'dal',       unit: '1 cup (200g)',        cal: 270, protein: 14.5, carbs: 40.0, fat: 5.5,  fiber: 9.0, sugar: 3.0 },
      { id: 64, name: 'Palak Paneer',               category: 'dal',       unit: '1 cup (200g)',        cal: 280, protein: 13.0, carbs: 10.0, fat: 20.0, fiber: 3.5, sugar: 2.5 },
      { id: 65, name: 'Paneer Butter Masala',       category: 'dal',       unit: '1 cup (200g)',        cal: 320, protein: 15.0, carbs: 12.0, fat: 24.0, fiber: 2.0, sugar: 4.0 },
      { id: 66, name: 'Aloo Curry',                 category: 'dal',       unit: '1 cup (200g)',        cal: 195, protein: 3.5,  carbs: 30.0, fat: 7.0,  fiber: 3.5, sugar: 2.0 },
      { id: 67, name: 'Egg Curry',                  category: 'dal',       unit: '1 egg + gravy (150g)',cal: 145, protein: 8.0,  carbs: 6.0,  fat: 10.0, fiber: 1.0, sugar: 1.5 },
      { id: 68, name: 'Dal Makhani',                category: 'dal',       unit: '1 cup (180ml)',       cal: 250, protein: 12.0, carbs: 28.0, fat: 10.0, fiber: 6.0, sugar: 2.0 },
      { id: 69, name: 'Mix Vegetable Curry',        category: 'dal',       unit: '1 cup (200g)',        cal: 165, protein: 4.5,  carbs: 22.0, fat: 6.5,  fiber: 5.0, sugar: 3.5 },
      { id: 70, name: 'Rasam',                      category: 'dal',       unit: '1 cup (200ml)',       cal: 45,  protein: 2.0,  carbs: 8.0,  fat: 1.0,  fiber: 1.5, sugar: 1.0 },
      { id: 71, name: 'Kootu (Veg+Dal)',            category: 'dal',       unit: '1 cup (180g)',        cal: 175, protein: 8.0,  carbs: 22.0, fat: 5.0,  fiber: 4.0, sugar: 1.5 },
      { id: 72, name: 'Coconut Chutney',            category: 'dal',       unit: '2 tbsp (40g)',        cal: 65,  protein: 1.0,  carbs: 3.5,  fat: 5.5,  fiber: 1.5, sugar: 0.8 },
      { id: 73, name: 'Tomato Chutney',             category: 'dal',       unit: '2 tbsp (40g)',        cal: 35,  protein: 0.8,  carbs: 5.0,  fat: 1.0,  fiber: 1.0, sugar: 2.5 },
      { id: 74, name: 'Coconut Milk Curry (Gravy)', category: 'dal',       unit: '1 cup (200g)',        cal: 220, protein: 5.0,  carbs: 12.0, fat: 17.0, fiber: 2.0, sugar: 3.0 },
      { id: 75, name: 'Fish Curry (Meen Kuzhambu)', category: 'dal',       unit: '1 cup (200g)',        cal: 185, protein: 18.0, carbs: 8.0,  fat: 9.0,  fiber: 1.5, sugar: 2.0 },
      { id: 76, name: 'Avial',                      category: 'dal',       unit: '1 cup (150g)',        cal: 140, protein: 3.5,  carbs: 15.0, fat: 8.0,  fiber: 3.5, sugar: 2.5 },
      { id: 77, name: 'Poriyal (Cabbage)',           category: 'dal',       unit: '1 cup (120g)',        cal: 85,  protein: 2.5,  carbs: 10.0, fat: 4.5,  fiber: 3.0, sugar: 3.0 },
      { id: 78, name: 'Mutton Curry',               category: 'dal',       unit: '1 cup (200g)',        cal: 380, protein: 32.0, carbs: 5.0,  fat: 25.0, fiber: 0.5, sugar: 1.5 },
      { id: 79, name: 'Prawn Curry',                category: 'dal',       unit: '1 cup (200g)',        cal: 220, protein: 22.0, carbs: 8.0,  fat: 11.0, fiber: 1.0, sugar: 2.0 },
      // ---- CHICKEN ----
      { id: 80, name: 'Chicken Curry',              category: 'chicken',   unit: '1 cup (200g)',        cal: 310, protein: 28.0, carbs: 8.0,  fat: 18.0, fiber: 1.0, sugar: 2.0 },
      { id: 81, name: 'Tandoori Chicken',           category: 'chicken',   unit: '2 pieces (150g)',     cal: 220, protein: 30.0, carbs: 4.0,  fat: 9.0,  fiber: 0.5, sugar: 1.5 },
      { id: 82, name: 'Grilled Chicken Breast',     category: 'chicken',   unit: '1 piece (150g)',      cal: 195, protein: 36.0, carbs: 0.0,  fat: 5.0,  fiber: 0.0, sugar: 0.0 },
      { id: 83, name: 'Chicken Biryani',            category: 'chicken',   unit: '1 plate (350g)',      cal: 490, protein: 28.0, carbs: 56.0, fat: 16.0, fiber: 2.0, sugar: 2.5 },
      { id: 84, name: 'Butter Chicken',             category: 'chicken',   unit: '1 cup (200g)',        cal: 360, protein: 26.0, carbs: 10.0, fat: 24.0, fiber: 1.5, sugar: 5.0 },
      { id: 85, name: 'Chicken 65',                 category: 'chicken',   unit: '6 pieces (150g)',     cal: 320, protein: 28.0, carbs: 12.0, fat: 18.0, fiber: 0.5, sugar: 1.0 },
      { id: 86, name: 'Chicken Tikka',              category: 'chicken',   unit: '4 pieces (150g)',     cal: 265, protein: 30.0, carbs: 5.0,  fat: 13.0, fiber: 0.5, sugar: 1.5 },
      { id: 87, name: 'Chicken Leg Piece',          category: 'chicken',   unit: '1 piece (120g)',      cal: 200, protein: 22.0, carbs: 0.0,  fat: 12.0, fiber: 0.0, sugar: 0.0 },
      { id: 88, name: 'Boiled Chicken (plain)',     category: 'chicken',   unit: '100g',               cal: 165, protein: 31.0, carbs: 0.0,  fat: 3.6,  fiber: 0.0, sugar: 0.0 },
      { id: 89, name: 'Chicken Soup',               category: 'chicken',   unit: '1 bowl (250ml)',      cal: 100, protein: 12.0, carbs: 5.0,  fat: 3.5,  fiber: 0.5, sugar: 1.0 },
      // ---- EGGS ----
      { id: 90, name: 'Boiled Egg',                 category: 'egg',       unit: '1 large (50g)',       cal: 77,  protein: 6.3,  carbs: 0.5,  fat: 5.3,  fiber: 0.0, sugar: 0.3 },
      { id: 91, name: 'Egg White (only)',            category: 'egg',       unit: '1 white (33g)',       cal: 17,  protein: 3.6,  carbs: 0.2,  fat: 0.1,  fiber: 0.0, sugar: 0.2 },
      { id: 92, name: 'Omelette (plain)',            category: 'egg',       unit: '2 egg omelette',      cal: 190, protein: 13.0, carbs: 1.0,  fat: 15.0, fiber: 0.0, sugar: 0.5 },
      { id: 93, name: 'Egg Bhurji',                 category: 'egg',       unit: '2 eggs (120g)',       cal: 210, protein: 14.0, carbs: 4.0,  fat: 16.0, fiber: 0.5, sugar: 1.0 },
      { id: 94, name: 'Fried Egg',                  category: 'egg',       unit: '1 egg (50g)',         cal: 90,  protein: 6.0,  carbs: 0.5,  fat: 7.0,  fiber: 0.0, sugar: 0.3 },
      // ---- SNACKS ----
      { id: 100, name: 'Samosa',                    category: 'snacks',    unit: '1 piece (80g)',       cal: 210, protein: 4.5,  carbs: 26.0, fat: 10.0, fiber: 2.0, sugar: 1.5 },
      { id: 101, name: 'Vada Pav',                  category: 'snacks',    unit: '1 piece (150g)',      cal: 290, protein: 7.0,  carbs: 44.0, fat: 9.5,  fiber: 2.5, sugar: 2.0 },
      { id: 102, name: 'Pakoda (Veg)',              category: 'snacks',    unit: '5 pieces (80g)',      cal: 200, protein: 4.0,  carbs: 22.0, fat: 11.0, fiber: 1.5, sugar: 0.8 },
      { id: 103, name: 'Bread Omelette',            category: 'snacks',    unit: '1 serving (120g)',    cal: 260, protein: 13.0, carbs: 24.0, fat: 12.0, fiber: 1.0, sugar: 1.5 },
      { id: 104, name: 'Peanuts (roasted)',         category: 'snacks',    unit: 'handful (30g)',       cal: 171, protein: 7.8,  carbs: 5.0,  fat: 14.5, fiber: 2.4, sugar: 0.5 },
      { id: 105, name: 'Murukku',                   category: 'snacks',    unit: '3 pieces (30g)',      cal: 155, protein: 3.0,  carbs: 20.0, fat: 7.0,  fiber: 0.8, sugar: 0.3 },
      { id: 106, name: 'Kachori',                   category: 'snacks',    unit: '1 piece (60g)',       cal: 175, protein: 3.5,  carbs: 22.0, fat: 8.0,  fiber: 1.2, sugar: 0.5 },
      { id: 107, name: 'Banana Chips',              category: 'snacks',    unit: '1 small pack (30g)',  cal: 155, protein: 1.0,  carbs: 17.0, fat: 9.5,  fiber: 1.0, sugar: 4.0 },
      { id: 108, name: 'Dhokla',                    category: 'snacks',    unit: '3 pieces (90g)',      cal: 140, protein: 6.5,  carbs: 22.0, fat: 3.0,  fiber: 1.5, sugar: 2.5 },
      { id: 109, name: 'Boiled Chana',              category: 'snacks',    unit: '1 cup (160g)',        cal: 270, protein: 15.0, carbs: 40.0, fat: 4.0,  fiber: 10.0, sugar: 2.0 },
      { id: 110, name: 'Pani Puri / Golgappa',      category: 'snacks',    unit: '6 pieces (120g)',     cal: 195, protein: 4.0,  carbs: 32.0, fat: 6.0,  fiber: 2.5, sugar: 3.5 },
      { id: 111, name: 'Bhel Puri',                 category: 'snacks',    unit: '1 cup (100g)',        cal: 165, protein: 4.0,  carbs: 28.0, fat: 4.5,  fiber: 2.0, sugar: 4.0 },
      { id: 112, name: 'Masala Peanuts',            category: 'snacks',    unit: 'handful (40g)',       cal: 200, protein: 8.5,  carbs: 14.0, fat: 13.0, fiber: 3.0, sugar: 0.5 },
      // ---- DAIRY ----
      { id: 120, name: 'Milk (Full Fat)',           category: 'dairy',     unit: '1 glass (250ml)',     cal: 150, protein: 8.0,  carbs: 12.0, fat: 8.0,  fiber: 0.0, sugar: 12.0 },
      { id: 121, name: 'Milk (Toned/Low Fat)',      category: 'dairy',     unit: '1 glass (250ml)',     cal: 115, protein: 8.0,  carbs: 12.0, fat: 3.5,  fiber: 0.0, sugar: 12.0 },
      { id: 122, name: 'Curd / Dahi',              category: 'dairy',     unit: '1 cup (200g)',        cal: 120, protein: 6.5,  carbs: 9.5,  fat: 5.0,  fiber: 0.0, sugar: 9.0 },
      { id: 123, name: 'Paneer (raw)',              category: 'dairy',     unit: '100g',               cal: 265, protein: 18.0, carbs: 3.5,  fat: 20.0, fiber: 0.0, sugar: 3.0 },
      { id: 124, name: 'Greek Yogurt',             category: 'dairy',     unit: '1 cup (170g)',        cal: 100, protein: 17.0, carbs: 6.0,  fat: 0.7,  fiber: 0.0, sugar: 4.0 },
      { id: 125, name: 'Butter',                   category: 'dairy',     unit: '1 tsp (5g)',          cal: 36,  protein: 0.0,  carbs: 0.0,  fat: 4.0,  fiber: 0.0, sugar: 0.0 },
      { id: 126, name: 'Ghee',                     category: 'dairy',     unit: '1 tsp (5g)',          cal: 45,  protein: 0.0,  carbs: 0.0,  fat: 5.0,  fiber: 0.0, sugar: 0.0 },
      { id: 127, name: 'Buttermilk (Chaas)',        category: 'dairy',     unit: '1 glass (250ml)',     cal: 50,  protein: 3.5,  carbs: 5.5,  fat: 1.5,  fiber: 0.0, sugar: 5.0 },
      { id: 128, name: 'Whey Protein (scoop)',      category: 'dairy',     unit: '1 scoop (30g)',       cal: 120, protein: 24.0, carbs: 3.0,  fat: 1.5,  fiber: 0.0, sugar: 2.0 },
      { id: 129, name: 'Condensed Milk',           category: 'dairy',     unit: '1 tbsp (20g)',        cal: 64,  protein: 1.5,  carbs: 11.0, fat: 1.7,  fiber: 0.0, sugar: 11.0 },
      // ---- FRUITS ----
      { id: 140, name: 'Banana',                   category: 'fruits',    unit: '1 medium (100g)',     cal: 89,  protein: 1.1,  carbs: 23.0, fat: 0.3,  fiber: 2.6, sugar: 12.0 },
      { id: 141, name: 'Apple',                    category: 'fruits',    unit: '1 medium (150g)',     cal: 78,  protein: 0.4,  carbs: 21.0, fat: 0.2,  fiber: 2.7, sugar: 16.0 },
      { id: 142, name: 'Mango',                    category: 'fruits',    unit: '1 medium (200g)',     cal: 130, protein: 1.0,  carbs: 33.0, fat: 0.5,  fiber: 3.0, sugar: 29.0 },
      { id: 143, name: 'Papaya',                   category: 'fruits',    unit: '1 cup (150g)',        cal: 62,  protein: 0.7,  carbs: 15.7, fat: 0.4,  fiber: 2.5, sugar: 11.0 },
      { id: 144, name: 'Watermelon',               category: 'fruits',    unit: '1 slice (250g)',      cal: 75,  protein: 1.5,  carbs: 18.0, fat: 0.3,  fiber: 1.0, sugar: 15.0 },
      { id: 145, name: 'Orange',                   category: 'fruits',    unit: '1 medium (130g)',     cal: 62,  protein: 1.2,  carbs: 15.5, fat: 0.2,  fiber: 3.1, sugar: 12.0 },
      { id: 146, name: 'Guava',                    category: 'fruits',    unit: '1 medium (100g)',     cal: 68,  protein: 2.6,  carbs: 14.3, fat: 1.0,  fiber: 5.4, sugar: 9.0 },
      { id: 147, name: 'Grapes',                   category: 'fruits',    unit: '1 cup (150g)',        cal: 104, protein: 1.1,  carbs: 27.0, fat: 0.2,  fiber: 1.4, sugar: 23.0 },
      { id: 148, name: 'Pomegranate',              category: 'fruits',    unit: '1 cup (180g)',        cal: 144, protein: 2.9,  carbs: 32.5, fat: 2.1,  fiber: 7.0, sugar: 24.0 },
      { id: 149, name: 'Pineapple',                category: 'fruits',    unit: '1 cup (165g)',        cal: 83,  protein: 0.9,  carbs: 21.6, fat: 0.2,  fiber: 2.3, sugar: 16.0 },
      { id: 150, name: 'Chickoo / Sapodilla',      category: 'fruits',    unit: '1 medium (100g)',     cal: 83,  protein: 0.4,  carbs: 19.9, fat: 1.1,  fiber: 5.3, sugar: 14.0 },
      // ---- SWEETS ----
      { id: 160, name: 'Halwa (Rava)',             category: 'sweets',    unit: '1 cup (150g)',        cal: 380, protein: 5.0,  carbs: 55.0, fat: 14.0, fiber: 1.5, sugar: 30.0 },
      { id: 161, name: 'Gulab Jamun',              category: 'sweets',    unit: '2 pieces (80g)',      cal: 270, protein: 4.0,  carbs: 42.0, fat: 9.5,  fiber: 0.5, sugar: 32.0 },
      { id: 162, name: 'Rasgulla',                 category: 'sweets',    unit: '2 pieces (100g)',     cal: 186, protein: 5.0,  carbs: 38.0, fat: 1.0,  fiber: 0.0, sugar: 35.0 },
      { id: 163, name: 'Laddu (Besan)',            category: 'sweets',    unit: '1 piece (40g)',       cal: 175, protein: 3.5,  carbs: 22.0, fat: 8.0,  fiber: 1.0, sugar: 14.0 },
      { id: 164, name: 'Kheer (Rice Payasam)',     category: 'sweets',    unit: '1 cup (200g)',        cal: 250, protein: 7.0,  carbs: 38.0, fat: 8.0,  fiber: 0.3, sugar: 28.0 },
      { id: 165, name: 'Jalebi',                   category: 'sweets',    unit: '2 pieces (40g)',      cal: 150, protein: 1.5,  carbs: 28.0, fat: 4.5,  fiber: 0.0, sugar: 22.0 },
      { id: 166, name: 'Mysore Pak',               category: 'sweets',    unit: '1 piece (50g)',       cal: 245, protein: 4.5,  carbs: 25.0, fat: 14.0, fiber: 1.0, sugar: 18.0 },
      { id: 167, name: 'Payasam (Semiya)',         category: 'sweets',    unit: '1 cup (200g)',        cal: 260, protein: 6.0,  carbs: 40.0, fat: 8.0,  fiber: 0.5, sugar: 30.0 },
      { id: 168, name: 'Kesari Bath',              category: 'sweets',    unit: '1 cup (120g)',        cal: 290, protein: 3.5,  carbs: 46.0, fat: 10.0, fiber: 0.5, sugar: 28.0 },
      // ---- DRINKS ----
      { id: 180, name: 'Tea (with milk+sugar)',    category: 'drinks',    unit: '1 cup (180ml)',       cal: 55,  protein: 1.5,  carbs: 10.0, fat: 1.0,  fiber: 0.0, sugar: 8.0 },
      { id: 181, name: 'Coffee (with milk)',       category: 'drinks',    unit: '1 cup (180ml)',       cal: 60,  protein: 2.0,  carbs: 9.0,  fat: 2.0,  fiber: 0.0, sugar: 7.0 },
      { id: 182, name: 'Black Coffee',             category: 'drinks',    unit: '1 cup (200ml)',       cal: 5,   protein: 0.3,  carbs: 0.5,  fat: 0.0,  fiber: 0.0, sugar: 0.0 },
      { id: 183, name: 'Coconut Water',            category: 'drinks',    unit: '1 coconut (300ml)',   cal: 60,  protein: 0.8,  carbs: 14.0, fat: 0.5,  fiber: 1.0, sugar: 10.0 },
      { id: 184, name: 'Mango Juice (fresh)',      category: 'drinks',    unit: '1 glass (250ml)',     cal: 128, protein: 0.5,  carbs: 32.0, fat: 0.2,  fiber: 1.5, sugar: 28.0 },
      { id: 185, name: 'Lassi (plain)',            category: 'drinks',    unit: '1 glass (250ml)',     cal: 150, protein: 8.0,  carbs: 18.0, fat: 5.0,  fiber: 0.0, sugar: 14.0 },
      { id: 186, name: 'Lassi (sweet)',            category: 'drinks',    unit: '1 glass (250ml)',     cal: 220, protein: 7.5,  carbs: 35.0, fat: 5.0,  fiber: 0.0, sugar: 28.0 },
      { id: 187, name: 'Protein Shake',            category: 'drinks',    unit: '1 serving (350ml)',   cal: 180, protein: 25.0, carbs: 8.0,  fat: 5.0,  fiber: 1.0, sugar: 4.0 },
      { id: 188, name: 'Tender Coconut Water',     category: 'drinks',    unit: '1 glass (250ml)',     cal: 50,  protein: 0.5,  carbs: 12.0, fat: 0.2,  fiber: 0.8, sugar: 9.0 },
      { id: 189, name: 'Nimbu Pani / Lemonade',   category: 'drinks',    unit: '1 glass (250ml)',     cal: 60,  protein: 0.2,  carbs: 16.0, fat: 0.0,  fiber: 0.2, sugar: 14.0 },
      { id: 190, name: 'Badam Milk',               category: 'drinks',    unit: '1 glass (250ml)',     cal: 210, protein: 8.0,  carbs: 28.0, fat: 8.0,  fiber: 1.0, sugar: 22.0 },
      { id: 191, name: 'Sugarcane Juice',          category: 'drinks',    unit: '1 glass (250ml)',     cal: 115, protein: 0.3,  carbs: 28.0, fat: 0.2,  fiber: 0.0, sugar: 26.0 },
    ];
  
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
      currentResults: []   // keep reference so click works by index
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
      showPlaceholder();
      renderAll();
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
  
    function loadFromStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          ['breakfast','lunch','dinner','snacks'].forEach(m => {
            if (Array.isArray(parsed[m])) state.log[m] = parsed[m];
          });
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
        id:      'usda_' + f.id,
        name:    cleanName(f.name),
        category:'usda',
        unit:    '100g',
        cal:     round1(f.calories || 0),
        protein: round1(f.protein  || 0),
        carbs:   round1(f.carbs    || 0),
        fat:     round1(f.fat      || 0),
        fiber:   round1(f.fiber    || 0),
        sugar:   round1(f.sugar    || 0),
        source:  'USDA'
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
      return LOCAL_FOOD_DB.filter(f => {
        const matchCat = category === 'all' || f.category === category;
        const matchQ   = !q || f.name.toLowerCase().includes(q);
        return matchCat && matchQ;
      });
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
          if (clearBtn) clearBtn.style.display = input.value ? 'block' : 'none';
  
          clearTimeout(state.searchTimeout);
  
          if (!input.value.trim()) {
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
      }
  
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value         = '';
          state.searchQuery   = '';
          clearBtn.style.display = 'none';
          clearTimeout(state.searchTimeout);
          showPlaceholder();
          input.focus();
        });
      }
    }
  
    async function performSearch(query) {
        setLoading(true);
        try {
          // Step 1: Check local Indian food DB first (instant)
          const localMatches = searchLocal(query, 'all');
          const localMapped  = localMatches.map(f => ({ ...f, source: 'Local' }));
      
          // If local has good results (3+), show immediately and stop
          if (localMapped.length >= 3) {
            renderResults(localMapped);
            setLoading(false);
            return;
          }
      
          // Step 2: Local has few/no results — ask OpenAI for Indian nutrition data
          try {
            const aiResults = await fetchAINutrition(query);
            if (aiResults && aiResults.length > 0) {
              const aiMapped = aiResults.map((f, i) => ({
                id:       'ai_' + i + '_' + Date.now(),
                name:     f.name,
                category: 'ai',
                unit:     f.unit || '1 serving',
                cal:      round1(f.cal      || 0),
                protein:  round1(f.protein  || 0),
                carbs:    round1(f.carbs    || 0),
                fat:      round1(f.fat      || 0),
                fiber:    round1(f.fiber    || 0),
                sugar:    round1(f.sugar    || 0),
                source:   'AI'
              }));
      
              // Merge: local first, then AI results not already in local
              const localNames = new Set(localMapped.map(f => f.name.toLowerCase()));
              const aiFiltered = aiMapped.filter(f => !localNames.has(f.name.toLowerCase()));
              renderResults([...localMapped, ...aiFiltered]);
              return;
            }
          } catch (aiErr) {
            console.warn('AI nutrition failed:', aiErr.message);
          }
      
          // Step 3: Both failed — show whatever local has (even if few)
          if (localMapped.length > 0) {
            renderResults(localMapped);
          } else {
            // Last resort: try USDA
            try {
              const usdaResults = await searchFoodAPI(query);
              const usdaMapped  = usdaResults.map(mapUSDAFood);
              renderResults(usdaMapped.length > 0 ? usdaMapped : []);
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
          <div class="cal-results-placeholder-sub">Powered by USDA — 10,000+ foods including Indian dishes</div>
        </div>`;
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
        <div class="cal-result-item ${state.selectedFood && state.selectedFood.id === food.id ? 'selected' : ''}"
             data-idx="${idx}">
          <div class="cal-result-left">
            <div class="cal-result-name">${food.name}</div>
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
          <div class="cal-selected-unit">Per ${food.unit}${food.source === 'USDA' ? '&nbsp;<span class="cal-usda-badge">USDA</span>' : ''}</div>
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
      const qty     = parseFloat(document.getElementById('foodQty').value) || 1;
      const preview = document.getElementById('addPreview');
      if (!preview) return;
  
      preview.innerHTML = `
        <div class="cal-preview-item">
          <span class="cal-preview-val">${round1(food.cal     * qty)}</span>
          <span class="cal-preview-lbl">kcal</span>
        </div>
        <div class="cal-preview-item">
          <span class="cal-preview-val">${round1(food.protein * qty)}g</span>
          <span class="cal-preview-lbl">Protein</span>
        </div>
        <div class="cal-preview-item">
          <span class="cal-preview-val">${round1(food.carbs   * qty)}g</span>
          <span class="cal-preview-lbl">Carbs</span>
        </div>
        <div class="cal-preview-item">
          <span class="cal-preview-val">${round1(food.fat     * qty)}g</span>
          <span class="cal-preview-lbl">Fat</span>
        </div>
        <div class="cal-preview-item">
          <span class="cal-preview-val">${round1(food.fiber   * qty)}g</span>
          <span class="cal-preview-lbl">Fiber</span>
        </div>
        <div class="cal-preview-item cal-preview-sugar">
          <span class="cal-preview-val">${round1((food.sugar || 0) * qty)}g</span>
          <span class="cal-preview-lbl">Sugar</span>
        </div>
      `;
    }
  
    function addFoodToLog() {
      const food = state.selectedFood;
      if (!food) { showToast('⚠️ Please select a food first'); return; }
  
      const qty  = parseFloat(document.getElementById('foodQty').value) || 1;
      const meal = document.getElementById('mealTypeSelect').value;
  
      const entry = {
        id:      Date.now(),
        foodId:  food.id,
        name:    food.name,
        unit:    food.unit,
        qty:     qty,
        cal:     round1(food.cal           * qty),
        protein: round1(food.protein       * qty),
        carbs:   round1(food.carbs         * qty),
        fat:     round1(food.fat           * qty),
        fiber:   round1(food.fiber         * qty),
        sugar:   round1((food.sugar || 0)  * qty),
        source:  food.source || 'Local'
      };
  
      state.log[meal].push(entry);
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
              <div class="cal-log-sub">
                P:&nbsp;${entry.protein}g &nbsp;·&nbsp;
                C:&nbsp;${entry.carbs}g &nbsp;·&nbsp;
                Fat:&nbsp;${entry.fat}g &nbsp;·&nbsp;
                Fiber:&nbsp;${entry.fiber}g &nbsp;·&nbsp;
                <span class="cal-log-sugar">Sugar:&nbsp;${entry.sugar}g</span>
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
        acc.cal     += e.cal     || 0;
        acc.protein += e.protein || 0;
        acc.carbs   += e.carbs   || 0;
        acc.fat     += e.fat     || 0;
        acc.fiber   += e.fiber   || 0;
        acc.sugar   += e.sugar   || 0;
        return acc;
      }, { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });
  
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
      safe('summaryFiber',    round1(totals.fiber)   + 'g');
      safe('summarySugar',    round1(totals.sugar)   + 'g');
  
      // Macro bars (% of combined macros weight)
      const macroTotal = totals.protein + totals.carbs + totals.fat + totals.fiber;
      const pct = v => macroTotal > 0 ? Math.min(100, (v / macroTotal * 100)).toFixed(1) : 0;
  
      const setBar = (id, v) => { const el = document.getElementById(id); if (el) el.style.width = pct(v) + '%'; };
      setBar('proteinBar', totals.protein);
      setBar('carbsBar',   totals.carbs);
      setBar('fatBar',     totals.fat);
      setBar('fiberBar',   totals.fiber);
    }
  
    function renderAll() {
      ['breakfast','lunch','dinner','snacks'].forEach(renderMeal);
      renderSummary();
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
  
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          saveToStorage();
          if (notice) { notice.style.display = 'block'; setTimeout(() => notice.style.display = 'none', 4000); }
          showToast('💾 Log saved successfully!');
        });
      }
      if (resetBtn)  resetBtn.addEventListener('click',  resetLog);
      if (resetBtn2) resetBtn2.addEventListener('click', resetLog);
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
  
    // ==========================================
    //  START
    // ==========================================
    document.addEventListener('DOMContentLoaded', init);
  
  })();
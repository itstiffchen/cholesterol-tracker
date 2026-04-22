import { CholesterolRecord } from "@/types/cholesterol";

export interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface NutritionProfile {
  summary: string;
  concerns: string[];
  tips: string[];
  weeklyPlan: { day: string; meals: MealPlan }[];
}

interface Flags {
  highLdl: boolean;
  lowHdl: boolean;
  highTriglycerides: boolean;
  highTotal: boolean;
  highNonHdl: boolean;
}

function getFlags(record: CholesterolRecord): Flags {
  return {
    highLdl: record.ldl !== null && record.ldl >= 100,
    lowHdl: record.hdl !== null && record.hdl < 60,
    highTriglycerides: record.triglycerides !== null && record.triglycerides >= 150,
    highTotal: record.totalCholesterol !== null && record.totalCholesterol >= 200,
    highNonHdl: record.nonHdl !== null && record.nonHdl >= 130,
  };
}

const HEART_HEALTHY_BREAKFASTS: string[][] = [
  ["Oatmeal with walnuts, blueberries, and ground flaxseed", "Green tea"],
  ["Avocado toast on whole-grain bread with cherry tomatoes", "Black coffee or green tea"],
  ["Greek yogurt parfait with almonds, chia seeds, and mixed berries", "Chamomile tea"],
  ["Smoothie: spinach, banana, almond butter, oat milk, and flaxseed", "Water with lemon"],
  ["Whole-grain toast with almond butter and sliced banana", "Green tea"],
  ["Steel-cut oats with pecans, cinnamon, and diced apple", "Black coffee"],
  ["Egg white omelet with spinach, mushrooms, and bell peppers", "Herbal tea"],
];

const HEART_HEALTHY_LUNCHES: string[][] = [
  ["Grilled salmon salad with mixed greens, avocado, olive oil and lemon dressing", "Side of quinoa"],
  ["Lentil soup with whole-grain bread and side salad", "Sparkling water with lime"],
  ["Mediterranean bowl: chickpeas, cucumber, tomato, olives, feta, olive oil dressing", "Whole-wheat pita"],
  ["Grilled chicken breast with roasted sweet potato and steamed broccoli", "Water"],
  ["Black bean and vegetable wrap in a whole-wheat tortilla with guacamole", "Side of fruit"],
  ["Tuna salad (olive oil-based) on mixed greens with whole-grain crackers", "Herbal iced tea"],
  ["Turkey and vegetable stir-fry with brown rice and sesame seeds", "Green tea"],
];

const HEART_HEALTHY_DINNERS: string[][] = [
  ["Baked salmon with roasted Brussels sprouts and wild rice", "Side of steamed asparagus"],
  ["Grilled chicken with quinoa, roasted vegetables, and tahini drizzle", "Mixed green salad"],
  ["Bean and vegetable chili with a side of cornbread", "Steamed kale with garlic"],
  ["Baked cod with lemon herb sauce, roasted cauliflower, and sweet potato", "Side salad with vinaigrette"],
  ["Whole-wheat pasta with marinara, grilled vegetables, and a sprinkle of parmesan", "Steamed broccoli"],
  ["Grilled shrimp tacos with cabbage slaw, avocado, and lime on corn tortillas", "Black bean side"],
  ["Stuffed bell peppers with ground turkey, brown rice, tomatoes, and herbs", "Side of sautéed spinach"],
];

const HEART_HEALTHY_SNACKS: string[][] = [
  ["Handful of almonds (about 23)", "Apple slices"],
  ["Carrot and celery sticks with hummus"],
  ["Mixed berries with a small handful of walnuts"],
  ["Edamame with a sprinkle of sea salt"],
  ["Sliced avocado on whole-grain crackers"],
  ["Trail mix: unsalted nuts, seeds, and dark chocolate chips"],
  ["Pear slices with a tablespoon of almond butter"],
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function generateNutritionPlan(record: CholesterolRecord): NutritionProfile {
  const flags = getFlags(record);
  const concerns: string[] = [];
  const tips: string[] = [];

  // Always include baseline heart-healthy tips
  tips.push("Aim for at least 25–30g of fiber daily from whole grains, fruits, and vegetables.");
  tips.push("Use olive oil or avocado oil as your primary cooking fat instead of butter.");

  if (flags.highLdl) {
    concerns.push("Your LDL (bad cholesterol) is above optimal. Focus on reducing saturated fat and increasing soluble fiber.");
    tips.push("Eat oats, barley, beans, and lentils — their soluble fiber helps lower LDL.");
    tips.push("Add plant sterols: almonds, walnuts, flaxseed, and avocado help block cholesterol absorption.");
    tips.push("Limit red meat to once a week. Choose fish, poultry, or plant proteins instead.");
  }

  if (flags.lowHdl) {
    concerns.push("Your HDL (good cholesterol) is below the protective level. Focus on healthy fats and regular exercise.");
    tips.push("Include fatty fish (salmon, mackerel, sardines) at least 2–3 times per week for omega-3s.");
    tips.push("Add avocado, olive oil, and nuts daily — monounsaturated fats raise HDL.");
    tips.push("Pair this meal plan with 30+ minutes of aerobic exercise most days to boost HDL.");
  }

  if (flags.highTriglycerides) {
    concerns.push("Your triglycerides are elevated. Reduce sugar, refined carbs, and alcohol.");
    tips.push("Cut back on added sugars, sugary drinks, white bread, and pastries.");
    tips.push("Increase omega-3 intake: salmon, mackerel, walnuts, and ground flaxseed.");
    tips.push("Limit alcohol — even moderate drinking can raise triglycerides significantly.");
  }

  if (flags.highTotal) {
    concerns.push("Your total cholesterol is above the desirable range.");
  }

  if (flags.highNonHdl) {
    concerns.push("Your non-HDL cholesterol is elevated, indicating higher cardiovascular risk.");
  }

  // General tips everyone benefits from
  tips.push("Stay hydrated — drink at least 8 glasses of water daily.");
  tips.push("Limit sodium to under 2,300mg/day to support overall heart health.");
  tips.push("Choose whole fruits over fruit juice to get fiber and avoid blood sugar spikes.");

  const hasConcerns = concerns.length > 0;
  const summary = hasConcerns
    ? "Based on your latest results, this meal plan focuses on heart-healthy foods tailored to bring your levels into the healthy range."
    : "Your cholesterol levels look good! This meal plan helps you maintain your healthy numbers with nutrient-rich, heart-friendly foods.";

  const weeklyPlan = DAYS.map((day, i) => ({
    day,
    meals: {
      breakfast: HEART_HEALTHY_BREAKFASTS[i],
      lunch: HEART_HEALTHY_LUNCHES[i],
      dinner: HEART_HEALTHY_DINNERS[i],
      snacks: HEART_HEALTHY_SNACKS[i],
    },
  }));

  return { summary, concerns, tips, weeklyPlan };
}

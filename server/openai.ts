import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BMIAnalysis {
  bmi: number;
  category: string;
  recommendation: string;
}

export interface ExerciseRecommendation {
  name: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "cardio" | "strength" | "flexibility";
  description: string;
}

export interface CalorieAnalysis {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  analysis: string;
}

export async function analyzeBMI(
  height: number,
  weight: number,
  age: number,
  gender: string
): Promise<BMIAnalysis> {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a helpful fitness and health advisor. Provide personalized, encouraging health recommendations based on BMI data. Keep responses concise but actionable. Respond with JSON in this format: { \"recommendation\": \"string\" }"
      },
      {
        role: "user",
        content: `A ${age} year old ${gender} has the following stats: Height: ${height}cm, Weight: ${weight}kg, BMI: ${bmi.toFixed(1)}, Category: ${category}. Provide a personalized health recommendation.`
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 512
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    recommendation: result.recommendation || "Maintain a balanced diet and regular exercise routine."
  };
}

export async function getExerciseRecommendations(
  fitnessLevel: string,
  goal: string,
  bmi?: number
): Promise<ExerciseRecommendation[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are an expert personal trainer. Generate 8 diverse, personalized exercise recommendations based on the user's fitness level and goals. 
        Include a mix of cardio, strength, and flexibility exercises appropriate for their level.
        Respond with JSON in this format: { "exercises": [{ "name": "string", "duration": "string (e.g., '30 mins' or '3 sets of 12')", "difficulty": "beginner|intermediate|advanced", "type": "cardio|strength|flexibility", "description": "string (2-3 sentences explaining benefits and proper form)" }] }
        Make sure to include:
        - 2-3 cardio exercises
        - 2-3 strength exercises
        - 2-3 flexibility exercises
        All should match the user's fitness level and help achieve their specific goal.`
      },
      {
        role: "user",
        content: `Create 8 diverse exercise recommendations for someone with:
        - Fitness level: ${fitnessLevel}
        - Goal: ${goal}${bmi ? `\n- BMI: ${bmi}` : ""}
        
        Make exercises practical, safe, and progressively appropriate for their level. Include variety across cardio, strength, and flexibility.`
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2000
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result.exercises || [];
}

export async function analyzeCalories(mealDescription: string): Promise<CalorieAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a nutrition expert. Analyze the described meal and provide accurate calorie and macronutrient estimates.
        Respond with JSON in this format: { "totalCalories": number, "protein": number (in grams), "carbs": number (in grams), "fats": number (in grams), "analysis": "string (2-3 sentences with nutritional insights and suggestions)" }`
      },
      {
        role: "user",
        content: `Analyze this meal and provide nutritional information: ${mealDescription}`
      }
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 512
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  return {
    totalCalories: result.totalCalories || 0,
    protein: result.protein || 0,
    carbs: result.carbs || 0,
    fats: result.fats || 0,
    analysis: result.analysis || "Unable to analyze the meal."
  };
}

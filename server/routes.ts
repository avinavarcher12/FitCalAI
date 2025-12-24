import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeBMI, getExerciseRecommendations, analyzeCalories } from "./openai";
import { insertExerciseLogSchema, insertMealLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // BMI Analysis with AI
  app.post("/api/bmi/analyze", async (req, res) => {
    try {
      const { height, weight, age, gender } = req.body;
      
      if (!height || !weight) {
        return res.status(400).json({ error: "Height and weight are required" });
      }

      const analysis = await analyzeBMI(
        parseFloat(height),
        parseFloat(weight),
        parseInt(age) || 30,
        gender || "unspecified"
      );

      // Save to database
      await storage.createBmiRecord({
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age) || null,
        gender: gender || null,
        bmiValue: analysis.bmi,
        category: analysis.category,
        aiRecommendation: analysis.recommendation
      });

      res.json(analysis);
    } catch (error) {
      console.error("BMI analysis error:", error);
      res.status(500).json({ error: "Failed to analyze BMI" });
    }
  });

  // Get BMI history
  app.get("/api/bmi/history", async (req, res) => {
    try {
      const records = await storage.getBmiRecords(10);
      res.json(records);
    } catch (error) {
      console.error("Error fetching BMI history:", error);
      res.status(500).json({ error: "Failed to fetch BMI history", details: (error as Error).message });
    }
  });

  // Exercise Recommendations with AI
  app.post("/api/exercises/recommend", async (req, res) => {
    try {
      const { fitnessLevel, goal } = req.body;
      
      if (!fitnessLevel || !goal) {
        return res.status(400).json({ error: "Fitness level and goal are required" });
      }

      const latestBmi = await storage.getLatestBmiRecord();
      const recommendations = await getExerciseRecommendations(
        fitnessLevel,
        goal,
        latestBmi?.bmiValue
      );

      res.json(recommendations);
    } catch (error) {
      console.error("Exercise recommendation error:", error);
      res.status(500).json({ error: "Failed to get exercise recommendations" });
    }
  });

  // Log an exercise
  app.post("/api/exercises/log", async (req, res) => {
    try {
      const validated = insertExerciseLogSchema.parse(req.body);
      const log = await storage.createExerciseLog(validated);
      res.json(log);
    } catch (error) {
      console.error("Error logging exercise:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid exercise data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to log exercise" });
    }
  });

  // Get exercise history
  app.get("/api/exercises/history", async (req, res) => {
    try {
      const logs = await storage.getExerciseLogs(20);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching exercise history:", error);
      res.status(500).json({ error: "Failed to fetch exercise history" });
    }
  });

  // Calorie Analysis with AI
  app.post("/api/calories/analyze", async (req, res) => {
    try {
      const { mealDescription } = req.body;
      
      if (!mealDescription?.trim()) {
        return res.status(400).json({ error: "Meal description is required" });
      }

      const analysis = await analyzeCalories(mealDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Calorie analysis error:", error);
      res.status(500).json({ error: "Failed to analyze calories" });
    }
  });

  // Save meal to history
  app.post("/api/meals/log", async (req, res) => {
    try {
      const validated = insertMealLogSchema.parse(req.body);
      const log = await storage.createMealLog(validated);
      res.json(log);
    } catch (error) {
      console.error("Error logging meal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid meal data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to log meal" });
    }
  });

  // Get meal history
  app.get("/api/meals/history", async (req, res) => {
    try {
      const logs = await storage.getMealLogs(20);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching meal history:", error);
      res.status(500).json({ error: "Failed to fetch meal history" });
    }
  });

  // Dashboard stats
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const latestBmi = await storage.getLatestBmiRecord();
      const exerciseLogs = await storage.getExerciseLogs(7);
      const mealLogs = await storage.getMealLogs(7);

      const totalCalories = mealLogs.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const avgCalories = mealLogs.length > 0 ? Math.round(totalCalories / mealLogs.length) : 0;

      res.json({
        bmi: latestBmi ? {
          value: latestBmi.bmiValue,
          category: latestBmi.category
        } : null,
        weeklyCalories: totalCalories,
        avgDailyCalories: avgCalories,
        workoutsThisWeek: exerciseLogs.length,
        recentMeals: mealLogs.slice(0, 3),
        recentExercises: exerciseLogs.slice(0, 3)
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats", details: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

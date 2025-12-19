import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  height: real("height"),
  weight: real("weight"),
  age: integer("age"),
  gender: text("gender"),
  fitnessLevel: text("fitness_level"),
  fitnessGoal: text("fitness_goal"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export const exerciseLogs = pgTable("exercise_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exerciseName: text("exercise_name").notNull(),
  duration: text("duration").notNull(),
  difficulty: text("difficulty"),
  exerciseType: text("exercise_type"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const insertExerciseLogSchema = createInsertSchema(exerciseLogs).omit({ id: true, loggedAt: true });
export type InsertExerciseLog = z.infer<typeof insertExerciseLogSchema>;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;

export const mealLogs = pgTable("meal_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mealDescription: text("meal_description").notNull(),
  totalCalories: integer("total_calories").notNull(),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  aiAnalysis: text("ai_analysis"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const insertMealLogSchema = createInsertSchema(mealLogs).omit({ id: true, loggedAt: true });
export type InsertMealLog = z.infer<typeof insertMealLogSchema>;
export type MealLog = typeof mealLogs.$inferSelect;

export const bmiRecords = pgTable("bmi_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  age: integer("age"),
  gender: text("gender"),
  bmiValue: real("bmi_value").notNull(),
  category: text("category").notNull(),
  aiRecommendation: text("ai_recommendation"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const insertBmiRecordSchema = createInsertSchema(bmiRecords).omit({ id: true, recordedAt: true });
export type InsertBmiRecord = z.infer<typeof insertBmiRecordSchema>;
export type BmiRecord = typeof bmiRecords.$inferSelect;

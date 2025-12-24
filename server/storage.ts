import { randomUUID } from "crypto";
import {
  type User, type InsertUser,
  type UserProfile, type InsertUserProfile,
  type ExerciseLog, type InsertExerciseLog,
  type MealLog, type InsertMealLog,
  type BmiRecord, type InsertBmiRecord
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserProfile(): Promise<UserProfile | undefined>;
  saveUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  getExerciseLogs(limit?: number): Promise<ExerciseLog[]>;
  createExerciseLog(log: InsertExerciseLog): Promise<ExerciseLog>;
  
  getMealLogs(limit?: number): Promise<MealLog[]>;
  createMealLog(log: InsertMealLog): Promise<MealLog>;
  
  getBmiRecords(limit?: number): Promise<BmiRecord[]>;
  createBmiRecord(record: InsertBmiRecord): Promise<BmiRecord>;
  getLatestBmiRecord(): Promise<BmiRecord | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private exerciseLogs: ExerciseLog[] = [];
  private mealLogs: MealLog[] = [];
  private bmiRecords: BmiRecord[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values())[0];
  }

  async saveUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getUserProfile();
    const id = existing?.id || randomUUID();
    const userProfile: UserProfile = { 
      id,
      height: profile.height ?? null,
      weight: profile.weight ?? null,
      age: profile.age ?? null,
      gender: profile.gender ?? null,
      fitnessLevel: profile.fitnessLevel ?? null,
      fitnessGoal: profile.fitnessGoal ?? null
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async getExerciseLogs(limit = 20): Promise<ExerciseLog[]> {
    return this.exerciseLogs.slice(0, limit);
  }

  async createExerciseLog(log: InsertExerciseLog): Promise<ExerciseLog> {
    const id = randomUUID();
    const exerciseLog: ExerciseLog = { 
      id,
      exerciseName: log.exerciseName,
      duration: log.duration,
      difficulty: log.difficulty ?? null,
      exerciseType: log.exerciseType ?? null,
      loggedAt: new Date()
    };
    this.exerciseLogs.unshift(exerciseLog);
    return exerciseLog;
  }

  async getMealLogs(limit = 20): Promise<MealLog[]> {
    return this.mealLogs.slice(0, limit);
  }

  async createMealLog(log: InsertMealLog): Promise<MealLog> {
    const id = randomUUID();
    const mealLog: MealLog = { 
      id,
      mealDescription: log.mealDescription,
      totalCalories: log.totalCalories,
      protein: log.protein ?? null,
      carbs: log.carbs ?? null,
      fats: log.fats ?? null,
      aiAnalysis: log.aiAnalysis ?? null,
      loggedAt: new Date()
    };
    this.mealLogs.unshift(mealLog);
    return mealLog;
  }

  async getBmiRecords(limit = 10): Promise<BmiRecord[]> {
    return this.bmiRecords.slice(0, limit);
  }

  async createBmiRecord(record: InsertBmiRecord): Promise<BmiRecord> {
    const id = randomUUID();
    const bmiRecord: BmiRecord = { 
      id,
      height: record.height,
      weight: record.weight,
      age: record.age ?? null,
      gender: record.gender ?? null,
      bmiValue: record.bmiValue,
      category: record.category,
      aiRecommendation: record.aiRecommendation ?? null,
      recordedAt: new Date()
    };
    this.bmiRecords.unshift(bmiRecord);
    return bmiRecord;
  }

  async getLatestBmiRecord(): Promise<BmiRecord | undefined> {
    return this.bmiRecords[0];
  }
}

export const storage = new MemStorage();

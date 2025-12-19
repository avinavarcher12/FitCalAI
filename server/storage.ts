import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  userProfiles, type UserProfile, type InsertUserProfile,
  exerciseLogs, type ExerciseLog, type InsertExerciseLog,
  mealLogs, type MealLog, type InsertMealLog,
  bmiRecords, type BmiRecord, type InsertBmiRecord
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserProfile(): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).limit(1);
    return profile;
  }

  async saveUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getUserProfile();
    if (existing) {
      const [updated] = await db.update(userProfiles)
        .set(profile)
        .where(eq(userProfiles.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async getExerciseLogs(limit = 20): Promise<ExerciseLog[]> {
    return db.select().from(exerciseLogs).orderBy(desc(exerciseLogs.loggedAt)).limit(limit);
  }

  async createExerciseLog(log: InsertExerciseLog): Promise<ExerciseLog> {
    const [created] = await db.insert(exerciseLogs).values(log).returning();
    return created;
  }

  async getMealLogs(limit = 20): Promise<MealLog[]> {
    return db.select().from(mealLogs).orderBy(desc(mealLogs.loggedAt)).limit(limit);
  }

  async createMealLog(log: InsertMealLog): Promise<MealLog> {
    const [created] = await db.insert(mealLogs).values(log).returning();
    return created;
  }

  async getBmiRecords(limit = 10): Promise<BmiRecord[]> {
    return db.select().from(bmiRecords).orderBy(desc(bmiRecords.recordedAt)).limit(limit);
  }

  async createBmiRecord(record: InsertBmiRecord): Promise<BmiRecord> {
    const [created] = await db.insert(bmiRecords).values(record).returning();
    return created;
  }

  async getLatestBmiRecord(): Promise<BmiRecord | undefined> {
    const [record] = await db.select().from(bmiRecords).orderBy(desc(bmiRecords.recordedAt)).limit(1);
    return record;
  }
}

export const storage = new DatabaseStorage();

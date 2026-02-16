import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  InsertUser,
  transactionCategoriesTable,
  usersTable,
} from "@/db/schema";

export class UserService {
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.getUserByUsername = this.getUserByUsername.bind(this);
    this.getUserByTelegramId = this.getUserByTelegramId.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  async createUser(data: InsertUser) {
    const user = await db.insert(usersTable).values(data).returning();

    await db.insert(transactionCategoriesTable).values({
      name: "Default",
      userId: user[0].telegramId,
    });
    return user[0];
  }
  async getUserByUsername(username: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    return user[0];
  }
  async getUserByTelegramId(telegramId: bigint) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.telegramId, telegramId));

    return user[0];
  }
  async updateUser(telegramId: bigint, data: Partial<InsertUser>) {
    await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.telegramId, telegramId));
  }
  async deleteUser(telegramId: bigint) {
    // TODO: Implement soft delete instead of hard delete
    await db.delete(usersTable).where(eq(usersTable.telegramId, telegramId));
  }
}

export const userService = new UserService();

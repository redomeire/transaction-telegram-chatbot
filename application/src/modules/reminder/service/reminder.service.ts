import { db } from "@/db";
import { InsertReminder, remindersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export class ReminderService {
  constructor() {
    this.create = this.create.bind(this);
    this.getByTelegramId = this.getByTelegramId.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
  }
  async create(data: InsertReminder) {
    const reminder = await db.insert(remindersTable).values(data).returning();
    return reminder[0];
  }
  async getByTelegramId(telegramId: bigint) {
    const reminders = await db
      .select()
      .from(remindersTable)
      .where(eq(remindersTable.userId, telegramId));
    return reminders;
  }
  async updateReminder(
    id: number,
    telegramId: bigint,
    data: Partial<InsertReminder>,
  ) {
    const reminder = await db
      .update(remindersTable)
      .set(data)
      .where(
        and(eq(remindersTable.id, id), eq(remindersTable.userId, telegramId)),
      )
      .returning();
    return reminder[0];
  }
  async deleteReminder(id: number, telegramId: bigint) {
    const reminder = await db
      .delete(remindersTable)
      .where(
        and(eq(remindersTable.id, id), eq(remindersTable.userId, telegramId)),
      )
      .returning();
    return reminder[0];
  }
}

export const reminderService = new ReminderService();

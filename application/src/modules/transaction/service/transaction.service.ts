import { db } from "@/db";
import {
  InsertTransaction,
  transactionCategoriesTable,
  transactionsTable,
  usersTable,
} from "@/db/schema";
import { and, between, eq, inArray, sql } from "drizzle-orm";

export class TransactionService {
  constructor() {
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.bulkDelete = this.bulkDelete.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.getCategoriesByUserId = this.getCategoriesByUserId.bind(this);
    this.getUserCategoriesByTelegramId =
      this.getUserCategoriesByTelegramId.bind(this);
  }
  async create(data: InsertTransaction) {
    const transaction = await db
      .insert(transactionsTable)
      .values(data)
      .returning();
    return transaction[0];
  }
  async createCategory(name: string, telegramId: bigint) {
    const category = await db
      .insert(transactionCategoriesTable)
      .values({ name, userId: telegramId })
      .returning();
    return category;
  }
  async getById(id: number) {
    const transaction = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, id));
    return transaction[0];
  }
  async getCategoriesByUserId(telegramId: bigint) {
    const categories = await db
      .select()
      .from(transactionCategoriesTable)
      .where(eq(transactionCategoriesTable.userId, telegramId));
    return categories;
  }
  async getUserCategoriesByTelegramId(telegramId: bigint) {
    const categories = await db
      .select({
        id: transactionCategoriesTable.id,
        name: transactionCategoriesTable.name,
        userId: transactionCategoriesTable.userId,
      })
      .from(transactionCategoriesTable)
      .innerJoin(
        usersTable,
        eq(transactionCategoriesTable.userId, usersTable.telegramId),
      )
      .where(eq(usersTable.telegramId, telegramId));

    return categories;
  }
  async getByUserId(telegramId: bigint, limit?: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, telegramId),
          between(transactionsTable.createdAt, startOfMonth, endOfMonth),
        ),
      )
      .orderBy(sql`${transactionsTable.createdAt} desc`)
      .limit(limit || 10);
    return transactions;
  }
  async update(
    telegramId: bigint,
    id: number,
    data: Partial<InsertTransaction>,
  ) {
    const transaction = await db
      .update(transactionsTable)
      .set(data)
      .where(
        and(
          eq(transactionsTable.userId, telegramId),
          eq(transactionsTable.id, id),
        ),
      )
      .returning();
    return transaction[0];
  }
  async delete(telegramId: bigint, id: number) {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, telegramId),
          eq(transactionsTable.id, id),
        ),
      );
  }
  async bulkDelete(telegramId: bigint, ids: number[]) {
    const deletedIds = await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, telegramId),
          inArray(transactionsTable.id, ids),
        ),
      )
      .returning();
    return deletedIds;
  }
}

export const transactionService = new TransactionService();

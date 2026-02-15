import { Request, Response } from "express";
import { UserService } from "../service/user.service.js";

export class UserController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
    // binds
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }
  async create(req: Request, res: Response) {
    try {
      const { username, telegramId } = req.body;
      await this.userService.createUser({
        username,
        telegramId,
      });
      res
        .status(201)
        .json({ error: false, message: "User created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async get(req: Request, res: Response) {
    try {
      const { telegramId } = req.params as { telegramId: string };
      if (!telegramId) {
        return res
          .status(400)
          .json({ error: true, message: "Telegram id is required" });
      }
      const user = await this.userService.getUserByTelegramId(
        BigInt(telegramId),
      );
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }
      res.status(200).json({ error: false, data: user });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async updateUsername(req: Request, res: Response) {
    try {
      const { telegramId } = req.params as { telegramId: string };
      const { username } = req.body;
      if (!username) {
        return res
          .status(400)
          .json({ error: true, message: "Username is required" });
      }
      const user = await this.userService.getUserByUsername(username);
      if (user) {
        return res
          .status(400)
          .json({ error: true, message: "Username already exists" });
      }
      await this.userService.updateUser(BigInt(telegramId), { username });
      res
        .status(200)
        .json({ error: false, message: "Username updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

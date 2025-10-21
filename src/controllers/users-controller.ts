import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import z from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Name is required" }),
      email: z
        .string()
        .trim()
        .email({ message: "Email is not valid" })
        .toLowerCase(),
      password: z
        .string()
        .min(6, { message: "password must have at least 6 characters" }),
      role: z
        .enum([UserRole.employe, UserRole.manager])
        .default(UserRole.employe),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    response.json({ name, email, password, role });
  }
}

export { UsersController };

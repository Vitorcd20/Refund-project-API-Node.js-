import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { compare } from "bcrypt";
import z from "zod";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "Email is not valid" }),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new AppError("Email or password is not valid", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Email or password is not valid", 401);
    }

    const {expiresIn, secret} = authConfig.jwt

    const token = sign({role: user.role}, secret, {
        subject: user.id,
        expiresIn
    })

    const {password: _, ...userWithoutPassword } = user

    response.json({ token, user: userWithoutPassword});
  }
}

export { SessionsController };

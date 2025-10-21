import { Request, Response } from "express";
import z from "zod";
import {prisma} from '@/database/prisma'
import { AppError } from "@/utils/app-error";
import { compare } from "bcrypt";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "Email is not valid" }),
      password: z.string()
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({where: {email}})

    if(!user) {
      throw new AppError("Email or password is not valid", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched) {
        throw new AppError("Email or password is not valid", 401)
    }

    response.json({ email, password });
  }
}

export { SessionsController };

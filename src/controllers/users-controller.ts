import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import {prisma} from '@/database/prisma'
import z from "zod";
import { hash } from "bcrypt";
import { AppError } from "@/utils/app-error";

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

    const userWithSameEmail = await prisma.user.findFirst({
        where: {email}
    })

    if(userWithSameEmail){
        throw new AppError("This email is already registered")
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        }
    })

    response.status(201).json()
  }
}

export { UsersController };

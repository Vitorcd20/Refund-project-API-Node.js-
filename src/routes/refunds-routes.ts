import { Router } from "express";
import { RefundsController } from "@/controllers/refund-controller";

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post("/", refundsController.create)

export {refundsRoutes}
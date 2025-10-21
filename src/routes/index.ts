import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";

const routes = Router();

//public routes
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

//private routes
routes.use("/refunds", refundsRoutes)

export { routes };

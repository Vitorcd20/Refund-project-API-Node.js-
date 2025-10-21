import { Router } from "express";

import { usersRoutes } from "./users-routes";

const routes = Router();

//public
routes.use("/users", usersRoutes);

export { routes };

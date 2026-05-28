import { createSuperAdmin } from "./seedSuperAdmin.js";
import { createAdmin } from "./seedAdmin.js";

export const runSeeders = async () => {
  await createSuperAdmin();
  await createAdmin();
};
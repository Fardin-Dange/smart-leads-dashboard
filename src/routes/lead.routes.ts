import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead
} from "../controllers/lead.controller";
import { authorize, protect } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  createLeadSchema,
  getLeadsQuerySchema,
  leadIdParamSchema,
  updateLeadSchema
} from "../validations/lead.validation";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(validateRequest(getLeadsQuerySchema), getLeads)
  .post(authorize("admin", "sales"), validateRequest(createLeadSchema), createLead);

router
  .route("/:id")
  .get(validateRequest(leadIdParamSchema), getLeadById)
  .patch(authorize("admin", "sales"), validateRequest(updateLeadSchema), updateLead)
  .delete(authorize("admin"), validateRequest(leadIdParamSchema), deleteLead);

export default router;

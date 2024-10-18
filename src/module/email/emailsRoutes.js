import { Router } from "express";
import EmailerController from "./emailsController.js";
const router = new Router();

const emailControler = new EmailerController();

//Send mails
router.post(
  "/v2/emails/order/:state",
  // authentication(),
  emailControler.order
);

export default router;

import { createInvoicePDF, Mailer } from "./emailsService.js";

const Emailer = new Mailer();

class EmailerController {
  /**
   * Handle the email service
   * @param {*} req - HTTP request object
   * @param {*} res - HTTP response object
   * @return {Promise<void>}
   */
  async order(req, res) {
    try {
      const { state } = req.params;
      const payload = req.body;

      if (!["confirm", "cancel", "refund", "delivered"].includes(state)) {
        return res.status(400).json({
          message: "Valid states are confirm, cancel and refund",
        });
      }

      let attachments;
      if (state === "confirm") {
        attachments = [
          {
            filename: "Invoice.pdf",
            content: await createInvoicePDF(),
          },
        ];
      }

      Emailer.send(`order/${state}`, {
        receivers: [payload.email],
        data: { ...payload, attachments },
      });

      return res.send("OK");
    } catch (error) {
      console.error("Error processing emails ====>", error);
      return res.status(400).json(error);
    }
  }
}

export default EmailerController;

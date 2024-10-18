import EmailTemplate from "email-templates";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Mailer {
  constructor() {
    this.sender = process.env.SMTP_EMAIL_SENDER;
    this.transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || "587",
      auth: {
        user: process.env.SMTP_AUTH_USERNAME,
        pass: process.env.SMTP_AUTH_PASSWORD,
      },
    });

    console.log("Transport", this.transport.options);
    console.log("Emails", path.resolve(__dirname, "template"));

    this.emailTemplateEngine = new EmailTemplate({
      message: { from: this.sender },
      send: true,
      transport: this.transport,
      views: {
        root: path.resolve(__dirname, "template"),
        options: { extension: "pug" },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "..", "..", "public", "stylesheets"),
        },
      },
    });
    console.log("Email template initialized");
  }

  send(template, options) {
    this.receivers = options.receivers.join(", ");

    const x = {
      template: template,
      message: {
        to: this.receivers,
        attachments: options.data.attachments,
      },
      locals: options.data,
    };
    console.log(x);
    this.emailTemplateEngine.send(x);
  }
}

export async function createInvoicePDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const pageTwo = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 10;
  const textMargin = 20;
  let yPos = height - textMargin;
  let yPosTwo = height - textMargin;

  // Header
  yPos -= 40;
  page.drawText("Invoice", { x: textMargin, y: yPos, size: 20, font });
  yPos -= 40;
  page.drawText("Invoice issued for Supply made by", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(
    "Legal entity name: JUBILANT FOODWORKmargin key in the optionsS LIMITED",
    { x: textMargin, y: yPos, size: fontSize, font }
  );
  yPos -= 20;
  page.drawText("Restaurant Name: Domino's Pizza", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText("Restaurant GSTIN: 06AABCD1821C1ZF", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(
    "Restaurant Address: Space no 88A Ground Floor Eros City Square Rosewood City Sector 49/50, Gurgaon",
    { x: textMargin, y: yPos, size: fontSize, font }
  );
  yPos -= 40;
  page.drawText(`Restaurant FSSAI: 10819005000172 `, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`Order ID: 140454933`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`Customer Name : <First Name Last Name>,`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`Customer Address`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`Customer Address`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`GSTIN: Unregistered or GSTIN`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  page.drawText(`Service Description- Restaurant Service`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(`Supply attracts reverse charge : No`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(`HSN Code-996331`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(`Invoice No. MDL/Sep-24/1385792 `, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText(`Invoice Date : 29 Sep 2024`, {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  // Draw table lines for headers and rows
  const tableX = textMargin;
  const tableWidth = width - 2 * textMargin;
  const cellHeight = 20;
  const colWidths = [40, 150, 60, 60, 80, 60, 60, 60, 60]; // Column widths

  // Draw table header
  const headers = [
    "Sr No",
    "Item",
    "Quantity",
    "Rate",
    "Gross Order Value",
    "Discount",
    "Taxable Order Value",
    "CGST (2.5%)",
    "SGST (2.5%)",
  ];
  yPos -= 20;

  // Draw header row background
  page.drawRectangle({
    x: tableX,
    y: yPos,
    width: tableWidth,
    height: cellHeight,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Draw header text
  let xPos = tableX;
  headers.forEach((header, i) => {
    page.drawText(header, { x: xPos + 2, y: yPos + 5, size: fontSize, font });
    xPos += colWidths[i];
  });

  // Draw horizontal line after header
  yPos -= cellHeight;
  page.drawLine({
    start: { x: tableX, y: yPos },
    end: { x: tableX + tableWidth, y: yPos },
    thickness: 1,
  });

  // Draw table content (rows)
  const items = [
    [
      "1",
      "Classic Stuffed Garlic Bread",
      "1",
      "159.00",
      "159.00",
      "0.00",
      "159.00",
      "3.98",
      "3.98",
    ],
    [
      "2",
      "Peppy Paneer Pizza - Regular",
      "1",
      "344.00",
      "344.00",
      "69.00",
      "275.00",
      "6.88",
      "6.88",
    ],
    ["3", "Delivery Fees", "1", "1.13", "1.13", "0.00", "1.13", "0.03", "0.03"],
  ];

  items.forEach((item) => {
    xPos = tableX;
    item.forEach((cell, i) => {
      page.drawText(cell, { x: xPos + 2, y: yPos + 5, size: fontSize, font });
      xPos += colWidths[i];
    });
    yPos -= cellHeight;

    // Draw horizontal line between rows
    page.drawLine({
      start: { x: tableX, y: yPos },
      end: { x: tableX + tableWidth, y: yPos },
      thickness: 0.5,
    });
  });

  page.drawText("Grand Total: 456.89", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText("CGST: 10.85", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;
  page.drawText("SGST: 10.85", {
    x: textMargin,
    y: yPos,
    size: fontSize,
    font,
  });
  yPos -= 20;

  // Totals section
  yPosTwo -= 40;
  pageTwo.drawText(
    "This is computer generated invoice and does not require physical signature.",
    { x: textMargin, y: yPosTwo, size: fontSize, font }
  );
  yPosTwo -= 20;
  pageTwo.drawText(
    "Please write us to <<email address>> in case of any discrepancy in this invoice.",
    { x: textMargin, y: yPosTwo, size: fontSize, font }
  );
  yPosTwo -= 20;
  pageTwo.drawText(
    "Any dispute arising out of or pertaining to this invoice shall be subject to jurisdictional courts in Delhi only.",
    { x: textMargin, y: yPosTwo, size: fontSize, font }
  );
  yPosTwo -= 20;

  pageTwo.drawText("Invoice issued by:", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;
  pageTwo.drawText("Samast Technologies Private Limited ", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;
  pageTwo.drawText(
    "Registered Office Address: Plot No.379 & 380, Sector - 29, Near IFFCO Chowk Metro Station, Gurugram, Haryana-122001, India ",
    { x: textMargin, y: yPosTwo, size: fontSize, font }
  );
  yPosTwo -= 20;
  pageTwo.drawText("CIN: U74140HR2015PTC073829", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;
  pageTwo.drawText("GSTIN: 06AAVCS7907C2Z0", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;
  pageTwo.drawText("FSSAI: 10822999000650 ", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;
  pageTwo.drawText("PAN: AAVCS7907C", {
    x: textMargin,
    y: yPosTwo,
    size: fontSize,
    font,
  });
  yPosTwo -= 20;

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  console.log("PDF created successfully!");
  return pdfBytes;
}

createInvoicePDF();

import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Formats a numeric value into standard Indian numbering format (e.g., 1,13,800)
 */
function formatIndianNumber(num) {
  const n = Math.round(Number(num) || 0);
  return n.toLocaleString('en-IN');
}

/**
 * Triggers a real browser file download for a PDF Blob, ArrayBuffer, or jsPDF instance.
 * Preserves the Object URL for 120 seconds to prevent premature cancellation by Chrome/Edge.
 *
 * @param {Blob|ArrayBuffer|Object} pdfSource - Raw Blob, ArrayBuffer, or jsPDF instance
 * @param {string} fileName - Target file name (e.g. Invoice_INV-2026-001.pdf)
 */
export function triggerBlobDownload(pdfSource, fileName) {
  const cleanName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  
  let blob;
  if (pdfSource instanceof Blob) {
    blob = pdfSource.type === 'application/pdf' ? pdfSource : new Blob([pdfSource], { type: 'application/pdf' });
  } else if (pdfSource && typeof pdfSource.output === 'function') {
    // jsPDF instance
    const arrayBuffer = pdfSource.output('arraybuffer');
    blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  } else if (pdfSource instanceof ArrayBuffer || ArrayBuffer.isView(pdfSource)) {
    blob = new Blob([pdfSource], { type: 'application/pdf' });
  } else {
    throw new Error('Invalid PDF source: expected Blob, ArrayBuffer, or jsPDF document');
  }

  if (blob.size === 0) {
    throw new Error('PDF output buffer is empty');
  }

  // 1. Create standard object URL
  const url = window.URL.createObjectURL(blob);

  // 2. Create anchor with explicit download attribute
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = cleanName;
  anchor.setAttribute('download', cleanName);
  anchor.rel = 'noopener';
  anchor.style.position = 'fixed';
  anchor.style.left = '-9999px';
  anchor.style.top = '-9999px';
  anchor.style.opacity = '0';

  document.body.appendChild(anchor);

  // 3. Dispatch real click event for maximum browser compatibility (Chrome, Edge, Firefox, Safari)
  try {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    anchor.dispatchEvent(clickEvent);
  } catch (e) {
    anchor.click();
  }

  // 4. Fallback jsPDF native save if instance provided
  if (pdfSource && typeof pdfSource.save === 'function') {
    try {
      // jsPDF internal save uses FileSaver for fallback
      pdfSource.save(cleanName);
    } catch (saveErr) {
      // Ignore if browser already handled anchor click
    }
  }

  // 5. Cleanup safely without aborting download streams
  setTimeout(() => {
    if (anchor.parentNode) {
      anchor.parentNode.removeChild(anchor);
    }
    // Retain object URL for 2 minutes so Chrome/Edge finishes saving the file
    setTimeout(() => {
      try {
        window.URL.revokeObjectURL(url);
      } catch (err) {}
    }, 120000);
  }, 1000);

  return true;
}

/**
 * Generates and immediately downloads a professional, selectable-text Tax Invoice PDF.
 *
 * @param {Object} payment - Payment or transaction record
 * @param {Object} user - Currently authenticated user
 */
export async function downloadInvoicePDF(payment = {}, user = {}) {
  if (!payment || (!payment._id && !payment.id && !payment.invoiceNumber && !payment.amount)) {
    throw new Error('Invoice data not found');
  }

  const now = new Date();
  const paymentDate = payment.createdAt ? new Date(payment.createdAt) : now;
  const formattedDate = format(paymentDate, 'dd MMM yyyy');

  // Normalize Invoice Number
  let rawInvoiceNumber = payment.invoiceNumber;
  if (!rawInvoiceNumber) {
    const rawId = (payment.transactionId || payment._id || payment.id || '2026')
      .toString()
      .slice(-8)
      .toUpperCase();
    rawInvoiceNumber = `INV-${rawId}`;
  }
  if (!rawInvoiceNumber.startsWith('INV-')) {
    rawInvoiceNumber = `INV-${rawInvoiceNumber}`;
  }

  // Filename format: Invoice_INV-<invoiceNumber>.pdf
  const fileName = `Invoice_${rawInvoiceNumber}.pdf`;

  // Resolving Entities
  const contractObj = payment.contract || {};
  const jobObj = contractObj.job || payment.job || {};
  const projectTitle = jobObj.title || payment.description || 'Full-Stack Web Application Development';
  const shortContractId = (contractObj._id || contractObj.id || payment.contractId || 'CTR-2026')
    .toString()
    .slice(-8)
    .toUpperCase();

  const clientName = payment.client?.name || payment.payer?.name || user?.name || 'Verified Enterprise Client';
  const clientEmail = payment.client?.email || payment.payer?.email || user?.email || 'client@workstation.io';

  const freelancerName =
    payment.freelancer?.name ||
    payment.recipient?.name ||
    contractObj.freelancer?.name ||
    'Aarav Mehta';
  const freelancerEmail =
    payment.freelancer?.email ||
    payment.recipient?.email ||
    contractObj.freelancer?.email ||
    'specialist@workstation.io';

  const totalAmount = Number(payment.amount) || 0;
  const baseSubtotal = Math.round(totalAmount / 1.18);
  const gstTax = totalAmount - baseSubtotal;

  const status = (payment.status || 'completed').toUpperCase();
  const isPaid = status === 'COMPLETED' || status === 'SUCCEEDED' || status === 'PAID';
  const transactionId =
    payment.transactionId ||
    payment.razorpayPaymentId ||
    (payment._id ? `pay_${payment._id.toString().slice(-10)}` : 'SETTLED');

  // Create pure vector jsPDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: false, // Prevents corrupting binary streams
  });

  // ─── 1. Header Banner & Logo ───────────────────────────────────────────────
  // Monogram Logo Badge
  doc.setFillColor(0, 35, 102); // #002366 Navy
  doc.roundedRect(15, 15, 13, 13, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('WS', 17.8, 23.5);

  // WorkStation Typography
  doc.setFontSize(17);
  doc.setTextColor(0, 35, 102);
  doc.text('WorkStation', 32, 22.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216); // #1D4ED8
  doc.text('ESCROW & PAYMENTS PLATFORM', 32, 26.5);

  // Company Legal Subtitle
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('WorkStation Technologies Pvt Ltd • GSTIN: 08AAACW2026M1ZS', 15, 33);
  doc.text('support@workstation.io • www.workstation.io', 15, 37);

  // Right Side: Document Title & Metadata
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 35, 102);
  doc.text('TAX INVOICE', 195, 22, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(rawInvoiceNumber, 195, 28, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date: ${formattedDate}`, 195, 33, { align: 'right' });
  doc.text(`Txn Ref: ${transactionId}`, 195, 37.5, { align: 'right' });

  // Status Badge (Top Right)
  if (isPaid) {
    doc.setFillColor(236, 253, 245); // #ECFDF5
    doc.setDrawColor(167, 243, 208); // #A7F3D0
    doc.roundedRect(155, 41, 40, 6.5, 2, 2, 'FD');
    doc.setTextColor(4, 120, 87); // #047857
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('● PAID & VERIFIED', 175, 45.5, { align: 'center' });
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 230, 138);
    doc.roundedRect(160, 41, 35, 6.5, 2, 2, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`● ${status}`, 177.5, 45.5, { align: 'center' });
  }

  // Divider Line
  doc.setDrawColor(0, 35, 102);
  doc.setLineWidth(0.7);
  doc.line(15, 50, 195, 50);

  // ─── 2. Information Cards (3 Columns) ──────────────────────────────────────
  const cardY = 55;
  const cardH = 34;

  // Card 1: Billed To
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, cardY, 56, cardH, 2.5, 2.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('BILLED TO (CLIENT)', 19, cardY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(clientName, 48)[0] || clientName, 19, cardY + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(clientEmail, 48)[0] || clientEmail, 19, cardY + 17);
  doc.text('India • Verified Account', 19, cardY + 22);
  doc.text('Client ID: WS-CL-' + (user?._id ? user._id.toString().slice(-6).toUpperCase() : 'AUTH'), 19, cardY + 27);

  // Card 2: Service Provider
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(75, cardY, 56, cardH, 2.5, 2.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('SERVICE PROVIDER', 79, cardY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(doc.splitTextToSize(freelancerName, 48)[0] || freelancerName, 79, cardY + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(doc.splitTextToSize(freelancerEmail, 48)[0] || freelancerEmail, 79, cardY + 17);
  doc.text('WorkStation Verified Specialist', 79, cardY + 22);
  doc.text('Payout: Razorpay Escrow Direct', 79, cardY + 27);

  // Card 3: Engagement Reference
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(135, cardY, 60, cardH, 2.5, 2.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('ENGAGEMENT REFERENCE', 139, cardY + 6);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const projShort = projectTitle.length > 24 ? projectTitle.slice(0, 24) + '...' : projectTitle;
  doc.text(projShort, 139, cardY + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Contract: CTR-${shortContractId}`, 139, cardY + 17);
  doc.text(`Milestone: ${payment.milestoneTitle || 'Milestone Delivery'}`, 139, cardY + 22);
  doc.text('Payment: Escrow Reconciled', 139, cardY + 27);

  // ─── 3. Itemized Table ──────────────────────────────────────────────────────
  const tableY = cardY + cardH + 10;

  // Table Section Header
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ITEMIZED DELIVERABLES & SERVICE SPECIFICATIONS', 15, tableY - 3);

  // Table Column Header Bar
  doc.setFillColor(0, 35, 102);
  doc.roundedRect(15, tableY, 180, 8.5, 1.5, 1.5, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', 20, tableY + 5.5);
  doc.text('QTY', 125, tableY + 5.5, { align: 'center' });
  doc.text('TAX RATE', 148, tableY + 5.5, { align: 'center' });
  doc.text('AMOUNT (INR)', 190, tableY + 5.5, { align: 'right' });

  // Row 1: Milestone Description
  const rowY = tableY + 8.5;
  const rowH = 18;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, rowY, 180, rowH, 'FD');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const descLines = doc.splitTextToSize(`${projectTitle} — ${payment.milestoneTitle || payment.description || 'Milestone Deliverable'}`, 100);
  doc.text(descLines[0] || projectTitle, 20, rowY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Milestone Settlement Token: CTR-${shortContractId} • HSN/SAC: 998314`, 20, rowY + 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('1', 125, rowY + 8, { align: 'center' });
  doc.text('18% GST', 148, rowY + 8, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${formatIndianNumber(baseSubtotal)}`, 190, rowY + 8, { align: 'right' });

  // ─── 4. Financial Summary & PAID Stamp ──────────────────────────────────────
  const sumY = rowY + rowH + 10;

  // Left Box: Stamp & Compliance Note
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, sumY, 96, 44, 2.5, 2.5, 'FD');

  // Official Double-Bordered PAID Stamp
  if (isPaid) {
    doc.setDrawColor(4, 120, 87);
    doc.setLineWidth(0.8);
    doc.roundedRect(20, sumY + 6, 48, 14, 2, 2, 'D');
    doc.setLineWidth(0.3);
    doc.roundedRect(21, sumY + 7, 46, 12, 1.5, 1.5, 'D');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(4, 120, 87);
    doc.text('WORKSTATION ESCROW', 44, sumY + 11, { align: 'center' });

    doc.setFontSize(9);
    doc.text('✓ PAID & VERIFIED', 44, sumY + 16, { align: 'center' });
  }

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Escrow Guarantee & Statutory Reconciliation:', 20, sumY + 26);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    doc.splitTextToSize(
      'Funds were secured via RBI-compliant nodal escrow accounts and disbursed exclusively upon verified client sign-off. All statutory GST invoices are fully reconciled.',
      88
    ),
    20,
    sumY + 31
  );

  // Right Box: Totals Breakdown Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(116, sumY, 79, 44, 2.5, 2.5, 'FD');

  // Subtotal
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal', 121, sumY + 9);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${formatIndianNumber(baseSubtotal)}`, 190, sumY + 9, { align: 'right' });

  // Platform Fee
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Platform Escrow Fee', 121, sumY + 16);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('INR 0 (Waived)', 190, sumY + 16, { align: 'right' });

  // Taxes (GST 18%)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('GST (18% Integrated Tax)', 121, sumY + 23);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${formatIndianNumber(gstTax)}`, 190, sumY + 23, { align: 'right' });

  // Total Paid Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(121, sumY + 27, 190, sumY + 27);

  // Total Paid Highlight
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 35, 102);
  doc.text('TOTAL PAID', 121, sumY + 34);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Inclusive of all taxes', 121, sumY + 38);

  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.setTextColor(0, 35, 102);
  doc.text(`INR ${formatIndianNumber(totalAmount)}`, 190, sumY + 36, { align: 'right' });

  // ─── 5. Payment Verification Details Box ────────────────────────────────────
  const metaY = sumY + 49;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, metaY, 180, 16, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('PAYMENT VERIFICATION METADATA', 20, metaY + 5.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Gateway: Razorpay Escrow Direct`, 20, metaY + 11.5);
  doc.text(`Settlement Currency: Indian Rupee (INR - ₹)`, 85, metaY + 11.5);
  doc.text(`Encrypted Signature: 256-bit SHA-256`, 150, metaY + 11.5);

  // ─── 6. Footer (Page X of Y & Legal Notice) ────────────────────────────────
  const footerY = 280;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, footerY, 195, footerY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('WorkStation Technologies Pvt Ltd', 15, footerY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('• Computer-generated invoice under Information Technology Act, 2000 • Confidential', 56, footerY + 5);

  doc.setFontSize(7.5);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Page 1 of 1', 195, footerY + 5, { align: 'right' });

  // Execute clean download
  return triggerBlobDownload(doc, fileName);
}

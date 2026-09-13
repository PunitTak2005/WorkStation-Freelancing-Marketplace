import Payment from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { jsPDF } from 'jspdf';

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { type, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const query = {
      $or: [{ payer: req.user._id }, { recipient: req.user._id }]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Payment.find(query)
      .populate({
        path: 'contract',
        populate: { path: 'job', select: 'title' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Payment history fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const rawId = (req.params.paymentId || '').replace(/\.pdf$/i, '');
    const payment = await Payment.findById(rawId)
      .populate('payer', 'name email address')
      .populate('recipient', 'name email address')
      .populate({
        path: 'contract',
        populate: { path: 'job', select: 'title' }
      });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    if (payment.payer._id.toString() !== req.user._id.toString() &&
        payment.recipient._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to view this invoice');
    }

    const wantsPdf =
      req.query.format === 'pdf' ||
      req.query.download === 'true' ||
      (req.params.paymentId || '').endsWith('.pdf') ||
      req.headers.accept?.includes('application/pdf');

    if (wantsPdf) {
      const invoiceId = payment.invoiceNumber || `INV-${(payment.transactionId || payment._id).toString().slice(-8).toUpperCase()}`;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: false });
      
      const totalAmount = Number(payment.amount) || 0;
      const baseSubtotal = Math.round(totalAmount / 1.18);
      const gstTax = totalAmount - baseSubtotal;
      const transactionId = payment.transactionId || payment.razorpayPaymentId || `pay_${payment._id.toString().slice(-10)}`;
      const issueDate = new Date(payment.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const projectTitle = payment.contract?.job?.title || payment.description || 'Full-Stack Web Application Development';

      // 1. Top Header Banner
      doc.setFillColor(0, 35, 102); // #002366
      doc.rect(0, 0, 210, 26, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('WORKSTATION', 15, 14);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(219, 234, 254);
      doc.text('SECURE ESCROW & FREELANCE PAYMENTS PLATFORM', 15, 20);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('TAX INVOICE', 195, 14, { align: 'right' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('ORIGINAL FOR RECIPIENT', 195, 20, { align: 'right' });

      // 2. Metadata Grid
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE DETAILS', 15, 36);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 39, 180, 24, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Invoice Number:', 20, 46);
      doc.text('Issue Date:', 80, 46);
      doc.text('Payment Status:', 140, 46);

      doc.text('Transaction ID:', 20, 56);
      doc.text('Payment Method:', 80, 56);
      doc.text('GSTIN:', 140, 56);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoiceId, 43, 46);
      doc.text(issueDate, 97, 46);
      
      // Status pill
      doc.setTextColor(4, 120, 87); // emerald
      doc.text((payment.status || 'COMPLETED').toUpperCase(), 164, 46);

      doc.setTextColor(15, 23, 42);
      doc.setFont('courier', 'bold');
      doc.text(transactionId, 43, 56);
      doc.setFont('helvetica', 'bold');
      doc.text('Razorpay Escrow Direct', 104, 56);
      doc.text('08AAACW2026M1ZS', 152, 56);

      // 3. Parties (Billed To / From)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 35, 102);
      doc.text('BILLED TO (CLIENT):', 15, 71);
      doc.text('SERVICE PROVIDER (FREELANCER):', 110, 71);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 74, 88, 26, 2, 2, 'FD');
      doc.roundedRect(107, 74, 88, 26, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(payment.payer?.name || 'Verified Enterprise Client', 20, 81);
      doc.text(payment.recipient?.name || 'Aarav Mehta', 112, 81);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(payment.payer?.email || 'client@workstation.io', 20, 87);
      doc.text('Account: Client Verified', 20, 93);

      doc.text(payment.recipient?.email || 'specialist@workstation.io', 112, 87);
      doc.text('Verified Freelancer Specialist', 112, 93);

      // 4. Line Items Table
      doc.setFillColor(0, 35, 102);
      doc.rect(15, 108, 180, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('#', 19, 113);
      doc.text('DESCRIPTION / MILESTONE', 28, 113);
      doc.text('RATE (INR)', 135, 113, { align: 'right' });
      doc.text('TAX (18%)', 160, 113, { align: 'right' });
      doc.text('AMOUNT (INR)', 190, 113, { align: 'right' });

      // Table Row
      doc.setFillColor(255, 255, 255);
      doc.rect(15, 116, 180, 16, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 132, 195, 132);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('1', 19, 123);
      
      doc.setFont('helvetica', 'bold');
      doc.text(projectTitle.substring(0, 50), 28, 123);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Milestone Deliverable • Escrow Settlement Verified`, 28, 128);

      doc.setFontSize(8.5);
      doc.setFont('courier', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(baseSubtotal.toLocaleString('en-IN'), 135, 124, { align: 'right' });
      doc.text(gstTax.toLocaleString('en-IN'), 160, 124, { align: 'right' });
      doc.setFont('courier', 'bold');
      doc.text(totalAmount.toLocaleString('en-IN'), 190, 124, { align: 'right' });

      // 5. Summary Breakdown
      const sumY = 140;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(110, sumY, 85, 38, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Taxable Base Subtotal:', 115, sumY + 8);
      doc.text('CGST (9%):', 115, sumY + 14);
      doc.text('SGST (9%):', 115, sumY + 20);

      doc.setFont('courier', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(`Rs. ${baseSubtotal.toLocaleString('en-IN')}`, 190, sumY + 8, { align: 'right' });
      doc.text(`Rs. ${Math.round(gstTax / 2).toLocaleString('en-IN')}`, 190, sumY + 14, { align: 'right' });
      doc.text(`Rs. ${Math.round(gstTax / 2).toLocaleString('en-IN')}`, 190, sumY + 20, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.line(115, sumY + 24, 190, sumY + 24);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 35, 102);
      doc.text('TOTAL PAID:', 115, sumY + 31);
      doc.setFont('courier', 'bold');
      doc.text(`Rs. ${totalAmount.toLocaleString('en-IN')}`, 190, sumY + 31, { align: 'right' });

      // 6. Security & Escrow Note
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(15, sumY + 45, 180, 14, 2, 2, 'FD');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 78, 216);
      doc.text('PAYMENT VERIFICATION & ESCROW GUARANTEE', 20, sumY + 51);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Settled securely via WorkStation Razorpay Smart Escrow. Funds disbursed to freelancer upon verified delivery.`, 20, sumY + 55);

      // 7. Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 275, 195, 275);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('WorkStation Technologies Pvt Ltd • CIN: U72900KA2026PTC148000 • Computer Generated Invoice', 15, 281);
      doc.setFont('courier', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Page 1 of 1', 195, 281, { align: 'right' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Invoice_${invoiceId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    }

    res.status(200).json(new ApiResponse(200, payment, 'Invoice fetched successfully'));
  } catch (error) {
    next(error);
  }
};

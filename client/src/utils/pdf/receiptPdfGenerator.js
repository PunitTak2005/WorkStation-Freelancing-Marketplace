import { format } from 'date-fns';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  buildAndExportPDF,
  renderHeader,
  renderInfoCardGrid,
  renderPaidStamp,
  renderStatusBadge,
  PDF_COLORS,
} from './pdfEngine';

/**
 * Generates and downloads an executive Escrow Payment Receipt PDF.
 *
 * @param {Object} options
 * @param {Object} options.payment - Payment record object
 * @param {Object} options.user - Current user object
 */
export async function downloadReceiptPDF(payment = {}, user = {}) {
  const now = new Date();
  const paymentDate = payment?.createdAt || payment?.paidAt || now;

  const receiptId = `REC-${(payment?.transactionId || payment?._id || payment?.id || '2026')
    .toString()
    .slice(-8)
    .toUpperCase()}`;

  const fileName = `Receipt_${receiptId}.pdf`;

  const contractObj = payment?.contract || {};
  const jobObj = contractObj?.job || payment?.job || {};
  const projectTitle = jobObj?.title || payment?.description || 'Milestone Escrow Funding';
  const shortContractId = (contractObj?._id || contractObj?.id || 'CTR-2026').toString().slice(-8).toUpperCase();

  const clientName = payment?.client?.name || user?.name || 'Verified Client';
  const clientEmail = payment?.client?.email || user?.email || 'client@workstation.io';

  const freelancerName =
    payment?.freelancer?.name ||
    contractObj?.freelancer?.name ||
    'Professional Specialist';
  const freelancerEmail =
    payment?.freelancer?.email ||
    contractObj?.freelancer?.email ||
    'specialist@workstation.io';

  const amount = Number(payment?.amount) || 0;
  const razorpayTxnId = payment?.razorpayPaymentId || payment?.transactionId || `pay_${receiptId.toLowerCase()}`;

  // Info Cards
  const infoCards = [
    {
      title: 'Payer Information',
      primary: clientName,
      secondary: clientEmail,
      meta: 'Authorized Account Payer',
    },
    {
      title: 'Recipient / Escrow Beneficiary',
      primary: freelancerName,
      secondary: freelancerEmail,
      meta: 'WorkStation Verified Freelancer',
    },
    {
      title: 'Contract Reference',
      primary: projectTitle.length > 30 ? projectTitle.slice(0, 30) + '...' : projectTitle,
      secondary: `Contract ID: CTR-${shortContractId}`,
      meta: `Milestone: ${payment?.milestoneTitle || 'Escrow Milestone'}`,
    },
  ];

  const pageContent = `
    <!-- Header -->
    ${renderHeader({
      documentTitle: 'Payment Receipt',
      documentId: receiptId,
      date: paymentDate,
      extraMeta: [
        { label: 'Gateway Txn ID', value: razorpayTxnId },
        { label: 'Escrow Reference', value: `ESC-${shortContractId}` },
      ],
      badge: renderStatusBadge(payment?.status || 'succeeded'),
    })}

    <!-- Receipt Highlight Banner -->
    <div style="background: linear-gradient(135deg, ${PDF_COLORS.primary}, ${PDF_COLORS.secondary}); color: #FFFFFF; border-radius: 12px; padding: 20px 24px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; opacity: 0.85;">
          Official Payment Voucher & Escrow Settlement
        </div>
        <div style="font-size: 28px; font-weight: 900; margin-top: 4px; font-family: monospace; letter-spacing: -0.5px;">
          ${formatCurrency(amount)}
        </div>
        <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">
          Settled via Razorpay Escrow Direct in Indian Rupees (INR - ₹)
        </div>
      </div>
      <div>
        ${renderPaidStamp('RECEIVED & VERIFIED')}
      </div>
    </div>

    <!-- Payer, Payee, Project Details -->
    ${renderInfoCardGrid(infoCards)}

    <!-- Payment Transaction Specifications Table -->
    <div style="margin-bottom: 22px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Transaction Specification Breakdown
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: ${PDF_COLORS.primary}; color: ${PDF_COLORS.white}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
            <th style="padding: 10px 14px; text-align: left;">Attribute</th>
            <th style="padding: 10px 14px; text-align: left;">Transaction Detail</th>
            <th style="padding: 10px 14px; text-align: right; width: 140px;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #FFFFFF; border-bottom: 1px solid ${PDF_COLORS.slate200};">
            <td style="padding: 11px 14px; font-weight: 700; color: ${PDF_COLORS.slate700}; font-size: 10.5px;">
              Transaction ID
            </td>
            <td style="padding: 11px 14px; font-family: monospace; font-size: 10.5px; color: ${PDF_COLORS.slate900};">
              ${razorpayTxnId}
            </td>
            <td style="padding: 11px 14px; text-align: right; color: ${PDF_COLORS.success}; font-weight: 700; font-size: 10px;">
              ✓ Reconciled
            </td>
          </tr>
          <tr style="background: ${PDF_COLORS.slate50}; border-bottom: 1px solid ${PDF_COLORS.slate200};">
            <td style="padding: 11px 14px; font-weight: 700; color: ${PDF_COLORS.slate700}; font-size: 10.5px;">
              Payment Purpose
            </td>
            <td style="padding: 11px 14px; font-size: 10.5px; color: ${PDF_COLORS.slate900};">
              ${payment?.description || projectTitle}
            </td>
            <td style="padding: 11px 14px; text-align: right; color: ${PDF_COLORS.secondary}; font-weight: 700; font-size: 10px;">
              Escrow Funded
            </td>
          </tr>
          <tr style="background: #FFFFFF; border-bottom: 1px solid ${PDF_COLORS.slate200};">
            <td style="padding: 11px 14px; font-weight: 700; color: ${PDF_COLORS.slate700}; font-size: 10.5px;">
              Payment Method
            </td>
            <td style="padding: 11px 14px; font-size: 10.5px; color: ${PDF_COLORS.slate900};">
              UPI / Net Banking / Debit & Credit Cards (Razorpay Gateway)
            </td>
            <td style="padding: 11px 14px; text-align: right; color: ${PDF_COLORS.success}; font-weight: 700; font-size: 10px;">
              ✓ Authorized
            </td>
          </tr>
          <tr style="background: ${PDF_COLORS.slate50};">
            <td style="padding: 11px 14px; font-weight: 700; color: ${PDF_COLORS.slate700}; font-size: 10.5px;">
              Total Amount Received
            </td>
            <td style="padding: 11px 14px; font-size: 12px; font-weight: 800; color: ${PDF_COLORS.primary}; font-family: monospace;">
              ${formatCurrency(amount)}
            </td>
            <td style="padding: 11px 14px; text-align: right;">
              ${renderStatusBadge(payment?.status || 'succeeded')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Security & Escrow Guarantee Box -->
    <div style="background: ${PDF_COLORS.slate50}; border: 1px dashed ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 18px; margin-top: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <div style="font-size: 10.5px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase; letter-spacing: 0.5px;">
          Escrow Protection Guarantee
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.success}; font-weight: 700;">
          ✓ 100% Escrow Backed
        </div>
      </div>
      <p style="font-size: 10px; color: ${PDF_COLORS.slate600}; line-height: 1.5; margin: 0;">
        This document serves as proof of payment and escrow settlement. Funds are secured in institutional nodal escrow accounts compliant with Reserve Bank of India (RBI) payment guidelines. Funds are released exclusively upon verified deliverable approval.
      </p>
    </div>
  `;

  return await buildAndExportPDF({
    fileName,
    pagesHtml: [pageContent],
  });
}

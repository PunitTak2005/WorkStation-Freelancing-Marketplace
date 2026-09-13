import { format } from 'date-fns';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  buildAndExportPDF,
  renderHeader,
  renderRunningHeader,
  renderInfoCardGrid,
  renderStatusBadge,
  PDF_COLORS,
} from './pdfEngine';

/**
 * Generates and downloads a multi-page print-ready Payment Statement PDF.
 *
 * @param {Object} options
 * @param {Object} options.user - Current user object
 * @param {Array} options.payments - Array of payment records
 * @param {number} options.totalSpent - Total amount spent or earned
 * @param {number} options.inEscrow - Pending amount in escrow
 * @param {number} options.successfulCount - Count of successful payments
 * @param {string} options.statementPeriod - Selected filter period label
 */
export async function downloadStatementPDF({
  user = {},
  payments = [],
  totalSpent = 0,
  inEscrow = 0,
  successfulCount = 0,
  statementPeriod = 'All Transactions',
}) {
  const isClient = user?.role !== 'freelancer';
  const now = new Date();
  const dateStr = format(now, 'yyyy-MM-dd');
  const fileName = `WorkStation_Payment_Statement_${dateStr}.pdf`;

  // Render 4 Financial Metric Cards
  const summaryCardsHtml = `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
      <!-- Card 1 -->
      <div style="background: ${PDF_COLORS.infoBg}; border: 1px solid ${PDF_COLORS.infoBorder}; border-radius: 10px; padding: 12px 14px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${PDF_COLORS.info}; text-transform: uppercase;">
          ${isClient ? 'Total Spent' : 'Total Earnings'}
        </div>
        <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.primary}; margin-top: 4px; font-family: monospace;">
          ${formatCurrency(totalSpent)}
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.secondary}; margin-top: 2px;">Lifetime Settled</div>
      </div>

      <!-- Card 2 -->
      <div style="background: ${PDF_COLORS.warningBg}; border: 1px solid ${PDF_COLORS.warningBorder}; border-radius: 10px; padding: 12px 14px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${PDF_COLORS.warning}; text-transform: uppercase;">
          In Escrow
        </div>
        <div style="font-size: 16px; font-weight: 900; color: #78350F; margin-top: 4px; font-family: monospace;">
          ${formatCurrency(inEscrow)}
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.warning}; margin-top: 2px;">Pending Release</div>
      </div>

      <!-- Card 3 -->
      <div style="background: ${PDF_COLORS.successBg}; border: 1px solid ${PDF_COLORS.successBorder}; border-radius: 10px; padding: 12px 14px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${PDF_COLORS.success}; text-transform: uppercase;">
          Successful
        </div>
        <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.success}; margin-top: 4px; font-family: monospace;">
          ${successfulCount}
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.success}; margin-top: 2px;">Completed Orders</div>
      </div>

      <!-- Card 4 -->
      <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 12px 14px;">
        <div style="font-size: 9.5px; font-weight: 800; color: ${PDF_COLORS.slate600}; text-transform: uppercase;">
          Transactions
        </div>
        <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.slate900}; margin-top: 4px; font-family: monospace;">
          ${payments.length}
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.slate500}; margin-top: 2px;">Filtered Records</div>
      </div>
    </div>
  `;

  // Helper to render a single transaction row
  const renderRow = (p, idx) => {
    const isEven = idx % 2 === 0;
    const bg = isEven ? '#FFFFFF' : PDF_COLORS.slate50;
    const shortContractId = (p.contract?._id || p.contract?.id || p.contract || '6AA161A6').toString().slice(-8).toUpperCase();
    const projectTitle = p.contract?.job?.title || p.description || 'Milestone Delivery';
    const txnId = p.transactionId || p.razorpayPaymentId || (p._id ? p._id.toString().slice(-8).toUpperCase() : 'SETTLED');
    const amountSign = isClient ? '-' : '+';
    const amountColor = isClient ? '#DC2626' : p.type === 'credit' ? '#059669' : '#DC2626';

    return `
      <tr style="background-color: ${bg}; border-bottom: 1px solid ${PDF_COLORS.slate200};">
        <td style="padding: 10px 12px; font-weight: 500; color: ${PDF_COLORS.slate600}; white-space: nowrap; font-size: 10px;">
          ${formatDate(p.createdAt || new Date())}
        </td>
        <td style="padding: 10px 12px; max-width: 220px; word-break: break-word;">
          <div style="font-weight: 700; color: ${PDF_COLORS.slate900}; font-size: 11px;">
            ${p.description || 'Milestone Escrow Payment'}
          </div>
          <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; margin-top: 2px; font-family: monospace;">
            Txn: ${txnId}
          </div>
        </td>
        <td style="padding: 10px 12px; max-width: 180px; word-break: break-word;">
          <div style="font-weight: 600; color: ${PDF_COLORS.slate700}; font-size: 10.5px;">
            ${projectTitle.length > 28 ? projectTitle.slice(0, 28) + '...' : projectTitle}
          </div>
          <div style="font-family: monospace; font-size: 9.5px; color: ${PDF_COLORS.slate500}; margin-top: 2px;">
            ID: CTR-${shortContractId}
          </div>
        </td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 800; font-family: monospace; font-size: 12px; color: ${amountColor}; white-space: nowrap;">
          ${amountSign}${formatCurrency(p.amount)}
        </td>
        <td style="padding: 10px 12px; text-align: center; white-space: nowrap;">
          ${renderStatusBadge(p.status || 'succeeded')}
        </td>
      </tr>
    `;
  };

  // Helper to render table wrapper
  const renderTableWrapper = (rowsHtml, countText = '') => `
    <div style="margin-bottom: 12px;">
      <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px;">
          Transaction History Log
        </div>
        ${countText ? `<div style="font-size: 10px; color: ${PDF_COLORS.slate500};">${countText}</div>` : ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: ${PDF_COLORS.primary}; color: ${PDF_COLORS.white}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
            <th style="padding: 9px 12px; text-align: left; width: 85px;">Date</th>
            <th style="padding: 9px 12px; text-align: left;">Description</th>
            <th style="padding: 9px 12px; text-align: left;">Contract Ref</th>
            <th style="padding: 9px 12px; text-align: right; width: 110px;">Amount (INR)</th>
            <th style="padding: 9px 12px; text-align: center; width: 95px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;

  // Info Cards for Account & Settlement
  const infoCards = [
    {
      title: 'Account Holder',
      primary: user?.name || 'Rajesh Sharma',
      secondary: user?.email || 'client@workstation.io',
      meta: `Role: ${isClient ? 'Verified Client' : 'Freelancer Specialist'}`,
    },
    {
      title: 'Settlement Account',
      primary: 'Razorpay Escrow Direct',
      secondary: 'Currency: Indian Rupee (INR - ₹)',
      meta: 'RBI Mandated Escrow Compliance',
    },
    {
      title: 'Statement Scope',
      primary: statementPeriod,
      secondary: `Total Records: ${payments.length}`,
      meta: 'All transactions verified & settled',
    },
  ];

  // Smart Page Budgeting:
  // Page 1 has: Full Header + Info Cards + 4 Summary Metric Cards + Table.
  // Space allows exactly 6 rows on Page 1 without overflowing margins.
  // Subsequent pages have: Running Header + Table.
  // Space allows up to 13 rows on subsequent pages.
  const PAGE1_ROW_LIMIT = 6;
  const SUBSEQUENT_PAGE_ROW_LIMIT = 13;

  const pagesHtml = [];

  if (payments.length === 0) {
    // Empty statement
    const emptyRowHtml = `
      <tr>
        <td colspan="5" style="padding: 36px; text-align: center; color: ${PDF_COLORS.slate500}; font-size: 12px;">
          No transactions recorded for the selected period (${statementPeriod}).
        </td>
      </tr>
    `;
    const page1Content = `
      ${renderHeader({
        documentTitle: 'Payment Statement',
        documentId: `STM-${dateStr}`,
        date: now,
        extraMeta: [{ label: 'Period', value: statementPeriod }],
      })}
      ${renderInfoCardGrid(infoCards)}
      ${summaryCardsHtml}
      ${renderTableWrapper(emptyRowHtml)}
    `;
    pagesHtml.push(page1Content);
  } else {
    // Page 1
    const page1Rows = payments.slice(0, PAGE1_ROW_LIMIT);
    const page1RowsHtml = page1Rows.map((p, idx) => renderRow(p, idx)).join('');
    const page1CountText = `Showing records 1 - ${page1Rows.length} of ${payments.length}`;

    const page1Content = `
      ${renderHeader({
        documentTitle: 'Payment Statement',
        documentId: `STM-${dateStr}`,
        date: now,
        extraMeta: [{ label: 'Period', value: statementPeriod }],
      })}
      ${renderInfoCardGrid(infoCards)}
      ${summaryCardsHtml}
      ${renderTableWrapper(page1RowsHtml, page1CountText)}
    `;
    pagesHtml.push(page1Content);

    // Remaining Pages
    let currentIdx = PAGE1_ROW_LIMIT;
    while (currentIdx < payments.length) {
      const nextPageRows = payments.slice(currentIdx, currentIdx + SUBSEQUENT_PAGE_ROW_LIMIT);
      const nextPageRowsHtml = nextPageRows.map((p, idx) => renderRow(p, idx)).join('');
      const countText = `Showing records ${currentIdx + 1} - ${currentIdx + nextPageRows.length} of ${payments.length}`;

      const nextPageContent = `
        ${renderRunningHeader({
          documentTitle: 'Payment Statement',
          documentId: `STM-${dateStr}`,
        })}
        <div style="margin-bottom: 12px; font-size: 11px; color: ${PDF_COLORS.slate600};">
          Statement Period: <strong style="color: ${PDF_COLORS.primary};">${statementPeriod}</strong> • Account: <strong>${user?.name || 'User'}</strong>
        </div>
        ${renderTableWrapper(nextPageRowsHtml, countText)}
      `;

      pagesHtml.push(nextPageContent);
      currentIdx += SUBSEQUENT_PAGE_ROW_LIMIT;
    }
  }

  return await buildAndExportPDF({
    fileName,
    pagesHtml,
  });
}

// Export statement alias for backwards compatibility
export const exportStatementToPDF = downloadStatementPDF;

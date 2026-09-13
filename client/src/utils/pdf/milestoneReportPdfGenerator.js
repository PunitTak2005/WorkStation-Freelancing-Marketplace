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
 * Generates and downloads a Milestone Completion & Escrow Release Report PDF.
 *
 * @param {Object} options
 * @param {Object} options.contract - Contract object
 * @param {Object} options.milestone - Milestone object
 * @param {Object} options.user - Current user object
 */
export async function downloadMilestoneReportPDF(contract = {}, milestone = {}, user = {}) {
  const now = new Date();
  const contractId = (contract?._id || contract?.id || 'CTR-2026').toString();
  const shortContractId = contractId.slice(-8).toUpperCase();
  const milestoneId = (milestone?._id || milestone?.id || 'MLS-2026').toString().slice(-8).toUpperCase();
  const reportId = `MSR-${milestoneId}`;
  const fileName = `WorkStation_Milestone_Report_${reportId}.pdf`;

  const projectTitle = contract?.job?.title || 'Contract Deliverable';
  const clientName = contract?.client?.name || user?.name || 'Verified Client';
  const clientEmail = contract?.client?.email || user?.email || 'client@workstation.io';

  const freelancerName = contract?.freelancer?.name || 'Assigned Specialist';
  const freelancerEmail = contract?.freelancer?.email || 'specialist@workstation.io';

  const milestoneAmount = Number(milestone?.amount) || 0;
  const platformFee = Math.round(milestoneAmount * 0.1);
  const netEarnings = milestoneAmount - platformFee;

  const status = milestone?.status || 'approved';
  const isApproved = status === 'approved' || status === 'completed';

  const infoCards = [
    {
      title: 'Engaging Client',
      primary: clientName,
      secondary: clientEmail,
      meta: 'Authorized Deliverable Approver',
    },
    {
      title: 'Executing Freelancer',
      primary: freelancerName,
      secondary: freelancerEmail,
      meta: 'WorkStation Verified Specialist',
    },
    {
      title: 'Contract Association',
      primary: projectTitle.length > 28 ? projectTitle.slice(0, 28) + '...' : projectTitle,
      secondary: `Contract Ref: CTR-${shortContractId}`,
      meta: `Milestone Ref: #${milestoneId}`,
    },
  ];

  const pageContent = `
    <!-- Header -->
    ${renderHeader({
      documentTitle: 'Milestone Report',
      documentId: reportId,
      date: milestone?.updatedAt || now,
      extraMeta: [
        { label: 'Settlement Status', value: isApproved ? 'FUNDS RELEASED' : 'UNDER REVIEW' },
        { label: 'Milestone Value', value: formatCurrency(milestoneAmount) },
      ],
      badge: renderStatusBadge(status),
    })}

    <!-- Milestone Highlight Banner -->
    <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 12px; padding: 18px 22px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: ${PDF_COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.6px;">
          Milestone Verification & Sign-off
        </div>
        <div style="font-size: 18px; font-weight: 900; color: ${PDF_COLORS.slate900}; margin-top: 4px;">
          ${milestone?.title || 'Milestone Phase Deliverable'}
        </div>
        <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 2px;">
          Target Due Date: ${milestone?.dueDate ? formatDate(milestone.dueDate) : 'Deliverable Complete'}
        </div>
      </div>
      <div>
        ${isApproved ? renderPaidStamp('ESCROW RELEASED') : renderStatusBadge(status)}
      </div>
    </div>

    <!-- Info Cards -->
    ${renderInfoCardGrid(infoCards)}

    <!-- Deliverable Submission Description -->
    <div style="background: #FFFFFF; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
        Milestone Deliverables & Scope Completed
      </div>
      <div style="font-size: 11px; color: ${PDF_COLORS.slate700}; line-height: 1.6; word-break: break-word;">
        ${
          milestone?.description ||
          'All specified architectural requirements, functional source code, system documentation, and unit tests for this milestone phase have been successfully completed, inspected, and approved under WorkStation Escrow guidelines.'
        }
      </div>
    </div>

    <!-- Settlement Breakdown Table -->
    <div style="margin-bottom: 20px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Financial Escrow Release Breakdown
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: ${PDF_COLORS.primary}; color: ${PDF_COLORS.white}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
            <th style="padding: 10px 14px; text-align: left;">Financial Item</th>
            <th style="padding: 10px 14px; text-align: left;">Terms & Notes</th>
            <th style="padding: 10px 14px; text-align: right; width: 140px;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #FFFFFF; border-bottom: 1px solid ${PDF_COLORS.slate200};">
            <td style="padding: 11px 14px; font-weight: 700; color: ${PDF_COLORS.slate900}; font-size: 11px;">
              Gross Milestone Escrow Value
            </td>
            <td style="padding: 11px 14px; color: ${PDF_COLORS.slate600}; font-size: 10px;">
              Funded by Client into Nodal Escrow
            </td>
            <td style="padding: 11px 14px; text-align: right; font-weight: 800; font-family: monospace; font-size: 12.5px; color: ${PDF_COLORS.slate900};">
              ${formatCurrency(milestoneAmount)}
            </td>
          </tr>
          <tr style="background: ${PDF_COLORS.slate50}; border-bottom: 1px solid ${PDF_COLORS.slate200};">
            <td style="padding: 11px 14px; font-weight: 600; color: ${PDF_COLORS.slate700}; font-size: 11px;">
              Platform Escrow & Matching Fee (10%)
            </td>
            <td style="padding: 11px 14px; color: ${PDF_COLORS.slate600}; font-size: 10px;">
              Standard Marketplace Service Fee
            </td>
            <td style="padding: 11px 14px; text-align: right; font-weight: 700; font-family: monospace; font-size: 12px; color: #DC2626;">
              -${formatCurrency(platformFee)}
            </td>
          </tr>
          <tr style="background: #FFFFFF;">
            <td style="padding: 12px 14px; font-weight: 800; color: ${PDF_COLORS.primary}; font-size: 12px;">
              Net Released Payout
            </td>
            <td style="padding: 12px 14px; color: ${PDF_COLORS.success}; font-weight: 600; font-size: 10.5px;">
              ✓ Disbursed to Specialist Account
            </td>
            <td style="padding: 12px 14px; text-align: right; font-weight: 900; font-family: monospace; font-size: 14px; color: ${PDF_COLORS.success};">
              ${formatCurrency(netEarnings)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Official Approval Signature Confirmation -->
    <div style="background: ${PDF_COLORS.slate50}; border: 1px dashed ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 18px; margin-top: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 10.5px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase;">
            Deliverable Approval Confirmation
          </div>
          <div style="font-size: 10px; color: ${PDF_COLORS.slate600}; margin-top: 2px;">
            Authorized by: <strong>${clientName}</strong> • Escrow Funds Transferred to <strong>${freelancerName}</strong>
          </div>
        </div>
        <div style="font-size: 10px; font-weight: 800; color: ${PDF_COLORS.success}; font-family: monospace;">
          AUTH-ESCROW-${milestoneId}
        </div>
      </div>
    </div>
  `;

  return await buildAndExportPDF({
    fileName,
    pagesHtml: [pageContent],
  });
}

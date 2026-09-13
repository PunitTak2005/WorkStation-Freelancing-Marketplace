import { format } from 'date-fns';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  buildAndExportPDF,
  renderHeader,
  renderRunningHeader,
  renderInfoCardGrid,
  renderStatusBadge,
  renderSignatureSection,
  PDF_COLORS,
} from './pdfEngine';

/**
 * Generates and downloads a Master Freelance Services Contract & Escrow Agreement PDF.
 *
 * @param {Object} options
 * @param {Object} options.contract - Contract document object with job, client, freelancer, milestones
 * @param {Object} options.user - Current user object
 */
export async function downloadContractPDF(contract = {}, user = {}) {
  const now = new Date();
  const contractId = (contract?._id || contract?.id || 'CTR-2026').toString();
  const shortId = contractId.slice(-8).toUpperCase();
  const effectiveDate = contract?.createdAt ? formatDate(contract.createdAt) : formatDate(now);
  const fileName = `WorkStation_Contract_Agreement_${shortId}.pdf`;

  const job = contract?.job || {};
  const projectTitle = job?.title || 'Professional Freelance Engagement';
  const projectDescription =
    job?.description ||
    contract?.description ||
    'Full lifecycle digital project execution including system design, implementation, milestone quality testing, code delivery, and deployment verification under WorkStation Escrow terms.';

  const client = contract?.client || {};
  const clientName = client?.name || (user?.role === 'client' ? user?.name : 'Verified Enterprise Client');
  const clientEmail = client?.email || (user?.role === 'client' ? user?.email : 'client@workstation.io');

  const freelancer = contract?.freelancer || {};
  const freelancerName = freelancer?.name || (user?.role === 'freelancer' ? user?.name : 'Senior Specialist');
  const freelancerEmail = freelancer?.email || (user?.role === 'freelancer' ? user?.email : 'specialist@workstation.io');

  const totalBudget = Number(contract?.totalAmount) || 0;
  const milestones = Array.isArray(contract?.milestones) ? contract.milestones : [];

  // Info Cards: Parties Involved
  const partyCards = [
    {
      title: 'Party 1: Client (Engager)',
      primary: clientName,
      secondary: clientEmail,
      meta: 'India • Authorized Account Holder',
    },
    {
      title: 'Party 2: Freelancer (Specialist)',
      primary: freelancerName,
      secondary: freelancerEmail,
      meta: 'WorkStation Verified Pro Specialist',
    },
    {
      title: 'Escrow Intermediary',
      primary: 'WorkStation Escrow Services',
      secondary: 'GSTIN: 08AAACW2026M1ZS',
      meta: 'RBI Mandated Milestone Nodal Escrow',
    },
  ];

  // Milestone Rows for Page 2
  const milestoneRowsHtml =
    milestones.length > 0
      ? milestones
          .map(
            (m, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#FFFFFF' : PDF_COLORS.slate50}; border-bottom: 1px solid ${PDF_COLORS.slate200};">
          <td style="padding: 10px 12px; font-weight: 700; color: ${PDF_COLORS.slate900}; font-size: 11px;">
            <div>${m.title || `Milestone Phase ${idx + 1}`}</div>
            ${
              m.description
                ? `<div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; margin-top: 2px; font-weight: 400; line-height: 1.35;">${m.description}</div>`
                : ''
            }
          </td>
          <td style="padding: 10px 12px; text-align: center; color: ${PDF_COLORS.slate600}; font-size: 10px; white-space: nowrap;">
            ${m.dueDate ? formatDate(m.dueDate) : 'Deliverable Bound'}
          </td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; font-family: monospace; font-size: 12px; color: ${PDF_COLORS.primary}; white-space: nowrap;">
            ${formatCurrency(m.amount)}
          </td>
          <td style="padding: 10px 12px; text-align: center; white-space: nowrap;">
            ${renderStatusBadge(m.status || 'pending')}
          </td>
        </tr>
      `
          )
          .join('')
      : `
      <tr>
        <td style="padding: 12px 14px; font-weight: 700; color: ${PDF_COLORS.slate900}; font-size: 11px;">
          Phase 1: Project Deliverables & Final Handover
        </td>
        <td style="padding: 12px 14px; text-align: center; color: ${PDF_COLORS.slate600}; font-size: 10px;">
          Upon Completion
        </td>
        <td style="padding: 12px 14px; text-align: right; font-weight: 800; font-family: monospace; font-size: 12px; color: ${PDF_COLORS.primary};">
          ${formatCurrency(totalBudget)}
        </td>
        <td style="padding: 12px 14px; text-align: center;">
          ${renderStatusBadge(contract?.status || 'active')}
        </td>
      </tr>
    `;

  // Page 1: Agreement Header, Parties, Engagement Overview, Scope of Work, Financial Terms
  const page1Content = `
    <!-- Header -->
    ${renderHeader({
      documentTitle: 'Services Agreement',
      documentId: `CTR-${shortId}`,
      date: effectiveDate,
      extraMeta: [
        { label: 'Contract Status', value: (contract?.status || 'Active').toUpperCase() },
        { label: 'Total Value', value: formatCurrency(totalBudget) },
      ],
      badge: renderStatusBadge(contract?.status || 'active'),
    })}

    <!-- Parties Involved -->
    <div style="margin-bottom: 6px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Parties to the Agreement
      </div>
      ${renderInfoCardGrid(partyCards)}
    </div>

    <!-- Project Scope & Deliverables Card -->
    <div style="background: #FFFFFF; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 16px 20px; margin-bottom: 18px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">
        Project Title & Engagement Scope
      </div>
      <div style="font-size: 15px; font-weight: 800; color: ${PDF_COLORS.slate900}; line-height: 1.3; margin-bottom: 8px;">
        ${projectTitle}
      </div>
      <div style="font-size: 10.5px; color: ${PDF_COLORS.slate700}; line-height: 1.6; word-break: break-word;">
        ${projectDescription}
      </div>
    </div>

    <!-- Financial Terms & Escrow Protection Summary -->
    <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 18px; margin-bottom: 18px;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Commercial Terms & Escrow Governance
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
        <div>
          <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Agreed Contract Value</div>
          <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.primary}; font-family: monospace; margin-top: 2px;">
            ${formatCurrency(totalBudget)}
          </div>
        </div>
        <div>
          <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Amount in Escrow</div>
          <div style="font-size: 16px; font-weight: 900; color: ${PDF_COLORS.secondary}; font-family: monospace; margin-top: 2px;">
            ${formatCurrency(contract?.amountInEscrow || totalBudget)}
          </div>
        </div>
        <div>
          <div style="font-size: 9.5px; color: ${PDF_COLORS.slate500}; font-weight: 700; text-transform: uppercase;">Escrow Status</div>
          <div style="font-size: 14px; font-weight: 800; color: ${PDF_COLORS.success}; margin-top: 4px;">
            ● ${contract?.escrowStatus ? contract.escrowStatus.toUpperCase() : 'FUNDED & SECURED'}
          </div>
        </div>
      </div>
    </div>

    <!-- Statutory Platform Note -->
    <div style="margin-top: auto; font-size: 9.5px; color: ${PDF_COLORS.slate500}; line-height: 1.5; background: #F8FAFC; border: 1px dashed ${PDF_COLORS.slate200}; border-radius: 8px; padding: 10px 14px;">
      <strong>WorkStation Legal Framework:</strong> This contract constitutes a legally binding agreement under the Indian Contract Act, 1872 and Information Technology Act, 2000. All milestone funding is deposited into verified escrow before commencement. See Page 2 for detailed milestone schedule and digital signature execution.
    </div>
  `;

  // Page 2: Milestone Schedule, Legal Covenants, and Dual Signature Blocks
  const page2Content = `
    <!-- Running Header -->
    ${renderRunningHeader({
      documentTitle: 'Master Freelance Services Agreement',
      documentId: `CTR-${shortId}`,
    })}

    <!-- Milestone Deliverables Table -->
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px;">
          Milestone Delivery & Disbursement Schedule
        </div>
        <div style="font-size: 10px; color: ${PDF_COLORS.slate500};">
          ${milestones.length > 0 ? `${milestones.length} Defined Milestones` : 'Single Phase Delivery'}
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: ${PDF_COLORS.primary}; color: ${PDF_COLORS.white}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
            <th style="padding: 9px 12px; text-align: left;">Milestone / Deliverable</th>
            <th style="padding: 9px 12px; text-align: center; width: 100px;">Target Date</th>
            <th style="padding: 9px 12px; text-align: right; width: 110px;">Amount (INR)</th>
            <th style="padding: 9px 12px; text-align: center; width: 95px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${milestoneRowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Core Legal Covenants -->
    <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-size: 10.5px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Standard Terms & Conditions
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 9.5px; color: ${PDF_COLORS.slate600}; line-height: 1.5;">
        <div>
          <strong style="color: ${PDF_COLORS.slate800};">1. Intellectual Property Transfer:</strong>
          Upon full release of milestone escrow funds, all intellectual property, source code, designs, and proprietary materials are irreversibly transferred to the Client.
        </div>
        <div>
          <strong style="color: ${PDF_COLORS.slate800};">2. Confidentiality & Non-Disclosure:</strong>
          Both parties agree to treat all business specifications, proprietary datasets, and communications exchanged via WorkStation as strictly confidential.
        </div>
        <div>
          <strong style="color: ${PDF_COLORS.slate800};">3. Escrow Settlement:</strong>
          Funds are held in secure escrow. The Client must inspect deliverables and approve within 14 days or request revisions with clear criteria.
        </div>
        <div>
          <strong style="color: ${PDF_COLORS.slate800};">4. Dispute Resolution:</strong>
          Disputes are mediated by WorkStation Arbitration under Indian law. Arbitration findings shall be final and binding on both parties.
        </div>
      </div>
    </div>

    <!-- Dual Signature Section -->
    <div style="margin-top: auto;">
      <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.slate900}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
        Execution & Acceptance
      </div>
      ${renderSignatureSection({
        clientName,
        freelancerName,
        contractId,
      })}
    </div>
  `;

  return await buildAndExportPDF({
    fileName,
    pagesHtml: [page1Content, page2Content],
  });
}

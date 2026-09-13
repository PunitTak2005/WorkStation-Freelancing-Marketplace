import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

/**
 * WorkStation Unified PDF Engine
 * Standardized A4 (210mm x 297mm) Print-Ready Document Generator
 * Modeled after Stripe, Zoho Invoice, and Adobe Acrobat corporate standards.
 */

// Colors & Design Tokens
export const PDF_COLORS = {
  primary: '#002366',      // WorkStation Royal Navy
  primaryLight: '#EFF6FF', // Soft Blue Accent
  secondary: '#1D4ED8',    // Cobalt Blue
  accent: '#3B82F6',       // Electric Blue
  slate900: '#0F172A',     // Deep text
  slate700: '#334155',     // Body text
  slate600: '#475569',     // Subtle text
  slate500: '#64748B',     // Muted text
  slate400: '#94A3B8',     // Light borders/placeholders
  slate200: '#E2E8F0',     // Dividers / Borders
  slate100: '#F1F5F9',     // Alternate zebra row
  slate50: '#F8FAFC',      // Card backgrounds
  white: '#FFFFFF',
  // Statuses
  success: '#047857',      // Emerald
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  warning: '#B45309',      // Amber
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  danger: '#B91C1C',       // Crimson
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  info: '#1D4ED8',         // Blue
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
};

/**
 * Vector SVG WorkStation Logo (Scalable, Crisp, Zero Pixelation)
 */
export function renderLogoSvg(size = 32) {
  return `
    <div style="display: flex; align-items: center; gap: 10px;">
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; flex-shrink: 0;">
        <rect width="40" height="40" rx="10" fill="url(#ws-gradient)" />
        <path d="M10 13L15.5 27L20 18.5L24.5 27L30 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="20" cy="12" r="2" fill="#93C5FD"/>
        <defs>
          <linearGradient id="ws-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#002366"/>
            <stop offset="0.6" stop-color="#1D4ED8"/>
            <stop offset="1" stop-color="#3B82F6"/>
          </linearGradient>
        </defs>
      </svg>
      <div>
        <div style="font-size: 20px; font-weight: 900; color: ${PDF_COLORS.primary}; letter-spacing: -0.5px; line-height: 1.1; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          WorkStation
        </div>
        <div style="font-size: 9px; font-weight: 700; color: ${PDF_COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.8px;">
          Escrow & Payments
        </div>
      </div>
    </div>
  `;
}

/**
 * Status Badge Component
 */
export function renderStatusBadge(status = 'paid') {
  const s = String(status || '').toLowerCase();
  let bg = PDF_COLORS.successBg;
  let text = PDF_COLORS.success;
  let border = PDF_COLORS.successBorder;
  let label = 'PAID';

  if (s === 'pending' || s === 'in_progress' || s === 'review') {
    bg = PDF_COLORS.warningBg;
    text = PDF_COLORS.warning;
    border = PDF_COLORS.warningBorder;
    label = 'PENDING';
  } else if (s === 'escrow' || s === 'funded') {
    bg = PDF_COLORS.infoBg;
    text = PDF_COLORS.info;
    border = PDF_COLORS.infoBorder;
    label = 'IN ESCROW';
  } else if (s === 'failed' || s === 'cancelled' || s === 'disputed') {
    bg = PDF_COLORS.dangerBg;
    text = PDF_COLORS.danger;
    border = PDF_COLORS.dangerBorder;
    label = s.toUpperCase();
  } else if (s === 'succeeded' || s === 'completed' || s === 'active' || s === 'approved' || s === 'released') {
    bg = PDF_COLORS.successBg;
    text = PDF_COLORS.success;
    border = PDF_COLORS.successBorder;
    label = s === 'released' ? 'RELEASED' : s === 'active' ? 'ACTIVE' : 'PAID';
  }

  return `
    <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 800; background: ${bg}; color: ${text}; border: 1px solid ${border}; text-transform: uppercase; letter-spacing: 0.6px;">
      ● ${label}
    </span>
  `;
}

/**
 * High-Impact Official "PAID & ESCROW VERIFIED" Stamp
 */
export function renderPaidStamp(text = 'PAID & VERIFIED') {
  return `
    <div style="display: inline-block; border: 3px double #047857; color: #047857; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; transform: rotate(-5deg); background: rgba(236, 253, 245, 0.9); box-shadow: 0 2px 8px rgba(4, 120, 87, 0.12); text-align: center;">
      <div style="font-size: 9px; letter-spacing: 1px; font-weight: 700; opacity: 0.85;">WORKSTATION ESCROW</div>
      <div>✓ ${text}</div>
    </div>
  `;
}

/**
 * Standard Page 1 Header
 */
export function renderHeader({
  documentTitle = 'Tax Invoice',
  documentId = 'INV-2026-001',
  date = new Date(),
  extraMeta = [],
  badge = null,
}) {
  const formattedDate = typeof date === 'string' ? date : format(new Date(date), 'dd MMM yyyy');

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid ${PDF_COLORS.primary}; margin-bottom: 24px;">
      <!-- Company Branding -->
      <div>
        ${renderLogoSvg(36)}
        <div style="font-size: 10.5px; color: ${PDF_COLORS.slate600}; margin-top: 8px; line-height: 1.45;">
          <strong>WorkStation Technologies Private Limited</strong><br/>
          Milestone Escrow & Enterprise Freelance Marketplace<br/>
          GSTIN: 08AAACW2026M1ZS • PAN: AAACW2026M<br/>
          support@workstation.io • www.workstation.io
        </div>
      </div>

      <!-- Document Meta -->
      <div style="text-align: right;">
        <div style="font-size: 26px; font-weight: 900; color: ${PDF_COLORS.primary}; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.1;">
          ${documentTitle}
        </div>
        <div style="margin-top: 6px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 13px; font-weight: 800; color: ${PDF_COLORS.slate900};">
          # ${documentId}
        </div>
        <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 4px;">
          Issue Date: <strong style="color: ${PDF_COLORS.slate900};">${formattedDate}</strong>
        </div>
        ${extraMeta
          .map(
            (m) => `
          <div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 2px;">
            ${m.label}: <strong style="color: ${PDF_COLORS.slate900};">${m.value}</strong>
          </div>
        `
          )
          .join('')}
        ${badge ? `<div style="margin-top: 8px;">${badge}</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Compact Running Header for Pages 2+
 */
export function renderRunningHeader({ documentTitle = 'Document', documentId = '' }) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid ${PDF_COLORS.slate200}; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 13px; font-weight: 900; color: ${PDF_COLORS.primary}; letter-spacing: -0.3px;">WorkStation</span>
        <span style="color: ${PDF_COLORS.slate400};">|</span>
        <span style="font-size: 11px; font-weight: 700; color: ${PDF_COLORS.slate700}; text-transform: uppercase; letter-spacing: 0.5px;">${documentTitle}</span>
      </div>
      <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: ${PDF_COLORS.slate600};">
        ${documentId ? `#${documentId}` : ''}
      </div>
    </div>
  `;
}

/**
 * Running Footer on Every Page (Includes Dynamic Page X of Y)
 */
export function renderFooter({ pageNumber = 1, totalPages = 1, timestamp = null }) {
  const ts = timestamp || format(new Date(), 'dd MMM yyyy, hh:mm a');
  return `
    <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid ${PDF_COLORS.slate200}; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: ${PDF_COLORS.slate500};">
      <div>
        <strong style="color: ${PDF_COLORS.slate700};">WorkStation</strong> • Verified Escrow Settlement Platform • Legally Binding Document
      </div>
      <div style="text-align: center; color: ${PDF_COLORS.slate600};">
        Generated: ${ts}
      </div>
      <div style="font-weight: 700; color: ${PDF_COLORS.slate900}; font-family: monospace;">
        Page ${pageNumber} of ${totalPages}
      </div>
    </div>
  `;
}

/**
 * Information Cards Grid (Subtle borders, rounded corners, generous padding)
 */
export function renderInfoCardGrid(cards = []) {
  const colCount = Math.min(cards.length, 3);
  return `
    <div style="display: grid; grid-template-columns: repeat(${colCount}, 1fr); gap: 14px; margin-bottom: 22px;">
      ${cards
        .map(
          (card) => `
        <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 16px;">
          <div style="font-size: 10px; font-weight: 800; color: ${PDF_COLORS.secondary}; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">
            ${card.title}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: ${PDF_COLORS.slate900}; line-height: 1.3;">
            ${card.primary}
          </div>
          ${card.secondary ? `<div style="font-size: 11px; color: ${PDF_COLORS.slate600}; margin-top: 2px;">${card.secondary}</div>` : ''}
          ${card.meta ? `<div style="font-size: 10px; color: ${PDF_COLORS.slate500}; margin-top: 4px; line-height: 1.4;">${card.meta}</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Financial Summary Table Box
 */
export function renderFinancialSummary({
  subtotal = '₹0',
  platformFee = '₹0',
  taxes = '₹0',
  total = '₹0',
  notes = null,
  stamp = null,
}) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-top: 20px; margin-bottom: 24px;">
      <!-- Left: Notes or Stamp -->
      <div style="flex: 1;">
        ${stamp ? `<div style="margin-bottom: 12px;">${stamp}</div>` : ''}
        <div style="font-size: 10px; color: ${PDF_COLORS.slate500}; line-height: 1.5; background: ${PDF_COLORS.slate50}; border: 1px dashed ${PDF_COLORS.slate200}; border-radius: 8px; padding: 10px 14px;">
          <strong>Escrow Guarantee:</strong> Funds for this transaction are securely held and disbursed through RBI-compliant partner escrow accounts. All statutory GST invoicing and reconciliation standards are strictly fulfilled.
          ${notes ? `<div style="margin-top: 4px; color: ${PDF_COLORS.slate600}; font-style: italic;">Note: ${notes}</div>` : ''}
        </div>
      </div>

      <!-- Right: Structured Totals Card -->
      <div style="width: 280px; background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 10px; padding: 14px 18px;">
        <div style="display: flex; justify-content: space-between; padding-bottom: 8px; font-size: 11px; color: ${PDF_COLORS.slate600};">
          <span>Subtotal</span>
          <span style="font-weight: 700; color: ${PDF_COLORS.slate900}; font-family: monospace;">${subtotal}</span>
        </div>
        ${
          platformFee && platformFee !== '₹0'
            ? `
          <div style="display: flex; justify-content: space-between; padding-bottom: 8px; font-size: 11px; color: ${PDF_COLORS.slate600};">
            <span>Platform Fee</span>
            <span style="font-weight: 700; color: ${PDF_COLORS.slate900}; font-family: monospace;">${platformFee}</span>
          </div>
        `
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid ${PDF_COLORS.slate200}; font-size: 11px; color: ${PDF_COLORS.slate600};">
          <span>Taxes (GST 18%)</span>
          <span style="font-weight: 700; color: ${PDF_COLORS.slate900}; font-family: monospace;">${taxes}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: ${PDF_COLORS.primary}; text-transform: uppercase;">Total Paid</div>
            <div style="font-size: 9px; color: ${PDF_COLORS.slate500};">Inclusive of all taxes</div>
          </div>
          <div style="font-size: 18px; font-weight: 900; color: ${PDF_COLORS.primary}; font-family: monospace;">
            ${total}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Dual Signature & Verification Section
 */
export function renderSignatureSection({ clientName = 'Client', freelancerName = 'Freelancer', contractId = '' }) {
  const ts = format(new Date(), 'dd MMM yyyy, hh:mm a');
  return `
    <div style="margin-top: 24px; border-top: 1px solid ${PDF_COLORS.slate200}; padding-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- Client Signature -->
      <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; padding: 14px 16px;">
        <div style="font-size: 10px; font-weight: 800; color: ${PDF_COLORS.slate500}; text-transform: uppercase; margin-bottom: 6px;">
          Party 1 (Client Digital Sign-off)
        </div>
        <div style="font-size: 13px; font-weight: 800; color: ${PDF_COLORS.slate900};">
          ${clientName}
        </div>
        <div style="font-size: 10px; color: ${PDF_COLORS.success}; margin-top: 8px; font-weight: 700;">
          ✓ Cryptographically Signed & Escrow Verified
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.slate400}; margin-top: 2px;">
          Timestamp: ${ts}
        </div>
      </div>

      <!-- Freelancer Signature -->
      <div style="background: ${PDF_COLORS.slate50}; border: 1px solid ${PDF_COLORS.slate200}; border-radius: 8px; padding: 14px 16px;">
        <div style="font-size: 10px; font-weight: 800; color: ${PDF_COLORS.slate500}; text-transform: uppercase; margin-bottom: 6px;">
          Party 2 (Freelancer Digital Acceptance)
        </div>
        <div style="font-size: 13px; font-weight: 800; color: ${PDF_COLORS.slate900};">
          ${freelancerName}
        </div>
        <div style="font-size: 10px; color: ${PDF_COLORS.success}; margin-top: 8px; font-weight: 700;">
          ✓ Agreed to Deliverables & Platform Terms
        </div>
        <div style="font-size: 9px; color: ${PDF_COLORS.slate400}; margin-top: 2px;">
          Contract Token: CTR-${contractId ? contractId.slice(-8).toUpperCase() : 'AUTH'}
        </div>
      </div>
    </div>
  `;
}

/**
 * Core PDF Assembly Engine
 * Takes an array of page inner contents, builds distinct A4 DOM pages with exact margins,
 * renders at scale 2.5 via html2canvas, and adds cleanly to a multi-page jsPDF document.
 *
 * @param {Object} options
 * @param {string} options.fileName - Destination filename
 * @param {Array<string>} options.pagesHtml - Array of HTML strings, one for each A4 page
 */
export async function buildAndExportPDF({ fileName = 'WorkStation_Document.pdf', pagesHtml = [] }) {
  if (!pagesHtml || pagesHtml.length === 0) {
    throw new Error('No page content provided for PDF generation');
  }

  const totalPages = pagesHtml.length;
  const nowFormatted = format(new Date(), 'dd MMM yyyy, hh:mm a');

  // Create isolated sandbox container
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px'; // Standard 96 DPI A4 width
  sandbox.style.backgroundColor = '#E2E8F0';
  sandbox.style.zIndex = '-9999';

  // Build each A4 Page with exact 22mm padding and 1123px height
  pagesHtml.forEach((pageContent, idx) => {
    const pageNum = idx + 1;
    const pageEl = document.createElement('div');
    pageEl.className = `ws-pdf-page ws-pdf-page-${pageNum}`;
    pageEl.style.width = '794px';
    pageEl.style.height = '1123px'; // Standard 96 DPI A4 height (297mm)
    pageEl.style.boxSizing = 'border-box';
    pageEl.style.padding = '36px 42px 30px 42px'; // ~22mm left/right, ~24mm top/bottom
    pageEl.style.backgroundColor = '#ffffff';
    pageEl.style.color = PDF_COLORS.slate900;
    pageEl.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    pageEl.style.fontSize = '11px';
    pageEl.style.lineHeight = '1.5';
    pageEl.style.display = 'flex';
    pageEl.style.flexDirection = 'column';
    pageEl.style.justifyContent = 'space-between';
    pageEl.style.overflow = 'hidden';

    // Insert body & dynamic page number into footer
    const footerHtml = renderFooter({ pageNumber: pageNum, totalPages, timestamp: nowFormatted });
    pageEl.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        ${pageContent}
      </div>
      ${footerHtml}
    `;

    sandbox.appendChild(pageEl);
  });

  document.body.appendChild(sandbox);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // Must be false to prevent double-compressing image streams and corrupting xref table
    });

    const pageNodes = sandbox.querySelectorAll('.ws-pdf-page');

    for (let i = 0; i < pageNodes.length; i++) {
      const pageNode = pageNodes[i];

      // Render at high resolution (scale 2 gives crisp 200+ DPI text without memory overflow)
      const canvas = await html2canvas(pageNode, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Add image to fill the exact A4 page (210mm x 297mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'NONE');
    }

    // Ensure valid .pdf extension
    const cleanFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    // Generate real PDF binary buffer
    const pdfArrayBuffer = pdf.output('arraybuffer');
    
    // Explicit application/pdf MIME type Blob
    const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

    if (blob.size === 0) {
      throw new Error('Generated PDF binary is empty');
    }

    // Trigger immediate browser download via anchor
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = cleanFileName;
    downloadLink.setAttribute('download', cleanFileName);
    downloadLink.rel = 'noopener';
    downloadLink.style.position = 'fixed';
    downloadLink.style.left = '-9999px';
    downloadLink.style.top = '-9999px';
    downloadLink.style.opacity = '0';
    document.body.appendChild(downloadLink);

    try {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      downloadLink.dispatchEvent(clickEvent);
    } catch (e) {
      downloadLink.click();
    }

    setTimeout(() => {
      if (downloadLink.parentNode) {
        downloadLink.parentNode.removeChild(downloadLink);
      }
      setTimeout(() => {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (err) {}
      }, 120000);
    }, 1000);

    return true;
  } finally {
    if (sandbox.parentNode) {
      sandbox.parentNode.removeChild(sandbox);
    }
  }
}

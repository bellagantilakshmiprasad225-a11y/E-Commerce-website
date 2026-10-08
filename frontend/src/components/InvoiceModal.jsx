import React from 'react';
import { X, CheckCircle, Printer, Calendar, User, Mail, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const {
    order_id,
    customer_name,
    customer_email,
    order_date,
    items = [],
    subtotal = 0,
    tax = 0,
    total_amount = 0
  } = invoice;

  const formattedDate = new Date(order_date).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="invoice-modal-overlay">
      <div className="modal-card invoice-card" onClick={(e) => e.stopPropagation()} id="invoice-modal-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="invoice-badge">
              <CheckCircle size={16} /> Order Completed Successfully
            </div>
          </div>
          <button className="close-btn" onClick={onClose} id="close-invoice-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" id="printable-invoice">
          {/* Printable Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--accent-navy)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <div className="brand-symbol" style={{ width: '32px', height: '32px', fontSize: '1.1rem' }}>A</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-navy)' }}>
                  Aura Store
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Madanapalle, Andhra Pradesh 517326 • jayaprakash72888@gmail.com
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                OFFICIAL TAX INVOICE
              </h3>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-navy)', marginTop: '0.2rem' }}>
                Invoice #: INV-{order_id}
              </div>
            </div>
          </div>

          <div className="invoice-meta">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <User size={14} /> Billed To:
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{customer_name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{customer_email}</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <Calendar size={14} /> Date of Purchase:
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{formattedDate}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--status-success-text)', fontWeight: 600, marginTop: '0.2rem' }}>
                Status: Paid in Full
              </div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th className="num">Qty</th>
                <th className="num">Unit Price</th>
                <th className="num">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const pName = item.product_name || item.name;
                const qty = item.quantity || item.qty;
                const uPrice = parseFloat(item.unit_price);
                const lineTot = item.line_total ? parseFloat(item.line_total) : qty * uPrice;

                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pName}</td>
                    <td className="num">{qty}</td>
                    <td className="num">{formatINR(uPrice)}</td>
                    <td className="num" style={{ fontWeight: 700, color: 'var(--accent-navy)' }}>{formatINR(lineTot)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <div style={{ width: '280px', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST / Tax (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent-navy)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-dark)', marginTop: '0.25rem' }}>
                <span>Invoice Total</span>
                <span style={{ color: 'var(--accent-gold)' }}>{formatINR(total_amount)}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0', borderTop: '1px dashed var(--border-dark)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent-navy)', marginBottom: '0.2rem' }}>
              <ShieldCheck size={16} color="#B8963E" /> Thank you for shopping with Aura Store!
            </div>
            <span>If you have any questions regarding this invoice, please contact jayaprakash72888@gmail.com</span>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              id="print-invoice-btn"
              className="checkout-btn"
              style={{ flex: 1, background: 'var(--accent-navy)' }}
              onClick={handlePrint}
            >
              <Printer size={18} /> Print / Download PDF
            </button>

            <button
              id="close-invoice-dialog-btn"
              className="checkout-btn"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Done & Return to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

export default function FineDetails({ fine, onProceed, onBack, onViewReceipt }) {
  // Check if fine is overdue based on due date (e.g. if current date is after due date, or if it already has a lateFee)
  const isOverdue = fine.status === 'pending' && (new Date(fine.dueDate) < new Date('2026-06-12') || fine.lateFee > 0);
  const totalAmount = fine.baseAmount + (isOverdue ? fine.lateFee || 1500 : 0);

  return (
    <div className="card animate-fade-in">
      <div className="fine-header">
        <div className="fine-title">
          <h3>Traffic Fine Ticket Details</h3>
          <span className="fine-ref">Ref: {fine.referenceNumber}</span>
        </div>
        <div>
          {fine.status === 'paid' ? (
            <span className="badge badge-paid">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Settled
            </span>
          ) : isOverdue ? (
            <span className="badge badge-overdue">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              Overdue / Late
            </span>
          ) : (
            <span className="badge badge-pending">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              Pending Payment
            </span>
          )}
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Offender Name</span>
          <span className="info-value">{fine.driverName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">License Number</span>
          <span className="info-value">{fine.licenseNumber}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Vehicle Registration No.</span>
          <span className="info-value">{fine.vehicleNumber}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Category Code</span>
          <span className="info-value info-value-highlight">{fine.categoryCode}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Violation Date & Time</span>
          <span className="info-value">{fine.violationDate} at {fine.violationTime}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Location of Incident</span>
          <span className="info-value">{fine.location}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Issuing Officer</span>
          <span className="info-value">{fine.officerName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Officer Badge ID</span>
          <span className="info-value">{fine.officerBadge}</span>
        </div>
      </div>

      <div className="violation-box">
        <div className="violation-title">Traffic Law Violation Description</div>
        <div className="violation-desc">{fine.violation}</div>
      </div>

      {isOverdue && (
        <div className="overdue-alert">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span><strong>Statutory Late Fee Warning:</strong> This ticket is overdue. A late fee has been added under the Sri Lanka Motor Traffic Act.</span>
        </div>
      )}

      <div className="cost-summary">
        <div className="cost-row">
          <span>Base Ticket Fine</span>
          <span className="cost-amount">LKR {fine.baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="cost-row">
          <span>Late Penalty Surcharge</span>
          <span className="cost-amount">
            {isOverdue ? `LKR ${(fine.lateFee || 1500).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'LKR 0.00'}
          </span>
        </div>
        <div className="cost-row border-top total">
          <span>Total Outstanding Amount</span>
          <span className="cost-amount-total">
            LKR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="fine-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ transform: 'scaleX(-1)' }}>
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
            Search Again
          </div>
        </button>

        {fine.status === 'paid' ? (
          <button type="button" className="btn-accent" onClick={onViewReceipt}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            View Digital Receipt
          </button>
        ) : (
          <button type="button" className="btn-accent" onClick={() => onProceed(totalAmount)}>
            Proceed to Payment
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

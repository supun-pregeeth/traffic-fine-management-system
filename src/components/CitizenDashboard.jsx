import { useState } from 'react';

export default function CitizenDashboard({ citizen, fines, onPayFine, onViewReceipt, onViewDetails, onLogout }) {
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' | 'paid'

  // Filter fines for this specific citizen
  const citizenFines = fines.filter(
    (f) => f.licenseNumber.trim().toUpperCase() === citizen.licenseNumber.trim().toUpperCase()
  );

  const unpaidFines = citizenFines.filter((f) => f.status === 'pending');
  const paidFines = citizenFines.filter((f) => f.status === 'paid');

  // Calculations for stats
  const totalUnpaidCount = unpaidFines.length;
  
  // Calculate total unpaid amount including late fees if overdue
  const totalUnpaidAmount = unpaidFines.reduce((acc, fine) => {
    const isOverdue = new Date(fine.dueDate) < new Date('2026-06-12') || fine.lateFee > 0;
    const fineTotal = fine.baseAmount + (isOverdue ? fine.lateFee || 1500 : 0);
    return acc + fineTotal;
  }, 0);

  const totalPaidCount = paidFines.length;

  return (
    <div className="citizen-dashboard animate-fade-in">
      {/* Dashboard Top Header & Profile Banner */}
      <div className="dashboard-profile-card">
        <div className="profile-details">
          <div className="profile-avatar">
            {citizen.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="profile-text">
            <h3>{citizen.fullName}</h3>
            <span className="profile-license">License No: <strong>{citizen.licenseNumber}</strong></span>
            <span className="profile-vehicle">Primary Vehicle: <strong>{citizen.vehicleNumber || 'N/A'}</strong></span>
          </div>
        </div>
        <button type="button" className="btn-secondary logout-btn" onClick={onLogout}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
          Logout Portal
        </button>
      </div>

      {/* Stats Quick Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Law Violations</span>
            <span className="stat-number">{totalUnpaidCount}</span>
            <span className="stat-meta">Total Due: LKR {totalUnpaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card cleared">
          <div className="stat-icon-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Settled & Cleared Tickets</span>
            <span className="stat-number">{totalPaidCount}</span>
            <span className="stat-meta">Good Citizen Record</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="dashboard-tabs">
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'unpaid' ? 'active' : ''}`}
          onClick={() => setActiveTab('unpaid')}
        >
          Unpaid Fines ({totalUnpaidCount})
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveTab('paid')}
        >
          Settlement History ({totalPaidCount})
        </button>
      </div>

      {/* Tabs Dynamic Content */}
      <div className="tab-content">
        {activeTab === 'unpaid' && (
          <div className="fines-list-container">
            {unpaidFines.length === 0 ? (
              <div className="empty-state animate-fade-in">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="var(--success)" style={{ marginBottom: '16px', opacity: 0.8 }}>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <h4>No Outstanding Fines!</h4>
                <p>All traffic tickets for License <strong>{citizen.licenseNumber}</strong> are paid. Thank you for maintaining safe road ethics.</p>
              </div>
            ) : (
              <div className="fines-grid animate-fade-in">
                {unpaidFines.map((fine) => {
                  const isOverdue = new Date(fine.dueDate) < new Date('2026-06-12') || fine.lateFee > 0;
                  const currentTotal = fine.baseAmount + (isOverdue ? fine.lateFee || 1500 : 0);
                  
                  return (
                    <div key={fine.referenceNumber} className={`fine-card-item ${isOverdue ? 'overdue' : ''}`}>
                      <div className="fine-card-header">
                        <div>
                          <span className="fine-card-ref">Ref: {fine.referenceNumber}</span>
                          <h4 className="fine-card-violation">{fine.violation}</h4>
                        </div>
                        {isOverdue ? (
                          <span className="badge badge-overdue">Overdue</span>
                        ) : (
                          <span className="badge badge-pending">Pending</span>
                        )}
                      </div>

                      <div className="fine-card-body">
                        <div className="fine-card-meta">
                          <span><strong>Date:</strong> {fine.violationDate} at {fine.violationTime}</span>
                          <span><strong>Vehicle:</strong> {fine.vehicleNumber}</span>
                          <span><strong>Location:</strong> {fine.location}</span>
                          <span><strong>Due Date:</strong> {fine.dueDate}</span>
                        </div>
                        
                        <div className="fine-card-amounts">
                          <div className="amount-row">
                            <span>Base Fine:</span>
                            <span>LKR {fine.baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          {isOverdue && (
                            <div className="amount-row warning-text">
                              <span>Late Surcharge:</span>
                              <span>LKR {(fine.lateFee || 1500).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          <div className="amount-row total-row">
                            <span>Total Due:</span>
                            <span>LKR {currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="fine-card-footer">
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                          onClick={() => onViewDetails(fine)}
                        >
                          View Details
                        </button>
                        <button 
                          type="button" 
                          className="btn-accent" 
                          style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '8px' }}
                          onClick={() => onPayFine(fine, currentTotal)}
                        >
                          Pay Fine Now
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginLeft: '4px' }}>
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'paid' && (
          <div className="fines-list-container">
            {paidFines.length === 0 ? (
              <div className="empty-state animate-fade-in">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }}>
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <h4>No Settled Fines Yet</h4>
                <p>There are no past records of cleared fines under this driver license history.</p>
              </div>
            ) : (
              <div className="fines-grid animate-fade-in">
                {paidFines.map((fine) => {
                  const wasOverdue = fine.lateFee > 0;
                  const paidTotal = fine.baseAmount + (wasOverdue ? fine.lateFee : 0);
                  
                  return (
                    <div key={fine.referenceNumber} className="fine-card-item paid">
                      <div className="fine-card-header">
                        <div>
                          <span className="fine-card-ref">Ref: {fine.referenceNumber}</span>
                          <h4 className="fine-card-violation">{fine.violation}</h4>
                        </div>
                        <span className="badge badge-paid">Paid & Cleared</span>
                      </div>

                      <div className="fine-card-body">
                        <div className="fine-card-meta">
                          <span><strong>Vehicle:</strong> {fine.vehicleNumber}</span>
                          <span><strong>Settled On:</strong> {fine.paidAt}</span>
                          <span><strong>Receipt No:</strong> {fine.receiptNumber}</span>
                          <span><strong>Payment Method:</strong> {fine.paymentMethod}</span>
                        </div>
                        
                        <div className="fine-card-amounts">
                          <div className="amount-row total-row">
                            <span>Amount Settled:</span>
                            <span>LKR {paidTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="fine-card-footer">
                        <button 
                          type="button" 
                          className="btn-accent" 
                          style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '8px', width: '100%' }}
                          onClick={() => onViewReceipt(fine)}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '6px', transform: 'translateY(-1px)' }}>
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                          </svg>
                          View Official Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

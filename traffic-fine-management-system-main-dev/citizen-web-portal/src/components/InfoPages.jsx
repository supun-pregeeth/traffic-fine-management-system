import { useState } from 'react';

export function PrivacyPolicy({ onBack }) {
  return (
    <div className="card animate-fade-in text-left" style={{ textAlign: 'left' }}>
      <h2 className="form-title">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--primary-light)" style={{ marginRight: '8px' }}>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        Driver Privacy Policy & Information Security
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Effective Date: June 13, 2026. This policy outlines how the Sri Lanka Police Department handles driving license details and transaction metadata.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6' }}>
        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>1. Information We Collect</h4>
          <p>We collect essential information required to verify, process, and clear traffic fine tickets. This includes: Driver License Numbers, Reference Numbers, Vehicle Registration Plates, Payment cardholder name, email addresses, and timestamped transaction amounts.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>2. Data Protection & Encryption</h4>
          <p>All network communications on this portal are encrypted using standard 256-bit Secure Socket Layer (SSL) channels. Payment processing is handled directly through PCI-DSS Level 1 compliant bank gateways. We do not store full credit/debit card numbers or CVV codes on our servers.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>3. How We Use Your Data</h4>
          <p>Your license and ticket details are used solely to query active fine registers and clear pending road violations. Payment confirmation details are shared with the Central Bank of Sri Lanka and the Motor Traffic Department to lift license holds in real-time.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>4. Retention & Third Parties</h4>
          <p>Under the Sri Lanka Motor Traffic Act, driver fine logs are archived for compliance and audit controls. We do not sell, lease, or rent driver profile data to private entities or marketing agencies.</p>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Close & Back
        </button>
      </div>
    </div>
  );
}

export function TermsOfService({ onBack }) {
  return (
    <div className="card animate-fade-in text-left" style={{ textAlign: 'left' }}>
      <h2 className="form-title">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--primary-light)" style={{ marginRight: '8px' }}>
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        Terms of Service & Portal Agreement
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Last Updated: June 13, 2026. Please read these terms carefully before processing payments.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6' }}>
        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>1. Acceptance of Fine Settlement</h4>
          <p>By executing a payment on this portal, you acknowledge that you are the offender or have explicit authorization from the driver license holder. Settling a fine constitutes an admission of the specified traffic violation.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>2. Refund Policy</h4>
          <p>Once a transaction is processed and the digital receipt is issued, the Sri Lanka Police database is updated in real-time. Because pending charges are immediately dropped and police records cleared, fine payments are strictly non-refundable and cannot be cancelled.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>3. Statutory Deadlines & Overdue Fees</h4>
          <p>Drivers must settle traffic tickets within 14 days of issue. Failure to pay within 14 days results in an automatic statutory surcharge late fee under Motor Traffic regulations. If unresolved after 28 days, details are submitted to the Magistrate Court.</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-h)', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>4. Authorized Access</h4>
          <p>Users agree to input only valid reference and license numbers. Any attempt to scrape records, bypass authentication, or submit fraudulent card details is subject to prosecution under the Computer Crimes Act No. 24 of 2007.</p>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Close & Back
        </button>
      </div>
    </div>
  );
}

export function HelpDesk({ onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [category, setCategory] = useState('Payment Issue');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setGeneratedTicket(`SLP-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 900);
  };

  return (
    <div className="card animate-fade-in text-left" style={{ textAlign: 'left' }}>
      <h2 className="form-title">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--primary-light)" style={{ marginRight: '8px' }}>
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
        </svg>
        Help Desk & Dispute Support Portal
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
        Have questions regarding a traffic violation dispute, payment failure, or license clearance delays? Contact our support agents below.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }} className="help-grid-container">
        {/* Left Form side */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {submitted ? (
            <div className="success-banner animate-slide-in" style={{ margin: '0 0 24px 0' }}>
              <div className="success-icon-circle">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h4>Support Ticket Created</h4>
              <p>
                Thank you, <strong>{name}</strong>. Your ticket <strong>{generatedTicket}</strong> has been successfully registered. A support representative will review your message and contact you at <strong>{email}</strong> within 24 hours.
              </p>
              <button 
                type="button" 
                className="btn-accent" 
                style={{ marginTop: '16px', padding: '8px 16px', fontSize: '13px' }}
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setTicketNo('');
                  setMessage('');
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleHelpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-group-grid">
                <div className="form-group">
                  <label htmlFor="supportName">Your Full Name</label>
                  <input
                    id="supportName"
                    type="text"
                    placeholder="e.g. Kamal Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="supportEmail">Email Address</label>
                  <input
                    id="supportEmail"
                    type="email"
                    placeholder="kamal@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-group-grid">
                <div className="form-group">
                  <label htmlFor="supportTicketNo">License / Ticket Reference No.</label>
                  <input
                    id="supportTicketNo"
                    type="text"
                    placeholder="e.g. B1234567 or REF-9876-01"
                    value={ticketNo}
                    onChange={(e) => setTicketNo(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="supportCategory">Dispute / Inquiry Category</label>
                  <select
                    id="supportCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Payment Issue">Payment Failed / Double Charged</option>
                    <option value="Clearance Issue">License Release Hold Delay</option>
                    <option value="Dispute Request">Violation Fine Dispute Request</option>
                    <option value="Other">Other Technical Query</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="supportMessage">Details of your request</label>
                <textarea
                  id="supportMessage"
                  rows="5"
                  placeholder="Describe your issue or dispute in detail so our officers can investigate..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{
                    padding: '14px 20px',
                    fontSize: '16px',
                    border: '2px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg)',
                    color: 'var(--text-h)',
                    transition: 'var(--transition)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>

              <button type="submit" className="btn-accent" style={{ alignSelf: 'flex-start' }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                    Submitting Inquiry...
                  </>
                ) : (
                  'Submit Help Request'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--border)', paddingLeft: '40px' }} className="help-info-panel">
          <div>
            <h4 style={{ color: 'var(--text-h)', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Direct Hotlines</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <strong>Traffic Dept HQ Desk:</strong> <a href="tel:+94112433333" style={{ color: 'var(--primary-light)', fontWeight: 'bold' }}>+94 11 243 3333</a><br/>
              <strong>Fine Settlement Helpline:</strong> <a href="tel:+94112435555" style={{ color: 'var(--primary-light)', fontWeight: 'bold' }}>+94 11 243 5555</a>
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-h)', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Email Support</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
              For documentation attachments or dispute letters, write to:<br/>
              <a href="mailto:support@police.lk" style={{ color: 'var(--primary-light)', fontWeight: 'bold' }}>support@police.lk</a>
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-h)', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Physical Office Location</h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text)', lineHeight: '1.4' }}>
              Traffic Police Headquarters,<br/>
              331 Galle Road,<br/>
              Colombo 03,<br/>
              Sri Lanka.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Close & Back
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function PaymentPortal({ amount, onPaymentSuccess, onCancel }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');

  // Detect card brand dynamically
  const getCardBrand = (num) => {
    const cleanNum = num.replace(/\s+/g, '');
    if (cleanNum.startsWith('4')) {
      return 'VISA';
    } else if (/^5[1-5]/.test(cleanNum)) {
      return 'MASTERCARD';
    } else if (/^3[47]/.test(cleanNum)) {
      return 'AMEX';
    } else {
      return 'CARD';
    }
  };
  const cardBrand = getCardBrand(cardNumber);

  // Handle card number formatting (spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 16) value = value.slice(0, 16);
    
    // Group by 4 digits
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Handle expiry formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  // Handle CVV limit
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    
    if (expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    
    // Parse expiry for validity
    const [monthStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    if (month < 1 || month > 12) {
      setError('Invalid expiry month.');
      return;
    }

    if (cvv.length < 3) {
      setError('Please enter a valid CVV code (3 or 4 digits).');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address for receipt delivery.');
      return;
    }

    // Start processing simulation
    setIsProcessing(true);
    
    const steps = [
      'Establishing secure connection with Bank Gateway...',
      'Verifying credit card details...',
      'Authorizing transaction with Central Bank portal...',
      'Settling outstanding traffic fine LKR...',
      'Generating digital receipt and clearing police record...'
    ];

    let currentStepIndex = 0;
    setProcessingStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setProcessingStep(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        
        // Finalize transaction details
        const paymentDate = new Date();
        const formattedDate = paymentDate.getFullYear() + '-' + 
          String(paymentDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(paymentDate.getDate()).padStart(2, '0') + ' ' + 
          String(paymentDate.getHours()).padStart(2, '0') + ':' + 
          String(paymentDate.getMinutes()).padStart(2, '0');
        
        const receiptNo = "REC-" + Math.floor(1000 + Math.random() * 9000) + "-" + String(paymentDate.getMinutes()).padStart(2, '0');
        const cardEnd = cardNumber.slice(-4);
        
        setIsProcessing(false);
        onPaymentSuccess({
          paidAt: formattedDate,
          receiptNumber: receiptNo,
          paymentMethod: `${cardBrand} ending in **** ${cardEnd}`,
          email: email
        });
      }
    }, 850);
  };

  return (
    <div className="card animate-fade-in" style={{ position: 'relative' }}>
      {isProcessing && (
        <div className="processing-overlay">
          <div className="spinner"></div>
          <p className="processing-text">Processing Payment...</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{processingStep}</p>
        </div>
      )}

      <h2 className="form-title">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--primary-light)" style={{ transform: 'translateY(2px)' }}>
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
        Secure Fine Settlement Portal
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'left' }}>
        You are settling a total fine of <strong>LKR {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>. Fill out your debit/credit card information below.
      </p>

      {/* License Release Info Notice */}
      <div className="license-release-notice" style={{
        background: 'var(--warning-bg)',
        border: '1px solid var(--warning)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        color: 'var(--text-h)',
        fontSize: '13.5px',
        textAlign: 'left',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--warning)" style={{ flexShrink: 0 }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <span>
          <strong>License Release Info:</strong> Upon payment, an SMS notification will be sent to <strong>Officer S.P. Rajapaksha</strong> to release your licence. If relevant, you may contact the officer at <a href="tel:+94774589201" style={{ color: 'var(--text-h)', fontWeight: 'bold', textDecoration: 'underline' }}><strong>+94 77 458 9201</strong></a>.
        </span>
      </div>

      <div className="payment-section">
        {/* Left Hand: Payment Inputs */}
        <form onSubmit={handlePay} className="payment-form-side">
          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              id="cardName"
              type="text"
              placeholder="e.g. Hirushi Perera"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV / CVC</label>
              <input
                id="cvv"
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="helper-text">For sending your cleared transaction receipt</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', margin: '8px 0' }}>
            <input
              id="saveCard"
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="saveCard" style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>
              Save card securely for future fine payments
            </label>
          </div>

          {error && (
            <div className="alert-error" style={{ margin: '0' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-accent" style={{ flex: 1.5 }}>
              Pay Fine LKR {amount.toLocaleString('en-US')}
            </button>
          </div>
        </form>

        {/* Right Hand: Card Mockup & Safe Badges */}
        <div className="payment-card-visual-side">
          <div className="card-mockup">
            <div>
              <div className="card-mockup-logo">{cardBrand}</div>
              <div className="card-mockup-chip"></div>
            </div>
            
            <div className="card-mockup-number">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="card-mockup-bottom">
              <div className="card-mockup-holder">
                <span className="card-mockup-holder-label">Card Holder</span>
                <span className="card-mockup-holder-value">
                  {cardName.toUpperCase() || 'H. PERERA'}
                </span>
              </div>
              <div className="card-mockup-expiry">
                <span className="card-mockup-expiry-label">Expires</span>
                <span className="card-mockup-expiry-value">
                  {expiry || 'MM/YY'}
                </span>
              </div>
            </div>
          </div>

          {/* Secure gateway badges */}
          <div className="secure-badge-container">
            <div className="secure-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              PCI-DSS Compliant
            </div>
            <div className="secure-badge">
              <svg viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              SSL Encrypted
            </div>
            <div className="secure-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
              </svg>
              3D Secure Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

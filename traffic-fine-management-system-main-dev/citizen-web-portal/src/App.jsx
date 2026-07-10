import { useState, useEffect } from 'react';
import Header from './components/Header';
import FineSearch from './components/FineSearch';
import FineDetails from './components/FineDetails';
import PaymentPortal from './components/PaymentPortal';
import Receipt from './components/Receipt';
import CitizenLogin from './components/CitizenLogin';
import CitizenDashboard from './components/CitizenDashboard';
import { PrivacyPolicy, TermsOfService, HelpDesk } from './components/InfoPages';
import { mockFines } from './data/mockData';
import './App.css';

function App() {
  const [fines, setFines] = useState(mockFines);
  const [step, setStep] = useState('search'); // 'search' | 'login' | 'dashboard' | 'details' | 'payment' | 'receipt'
  const [activeFine, setActiveFine] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [loggedInCitizen, setLoggedInCitizen] = useState(null);
  const [paymentSource, setPaymentSource] = useState('public'); // 'public' | 'citizen'
  const [lastStep, setLastStep] = useState('search');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme class on load
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle fine retrieval from search
  const handleFineFound = (fine) => {
    // Find the latest state fine in case it has been paid during the current session
    const freshFine = fines.find(f => f.referenceNumber === fine.referenceNumber);
    setActiveFine(freshFine || fine);
    setPaymentSource('public');
    setStep('details');
  };

  // Proceed to payment form
  const handleProceedToPayment = (amount) => {
    setPayAmount(amount);
    if (loggedInCitizen) {
      setStep('payment');
    } else {
      setStep('account');
    }
  };

  // Handle successful mock payment
  const handlePaymentSuccess = (transactionData) => {
    // Update local copy of active fine to be 'paid' and append receipt info
    const updatedFine = {
      ...activeFine,
      status: 'paid',
      ...transactionData
    };
    
    // Update the master fines state so dashboard / searches reflect this payment
    setFines((prevFines) => 
      prevFines.map(f => f.referenceNumber === activeFine.referenceNumber ? updatedFine : f)
    );
    
    setActiveFine(updatedFine);
    setPaymentInfo(transactionData);
    setStep('receipt');
  };

  // Back to home / dashboard
  const handleReset = () => {
    if (loggedInCitizen) {
      setStep('dashboard');
    } else {
      setStep('search');
    }
    setActiveFine(null);
    setPaymentInfo(null);
    setPayAmount(0);
  };

  // Navigate to Privacy, Terms, or Support
  const handleGoToInfoStep = (targetStep) => {
    if (!['privacy', 'terms', 'support'].includes(step)) {
      setLastStep(step);
    }
    setStep(targetStep);
  };

  // View receipt for an already paid fine
  const handleViewPaidReceipt = () => {
    setPaymentInfo({
      receiptNumber: activeFine.receiptNumber,
      paidAt: activeFine.paidAt,
      paymentMethod: activeFine.paymentMethod,
      email: "" // Already paid previously
    });
    setStep('receipt');
  };

  // Get dynamic checkout steps
  const getStepsList = () => {
    if (loggedInCitizen) {
      return [
        { id: 'search', label: 'Retrieve Ticket' },
        { id: 'details', label: 'Fine Details' },
        { id: 'payment', label: 'Settle Fine' },
        { id: 'receipt', label: 'Receipt' }
      ];
    } else {
      return [
        { id: 'search', label: 'Retrieve Ticket' },
        { id: 'details', label: 'Fine Details' },
        { id: 'account', label: 'Account Details' },
        { id: 'payment', label: 'Settle Fine' },
        { id: 'receipt', label: 'Receipt' }
      ];
    }
  };

  // Determine current active step node for visual progress indicator
  const getStepClass = (nodeStep) => {
    const stepsList = getStepsList();
    const stepOrder = stepsList.map(s => s.id);
    const currentIndex = stepOrder.indexOf(step);
    const nodeIndex = stepOrder.indexOf(nodeStep);

    if (currentIndex > nodeIndex) return 'step-node completed';
    if (currentIndex === nodeIndex) return 'step-node active';
    return 'step-node';
  };

  return (
    <div className="app-container">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        loggedInCitizen={loggedInCitizen}
        onGoToPortal={() => {
          if (loggedInCitizen) {
            setStep('dashboard');
          } else {
            setStep('login');
          }
        }}
        onLogout={() => {
          setLoggedInCitizen(null);
          setStep('search');
        }}
        onGoHome={() => {
          if (loggedInCitizen) {
            setStep('dashboard');
          } else {
            setStep('search');
          }
        }}
      />

      <main className="main-content">
        {/* Step Progress Bar - only show during public / checkout wizard steps */}
        {['search', 'details', 'account', 'payment', 'receipt'].includes(step) && (
          <div className="steps-indicator">
            {getStepsList().map((s, idx) => (
              <div key={s.id} className={getStepClass(s.id)}>
                <div className="step-circle">{idx + 1}</div>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Views */}
        {step === 'search' && (
          <>
            {loggedInCitizen ? (
              <FineSearch onFineFound={handleFineFound} />
            ) : null}

            {/* Citizen Portal Invite Landing Card */}
            <div className="citizen-portal-invite animate-fade-in">
              <div className="invite-content">
                <h4>Registered Citizen Portal</h4>
                <p>Are you a Sri Lankan driver license holder? Sign in to view your profile, active tickets, and clean settlement records in one unified dashboard.</p>
              </div>
              <button type="button" className="btn-accent" onClick={() => setStep('login')} style={{ whiteSpace: 'nowrap' }}>
                Go to Citizen Portal
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginLeft: '8px', transform: 'translateY(-1px)' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {step === 'login' && (
          <CitizenLogin
            onLoginSuccess={(citizen) => {
              setLoggedInCitizen(citizen);
              setStep('dashboard');
            }}
            onCancel={() => setStep('search')}
          />
        )}

        {step === 'dashboard' && loggedInCitizen && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <FineSearch onFineFound={handleFineFound} />
            </div>
            <CitizenDashboard
              citizen={loggedInCitizen}
              fines={fines}
              onPayFine={(fine, totalAmount) => {
                setActiveFine(fine);
                setPayAmount(totalAmount);
                setPaymentSource('citizen');
                setStep('payment');
              }}
              onViewDetails={(fine) => {
                setActiveFine(fine);
                setPaymentSource('citizen');
                setStep('details');
              }}
              onViewReceipt={(fine) => {
                setActiveFine(fine);
                setPaymentSource('citizen');
                handleViewPaidReceipt();
              }}
              onLogout={() => {
                setLoggedInCitizen(null);
                setStep('search');
              }}
            />
          </>
        )}

        {step === 'details' && activeFine && (
          <FineDetails
            fine={activeFine}
            onProceed={handleProceedToPayment}
            onBack={() => {
              if (paymentSource === 'citizen') {
                setStep('dashboard');
              } else {
                handleReset();
              }
            }}
            onViewReceipt={handleViewPaidReceipt}
          />
        )}

        {step === 'account' && activeFine && (
          <CitizenLogin
            onLoginSuccess={(citizen) => {
              setLoggedInCitizen(citizen);
              setStep('payment');
            }}
            onCancel={() => setStep('details')}
            activeFine={activeFine}
            isCheckout={true}
          />
        )}

        {step === 'payment' && activeFine && (
          <PaymentPortal
            amount={payAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => {
              if (paymentSource === 'citizen') {
                setStep('dashboard');
              } else {
                setStep('details');
              }
            }}
          />
        )}

        {step === 'receipt' && activeFine && paymentInfo && (
          <Receipt
            fine={activeFine}
            payment={paymentInfo}
            onClose={handleReset}
          />
        )}

        {step === 'privacy' && (
          <PrivacyPolicy onBack={() => setStep(lastStep)} />
        )}

        {step === 'terms' && (
          <TermsOfService onBack={() => setStep(lastStep)} />
        )}

        {step === 'support' && (
          <HelpDesk onBack={() => setStep(lastStep)} />
        )}

        {/* FAQ Section: Only shown on Search screen for neat home page styling */}
        {step === 'search' && (
          <section className="faq-section animate-fade-in" style={{ marginTop: '20px' }}>
            <h3 className="faq-title">Frequently Asked Questions</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h4 className="faq-question">How long do I have to settle a traffic fine ticket?</h4>
                <p className="faq-answer">
                  According to Sri Lankan Motor Traffic regulations, you must settle a pending fine within 14 days of issue. Failure to pay within 14 days will attract a statutory late fee surcharge. If unpaid after 28 days, legal court proceedings may be initiated.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">What payment methods are supported on this portal?</h4>
                <p className="faq-answer">
                  This portal supports all major credit, debit, and prepaid cards issued by local and international banks, including Visa, Mastercard, and American Express. All payments are processed through secure 256-bit SSL encrypted channels.
                </p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">Will my police record be updated immediately?</h4>
                <p className="faq-answer">
                  Yes. This is the official digital integration portal. As soon as you receive your "Paid & Cleared" digital receipt on screen, our database is updated in real-time. Any automated license holds or vehicle flags will be lifted immediately.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Sri Lanka Police Department. All Rights Reserved.</p>
        <div style={{ marginTop: '8px' }}>
          <button type="button" onClick={() => handleGoToInfoStep('privacy')} className="footer-link-btn">Privacy Policy</button>
          <button type="button" onClick={() => handleGoToInfoStep('terms')} className="footer-link-btn">Terms of Service</button>
          <button type="button" onClick={() => handleGoToInfoStep('support')} className="footer-link-btn">Support & Help Desk</button>
        </div>
      </footer>
    </div>
  );
}

export default App;

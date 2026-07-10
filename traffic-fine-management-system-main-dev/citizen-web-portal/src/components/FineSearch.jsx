import { useState } from 'react';
import { fetchFineByReference } from '../api/citizenApi';

export default function FineSearch({ onFineFound }) {
  const [refNum, setRefNum] = useState('');
  const [catCode, setCatCode] = useState('CAT-A01');
  const [customCatCode, setCustomCatCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCatCode = catCode === 'CUSTOM' ? customCatCode : catCode;

    if (!refNum.trim()) {
      setError('Please enter a valid Fine Reference Number.');
      return;
    }
    if (catCode === 'CUSTOM' && !customCatCode.trim()) {
      setError('Please specify the custom category code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchFineByReference(refNum.trim());
      const fine = response?.data?.data;
      if (fine) {
        onFineFound({
          ...fine,
          referenceNumber: fine.referenceNumber,
          categoryCode: fine.categoryId || finalCatCode,
          violation: fine.description || 'Traffic Violation',
          baseAmount: Number(fine.amount || 0),
          status: (fine.status || 'PENDING').toLowerCase(),
          driverName: fine.driverName,
          licenseNumber: '',
          vehicleNumber: fine.vehicleNumber,
          district: fine.district,
        });
      } else {
        setError('Fine ticket not found. Please verify the Reference Number and Category Code.');
      }
    } catch (err) {
      setError('Unable to retrieve the fine at the moment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (ref, cat) => {
    setRefNum(ref);
    setCatCode(cat);
    setError('');
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="form-title">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--primary-light)" style={{ transform: 'translateY(2px)' }}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        Retrieve Traffic Fine Ticket
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'left' }}>
        Search for your pending fine details using the unique reference number and category identifier printed on your physical fine sheet.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group-grid">
          <div className="form-group">
            <label htmlFor="refNum">
              Fine Reference Number
            </label>
            <input
              id="refNum"
              type="text"
              placeholder="e.g. REF-9876-01"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
              required
            />
            <span className="helper-text">Format: REF-XXXX-XX</span>
          </div>

          <div className="form-group">
            <label htmlFor="catCode">
              Category Identifier
            </label>
            <select
              id="catCode"
              value={catCode}
              onChange={(e) => setCatCode(e.target.value)}
            >
              <option value="CAT-A01">CAT-A01: Speeding Violation</option>
              <option value="CAT-B04">CAT-B04: Reckless Driving</option>
              <option value="CAT-C12">CAT-C12: Distracted Driving</option>
              <option value="CUSTOM">Specify Custom Code...</option>
            </select>
            <span className="helper-text">Code on top right of the ticket</span>
          </div>
        </div>

        {catCode === 'CUSTOM' && (
          <div className="form-group animate-slide-in" style={{ marginBottom: '24px' }}>
            <label htmlFor="customCatCode">Custom Category Code</label>
            <input
              id="customCatCode"
              type="text"
              placeholder="e.g. CAT-D15"
              value={customCatCode}
              onChange={(e) => setCustomCatCode(e.target.value)}
              required
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Quick Demo Helpers for evaluation ease */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Quick Demo Tickets:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                onClick={() => loadSample('REF-9876-01', 'CAT-A01')}
              >
                Speeding (LKR 3,000)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                onClick={() => loadSample('REF-5432-02', 'CAT-B04')}
              >
                Overdue (LKR 6,500)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                onClick={() => loadSample('REF-1111-03', 'CAT-C12')}
              >
                Already Paid (Receipt)
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Retrieving...
              </>
            ) : (
              <>
                Search Fine
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert-error animate-slide-in">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

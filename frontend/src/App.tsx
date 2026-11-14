
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Shipment } from './types';
import './App.css';

function App() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackShipment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number.');
      return;
    }

    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const response = await fetch(
        `http://localhost:3000/shipments/${encodeURIComponent(trackingNumber.trim())}`,
      );

      if (response.status === 404) {
        setError('We could not find a shipment with that tracking number.');
        return;
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data: Shipment = await response.json();
      setShipment(data);
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-icon">S</span>
            <span>ShipTrack</span>
          </div>
          <span className="header-label">Shipment Tracking Portal</span>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">DELIVERY TRACKING</span>
          <h1>Track your package</h1>
          <p>
            Stay updated on your delivery. Enter your tracking number to see
            the latest shipment information.
          </p>

          <form className="search-form" onSubmit={handleTrackShipment}>
            <input
              type="text"
              placeholder="Enter tracking number (e.g. TRK12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              aria-label="Tracking number"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Track Package →'}
            </button>
          </form>
        </section>

        {loading && (
          <div className="message-card">
            <div className="spinner" />
            <p>Looking up your shipment...</p>
          </div>
        )}

        {error && (
          <div className="message-card error-message" role="alert">
            <span className="message-icon">!</span>
            <p>{error}</p>
          </div>
        )}

        {shipment && !loading && (
          <section className="results">
            <div className="result-heading">
              <div>
                <span className="eyebrow">SHIPMENT OVERVIEW</span>
                <h2>Your delivery details</h2>
              </div>
              <span className="status-badge">{shipment.status}</span>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <span className="detail-label">TRACKING NUMBER</span>
                <strong>{shipment.trackingNumber}</strong>
              </div>

              <div className="detail-card">
                <span className="detail-label">PRODUCT</span>
                <strong>{shipment.productName}</strong>
              </div>

              <div className="detail-card">
                <span className="detail-label">CURRENT STATUS</span>
                <strong>{shipment.status}</strong>
              </div>
            </div>

            <div className="timeline-card">
              <div className="timeline-heading">
                <div>
                  <span className="eyebrow">SHIPMENT UPDATES</span>
                  <h2>Tracking history</h2>
                </div>
                <span className="event-count">
                  {shipment.events.length} updates
                </span>
              </div>

              {shipment.events.length === 0 ? (
                <div className="empty-state">
                  <span>◷</span>
                  <h3>No tracking updates yet</h3>
                  <p>Your shipment has been created. Check back for updates.</p>
                </div>
              ) : (
                <div className="timeline">
                  {shipment.events.map((event, index) => (
                    <div className="timeline-item" key={event.id}>
                      <div className="timeline-marker">
                        <span className={index === 0 ? 'marker active' : 'marker'}>
                          {index === 0 ? '✓' : ''}
                        </span>
                        {index !== shipment.events.length - 1 && (
                          <span className="timeline-line" />
                        )}
                      </div>

                      <div className="timeline-content">
                        <div className="event-top">
                          <h3>{event.status}</h3>
                          {index === 0 && (
                            <span className="latest-badge">LATEST</span>
                          )}
                        </div>
                        <p>{event.description}</p>
                        <time>{formatDate(event.createdAt)}</time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {!shipment && !loading && !error && (
          <div className="initial-state">
            <div className="initial-icon">📦</div>
            <h3>Where is your package?</h3>
            <p>Enter your tracking number above to follow your delivery.</p>
          </div>
        )}
      </main>

      <footer>
        <p>Shipment Assignment Ullas</p>
      </footer>
    </div>
  );
}

export default App;

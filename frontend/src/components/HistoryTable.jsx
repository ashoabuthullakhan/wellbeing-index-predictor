import React, { useState } from 'react';

const HistoryTable = ({ history, onSelect, onDelete }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Very High': return 'badge-very-high';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setConfirmDeleteId(null);
    setIsDeletingId(idToDelete);
    
    // Wait for the exit animation to finish before notifying parent to actually remove the row
    setTimeout(async () => {
      try {
        await onDelete(idToDelete);
      } catch (err) {
        // If it fails, revert animation
        setIsDeletingId(null);
      }
    }, 600); // 600ms matches the exit animation
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (!history || history.length === 0) {
    return (
      <div className="glass-card empty-history animate-fade-in">
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.8, filter: 'grayscale(1)' }}>📋</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No History Yet</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>Your past predictions will appear here. Head over to the Predictor tab to run your first analysis.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card history-container animate-fade-in" style={{ position: 'relative' }}>
        <h2 className="history-title">Prediction History</h2>
        <p className="history-subtitle">Your last predictions stored securely in MongoDB.</p>

        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Country</th>
                <th>Life Exp.</th>
                <th>Exp. School</th>
                <th>Mean School</th>
                <th>GNI / Cap.</th>
                <th>HDI Score</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr 
                  key={item._id} 
                  className={`history-row ${isDeletingId === item._id ? 'animate-delete' : 'animate-fade-in'}`} 
                  style={isDeletingId !== item._id ? { animationDelay: `${index * 0.05}s`, animationFillMode: 'both' } : {}}
                >
                  <td className="timestamp" data-label="Time">{formatDate(item.createdAt)}</td>
                  <td className="country-cell" data-label="Country">{item.countryName || <span className="muted">Custom</span>}</td>
                  <td data-label="Life Exp.">{item.lifeExpectancy}</td>
                  <td data-label="Exp. School">{item.expectedYearsSchooling}</td>
                  <td data-label="Mean School">{item.meanYearsSchooling}</td>
                  <td data-label="GNI / Cap.">${item.gniPerCapita?.toLocaleString()}</td>
                  <td className="score-cell" data-label="HDI Score">{item.hdiScore?.toFixed(4)}</td>
                  <td data-label="Category">
                    <span className={`badge ${getCategoryBadgeClass(item.hdiCategory)}`}>
                      {item.hdiCategory}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} data-label="Actions">
                    <button 
                      className="btn btn-sm btn-outline" 
                      onClick={() => onSelect(item)}
                      style={{ marginRight: '0.5rem' }}
                      title="View Details"
                    >
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-danger-outline" 
                      onClick={() => handleDeleteClick(item._id)}
                      title="Delete Record"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-card animate-slide-up" style={{ textAlign: 'center', padding: '2.5rem', maxWidth: '400px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Delete Record?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Are you sure you want to delete this prediction? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryTable;

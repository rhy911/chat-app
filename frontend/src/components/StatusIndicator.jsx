import './StatusIndicator.css';

const StatusIndicator = ({ isOnline, size = 'small', showText = false }) => {
  return (
    <div className={`status-indicator ${size}`}>
      <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
      {showText && (
        <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
      )}
    </div>
  );
};

export default StatusIndicator;

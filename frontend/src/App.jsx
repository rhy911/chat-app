import "./socket.js";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">💬 Hello World</h1>

      <p id="msg" className="ws-message">
        Đang chờ thông điệp từ WebSocket...
      </p>

      <footer className="footer">
        Frontend: React + Vite | WebSocket Demo
      </footer>
    </div>
  );
}

export default App;

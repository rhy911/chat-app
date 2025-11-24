import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchUser from "./pages/SearchUser.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchUser />} />
        <Route path="/search" element={<SearchUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminImoveis from "./pages/AdminImoveis";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Contato from "./pages/Contato";
import Cliente from "./pages/Cliente";
import Proprietario from "./pages/Proprietario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/proprietario" element={<Proprietario />} />
        <Route
  path="/dashboard/imoveis"
  element={<AdminImoveis />}
/>s
      </Routes>
    </BrowserRouter>
  );
}

export default App;
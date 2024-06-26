import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/navbar" element={<Navbar />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
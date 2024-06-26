import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
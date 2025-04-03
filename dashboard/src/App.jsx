import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ManageUser from "./pages/ManageUser";
import Menu from "./pages/Menu";
import ManageProducts from "./pages/ManageProducts";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Reports from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route path="/home" Component={Home} />
                <Route path="/login" Component={Login} />
                <Route path="/signup" Component={SignUp} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/menu" Component={Menu} />
                <Route path="/manageuser" Component={ManageUser} />
                <Route path="/manageproduct" Component={ManageProducts} />
                <Route path="/cart" Component={Cart} />
                <Route path="/payment" Component={Payment} />
                <Route path="/reports" Component={Reports} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import UserDashboard from "./pages/UserDashboard";
import BuyStock from "./pages/BuyStock";
import PurchaseHistory from "./pages/PurchaseHistory";

// Manager Pages
import ManagerDashboard from "./pages/ManagerDashboard";
import AddStock from "./pages/AddStock";
import PendingStocks from "./pages/PendingStocks";
import LowStocks from "./pages/LowStocks";

// Common Pages
import Notifications from "./pages/Notifications";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Routes */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute role="user">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buy"
                    element={
                        <ProtectedRoute role="user">
                            <BuyStock />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute role="user">
                            <PurchaseHistory />
                        </ProtectedRoute>
                    }
                />

                {/* Manager Routes */}
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute role="manager">
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stocks/add"
                    element={
                        <ProtectedRoute role="manager">
                            <AddStock />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stocks/pending"
                    element={
                        <ProtectedRoute role="manager">
                            <PendingStocks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/lowstocks"
                    element={
                        <ProtectedRoute role="manager">
                            <LowStocks />
                        </ProtectedRoute>
                    }
                />

                {/* Shared Routes */}
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
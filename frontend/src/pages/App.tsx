import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

import Admin from "./admin";
import Home from ".";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn || !user?.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ── Root com providers ────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

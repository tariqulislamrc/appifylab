import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import GuestRoute from "./components/GuestRoute";
import Login from "./pages/Login";
import {AuthProvider} from "./context/AuthContext";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./pages/Feed.tsx";


const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/feed" element={<Feed />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/feed" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);

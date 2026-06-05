import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GuestRoute from "./components/GuestRoute";
import Login from "./pages/Login";


const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    </StrictMode>,
);

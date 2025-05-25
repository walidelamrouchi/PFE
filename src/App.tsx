import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Accueil from "./pages/Accueil";
import DeclareItem from "./pages/DeclareItem";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import MyItems from "./pages/MyItems";
import ItemDetail from "./pages/itemDetail";
const queryClient = new QueryClient();

// Composant de protection de route intégré
const ProtectedDeclareItem = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return <DeclareItem />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/declare-item" element={<ProtectedDeclareItem />} />
          <Route path="/declare-item/:id" element={<ProtectedDeclareItem />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ToolTypePage from "./pages/ToolTypePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/type/:type" element={<ToolTypePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
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
import SavedProductsPage from "./pages/SavedProductsPage";
import SearchPage from "./pages/SearchPage";
import ProductBrowserPage from "./pages/ProductBrowserPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PageContent from "./components/PageContent";
import SmartSlugRouter from "./components/SmartSlugRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
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
                <Route path="/search" element={<SearchPage />} />
                <Route path="/browse" element={<ProductBrowserPage />} />
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/type/:type" element={<ToolTypePage />} />
                <Route path="/saved" element={<SavedProductsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
                
                {/* Common pages - add more as needed */}
                <Route path="/about" element={<PageContent />} />
                <Route path="/contact" element={<PageContent />} />
                <Route path="/privacy" element={<PageContent />} />
                <Route path="/terms-conditions" element={<PageContent />} />
                <Route path="/careers" element={<PageContent />} />
                <Route path="/help" element={<PageContent />} />
                <Route path="/faq" element={<PageContent />} />
                
                {/* Dynamic page route for any other pages */}
                <Route path="/page/:slug" element={<PageContent />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/:slug" element={<SmartSlugRouter />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

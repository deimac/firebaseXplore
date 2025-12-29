import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TRPCProvider } from "./lib/trpcProvider";
import { trpc } from "./lib/trpc";
import GoogleAnalytics from "./components/GoogleAnalytics";
import Home from "./pages/Home";
import QuotationForm from "./pages/QuotationForm";
import Quotation from "./pages/Quotation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TravelDetails from "./pages/TravelDetails";
import CompanySettings from "./pages/CompanySettings";

// Import the authentication hook and a button component
import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/destino/:id"} component={TravelDetails} />
      <Route path={"/orcamento"} component={Quotation} />
      <Route path={"/quotation"} component={QuotationForm} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/configuracoes"} component={CompanySettings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: companySettings } = trpc.companySettings.get.useQuery();
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          {/* Authentication UI Example */}
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <>
                <span>Olá, {user.displayName}!</span>
                <Button onClick={() => logout()} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => loginWithGoogle()}>Login com Google</Button>
            )}
          </div>

          <Toaster />
          {companySettings?.googleAnalyticsId && (
            <GoogleAnalytics measurementId={companySettings.googleAnalyticsId} />
          )}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <TRPCProvider>
      <AppContent />
    </TRPCProvider>
  );
}

export default App;

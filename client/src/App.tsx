import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TRPCProvider } from "./lib/trpcProvider";
import { trpc } from "./lib/trpc";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";

// Lazily load all the page components
const Home = lazy(() => import("./pages/Home"));
const TravelDetails = lazy(() => import("./pages/TravelDetails"));
const Quotation = lazy(() => import("./pages/Quotation"));
const QuotationForm = lazy(() => import("./pages/QuotationForm"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CompanySettings = lazy(() => import("./pages/CompanySettings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Create a loading component for Suspense fallback
function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        fontSize: "1.5rem",
        color: "#555",
      }}
    >
      Carregando...
    </div>
  );
}

function Router() {
  return (
    // Wrap the routes in a Suspense component
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
}

function AppContent() {
  const { data: companySettings } = trpc.company.get.useQuery();
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          {/* Authentication UI Example */}
          <div
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
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
              <Button onClick={() => loginWithGoogle()}>
                Login com Google
              </Button>
            )}
          </div>

          <Toaster />
          {companySettings?.googleAnalyticsId && (
            <GoogleAnalytics
              measurementId={companySettings.googleAnalyticsId}
            />
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

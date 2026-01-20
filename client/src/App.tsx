import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "./_core/hooks/useAuth";
import { Route, Switch } from "wouter";
import { Loader2 } from "lucide-react";

import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AppointmentScheduling from "./pages/AppointmentScheduling";
import PatientRegistration from "./pages/PatientRegistration";
import DashboardLayout from "./components/DashboardLayout";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorManagement from "./pages/DoctorManagement";
import ErrorBoundary from "./components/ErrorBoundary";
import DoctorDashboard from "./pages/DoctorDashboard";
import AppointmentList from "./pages/AppointmentList";
import UserManagement from "./pages/UserManagement";
import AdminDashboard from "./pages/AdminDashboard";
import PatientLogin from "./pages/PatientLogin";
import PatientList from "./pages/PatientList";
import VisitNotes from "./pages/VisitNotes";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "@/pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";

type RouteParam = {
  component: React.ComponentType;
  requiredRole: string[];
};

function ProtectedRoute({ component: Component, requiredRole }: RouteParam) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) return <Login />;

  if (requiredRole && !requiredRole.includes(user.role ?? "user")) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // Patient portal routes (separate from main app)
  if (window.location.pathname.startsWith("/patient")) {
    return (
      <Switch>
        <Route path="/patient/login" component={PatientLogin} />
        <Route path="/patient/dashboard" component={PatientDashboard} />
        <Route path="/patient/*" component={() => <PatientLogin />} />
      </Switch>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Render dashboard layout for authenticated users
  return (
    <DashboardLayout>
      <Switch>
        {/* Admin routes */}
        <Route
          path="/"
          component={() => (
            <ProtectedRoute
              component={AdminDashboard}
              requiredRole={["admin"]}
            />
          )}
        />
        <Route
          path="/admin/users"
          component={() => (
            <ProtectedRoute
              component={UserManagement}
              requiredRole={["admin"]}
            />
          )}
        />
        <Route
          path="/admin/doctors"
          component={() => (
            <ProtectedRoute
              component={DoctorManagement}
              requiredRole={["admin"]}
            />
          )}
        />
        <Route
          path="/admin/logs"
          component={() => (
            <ProtectedRoute component={AuditLogs} requiredRole={["admin"]} />
          )}
        />

        {/* Receptionist routes */}
        <Route
          path="/receptionist"
          component={() => (
            <ProtectedRoute
              component={ReceptionistDashboard}
              requiredRole={["receptionist", "admin"]}
            />
          )}
        />
        <Route
          path="/patients"
          component={() => (
            <ProtectedRoute
              component={PatientList}
              requiredRole={["receptionist", "admin"]}
            />
          )}
        />
        <Route
          path="/patients/register"
          component={() => (
            <ProtectedRoute
              component={PatientRegistration}
              requiredRole={["receptionist", "admin"]}
            />
          )}
        />
        <Route
          path="/appointments"
          component={() => (
            <ProtectedRoute
              component={AppointmentList}
              requiredRole={["receptionist", "admin"]}
            />
          )}
        />
        <Route
          path="/appointments/schedule"
          component={() => (
            <ProtectedRoute
              component={AppointmentScheduling}
              requiredRole={["receptionist", "admin"]}
            />
          )}
        />

        {/* Doctor routes */}
        <Route
          path="/doctor"
          component={() => (
            <ProtectedRoute
              component={DoctorDashboard}
              requiredRole={["doctor"]}
            />
          )}
        />
        <Route
          path="/visit-notes"
          component={() => (
            <ProtectedRoute component={VisitNotes} requiredRole={["doctor"]} />
          )}
        />

        {/* Error routes */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

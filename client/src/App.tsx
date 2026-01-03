import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import PatientList from "./pages/PatientList";
import AppointmentScheduling from "./pages/AppointmentScheduling";
import AppointmentList from "./pages/AppointmentList";
import VisitNotes from "./pages/VisitNotes";
import UserManagement from "./pages/UserManagement";
import DoctorManagement from "./pages/DoctorManagement";
import AuditLogs from "./pages/AuditLogs";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
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

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Login} />
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
        <Route path="/" component={() => <ProtectedRoute component={AdminDashboard} requiredRole={["admin"]} />} />
        <Route path="/admin/users" component={() => <ProtectedRoute component={UserManagement} requiredRole={["admin"]} />} />
        <Route path="/admin/doctors" component={() => <ProtectedRoute component={DoctorManagement} requiredRole={["admin"]} />} />
        <Route path="/admin/logs" component={() => <ProtectedRoute component={AuditLogs} requiredRole={["admin"]} />} />

        {/* Receptionist routes */}
        <Route path="/receptionist" component={() => <ProtectedRoute component={ReceptionistDashboard} requiredRole={["receptionist", "admin"]} />} />
        <Route path="/patients" component={() => <ProtectedRoute component={PatientList} requiredRole={["receptionist", "admin"]} />} />
        <Route path="/patients/register" component={() => <ProtectedRoute component={PatientRegistration} requiredRole={["receptionist", "admin"]} />} />
        <Route path="/appointments" component={() => <ProtectedRoute component={AppointmentList} requiredRole={["receptionist", "admin"]} />} />
        <Route path="/appointments/schedule" component={() => <ProtectedRoute component={AppointmentScheduling} requiredRole={["receptionist", "admin"]} />} />

        {/* Doctor routes */}
        <Route path="/doctor" component={() => <ProtectedRoute component={DoctorDashboard} requiredRole={["doctor"]} />} />
        <Route path="/visit-notes" component={() => <ProtectedRoute component={VisitNotes} requiredRole={["doctor"]} />} />

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

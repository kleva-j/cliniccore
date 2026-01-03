import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/");
      } else if (user.role === "receptionist") {
        navigate("/receptionist");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">ClinicCore</h1>
          <p className="text-muted-foreground">Hospital Management System</p>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Sign In</h2>
          <p className="text-muted-foreground mb-6">Secure access to patient records and clinic operations</p>

          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6">
            <a href={getLoginUrl()}>Sign in with Manus</a>
          </Button>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Authorized personnel only. All access is logged for security and compliance purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

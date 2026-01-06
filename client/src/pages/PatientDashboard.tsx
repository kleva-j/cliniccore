import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason?: string;
  doctor?: {
    id: number;
    specialty: string;
  };
}

export default function PatientDashboard() {
  const [, navigate] = useLocation();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("patientUserId");
    if (!userId) {
      navigate("/patient/login");
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const upcomingRes = await fetch("/api/trpc/patientPortal.getUpcomingAppointments");
      const historyRes = await fetch("/api/trpc/patientPortal.getAppointmentHistory");

      const upcomingData = await upcomingRes.json();
      const historyData = await historyRes.json();

      if (upcomingData.result?.data) {
        setUpcomingAppointments(upcomingData.result.data);
      }
      if (historyData.result?.data) {
        setAppointmentHistory(historyData.result.data);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("patientUserId");
    localStorage.removeItem("patientId");
    navigate("/patient/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Portal</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="history">Appointment History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No upcoming appointments scheduled
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {formatDate(appointment.appointmentDate)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {appointment.appointmentTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {appointment.doctor && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{appointment.doctor.specialty}</span>
                      </div>
                    )}
                    {appointment.reason && (
                      <p className="text-sm text-muted-foreground">Reason: {appointment.reason}</p>
                    )}
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-900">
                      {appointment.status}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : appointmentHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No appointment history
                </CardContent>
              </Card>
            ) : (
              appointmentHistory.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {formatDate(appointment.appointmentDate)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {appointment.doctor && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{appointment.doctor.specialty}</span>
                      </div>
                    )}
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900">
                      {appointment.status}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function PatientList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: patients = [], isLoading } = trpc.patients.list.useQuery();
  const { data: searchResults = [] } = trpc.patients.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const displayPatients = searchQuery ? searchResults : patients;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Patients</h1>
        <p className="text-muted-foreground">Search and manage patient records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => navigate("/patients/register")}>Register New</Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Gender</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPatients.map((patient: any) => (
                    <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{patient.name}</td>
                      <td className="py-3 px-4">{patient.phone}</td>
                      <td className="py-3 px-4">{patient.email || "-"}</td>
                      <td className="py-3 px-4 capitalize">{patient.gender}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {displayPatients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No patients found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

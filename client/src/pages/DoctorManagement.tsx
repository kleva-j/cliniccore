import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DoctorManagement() {
  const { data: doctors = [], isLoading } = trpc.doctors.list.useQuery();
  const createDoctor = trpc.doctors.create.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    specialty: "",
    licenseNumber: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDoctor.mutateAsync({
        userId: parseInt(formData.userId),
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success("Doctor profile created");
      setFormData({ userId: "", specialty: "", licenseNumber: "", phone: "", address: "" });
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to create doctor profile");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Management</h1>
        <p className="text-muted-foreground">Manage doctor profiles and specialties</p>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Doctor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="userId">User ID *</Label>
                  <Input
                    id="userId"
                    type="number"
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Input
                    id="specialty"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Medical specialty"
                  />
                </div>

                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createDoctor.isPending}>
                  {createDoctor.isPending ? "Creating..." : "Create Profile"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Doctor Profiles</CardTitle>
          {!showForm && <Button onClick={() => setShowForm(true)}>Add Doctor</Button>}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                    <th className="text-left py-3 px-4 font-semibold">License</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor: any) => (
                    <tr key={doctor.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{doctor.id}</td>
                      <td className="py-3 px-4">{doctor.specialty}</td>
                      <td className="py-3 px-4">{doctor.licenseNumber || "-"}</td>
                      <td className="py-3 px-4">{doctor.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No doctors found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

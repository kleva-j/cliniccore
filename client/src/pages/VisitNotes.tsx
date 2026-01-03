import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function VisitNotes() {
  const [formData, setFormData] = useState({
    appointmentId: "",
    doctorId: "",
    patientId: "",
    diagnosis: "",
    treatment: "",
    prescriptions: "",
    followUp: "",
    notes: "",
  });

  const createVisitNote = trpc.visitNotes.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVisitNote.mutateAsync({
        appointmentId: parseInt(formData.appointmentId),
        doctorId: parseInt(formData.doctorId),
        patientId: parseInt(formData.patientId),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        prescriptions: formData.prescriptions,
        followUp: formData.followUp,
        notes: formData.notes,
      });
      toast.success("Visit note created successfully");
      setFormData({
        appointmentId: "",
        doctorId: "",
        patientId: "",
        diagnosis: "",
        treatment: "",
        prescriptions: "",
        followUp: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to create visit note");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Visit Notes</h1>
        <p className="text-muted-foreground">Document clinical consultation details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Visit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="appointmentId">Appointment ID *</Label>
                <Input
                  id="appointmentId"
                  type="number"
                  required
                  value={formData.appointmentId}
                  onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="doctorId">Doctor ID *</Label>
                <Input
                  id="doctorId"
                  type="number"
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  type="number"
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Clinical diagnosis"
              />
            </div>

            <div>
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                placeholder="Treatment plan"
              />
            </div>

            <div>
              <Label htmlFor="prescriptions">Prescriptions</Label>
              <Textarea
                id="prescriptions"
                value={formData.prescriptions}
                onChange={(e) => setFormData({ ...formData, prescriptions: e.target.value })}
                placeholder="Medications and dosages"
              />
            </div>

            <div>
              <Label htmlFor="followUp">Follow-up Instructions</Label>
              <Textarea
                id="followUp"
                value={formData.followUp}
                onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                placeholder="Follow-up advice and next steps"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional clinical notes"
              />
            </div>

            <Button type="submit" disabled={createVisitNote.isPending}>
              {createVisitNote.isPending ? "Saving..." : "Save Visit Note"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

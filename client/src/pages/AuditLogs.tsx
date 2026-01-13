import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AuditLogs() {
  const { data: logs = [], isLoading } = trpc.logs.list.useQuery({ limit: 100, offset: 0 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">System activity and security trail</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
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
                    <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold">User ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 font-semibold">Entity</th>
                    <th className="text-left py-3 px-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">{log.userId}</td>
                      <td className="py-3 px-4">{log.action}</td>
                      <td className="py-3 px-4">{log.entityType || "-"}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{log.details || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No logs found</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

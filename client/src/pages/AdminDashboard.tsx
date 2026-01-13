import { Users, Calendar, Stethoscope, TrendingUp, BarChart3, Clock } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", income: 4000, expense: 2400 },
  { month: "Feb", income: 3000, expense: 1398 },
  { month: "Mar", income: 2000, expense: 9800 },
  { month: "Apr", income: 2780, expense: 3908 },
  { month: "May", income: 1890, expense: 4800 },
  { month: "Jun", income: 2390, expense: 3800 },
];

const appointmentData = [
  { name: "Completed", value: 65, fill: "#a8e6cf" },
  { name: "Scheduled", value: 25, fill: "#dcedc1" },
  { name: "Cancelled", value: 10, fill: "#ffd3b6" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search here..."
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Clock className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Patients"
          value="1,250"
          trend={{ percentage: 23, direction: "up" }}
          icon={Users}
          backgroundColor="bg-purple-100"
          description="150 more than Yesterday"
        />
        <MetricCard
          title="Appointments"
          value="342"
          trend={{ percentage: 15, direction: "down" }}
          icon={Calendar}
          backgroundColor="bg-blue-100"
          description="15 more than Yesterday"
        />
        <MetricCard
          title="Active Doctors"
          value="28"
          trend={{ percentage: 8, direction: "up" }}
          icon={Stethoscope}
          backgroundColor="bg-yellow-100"
          description="2 more than Yesterday"
        />
        <MetricCard
          title="Revenue"
          value="$45.2K"
          trend={{ percentage: 12, direction: "up" }}
          icon={TrendingUp}
          backgroundColor="bg-green-100"
          description="$5.2K more than Yesterday"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Overview</CardTitle>
            <CardDescription>By Department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cardiology</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Orthopedics</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Neurology</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Schedule</CardTitle>
            <CardDescription>Today's Availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Cardiology</p>
              </div>
              <span className="px-2 py-1 bg-green-200 text-green-900 text-xs font-semibold rounded-full">
                Available
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Dr. Michael Chen</p>
                <p className="text-xs text-gray-500">Orthopedics</p>
              </div>
              <span className="px-2 py-1 bg-yellow-200 text-yellow-900 text-xs font-semibold rounded-full">
                Busy
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-sm">Dr. Emily Davis</p>
                <p className="text-xs text-gray-500">Neurology</p>
              </div>
              <span className="px-2 py-1 bg-red-200 text-red-900 text-xs font-semibold rounded-full">
                Offline
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Performance Metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Server Uptime</span>
                <span className="font-semibold">99.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.8%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Database Health</span>
                <span className="font-semibold">98.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "98.5%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>API Response Time</span>
                <span className="font-semibold">145ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    percentage: number;
    direction: "up" | "down";
  };
  icon: LucideIcon;
  backgroundColor: string;
  textColor?: string;
  description?: string;
  children?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  backgroundColor,
  textColor = "text-gray-900",
  description,
  children,
}: MetricCardProps) {
  return (
    <div className={`${backgroundColor} rounded-2xl p-6 relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-gray-600 opacity-60" />
          {trend && (
            <div
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                trend.direction === "up"
                  ? "bg-green-200 text-green-900"
                  : "bg-red-200 text-red-900"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.percentage)}%
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

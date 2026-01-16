import { motion } from "framer-motion";
import { Heart, Brain, FlaskConical, Coins, GraduationCap } from "lucide-react";

interface StatBarProps {
  type: "health" | "mental" | "research" | "money" | "advisor";
  value: number;
  maxValue: number;
  label: string;
  showChange?: number;
}

const statConfig = {
  health: {
    icon: Heart,
    gradient: "stat-health",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/30"
  },
  mental: {
    icon: Brain,
    gradient: "stat-mental",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/30"
  },
  research: {
    icon: FlaskConical,
    gradient: "stat-research",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/30"
  },
  money: {
    icon: Coins,
    gradient: "stat-money",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/30"
  },
  advisor: {
    icon: GraduationCap,
    gradient: "stat-advisor",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/30"
  }
};

export function StatBar({ type, value, maxValue, label, showChange }: StatBarProps) {
  const config = statConfig[type];
  const Icon = config.icon;
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  const getStatusLevel = () => {
    if (percentage <= 20) return "critical";
    if (percentage <= 40) return "warning";
    return "normal";
  };
  
  const status = getStatusLevel();
  
  const displayValue = type === "money" 
    ? `${(value / 10000).toFixed(1)}만원` 
    : `${Math.round(value)}`;

  return (
    <div className="flex items-center gap-3" data-testid={`stat-bar-${type}`}>
      <div className={`p-2 rounded-md ${config.bgColor}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {label}
          </span>
          <div className="flex items-center gap-1">
            <span 
            className={`text-xs font-bold ${
              status === "critical" ? "text-red-500" : 
              status === "warning" ? "text-yellow-500" : 
              "text-foreground"
            }`}
            data-testid={`stat-value-${type}`}
          >
              {displayValue}
            </span>
            {showChange !== undefined && showChange !== 0 && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs font-bold ${
                  showChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {showChange > 0 ? `+${showChange}` : showChange}
              </motion.span>
            )}
          </div>
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${config.gradient}`}
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              transition: { type: "spring", stiffness: 100, damping: 20 }
            }}
          />
          {status === "critical" && (
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

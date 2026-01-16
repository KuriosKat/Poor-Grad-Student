import { motion, AnimatePresence } from "framer-motion";
import { Heart, Brain, FlaskConical, Coins, GraduationCap, TrendingUp, TrendingDown } from "lucide-react";

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
    bgColor: "bg-red-100 dark:bg-red-950/30",
    glowColor: "shadow-red-500/50"
  },
  mental: {
    icon: Brain,
    gradient: "stat-mental",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    glowColor: "shadow-blue-500/50"
  },
  research: {
    icon: FlaskConical,
    gradient: "stat-research",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/30",
    glowColor: "shadow-green-500/50"
  },
  money: {
    icon: Coins,
    gradient: "stat-money",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/30",
    glowColor: "shadow-yellow-500/50"
  },
  advisor: {
    icon: GraduationCap,
    gradient: "stat-advisor",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    glowColor: "shadow-purple-500/50"
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

  const hasPositiveChange = showChange !== undefined && showChange > 0;
  const hasNegativeChange = showChange !== undefined && showChange < 0;

  return (
    <motion.div 
      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
        hasPositiveChange ? "bg-green-500/5" : 
        hasNegativeChange ? "bg-red-500/5" : ""
      }`}
      animate={
        hasPositiveChange ? { scale: [1, 1.02, 1] } :
        hasNegativeChange ? { x: [0, -3, 3, -3, 0] } :
        {}
      }
      transition={{ duration: 0.3 }}
      data-testid={`stat-bar-${type}`}
    >
      <motion.div 
        className={`p-2 rounded-md ${config.bgColor} ${
          status === "critical" ? "animate-pulse" : ""
        }`}
        animate={hasPositiveChange ? { 
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <motion.span 
              className={`text-xs font-bold ${
                status === "critical" ? "text-red-500 animate-pulse" : 
                status === "warning" ? "text-yellow-500" : 
                "text-foreground"
              }`}
              key={value}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              data-testid={`stat-value-${type}`}
            >
              {displayValue}
            </motion.span>
            
            <AnimatePresence mode="wait">
              {showChange !== undefined && showChange !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    showChange > 0
                      ? "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                  }`}
                >
                  {showChange > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {type === "money"
                      ? `${showChange > 0 ? "+" : ""}${(showChange / 10000).toFixed(1)}만`
                      : `${showChange > 0 ? "+" : ""}${showChange}`
                    }
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${config.gradient}`}
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-y-0 left-0 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              width: "30%",
            }}
            animate={{ x: ["-100%", "400%"] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
          
          {status === "critical" && (
            <motion.div
              className="absolute inset-0 bg-red-500/30"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, FlaskConical, PenTool, Moon, Coffee, 
  Soup, UserCheck, Briefcase, Armchair, Dumbbell
} from "lucide-react";
import type { GameAction } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FlaskConical,
  PenTool,
  Moon,
  Coffee,
  Soup,
  UserCheck,
  Briefcase,
  Armchair,
  Dumbbell
};

interface ActionButtonProps {
  action: GameAction;
  onAction: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ActionButton({ action, onAction, disabled, isLoading }: ActionButtonProps) {
  const Icon = iconMap[action.icon] || BookOpen;
  
  const getEffectColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400";
    if (value < 0) return "text-red-500 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getEffectBg = (value: number) => {
    if (value > 0) return "bg-green-100/50 dark:bg-green-950/30";
    if (value < 0) return "bg-red-100/50 dark:bg-red-950/30";
    return "";
  };
  
  const formatEffect = (key: string, value: number) => {
    const labels: Record<string, string> = {
      health: "체력",
      mental: "멘탈",
      research: "연구",
      money: "돈",
      advisorFavor: "교수"
    };
    const label = labels[key] || key;
    const displayValue = key === "money" 
      ? `${value > 0 ? "+" : ""}${(value / 10000).toFixed(1)}만` 
      : `${value > 0 ? "+" : ""}${value}`;
    return { label, displayValue, value };
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="outline"
        className="w-full h-auto min-h-[100px] py-4 px-4 flex flex-col items-start gap-3 text-left relative overflow-hidden group"
        onClick={onAction}
        disabled={disabled || isLoading}
        data-testid={`action-button-${action.type}`}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent" />
        
        <div className="flex items-center gap-3 w-full relative z-10">
          <motion.div 
            className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="font-semibold text-sm">{action.name}</span>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 w-full relative z-10">
          {action.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 w-full relative z-10">
          {Object.entries(action.effects).map(([key, value]) => {
            if (value === undefined) return null;
            const { label, displayValue } = formatEffect(key, value);
            return (
              <span 
                key={key} 
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${getEffectColor(value)} ${getEffectBg(value)}`}
              >
                {label} {displayValue}
              </span>
            );
          })}
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={false}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </motion.div>
      </Button>
    </motion.div>
  );
}

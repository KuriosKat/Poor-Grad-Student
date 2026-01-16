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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        className="w-full flex flex-col items-start gap-2 text-left"
        onClick={onAction}
        disabled={disabled || isLoading}
        data-testid={`action-button-${action.type}`}
      >
        <div className="flex items-center gap-2 w-full">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm">{action.name}</span>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-1 w-full">
          {action.description}
        </p>
        
        <div className="flex flex-wrap gap-x-2 gap-y-1 w-full">
          {Object.entries(action.effects).map(([key, value]) => {
            if (value === undefined) return null;
            const { label, displayValue } = formatEffect(key, value);
            return (
              <span 
                key={key} 
                className={`text-xs font-medium ${getEffectColor(value)}`}
              >
                {label} {displayValue}
              </span>
            );
          })}
        </div>
      </Button>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertTriangle, PartyPopper, X } from "lucide-react";
import type { GameEvent } from "@shared/schema";

interface EventModalProps {
  event: GameEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const formatEffect = (key: string, value: number) => {
    const labels: Record<string, string> = {
      health: "체력",
      mental: "멘탈",
      research: "연구진척도",
      money: "돈",
      advisorFavor: "교수 호감도"
    };
    const label = labels[key] || key;
    const displayValue = key === "money" 
      ? `${value > 0 ? "+" : ""}${(value / 10000).toFixed(1)}만원` 
      : `${value > 0 ? "+" : ""}${value}`;
    return { label, displayValue };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="event-modal-backdrop"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-sm mx-auto overflow-hidden" data-testid="event-modal">
            <CardHeader className={`py-4 ${
              event.isPositive 
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20" 
                : "bg-gradient-to-r from-red-500/20 to-orange-500/20"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  event.isPositive 
                    ? "bg-green-500/20" 
                    : "bg-red-500/20"
                }`}>
                  {event.isPositive ? (
                    <PartyPopper className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                  data-testid="event-modal-close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                {event.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">효과:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.effects).map(([key, value]) => {
                    if (value === undefined) return null;
                    const { label, displayValue } = formatEffect(key, value);
                    return (
                      <span
                        key={key}
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          value > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                        }`}
                      >
                        {label} {displayValue}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full" 
                onClick={onClose}
                data-testid="event-modal-confirm"
              >
                확인
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

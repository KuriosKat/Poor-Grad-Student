import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertTriangle, PartyPopper, X, Sparkles, Skull, TrendingUp, TrendingDown } from "lucide-react";
import type { GameEvent } from "@shared/schema";

interface EventModalProps {
  event: GameEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [event, onClose]);

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        data-testid="event-modal-backdrop"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="perspective-1000"
        >
          <Card 
            className={`w-full max-w-sm mx-auto overflow-hidden border-2 ${
              event.isPositive 
                ? "border-green-500/50 shadow-lg shadow-green-500/20" 
                : "border-red-500/50 shadow-lg shadow-red-500/20"
            }`}
            data-testid="event-modal"
          >
            <CardHeader className={`py-5 relative overflow-hidden ${
              event.isPositive 
                ? "bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/10" 
                : "bg-gradient-to-br from-red-500/30 via-orange-500/20 to-yellow-500/10"
            }`}>
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${
                      event.isPositive ? "bg-green-400/40" : "bg-red-400/40"
                    }`}
                    initial={{ 
                      x: Math.random() * 300, 
                      y: Math.random() * 100,
                      scale: 0 
                    }}
                    animate={{ 
                      y: [null, -50],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <motion.div 
                  className={`p-3 rounded-full ${
                    event.isPositive 
                      ? "bg-green-500/30" 
                      : "bg-red-500/30"
                  }`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: event.isPositive ? [0, 10, -10, 0] : [0, -5, 5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  {event.isPositive ? (
                    <PartyPopper className="w-6 h-6 text-green-500" />
                  ) : (
                    <Skull className="w-6 h-6 text-red-500" />
                  )}
                </motion.div>
                <div className="flex-1">
                  <motion.h3 
                    className="font-bold text-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {event.title}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1 mt-1"
                  >
                    {event.isPositive ? (
                      <Sparkles className="w-3 h-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      event.isPositive ? "text-green-600 dark:text-green-400" : "text-red-500"
                    }`}>
                      {event.isPositive ? "긍정적 이벤트" : "부정적 이벤트"}
                    </span>
                  </motion.div>
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
            
            <CardContent className="py-5">
              <motion.p 
                className="text-sm text-muted-foreground mb-5 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {event.description}
              </motion.p>
              
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  효과
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.effects).map(([key, value], index) => {
                    if (value === undefined) return null;
                    const { label, displayValue } = formatEffect(key, value);
                    return (
                      <motion.span
                        key={key}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                          value > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}
                      >
                        {value > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {label} {displayValue}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            </CardContent>
            
            <CardFooter className="border-t pt-4 bg-muted/30">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  className="w-full" 
                  onClick={onClose}
                  data-testid="event-modal-confirm"
                >
                  {event.isPositive ? "좋아요!" : "알겠어요..."}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

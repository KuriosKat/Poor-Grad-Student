import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, PartyPopper, Clock } from "lucide-react";
import type { GameEvent } from "@shared/schema";

interface EventLogProps {
  events: GameEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const recentEvents = events.slice(-5).reverse();

  if (recentEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">아직 이벤트가 없습니다</p>
        <p className="text-xs">행동을 하면 이벤트가 발생할 수 있습니다</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[180px]">
      <div className="space-y-2 pr-3">
        <AnimatePresence mode="popLayout">
          {recentEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-md border ${
                event.isPositive 
                  ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50" 
                  : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
              }`}
              data-testid={`event-log-item-${event.id}`}
            >
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full mt-0.5 ${
                  event.isPositive 
                    ? "bg-green-100 dark:bg-green-900/50" 
                    : "bg-red-100 dark:bg-red-900/50"
                }`}>
                  {event.isPositive ? (
                    <PartyPopper className="w-3 h-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}

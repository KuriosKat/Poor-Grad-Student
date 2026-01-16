import { motion } from "framer-motion";
import { Calendar, Sun, Moon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  day: number;
  semester: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onNewGame: () => void;
}

export function GameHeader({ day, semester, isDarkMode, onToggleTheme, onNewGame }: GameHeaderProps) {
  const getSemesterName = (sem: number) => {
    const year = Math.ceil(sem / 2);
    const half = sem % 2 === 1 ? "1" : "2";
    return `${year}년차 ${half}학기`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
          >
            <GraduationCap className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold leading-tight">불쌍한 대학원생</h1>
            <p className="text-xs text-muted-foreground">서바이벌</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium" data-testid="game-semester">
              {getSemesterName(semester)}
            </span>
            <span className="text-xs text-muted-foreground" data-testid="game-day">
              Day {day}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            data-testid="theme-toggle"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNewGame}
            data-testid="new-game-button"
          >
            새 게임
          </Button>
        </div>
      </div>
    </header>
  );
}

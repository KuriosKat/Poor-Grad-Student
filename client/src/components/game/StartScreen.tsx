import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Coffee, Moon, FlaskConical, Brain, Play, Sparkles, Heart, Coins } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function StartScreen({ onStart, isLoading }: StartScreenProps) {
  const floatingIcons = [
    { icon: Coffee, delay: 0, x: -80, y: -60, color: "text-amber-500" },
    { icon: Moon, delay: 0.2, x: 90, y: -70, color: "text-indigo-400" },
    { icon: FlaskConical, delay: 0.4, x: -100, y: 40, color: "text-green-500" },
    { icon: Brain, delay: 0.6, x: 100, y: 50, color: "text-pink-500" },
    { icon: Heart, delay: 0.8, x: -60, y: -100, color: "text-red-500" },
    { icon: Coins, delay: 1.0, x: 70, y: -100, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/50 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="overflow-hidden border-2 shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            {floatingIcons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/3"
                  initial={{ x: item.x, y: item.y, opacity: 0 }}
                  animate={{ 
                    x: item.x, 
                    y: [item.y, item.y - 20, item.y],
                    opacity: 0.2,
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    delay: item.delay,
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.8 }
                  }}
                >
                  <Icon className={`w-10 h-10 ${item.color}`} />
                </motion.div>
              );
            })}
          </div>

          <CardContent className="p-10 relative z-10">
            <div className="text-center space-y-8">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <motion.div 
                  className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/5 flex items-center justify-center shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring" }}
                >
                  <GraduationCap className="w-14 h-14 text-primary drop-shadow-md" />
                </motion.div>
              </motion.div>

              <div className="space-y-3">
                <motion.h1 
                  className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  불쌍한 대학원생
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground font-medium flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  서바이벌 시뮬레이터
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.p>
              </div>

              <motion.div 
                className="text-sm text-muted-foreground space-y-2 bg-muted/50 rounded-lg p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p>체력, 멘탈, 연구진척도를 관리하며</p>
                <p>무사히 졸업을 향해 달려가세요!</p>
              </motion.div>

              <motion.div
                className="pt-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-7 shadow-lg shadow-primary/30 relative overflow-hidden group"
                    onClick={onStart}
                    disabled={isLoading}
                    data-testid="start-game-button"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <Play className="w-6 h-6 mr-2" />
                    {isLoading ? "로딩 중..." : "게임 시작"}
                  </Button>
                </motion.div>

                <p className="text-xs text-muted-foreground">
                  연구진척도 100%를 달성하면 졸업!
                </p>
              </motion.div>

              <motion.div 
                className="pt-6 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-muted-foreground mb-4 font-medium">초기 상태</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-2xl font-bold text-red-500">80</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">체력</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-2xl font-bold text-blue-500">70</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">멘탈</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <FlaskConical className="w-4 h-4 text-green-500" />
                      <span className="text-2xl font-bold text-green-500">0%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">연구</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Made with exhaustion and instant noodles
        </motion.p>
      </motion.div>
    </div>
  );
}

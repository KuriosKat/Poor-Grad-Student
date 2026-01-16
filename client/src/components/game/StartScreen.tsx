import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Coffee, Moon, FlaskConical, Brain, Play } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function StartScreen({ onStart, isLoading }: StartScreenProps) {
  const floatingIcons = [
    { icon: Coffee, delay: 0, x: -60, y: -40 },
    { icon: Moon, delay: 0.2, x: 70, y: -50 },
    { icon: FlaskConical, delay: 0.4, x: -80, y: 30 },
    { icon: Brain, delay: 0.6, x: 85, y: 40 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden relative">
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
                    y: [item.y, item.y - 15, item.y],
                    opacity: 0.15
                  }}
                  transition={{ 
                    delay: item.delay,
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.5 }
                  }}
                >
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </motion.div>
              );
            })}
          </div>

          <CardContent className="p-8 relative z-10">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-primary" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  불쌍한 대학원생
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  서바이벌 시뮬레이터
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>체력, 멘탈, 연구진척도를 관리하며</p>
                <p>무사히 졸업을 향해 달려가세요!</p>
              </div>

              <div className="pt-4 space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6"
                    onClick={onStart}
                    disabled={isLoading}
                    data-testid="start-game-button"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {isLoading ? "로딩 중..." : "게임 시작"}
                  </Button>
                </motion.div>

                <p className="text-xs text-muted-foreground">
                  연구진척도 100%를 달성하면 졸업!
                </p>
              </div>

              <div className="pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500">100</div>
                    <div className="text-xs text-muted-foreground">체력</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">100</div>
                    <div className="text-xs text-muted-foreground">멘탈</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">0%</div>
                    <div className="text-xs text-muted-foreground">연구</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Made with exhaustion and instant noodles
        </motion.p>
      </motion.div>
    </div>
  );
}

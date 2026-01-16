import confetti from "canvas-confetti";

export function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireGraduation() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#9370DB'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#9370DB'],
    });
  }, 250);
}

export function firePositiveEvent() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#22c55e', '#10b981', '#34d399', '#6ee7b7'],
    zIndex: 9999,
  });
}

export function fireNegativeEvent() {
  confetti({
    particleCount: 30,
    spread: 40,
    origin: { y: 0.5 },
    colors: ['#666', '#888', '#aaa'],
    gravity: 2,
    scalar: 0.8,
    drift: 0,
    zIndex: 9999,
  });
}

export function fireMoney() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#eab308'],
    zIndex: 9999,
  });
}

export function fireCoffee() {
  confetti({
    particleCount: 25,
    spread: 45,
    origin: { y: 0.5 },
    colors: ['#92400e', '#78350f', '#a16207', '#854d0e'],
    gravity: 0.8,
    zIndex: 9999,
  });
}

export function fireRamen() {
  confetti({
    particleCount: 25,
    spread: 45,
    origin: { y: 0.5 },
    colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74'],
    gravity: 0.8,
    zIndex: 9999,
  });
}

export function fireResearch() {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.5 },
    colors: ['#22c55e', '#16a34a', '#15803d', '#4ade80'],
    gravity: 0.6,
    zIndex: 9999,
  });
}

export function screenShake(element: HTMLElement | null, intensity: number = 5) {
  if (!element) return;
  
  const originalTransform = element.style.transform;
  let shakeCount = 0;
  const maxShakes = 6;
  
  const shake = () => {
    if (shakeCount >= maxShakes) {
      element.style.transform = originalTransform;
      return;
    }
    
    const x = (Math.random() - 0.5) * intensity;
    const y = (Math.random() - 0.5) * intensity;
    element.style.transform = `translate(${x}px, ${y}px)`;
    shakeCount++;
    
    requestAnimationFrame(() => {
      setTimeout(shake, 50);
    });
  };
  
  shake();
}

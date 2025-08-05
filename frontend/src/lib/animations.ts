import anime from 'animejs';

export const fadeInUp = (targets: any, delay = 0) => {
  return anime({
    targets,
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: 'easeOutExpo',
  });
};

export const fadeInScale = (targets: any, delay = 0) => {
  return anime({
    targets,
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    delay,
    easing: 'easeOutExpo',
  });
};

export const staggerFadeIn = (targets: any, staggerDelay = 100) => {
  return anime({
    targets,
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 600,
    delay: anime.stagger(staggerDelay),
    easing: 'easeOutExpo',
  });
};

export const buttonHover = (target: any) => {
  return anime({
    targets: target,
    scale: 1.05,
    duration: 200,
    easing: 'easeOutQuad',
  });
};

export const buttonLeave = (target: any) => {
  return anime({
    targets: target,
    scale: 1,
    duration: 200,
    easing: 'easeOutQuad',
  });
};

export const buttonClick = (target: any) => {
  return anime({
    targets: target,
    scale: [1, 0.95, 1],
    duration: 200,
    easing: 'easeOutQuad',
  });
};

export const slideInLeft = (targets: any, delay = 0) => {
  return anime({
    targets,
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: 'easeOutExpo',
  });
};

export const slideInRight = (targets: any, delay = 0) => {
  return anime({
    targets,
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: 'easeOutExpo',
  });
};

export const pulseGlow = (targets: any) => {
  return anime({
    targets,
    boxShadow: [
      '0 0 20px rgba(255, 0, 128, 0.3)',
      '0 0 40px rgba(255, 0, 128, 0.6)',
      '0 0 20px rgba(255, 0, 128, 0.3)',
    ],
    duration: 2000,
    loop: true,
    easing: 'easeInOutSine',
  });
};

export const rotateIn = (targets: any, delay = 0) => {
  return anime({
    targets,
    rotate: [180, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: 'easeOutExpo',
  });
};

export const morphPath = (targets: any, path: string) => {
  return anime({
    targets,
    d: path,
    duration: 1000,
    easing: 'easeOutExpo',
  });
};

export const typewriter = (targets: any, text: string) => {
  const element = targets as HTMLElement;
  element.innerHTML = '';

  const animationTarget = { value: 0 };

  return anime({
    targets: animationTarget,
    value: text.length,
    duration: text.length * 50,
    easing: 'linear',
    update: () => {
      const progress = Math.floor(animationTarget.value);
      element.innerHTML = text.substring(0, progress);
    },
  });
};

// Function to handle counter animations
export const animateCounter = (target, setValue, duration) => {
  const startTime = performance.now();
  const startValue = 0;

  const updateCounter = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(
      startValue + easeOutQuart * (target - startValue)
    );

    setValue(currentValue);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      setValue(target); // Ensure exact final value
    }
  };

  requestAnimationFrame(updateCounter);
};

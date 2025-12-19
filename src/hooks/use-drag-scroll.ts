"use client";

import { useRef, useEffect, useState } from "react";
import { logger } from "@/lib/logger";

interface UseDragScrollOptions {
  friction?: number;
  speedMultiplier?: number;
  dragThreshold?: number;
  enableTouch?: boolean;
}

export function useDragScroll(options: UseDragScrollOptions = {}) {
  const {
    friction = 0.92,
    speedMultiplier = 1.5,
    dragThreshold = 5,
    enableTouch = true,
  } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let hasDragged = false;
    let velX = 0;
    let momentumID: number;

    // For velocity averaging
    const lastPositions: { x: number; time: number }[] = [];

    const startDragging = (pageX: number) => {
      isDown = true;
      hasDragged = false;
      setIsDragging(false);
      startX = pageX;
      scrollLeft = slider.scrollLeft;
      cancelMomentumTracking();
      lastPositions.length = 0;
      lastPositions.push({ x: pageX, time: Date.now() });

      logger.debug({ scrollLeft }, "Drag scroll started");
    };

    const stopDragging = () => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);

      if (hasDragged) {
        // Calculate average velocity from last few points for smoother transition
        if (lastPositions.length > 1) {
          const last = lastPositions[lastPositions.length - 1];
          const first = lastPositions[Math.max(0, lastPositions.length - 5)];
          const dt = last.time - first.time;
          if (dt > 0) {
            velX = ((first.x - last.x) / dt) * 16; // px per frame approx
          }
        }

        beginMomentumTracking();
        logger.debug({ velX }, "Drag scroll ended, momentum started");
      }
    };

    const moveDragging = (pageX: number) => {
      if (!isDown) return;

      const movedDistance = Math.abs(pageX - startX);
      if (!hasDragged && movedDistance > dragThreshold) {
        hasDragged = true;
        setIsDragging(true);
      }

      if (hasDragged) {
        const walk = (pageX - startX) * speedMultiplier;
        slider.scrollLeft = scrollLeft - walk;

        // Track positions for velocity
        lastPositions.push({ x: pageX, time: Date.now() });
        if (lastPositions.length > 10) lastPositions.shift();
      }
    };

    const mouseDownHandler = (e: MouseEvent) => startDragging(e.pageX);
    const mouseUpHandler = () => stopDragging();
    const mouseMoveHandler = (e: MouseEvent) => moveDragging(e.pageX);

    const touchStartHandler = (e: TouchEvent) => {
      if (!enableTouch) return;
      startDragging(e.touches[0].pageX);
    };
    const touchEndHandler = () => {
      if (!enableTouch) return;
      stopDragging();
    };
    const touchMoveHandler = (e: TouchEvent) => {
      if (!enableTouch) return;
      moveDragging(e.touches[0].pageX);
    };

    const captureClickHandler = (e: MouseEvent) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const beginMomentumTracking = () => {
      cancelMomentumTracking();
      momentumID = requestAnimationFrame(momentumLoop);
    };

    const cancelMomentumTracking = () => {
      cancelAnimationFrame(momentumID);
    };

    const momentumLoop = () => {
      if (Math.abs(velX) < 0.1) {
        cancelMomentumTracking();
        return;
      }
      slider.scrollLeft += velX;
      velX *= friction;
      momentumID = requestAnimationFrame(momentumLoop);
    };

    // Mouse Events
    slider.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("mousemove", mouseMoveHandler);
    slider.addEventListener("click", captureClickHandler, true);

    // Touch Events
    if (enableTouch) {
      slider.addEventListener("touchstart", touchStartHandler, {
        passive: true,
      });
      slider.addEventListener("touchend", touchEndHandler, { passive: true });
      slider.addEventListener("touchmove", touchMoveHandler, {
        passive: false,
      });
    }

    return () => {
      slider.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      slider.removeEventListener("click", captureClickHandler, true);

      if (enableTouch) {
        slider.removeEventListener("touchstart", touchStartHandler);
        slider.removeEventListener("touchend", touchEndHandler);
        slider.removeEventListener("touchmove", touchMoveHandler);
      }

      cancelMomentumTracking();
    };
  }, [friction, speedMultiplier, dragThreshold, enableTouch]);

  return { scrollRef, isDragging };
}

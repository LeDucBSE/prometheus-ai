"use client";

import * as React from "react";
import { useRef } from "react";
import Link from "next/link";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...args: any[]) => twMerge(clsx(args));

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}

export interface DockItemData {
  id: string;
  label: string;
  Icon: React.ReactNode;
  link?: string;
  target?: string;
  onClick?: () => void;
  active?: boolean;
}

export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 w-fit items-end justify-center gap-4 bg-transparent px-2 pb-3 shadow-none",
        className
      )}
    >
      {items.map((item) => (
        <DockItem key={item.id} mouseX={mouseX} active={item.active}>
          {item.link ? (
            <Link
              href={item.link}
              target={item.target}
              aria-label={item.label}
              className="flex h-full w-full grow items-center justify-center"
            >
              {item.Icon}
            </Link>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              aria-pressed={item.active}
              className="flex h-full w-full grow items-center justify-center"
            >
              {item.Icon}
            </button>
          )}
        </DockItem>
      ))}
    </motion.div>
  );
};

interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  active?: boolean;
}

export const DockItem = ({ mouseX, children, active = false }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [40, 80], [1, 1.5]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "flex aspect-square w-10 items-center justify-center rounded-full border transition-colors backdrop-blur-xl",
        active
          ? "border-white/18 bg-white/[0.08] text-white shadow-[0_10px_28px_rgba(255,255,255,0.08)]"
          : "border-white/[0.08] bg-black/35 text-white/55"
      )}
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex h-full w-full grow items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

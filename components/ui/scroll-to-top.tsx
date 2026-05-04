"use client";

import { useEffect, useState } from "react";
import { IconChevronsUp } from "@tabler/icons-react";
import { Button } from "./button";
import { AnimatePresence, motion } from "motion/react";

export function ScrollToTop({
  threshold = 1000,
  className = "",
}: {
  threshold?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className=" fixed   top-0 inset-x-0 z-20 bg-linear-to-b from-background/80 via-transparent to-transparent py-5  flex justify-center pointer-events-none"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <Button
            variant="secondary"
            size="xl"
            className="pointer-events-auto"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <IconChevronsUp />
            <h1>Scroll to top</h1>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

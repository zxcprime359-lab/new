"use client";

import { motion } from "motion/react";

export default function TitleReusable({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon?: React.ElementType;
}) {
  return (
    <div>
      <div className="flex lg:gap-6 gap-3 items-center">
        <motion.span
          className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] 
            bg-size-[200%_100%] bg-clip-text capitalize
           font-medium tracking-wide  flex items-center lg:gap-3 gap-1.5  lg:text-xl text-base"
          initial={{ backgroundPosition: "200% 0" }}
          animate={{ backgroundPosition: "-200% 0" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 7,
            ease: "linear",
          }}
        >
          {Icon && <Icon className=" lg:size-7 size-5" />}
          {title}
        </motion.span>
        <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
      </div>

      <p className="text-muted-foreground mt-1 lg:text-base text-sm">
        {description}
      </p>
    </div>
  );
}

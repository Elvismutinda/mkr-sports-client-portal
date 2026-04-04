"use client";

import React from "react";
import { motion } from "framer-motion";
import PasswordUpdateForm from "../auth/PasswordUpdateForm";

export const SecurityTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      <div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
          Update Password
        </h3>

        <PasswordUpdateForm />
      </div>
    </motion.div>
  );
};

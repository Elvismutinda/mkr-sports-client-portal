"use client";

import { motion } from "framer-motion";
import AccountUpdateForm from "../auth/AccountUpdateForm";
import DeleteAccount from "../auth/DeleteAccount";

export const AccountTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
          Update Account Information
        </h3>

        <AccountUpdateForm />
      </div>

      <div className="pt-10 border-t border-white/10">
        <DeleteAccount />
      </div>
    </motion.div>
  );
};

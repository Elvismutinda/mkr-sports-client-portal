"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";

export const ContactTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-mkr-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="text-mkr-yellow" size={32} />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
          Tactical Support
        </h3>
        <p className="text-slate-400 text-sm font-bold max-w-md mx-auto leading-relaxed">
          Encountering issues with your deployment or tactical data? Contact the
          MKR Command Center for immediate assistance.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="mailto:support@mkr.com"
            className="text-mkr-yellow font-black uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            support@mkr.com <ExternalLink size={14} />
          </a>
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
            Response Time: &lt; 4 Hours
          </div>
        </div>
      </div>
    </motion.div>
  );
};

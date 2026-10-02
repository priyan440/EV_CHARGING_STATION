import React from 'react';
import { motion } from 'framer-motion';

const CyberButton = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  icon: Icon
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-green-400 hover:to-emerald-500 text-black font-semibold shadow-neon border-0';
      case 'secondary':
        return 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-blue-500 hover:to-sky-500 text-white font-semibold shadow-neonBlue border-0';
      case 'accent':
        return 'bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-neonCyan border-0';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-red-500 hover:to-rose-600 text-white font-semibold border-0 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
      case 'glass':
        return 'glass-panel text-white hover:border-primary/50 hover:bg-white/5 transition-all duration-200';
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer select-none text-sm outline-none tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
    >
      {Icon && <Icon className="w-4.5 h-4.5" />}
      {children}
    </motion.button>
  );
};

export default CyberButton;

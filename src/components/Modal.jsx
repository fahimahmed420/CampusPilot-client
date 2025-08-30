// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-80 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

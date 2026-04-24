import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";

interface TetrGameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TetrGameModal = ({ isOpen, onClose }: TetrGameModalProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus the iframe so keyboard controls work immediately
            const timer = setTimeout(() => {
                if (iframeRef.current) {
                    iframeRef.current.focus();
                }
            }, 500); // Wait for animation to finish
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAnimationComplete = () => {
        if (isOpen && iframeRef.current) {
            iframeRef.current.focus();
        }
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onAnimationComplete={handleAnimationComplete}
                        className="relative w-full max-w-5xl h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-sm font-medium text-muted-foreground font-mono">
                                    tetr_emulator.exe
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                                aria-label="Close game"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 bg-black relative flex items-center justify-center">
                            <span className="absolute text-white/30 text-sm z-0 pointer-events-none select-none">
                                If controls don't work, click anywhere on the game to focus.
                            </span>
                            <iframe
                                ref={iframeRef}
                                src="https://tetrjs-9e50a.web.app/"
                                className="absolute inset-0 w-full h-full border-0 z-10"
                                title="Tetr Emulator"
                                allow="autoplay; fullscreen"
                                tabIndex={0}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

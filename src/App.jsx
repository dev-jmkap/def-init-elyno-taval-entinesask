import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import './App.css'

function App() {
  const [mode, setMode] = useState("idle");
  const [hasPopped, setHasPopped] = useState(false);
  const [showShock, setShowShock] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const popTimeoutRef = useRef(null);

  const POP_HOLD_MS = 3500; // how long she needs to hold to trigger pop

  const handleDown = () => {
    // start holding
    setMode("held");

    // clear any old timer
    if (popTimeoutRef.current) clearTimeout(popTimeoutRef.current);

    // schedule the pop
    popTimeoutRef.current = setTimeout(() => {
      // only pop if STILL held by then
      setMode((prev) => (prev === "held" ? "popping" : prev));
    }, POP_HOLD_MS);
  };

  const handleUp = () => {
    // stop the timer
    if (popTimeoutRef.current) clearTimeout(popTimeoutRef.current);

    // if we were held (and not already popping), go to releasing
    setMode((prev) => (prev === "held" ? "releasing" : prev));
  };

  useEffect(() => {
    if (mode === "releasing") {
      const t = setTimeout(() => {
        setMode("idle");
      }, 1000); // match this roughly to the shrink duration

      return () => clearTimeout(t);
    }
  }, [mode]);

  useEffect(() => {
    // only show hint when idle and not popped
    if (mode === "idle" && !hasPopped) {
      const id = setTimeout(() => {
        setShowHint(true);
      }, 5000); // 5 seconds

      return () => clearTimeout(id);
    }
  }, [mode, hasPopped]);

  return (
    <div className="val-root">
      {showHint && !hasPopped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            marginTop: "20px",
            fontSize: "16px",
            opacity: 0.7,
            textAlign: "center"
          }}
        >
          Tap and hold to charge the heart 💖
        </motion.div>
      )}

      {!hasPopped && (
        <motion.div
          className="heart-wrapper"
          onPointerDown={handleDown}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
          onTouchStart={handleDown}
          onTouchEnd={handleUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <motion.img
            src="/heart-spin.gif"
            alt=""
            className="heart-aura"
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
            animate={{
              scale:
                mode === "held"
                  ? [1.3, 2.15] // stronger pulse when charging
                  : mode === "releasing"
                  ? 1
                  : mode === "popping"
                  ? [2, 2.6] // final big flash
                  : [1, 1.7], // idle pulse out
              opacity:
                mode === "held"
                  ? [0.35, 0]
                  : mode === "releasing"
                  ? 0
                  : mode === "popping"
                  ? [0.6, 0] // flash then disappear
                  : [0.45, 0],
            }}
            transition={{
              scale:
                mode === "held"
                  ? {
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 0.15,
                      ease: "easeOut",
                    }
                  : mode === "releasing"
                  ? { duration: 0.22, ease: "easeOut" }
                  : mode === "popping"
                  ? { duration: 0.28, ease: "easeOut" }
                  : {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeOut",
                    },
              opacity:
                mode === "held"
                  ? {
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 0.15,
                      ease: "easeOut",
                    }
                  : mode === "releasing"
                  ? { duration: 0.22, ease: "easeOut" }
                  : mode === "popping"
                  ? { duration: 0.28, ease: "easeOut" }
                  : {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeOut",
                    },
            }}
          />

          <motion.img
            src="/heart-spin.gif"
            alt="Spinning heart"
            className="heart-img"
            draggable={false}
            style={{ pointerEvents: "none" }}
            animate={{
              scale:
                mode === "held"
                  ? 3 // charging
                  : mode === "releasing"
                  ? 1 // cleanly shrink to base
                  : mode === "popping"
                  ? [3, 10] // POP: grow then shrink to nothing
                  : [1, 1.2, 1], // heartbeat loop
              x:
                mode === "held"
                  ? [-0.5, 1.5, -5, 2.5, 0] // rumble only while held
                  : 0,
              opacity: mode === "popping" ? [1, 1, 0] : 1,
            }}
            transition={{
              scale:
                mode === "held"
                  ? {
                      duration: 4,
                      ease: "easeInOut",
                    }
                  : mode === "releasing"
                  ? {
                      duration: 1,
                      ease: "easeOut",
                    }
                  : mode === "popping"
                  ? {
                      duration: 1,
                      ease: "easeOut",
                    }
                  : {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    },
              x: {
                repeat: mode === "held" ? Infinity : 0,
                duration: 0.35,
                ease: "easeInOut",
              },
              opacity:
                mode === "popping"
                  ? { duration: .75, ease: "easeOut" }
                  : undefined,
            }}
            onAnimationComplete={() => {
              if (mode === "popping") {
                setHasPopped(true); // remove heart after pop
                setShowShock(true); // show shock

                setTimeout(() => {
                  setShowShock(false);
                  setShowQuestion(true);
                }, 1500);
              }
            }}
          />
        </motion.div>
      )}

      {showShock && (
        <motion.img
          src="/shock.png"
          alt="shocked reaction"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: "70%",          // tweak here
            pointerEvents: "none",
            userSelect: "none",
            marginTop: "16px",
          }}
        />
      )}

      {showQuestion && (
        <motion.div
          className="question-block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 3,
            ease: "easeOut"
          }}
          style={{
            textAlign: "center",
            marginTop: "12px"
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 6 }}>Mal…</div>
          <div style={{ fontSize: 35 }}>will you be my valentine? 🥹</div>
        </motion.div>
      )}
    </div>
  );

}

export default App

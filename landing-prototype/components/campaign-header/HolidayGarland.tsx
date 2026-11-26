"use client";

import { useState, type CSSProperties } from "react";
import { publicAsset } from "../../lib/public-asset";
import styles from "./HolidayGarland.module.css";

const colors = ["#ffca6a", "#73d8b2", "#fe8b88", "#a999ff", "#7fc9ff"];
const rhythms = [3.7, 5.1, 4.3, 6.2, 3.9, 5.6, 4.8, 3.5, 5.9, 4.1, 6.5, 4.6];
const offsets = [-0.7, -2.9, -1.4, -4.8, -3.2, -0.3, -2.1, -1.8, -5.3, -3.6, -0.9, -4.1];

function Bulb({ x, y, index }: { x: number; y: number; index: number }) {
  return (
    <g className={styles.bulb} transform={`translate(${x} ${y})`} style={{ "--bulb-color": colors[index % colors.length], "--pulse-duration": `${rhythms[index % rhythms.length]}s`, "--pulse-delay": `${offsets[index % offsets.length]}s` } as CSSProperties}>
      <rect className={styles.socket} x="-3" y="-1" width="6" height="6" rx="1" />
      <path className={styles.glass} d="M-5 5 Q-6 13 0 19 Q6 13 5 5 Z" />
      <path className={styles.glint} d="M-2 8 L-2 12" />
    </g>
  );
}

export function HolidayGarland() {
  const [isOn, setIsOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`${styles.garland} ${isOn ? styles.lit : ""}`} data-garland-lit={isOn}>
      <svg className={styles.desktopLights} viewBox="0 0 1200 55" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.wire} d="M0 8 C60 30 140 30 200 8 C260 30 340 30 400 8 C460 30 540 30 600 8 C660 30 740 30 800 8 C860 30 940 30 1000 8 C1060 30 1140 30 1200 8" />
        {Array.from({ length: 12 }, (_, index) => <Bulb key={index} x={50 + index * 100} y={19} index={index} />)}
      </svg>
      <svg className={styles.mobileLights} viewBox="0 0 375 55" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.wire} d="M0 8 C30 27 70 27 100 8 C130 27 170 27 200 8 C230 27 270 27 300 8 C325 25 350 25 375 8" />
        {Array.from({ length: 7 }, (_, index) => <Bulb key={index} x={25 + index * 50} y={18} index={index} />)}
      </svg>
      <button
        className={`${styles.pull} ${isHovered ? styles.pulled : ""}`}
        type="button"
        aria-label={isOn ? "Погасить новогоднюю гирлянду" : "Зажечь новогоднюю гирлянду"}
        aria-pressed={isOn}
        title={isOn ? "Погасить гирлянду" : "Зажечь гирлянду"}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
        onClick={() => setIsOn((on) => !on)}
      >
        <span className={styles.pullCord} aria-hidden="true" />
        <span className={styles.pullOrnament} aria-hidden="true">
          <img className={styles.pullIcon} src={publicAsset("/images/holiday-star-switch.svg")} alt="" />
        </span>
      </button>
    </div>
  );
}

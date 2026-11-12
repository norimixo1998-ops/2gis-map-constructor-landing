import styles from "./AiChat.module.css";

export function ChatLauncherIcon() {
  return (
    <svg className={styles.launcherArtwork} width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <defs>
        <filter id="chat-launcher-glow" x="-46.6613" y="-55.6314" width="132.198" height="151.815" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="7.15" />
        </filter>
        <filter id="chat-launcher-soft-light" x="-51.6613" y="-60.6314" width="142.198" height="161.815" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="9.65" />
        </filter>
        <linearGradient id="chat-launcher-gradient" x1="52.0818" y1="87.0015" x2="-18.7166" y2="-9.63223" gradientUnits="userSpaceOnUse">
          <stop stopColor="#189C1C" />
          <stop offset="1" stopColor="#202020" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="chat-launcher-radial" cx="0" cy="0" r="1" gradientTransform="matrix(61.2109 13.6001 -5.17245 64.1226 29.3867 31.8683)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#002702" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <clipPath id="chat-launcher-clip">
          <rect width="56" height="56" rx="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#chat-launcher-clip)">
        <rect width="56" height="56" rx="16" fill="#242A2D" />
        <g filter="url(#chat-launcher-glow)">
          <path d="M27.1077 36.7075L24.55 -41.3313C30.9829 -37.7885 48.4388 -16.9328 66.7996 38.1469C85.1603 93.2266 41.9866 85.6635 20.3944 72.1455L-32.3604 65.8491L27.1077 36.7075Z" fill="url(#chat-launcher-gradient)" />
        </g>
        <g filter="url(#chat-launcher-soft-light)" style={{ mixBlendMode: "soft-light" }}>
          <path d="M27.1077 36.7075L24.55 -41.3313C30.9829 -37.7885 48.4388 -16.9328 66.7996 38.1469C85.1603 93.2266 41.9866 85.6635 20.3944 72.1455L-32.3604 65.8491L27.1077 36.7075Z" fill="url(#chat-launcher-radial)" />
        </g>
        <path className={styles.launcherSmallStar} d="M20.6174 13.3336L21.9995 17.0686C22.3709 18.0723 23.1622 18.8636 24.1658 19.235L27.9008 20.617L24.1658 21.9991C23.1622 22.3705 22.3709 23.1618 21.9995 24.1655L20.6174 27.9005L19.2353 24.1655C18.8639 23.1618 18.0726 22.3705 17.069 21.9991L13.334 20.617L17.069 19.235C18.0726 18.8636 18.8639 18.0723 19.2353 17.0686L20.6174 13.3336Z" fill="white" fillOpacity="0.8" />
        <path className={styles.launcherLargeStar} d="M31.7435 20.3193L33.8166 25.9218C34.3737 27.4273 35.5606 28.6143 37.0661 29.1714L42.6686 31.2445L37.0661 33.3176C35.5606 33.8747 34.3737 35.0616 33.8166 36.5671L31.7435 42.1696L29.6704 36.5671C29.1133 35.0616 27.9263 33.8747 26.4209 33.3176L20.8184 31.2445L26.4209 29.1714C27.9263 28.6143 29.1133 27.4273 29.6704 25.9218L31.7435 20.3193Z" fill="white" />
      </g>
      <path d="M16 .5H40C48.5604 .5 55.5 7.43959 55.5 16V40C55.5 48.5604 48.5604 55.5 40 55.5H16C7.43959 55.5 .5 48.5604 .5 40V16C.5 7.43959 7.43959 .5 16 .5Z" stroke="white" strokeOpacity="0.04" />
    </svg>
  );
}

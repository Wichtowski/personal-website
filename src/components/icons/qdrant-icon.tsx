type IconProps = {
  size?: number;
  className?: string;
};

export function QdrantIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3.25a8.75 8.75 0 1 1 0 17.5a8.75 8.75 0 0 1 0-17.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 8.2 12 12l4.6-3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 15.8 12 12l4.6 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" />
      <circle cx="7.3" cy="8.2" r="1.05" fill="currentColor" />
      <circle cx="16.7" cy="8.2" r="1.05" fill="currentColor" />
      <circle cx="16.7" cy="15.8" r="1.05" fill="currentColor" />
      <circle cx="7.3" cy="15.8" r="1.05" fill="currentColor" />
    </svg>
  );
}

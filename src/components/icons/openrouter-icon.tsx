type IconProps = {
  size?: number;
  className?: string;
};

export function OpenRouterIcon({ size = 18, className }: IconProps) {
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
        d="M6 12.75V8.8c0-.99.8-1.8 1.8-1.8h3.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 11.25v3.95c0 .99-.8 1.8-1.8 1.8h-3.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 15.5h2.95l3.8-7.02"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="7" r="1.25" fill="currentColor" />
      <circle cx="18" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

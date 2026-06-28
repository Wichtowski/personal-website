type IconProps = {
  size?: number;
  className?: string;
};

export function WindowsIcon({ size = 18, className }: IconProps) {
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
      <path d="M3.25 6.2 11 4.9v7.25H3.25V6.2Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M12.25 4.68 20.75 3.25V12H12.25V4.68Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M3.25 13h7.75v7.25L3.25 19.1V13Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M12.25 13h8.5v7.75l-8.5-1.45V13Z" fill="currentColor" fillOpacity="0.95" />
    </svg>
  );
}

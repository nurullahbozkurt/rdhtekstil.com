import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGOS = {
  dark: { src: "/logo-rdh-dark.png", width: 1662, height: 553 },
  light: { src: "/logo-rdh-light.png", width: 2482, height: 741 },
} as const;

export function Logo({
  href,
  label,
  variant = "dark",
  className,
  preload,
}: {
  href: string;
  label: string;
  variant?: keyof typeof LOGOS;
  className?: string;
  preload?: boolean;
}) {
  const logo = LOGOS[variant];
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={logo.src}
        alt={label}
        width={logo.width}
        height={logo.height}
        preload={preload}
        sizes="160px"
        className="h-full w-auto"
      />
    </Link>
  );
}

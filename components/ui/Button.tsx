import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AnchorProps = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Primary — moss fill, paper text
  primary: "bg-moss text-paper hover:bg-moss-deep",
  // Secondary — bordered on paper-deep
  secondary:
    "border border-ink bg-paper-deep text-ink hover:border-moss hover:text-moss",
  // Ghost — text only, moss on hover
  ghost: "text-ink hover:text-moss",
};

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(anchorRest as object)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonProps)}>
      {children}
    </button>
  );
}

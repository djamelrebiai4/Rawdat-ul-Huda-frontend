import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
};

export function NavLink({ href, children, className, isActive }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;

  return (
    <Link
      href={href}
      prefetch
      aria-current={active ? "page" : undefined}
      className={cn(
        "nav-link",
        active && "text-green-500",
        className
      )}
    >
      {children}
    </Link>
  );
}
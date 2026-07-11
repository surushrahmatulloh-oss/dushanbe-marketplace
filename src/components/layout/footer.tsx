import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden md:block border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-teal-800 via-primary to-teal-400 text-white font-bold">
              D
            </div>
            <span className="font-bold">
              Dushanbe <span className="text-primary">Маркетплейс</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/categories" className="hover:text-primary">
              Категорияҳо
            </Link>
            <Link href="/sell" className="hover:text-primary">
              Ҷойгиркунӣ
            </Link>
            <Link href="/dashboard" className="hover:text-primary">
              Утоқи ман
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dushanbe Маркетплейс
        </p>
      </div>
    </footer>
  );
}

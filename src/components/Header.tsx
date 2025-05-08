// src/components/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackagePlus, ShoppingBag } from 'lucide-react'; // Using ShoppingBag for app icon

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" legacyBehavior passHref>
          <a className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
            <ShoppingBag className="h-8 w-8" />
            WhataShop
          </a>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/admin/add-product">
              <PackagePlus className="mr-2 h-5 w-5" />
              Add Product
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

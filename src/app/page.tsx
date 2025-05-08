// src/app/page.tsx
import { getProducts } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/product';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const revalidate = 60; // Revalidate data every 60 seconds

export default async function HomePage() {
  const products: Product[] = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">No products found</h1>
        <p className="text-muted-foreground mb-6">
          It seems there are no products available at the moment.
          <br />
          If you are an admin, you can add new products.
        </p>
        <Button asChild>
          <Link href="/admin/add-product">Add New Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// src/components/ProductForm.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ProductFormData } from '@/types/product';
import { addProductAction } from '@/app/actions'; // Server action
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).or(z.literal("")).optional(), // Allow empty for placeholder
});

export default function ProductForm() {
  const { toast } = useToast();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
    },
  });

  async function onSubmit(values: ProductFormData) {
    const formDataWithFallbackImage = {
      ...values,
      imageUrl: values.imageUrl || "", // Ensure empty string if not provided, action will handle this
    };
    
    const result = await addProductAction(formDataWithFallbackImage);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to add product. Please check console for errors.",
        variant: "destructive",
      });
      // For field-specific errors from server validation (if implemented in action)
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const fieldName = field as keyof ProductFormData;
          if (Array.isArray(messages)) {
            form.setError(fieldName, { type: 'server', message: messages.join(', ') });
          }
        });
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
        <CardDescription>Fill in the details below to add a new product to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stylish T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 29.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to the product image. Leave empty to use a default placeholder.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

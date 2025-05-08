// src/app/actions.ts
"use server";

import { addProductToFirestore } from '@/lib/firebase';
import type { ProductFormData } from '@/types/product';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  imageUrl: z.string().url("Image URL must be a valid URL.").or(z.literal("")), // Allow empty string for placeholder
});

export async function addProductAction(formData: ProductFormData) {
  const validatedFields = productSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { productId: newProductId, error: firestoreError } = await addProductToFirestore(validatedFields.data);
    
    if (newProductId) {
      revalidatePath('/'); // Revalidate product list page
      revalidatePath('/admin/add-product'); // Revalidate the add product page itself
      return { success: true, message: "Product added successfully!" };
    } else {
      // If newProductId is null, an error must have occurred.
      // firestoreError should be a non-empty string from addProductToFirestore.
      const finalMessage = (firestoreError && firestoreError.trim() !== "")
        ? firestoreError
        : "Failed to add product. An unknown internal error occurred during the database operation.";
      return { success: false, message: finalMessage };
    }
  } catch (error) { 
    console.error("addProductAction unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Action failed: ${errorMessage}` };
  }
}
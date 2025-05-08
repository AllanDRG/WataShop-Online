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
    const newProductId = await addProductToFirestore(validatedFields.data);
    if (newProductId) {
      revalidatePath('/'); // Revalidate product list page
      revalidatePath('/admin/add-product'); // Revalidate the add product page itself (e.g. for clearing form or redirect)
      return { success: true, message: "Product added successfully!" };
    } else {
      return { success: false, message: "Failed to add product to database." };
    }
  } catch (error) {
    console.error("addProductAction error:", error);
    // Ensure the message is a string
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to add product: ${errorMessage}` };
  }
}

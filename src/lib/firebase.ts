import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Product, ProductFormData } from '@/types/product';

// Configuration directly from user prompt
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let db: any; 

// Validate essential configuration first
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is not configured. Check .env.local."
  );
  // Depending on how critical Firebase is at init, you might throw an error
  // or allow the app to load in a degraded state. For this app, it's critical.
  // throw new Error("Firebase API Key is not configured.");
} else if (!firebaseConfig.projectId) {
   console.error(
    "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is not configured. Check .env.local."
  );
  // throw new Error("Firebase Project ID is not configured.");
}


if (!getApps().length) {
  try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) { // Only initialize if config is present
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } else {
        console.error("Firebase initialization skipped due to missing API Key or Project ID.");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  app = getApps()[0];
  try {
    db = getFirestore(app);
  } catch (error) {
     console.error("Firebase getFirestore error on re-init:", error);
  }
}


const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  if (!db) {
    console.warn("Firestore is not initialized. Cannot fetch products.");
    return [];
  }
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      } as Product;
    });
    return productList;
  } catch (error) {
    console.error("Error fetching products (check Firestore rules and internet connection): ", error);
    return []; 
  }
}

interface AddProductResult {
  productId: string | null;
  error?: string;
}

export async function addProductToFirestore(productData: ProductFormData): Promise<AddProductResult> {
  if (!db) {
    const errorMessage = "Firestore is not initialized. Cannot add product.";
    console.warn(errorMessage);
    return { productId: null, error: errorMessage };
  }
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const dataToSave = {
      ...productData,
      price: Number(productData.price) // Ensure price is stored as a number
    };
    const docRef = await addDoc(productsCol, dataToSave);

    if (docRef && typeof docRef.id === 'string' && docRef.id.length > 0) {
        return { productId: docRef.id };
    } else {
        const errorMessage = "Failed to retrieve a valid product ID after adding to Firestore; the document reference or ID was unexpectedly missing or invalid.";
        console.error(errorMessage, "Raw docRef:", docRef);
        return { productId: null, error: errorMessage };
    }

  } catch (error: any) { 
    const errorMessage = error.message || "Unknown error adding product to Firestore.";
    console.error("Error adding product to Firestore (check Firestore rules, data, and internet connection): ", error);
    const specificError = error.code ? `Firestore error (${error.code}): ${errorMessage}` : `Firestore error: ${errorMessage}`;
    return { productId: null, error: specificError }; 
  }
}

export { db, app as firebaseApp };
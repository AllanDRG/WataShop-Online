import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Product, ProductFormData } from '@/types/product';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: any; // Use 'any' for db to avoid errors if app is undefined initially

// Check if Firebase is already initialized to prevent re-initialization
if (!getApps().length) {
  // Validate essential configuration only if we are about to initialize
  // This helps avoid build errors if env vars are set only at runtime.
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "Firebase API Key or Project ID is not configured. Features relying on Firebase may not work. Please check your .env.local file."
    );
    // app and db will remain undefined, functions using them should handle this
  } else {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
    } catch (error) {
      console.error("Firebase initialization error:", error);
      // app and db might still be undefined if initialization fails
    }
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
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
    console.error("Error fetching products: ", error);
    return []; 
  }
}

export async function addProductToFirestore(productData: ProductFormData): Promise<string | null> {
  if (!db) {
    console.warn("Firestore is not initialized. Cannot add product.");
    return null;
  }
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    const dataToSave = {
      ...productData,
      price: Number(productData.price)
    };
    const docRef = await addDoc(productsCol, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    return null; 
  }
}

// Export db instance if needed by other parts of the app, but be aware it might be undefined.
export { db, app as firebaseApp };

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

// Validate essential configuration
if (!firebaseConfig.apiKey) {
  throw new Error(
    "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is not configured. Please set it in your .env.local file."
  );
}
if (!firebaseConfig.projectId) {
  throw new Error(
    "Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is not configured. Please set it in your .env.local file."
  );
}


let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
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
    // In a real app, you might want to throw the error or handle it more gracefully
    // For now, returning empty array and logging helps identify if this is the source of an issue on the page
    return []; 
  }
}

export async function addProductToFirestore(productData: ProductFormData): Promise<string | null> {
  try {
    const productsCol = collection(db, PRODUCTS_COLLECTION);
    // Ensure price is stored as a number if it's coming from a form
    const dataToSave = {
      ...productData,
      price: Number(productData.price)
    };
    const docRef = await addDoc(productsCol, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    // In a real app, you might want to throw the error or handle it more gracefully
    return null; 
  }
}

export { db };

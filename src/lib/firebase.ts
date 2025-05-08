import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Product, ProductFormData } from '@/types/product';

// Configuration directly from user prompt
const firebaseConfig = {
  apiKey: "AIzaSyC5k9GIA0MHZWlpDwerHVwFkpEVb_YzRCA",
  authDomain: "whatashop-ef462.firebaseapp.com",
  databaseURL: "https://whatashop-ef462-default-rtdb.firebaseio.com",
  projectId: "whatashop-ef462",
  storageBucket: "whatashop-ef462.appspot.com", 
  messagingSenderId: "291121568560",
  appId: "1:291121568560:web:79ae47a1cf70f3197606f5"
};

let app: FirebaseApp | undefined;
let db: any; 

if (!getApps().length) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      "Firebase API Key or Project ID is missing in the hardcoded configuration. This is unexpected."
    );
  }
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
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
    return { productId: docRef.id };
  } catch (error: any) { // Catch as any to access error.message or other properties
    const errorMessage = error.message || "Unknown error adding product to Firestore.";
    console.error("Error adding product to Firestore (check Firestore rules, data, and internet connection): ", error);
    // It's helpful to log the full error object or relevant parts like error.code if available
    // For FirebaseError, error.code can be very informative (e.g., 'permission-denied')
    const specificError = error.code ? `Firestore error (${error.code}): ${errorMessage}` : `Firestore error: ${errorMessage}`;
    return { productId: null, error: specificError }; 
  }
}

export { db, app as firebaseApp };

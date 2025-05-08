import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Product, ProductFormData } from '@/types/product';

// Configuration directly from user prompt
const firebaseConfig = {
  apiKey: "AIzaSyC5k9GIA0MHZWlpDwerHVwFkpEVb_YzRCA",
  authDomain: "whatashop-ef462.firebaseapp.com",
  databaseURL: "https://whatashop-ef462-default-rtdb.firebaseio.com",
  projectId: "whatashop-ef462",
  storageBucket: "whatashop-ef462.appspot.com", // Corrected from firebasestorage.app
  messagingSenderId: "291121568560",
  appId: "1:291121568560:web:79ae47a1cf70f3197606f5"
};

let app: FirebaseApp | undefined;
let db: any; // Use 'any' for db to avoid errors if app is undefined initially

// Check if Firebase is already initialized to prevent re-initialization
if (!getApps().length) {
  // API key is now hardcoded from user, so primary check isn't strictly for presence
  // but more for successful initialization.
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    // This case should ideally not be hit if config is correctly hardcoded.
    // Kept for robustness, though the previous error was about permissions.
    console.error(
      "Firebase API Key or Project ID is missing in the hardcoded configuration. This is unexpected."
    );
  }
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // app and db might still be undefined if initialization fails
  }
} else {
  app = getApps()[0];
  // Ensure db is initialized if app was already initialized
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
    // The error "Missing or insufficient permissions" typically indicates Firestore security rules issues.
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
      price: Number(productData.price) // Ensure price is stored as a number
    };
    const docRef = await addDoc(productsCol, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product (check Firestore rules and internet connection): ", error);
    // The error "Missing or insufficient permissions" typically indicates Firestore security rules issues.
    return null; 
  }
}

// Export db instance if needed by other parts of the app, but be aware it might be undefined.
export { db, app as firebaseApp };

# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up Environment Variables:**
    Copy the example environment file `.env.local.example` to a new file named `.env.local`:
    ```bash
    cp .env.local.example .env.local
    ```
    Open `.env.local` and fill in your Firebase project credentials and any other required variables. You can find your Firebase project configuration in the Firebase console:
    *   Go to your Firebase project.
    *   Click on "Project settings" (the gear icon).
    *   Under the "General" tab, scroll down to "Your apps".
    *   If you haven't registered a web app, do so.
    *   Find the "SDK setup and configuration" section and select "Config".
    *   Copy the necessary values (`apiKey`, `authDomain`, `projectId`, etc.) into your `.env.local` file.
    
    **Ensure the following variables are correctly set for WhataShop:**
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC5k9GIA0MHZWlpDwerHVwFkpEVb_YzRCA
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=whatashop-ef462.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://whatashop-ef462-default-rtdb.firebaseio.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=whatashop-ef462
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=whatashop-ef462.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=291121568560
    NEXT_PUBLIC_FIREBASE_APP_ID=1:291121568560:web:79ae47a1cf70f3197606f5
    NEXT_PUBLIC_STORE_PHONE_NUMBER=your_whatsapp_number_here # e.g., 15551234567 (no + or symbols)
    ```

3.  **Configure Firestore Security Rules:**
    Firebase Firestore requires security rules to control access to your data. For development, you can use permissive rules, but **these must be secured before going to production.**
    *   Go to your Firebase project in the Firebase Console.
    *   Navigate to **Firestore Database** under the **Build** section.
    *   Click on the **Rules** tab.
    *   Copy the content of the `firestore.rules` file (located in the root of this project) and paste it into the rules editor.
    *   Click **Publish**.
    *   **Important**: Review and update these rules for production to ensure your data is secure. The example rules allow anyone to read and write to the `products` collection. Refer to the [Firebase Firestore Security Rules documentation](https://firebase.google.com/docs/firestore/security/get-started) for more information.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002) by default (as per package.json script).

To get started with customizing the app, take a look at `src/app/page.tsx`.

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

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002) by default (as per package.json script).

To get started with customizing the app, take a look at `src/app/page.tsx`.

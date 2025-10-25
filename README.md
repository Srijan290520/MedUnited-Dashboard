# MedUnited Hospitals - Care Dashboard

This is a dashboard for MedUnited Hospitals' customer care team to manage outbound patient feedback calls. It's built with React, TypeScript, and Vite, and it uses Google Sheets as a database backend.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To run the app locally for development, use the following command. This will start a local server, and you can view the app in your browser at the URL provided (usually `http://localhost:5173`).

```bash
npm run dev
```

## Deployment to GitHub Pages

Follow these steps to deploy your dashboard to a free public URL using GitHub Pages.

### Step 1: Create a GitHub Repository

If you haven't already, create a new repository on [GitHub.com](https://github.com/new).

### Step 2: Configure Project Files

You need to tell the project where it will be hosted.

1.  **`package.json`**:
    Open the `package.json` file and find the `"homepage"` line. Replace `<YOUR_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your GitHub username and the name of your repository.

    ```json
    // Before
    "homepage": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>",

    // After (example)
    "homepage": "https://john-doe.github.io/medunited-dashboard",
    ```

2.  **`vite.config.ts`**:
    Open `vite.config.ts` and find the `base` property. Replace `/<YOUR_REPOSITORY_NAME>/` with the name of your repository, making sure to include the slashes.

    ```typescript
    // Before
    base: '/<YOUR_REPOSITORY_NAME>/',

    // After (example)
    base: '/medunited-dashboard/',
    ```

### Step 3: Push Your Code to GitHub

Commit your changes and push them to your GitHub repository.

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

### Step 4: Run the Deploy Script

This single command will build your application and push the final static files to a special `gh-pages` branch in your repository, which GitHub will use to host your site.

```bash
npm run deploy
```

### Step 5: Configure GitHub Repository Settings

1.  Go to your repository on GitHub.
2.  Click on the **"Settings"** tab.
3.  In the left sidebar, click on **"Pages"**.
4.  Under "Build and deployment", for the **"Source"**, select **"Deploy from a branch"**.
5.  Set the branch to **`gh-pages`** and the folder to **`/ (root)`**.
6.  Click **"Save"**.

After a few minutes, your site will be live at the URL specified in the `homepage` field of your `package.json`.

# Vue 3 Project Setup Guide

This guide will walk you through setting up a Vue 3 project from your repository, configuring necessary environment variables, setting up a Supabase project, and obtaining the TMDB API key.

---

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/).
2.  **npm**: Comes with Node.js installation.
3.  **Git**: Ensure you have Git installed. [Download Git](https://git-scm.com/).

---

## 1\. Clone the Repository

Clone the repository to your local machine:

```
git clone <your-repo-url>
cd <your-repo-name>

```

---

## 2\. Create Environment Variables File

Create a `.env` file in the root of your project and add the following keys and values:

```
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
SUPABASE_PROJECT_REF=

# TMDB API Key
VITE_TMDB_API_KEY=

# Testing User Email
TESTING_USER_EMAIL=

```

Replace the placeholders with actual values:

- **Supabase** values are explained in the next step.
- **TMDB API Key** value is obtained in Step 5.

---

## 3\. Setup Supabase Project

### 3.1. Create a Supabase Account

1.  Visit [Supabase](https://supabase.com/) and sign up for an account.
2.  Create a new project and copy the following details:
    - `VITE_SUPABASE_URL`: Found in the project settings.
    - `VITE_SUPABASE_API_KEY`: Found in the API settings (public key).
    - `SUPABASE_URL`: Same as `VITE_SUPABASE_URL`.
    - `SUPABASE_SERVICE_ROLE`: Found in the API settings (service role key).
    - `SUPABASE_PROJECT_REF`: Project reference from the dashboard URL.

### 3.2. Initialize Supabase in the Project

Run the following commands in the terminal:

```
npm run supabase:init
npm run supabase:login
npm run supabase:link
npm run db:reset
npm run supabase:types

```

---

## 4\. Install Dependencies

Install the necessary packages:

```
npm install

```

---

## 5\. Obtain TMDB API Key

1.  Sign up or log in to [TMDB](https://www.themoviedb.org/).
2.  Navigate to your account settings and select **API**.
3.  Apply for an API key if you don't have one.
4.  Once approved, copy the key and paste it into your `.env` file under `VITE_TMDB_API_KEY`.

---

## 6\. Run the Project

After completing all the steps, start the development server:

```
npm run dev

```

You are now all set to go! 🎉

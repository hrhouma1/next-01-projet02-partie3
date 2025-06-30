# Module 2 – Création du formulaire Create Invoice (/invoices/new)

## Objectif pédagogique

À la fin de ce module, l'étudiant doit être capable de :

1. Installer et configurer correctement TailwindCSS v3 dans un projet Next.js 15
2. Générer une route App Router pour `/invoices/new`
3. Installer et utiliser des composants shadcn/ui
4. Construire un formulaire complet, stylé et fonctionnel
5. Intégrer React Hook Form pour la validation et la soumission
6. Configurer une base de données avec Drizzle ORM et Xata
7. Créer des API routes fonctionnelles

---

## Pré-requis techniques

* Node >= 18 et npm
* Projet Next.js 15 généré avec :
  ```bash
  npx create-next-app@latest my-invoicing-app --typescript --tailwind --eslint --app --src-dir
  cd my-invoicing-app
  ```

**IMPORTANT**: Même si TailwindCSS est coché lors de la génération, Next.js 15 installe souvent TailwindCSS v4 (beta) qui est incompatible. Nous devons migrer vers TailwindCSS v3 stable.

---

## Section A – Configuration TailwindCSS v3 (OBLIGATOIRE)

### 1. Vérification et migration TailwindCSS

```bash
# Vérifier la version actuelle
npm list tailwindcss

# Désinstaller TailwindCSS v4 (si présent)
npm uninstall tailwindcss @tailwindcss/postcss

# Vérifier la suppression
npm list tailwindcss

# Installer TailwindCSS v3 stable
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Vérifier l'installation
npm list tailwindcss

# Installer le module manquant
npm install tailwindcss-animate
```

### 2. Configuration postcss.config.mjs

Créer ou modifier `postcss.config.mjs` :

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

### 3. Configuration tailwind.config.js

Remplacer le contenu de `tailwind.config.js` :

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 4. Configuration src/app/globals.css

Remplacer le contenu de `src/app/globals.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
```

### 5. Correction layout.tsx

Modifier `src/app/layout.tsx` pour éviter les erreurs d'hydratation :

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Invoicing App",
  description: "Application de facturation moderne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 6. Test de la configuration

Modifier `src/app/page.tsx` pour tester TailwindCSS :

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Bienvenue sur My Invoicing App
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            TailwindCSS v3 est maintenant configuré et fonctionne parfaitement !
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Test Button 1
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
              Test Button 2
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### 7. Redémarrage et vérification

```bash
# Supprimer le cache (important)
rm -rf .next

# Redémarrer le serveur
npm run dev
```

Vérifier que `http://localhost:3000` affiche correctement la page avec les styles TailwindCSS.

---

## Étape 1 – Création de l'arborescence /invoices/new

### 1. Création des dossiers

```bash
mkdir -p src/app/invoices/new
```

### 2. Création du fichier page.tsx

Créer `src/app/invoices/new/page.tsx` :

```tsx
export default function NewInvoicePage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Créer une nouvelle facture
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">
            Formulaire de création de facture en cours de développement...
          </p>
        </div>
      </div>
    </main>
  );
}
```

### 3. Vérification

Naviguer vers `http://localhost:3000/invoices/new` et vérifier que la page s'affiche correctement.

---

## Étape 2 – Installation des composants shadcn/ui

### 1. Initialisation shadcn/ui

```bash
npx shadcn@latest init
```

Répondre aux questions :
- Would you like to use TypeScript? → **Yes**
- Which style? → **New York** (Recommended)
- Which color? → **Neutral**
- Where is your global CSS file? → **src/app/globals.css**
- Would you like to use CSS variables? → **Yes**
- Where is your tailwind.config.js? → **tailwind.config.js**
- Configure components.json? → **Yes**
- Where is your tsconfig.json? → **tsconfig.json**

### 2. Installation des composants nécessaires

```bash
npx shadcn@latest add input label textarea button
```

### 3. Installation de React Hook Form

```bash
npm install react-hook-form
```

---

## Étape 3 – Création du formulaire fonctionnel

Remplacer le contenu de `src/app/invoices/new/page.tsx` :

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InvoiceFormData {
  customer: string;
  email: string;
  value: string;
  description: string;
}

export default function NewInvoicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InvoiceFormData>();

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Facture créée avec succès !');
        reset();
      } else {
        const error = await response.json();
        setSubmitMessage(`Erreur : ${error.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setSubmitMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Créer une nouvelle facture
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom du client */}
            <div>
              <Label htmlFor="customer" className="block font-semibold text-sm mb-2">
                Nom du client *
              </Label>
              <Input
                id="customer"
                type="text"
                className="w-full"
                {...register('customer', { 
                  required: 'Le nom du client est requis',
                  minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                })}
              />
              {errors.customer && (
                <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block font-semibold text-sm mb-2">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Montant */}
            <div>
              <Label htmlFor="value" className="block font-semibold text-sm mb-2">
                Montant (€) *
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full"
                {...register('value', { 
                  required: 'Le montant est requis',
                  min: { value: 0.01, message: 'Le montant doit être supérieur à 0' }
                })}
              />
              {errors.value && (
                <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="block font-semibold text-sm mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                className="w-full"
                {...register('description')}
              />
            </div>

            {/* Message de retour */}
            {submitMessage && (
              <div className={`p-4 rounded-md ${
                submitMessage.includes('succès') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer la facture'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
```

---

## Étape 4 – Configuration de la base de données

### 1. Installation des dépendances

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg ts-node dotenv dotenv-cli
```

### 2. Configuration des variables d'environnement

Créer `.env.local` à la racine du projet :

```env
XATA_API_KEY=votre_cle_api_xata
XATA_DATABASE_URL=votre_url_postgresql_xata
```

**Note**: Remplacez par vos vraies credentials Xata.

### 3. Création du schéma de base de données

Créer `src/db/schema.ts` :

```typescript
import { pgTable, integer, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
  id:          integer("id").primaryKey().notNull(),
  customer:    varchar("customer", { length: 120 }).notNull(),
  email:       varchar("email",    { length: 160 }).notNull(),
  value:       numeric("value").notNull(),
  description: varchar("description", { length: 255 }),
  status:      varchar("status", { length: 32 }).default("open"),
  createdAt:   timestamp("created_at").defaultNow(),
});
```

### 4. Configuration de la connexion

Créer `src/db/index.ts` :

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL,
  max: 20,
});

export const db = drizzle(pool);
```

### 5. Configuration Drizzle Kit

Créer `drizzle.config.ts` à la racine :

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.XATA_DATABASE_URL!,
  },
});
```

### 6. Scripts npm

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate": "dotenv -e .env.local -- drizzle-kit generate",
    "migrate": "dotenv -e .env.local -- drizzle-kit migrate",
    "push": "dotenv -e .env.local -- drizzle-kit push"
  }
}
```

---

## Étape 5 – Création de l'API

### 1. Création du fichier API

Créer `src/app/api/invoices/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('API POST /api/invoices - Début de la requête');
    
    const body = await request.json();
    console.log('Body reçu:', JSON.stringify(body, null, 2));
    
    const { customer, email, value, description } = body;

    // Validation basique
    if (!customer || !email || !value) {
      console.log('Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Les champs customer, email et value sont requis' },
        { status: 400 }
      );
    }

    console.log('Validation réussie');
    
    // Obtenir le prochain ID disponible
    console.log('Recherche du prochain ID disponible...');
    const maxIdResult = await db.execute(sql`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM invoices`);
    const nextAvailableId = maxIdResult.rows[0]?.next_id || 1;
    console.log('Prochain ID disponible:', nextAvailableId);
    
    const insertData = {
      id: Number(nextAvailableId),
      customer,
      email,
      value: value.toString(),
      description: description || null,
      status: 'open' as const
    };
    
    console.log('Données à insérer:', insertData);
    console.log('Tentative d\'insertion en base...');
    
    const result = await db.insert(invoices).values(insertData).returning();
    
    console.log('Insertion réussie:', result);
    
    return NextResponse.json({ 
      success: true, 
      invoice: result[0],
      message: 'Facture créée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur dans POST /api/invoices:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la facture' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('API GET /api/invoices - Récupération des factures');
    
    const allInvoices = await db.select().from(invoices);
    
    console.log('Factures récupérées:', allInvoices.length);
    
    return NextResponse.json({
      success: true,
      invoices: allInvoices
    });
    
  } catch (error) {
    console.error('Erreur dans GET /api/invoices:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}
```

---

## Étape 6 – Génération et exécution des migrations

### 1. Génération des migrations

```bash
npm run generate
```

### 2. Exécution des migrations

```bash
npm run push
```

**Note**: Si vous avez des erreurs, vérifiez que :
- Le fichier `.env.local` existe et contient les bonnes variables
- Xata est accessible depuis votre réseau
- Les credentials sont corrects

---

## Étape 7 – Test de l'application

### 1. Redémarrage du serveur

```bash
# Supprimer le cache
rm -rf .next

# Redémarrer
npm run dev
```

### 2. Test du formulaire

1. Naviguer vers `http://localhost:3000/invoices/new`
2. Remplir le formulaire avec des données valides
3. Cliquer sur "Créer la facture"
4. Vérifier que le message de succès s'affiche

### 3. Test de l'API

Vous pouvez tester l'API directement :

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{"customer":"Test Client","email":"test@example.com","value":"50.00","description":"Facture de test"}'
```

---

## Étape 8 – Page de liste des factures (Bonus)

### 1. Création de la page liste

Créer `src/app/invoices/page.tsx` :

```tsx
import { db } from '@/db';
import { invoices } from '@/db/schema';

export default async function InvoicesPage() {
  const allInvoices = await db.select().from(invoices);
  
  const totalAmount = allInvoices.reduce((sum, invoice) => {
    return sum + parseFloat(invoice.value || '0');
  }, 0);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Liste des factures
          </h1>
          <a
            href="/invoices/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nouvelle facture
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {allInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-4">Aucune facture trouvée</p>
              <a
                href="/invoices/new"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Créer votre première facture
              </a>
            </div>
          ) : (
            <>
              <div className="p-6 bg-gray-50 border-b">
                <p className="text-lg font-semibold text-gray-700">
                  Total : {totalAmount.toFixed(2)} €
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.customer}
                          </div>
                          {invoice.description && (
                            <div className="text-sm text-gray-500">
                              {invoice.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {parseFloat(invoice.value || '0').toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'open' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
```

### 2. Mise à jour de la page d'accueil

Modifier `src/app/page.tsx` :

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Bienvenue sur My Invoicing App
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-6">
            Application de facturation moderne développée avec Next.js 15, TailwindCSS v3, et Drizzle ORM.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/invoices/new" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Créer une facture
            </a>
            <a 
              href="/invoices" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Voir les factures
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## Résolution des problèmes courants

### 1. Erreur TailwindCSS

Si vous avez des erreurs de style :
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### 2. Erreur de base de données

Si l'API retourne une erreur 500 :
- Vérifiez que `.env.local` existe et contient les bonnes variables
- Vérifiez la connexion à Xata
- Consultez les logs du serveur dans la console

### 3. Erreur de migration

Si `npm run push` échoue :
```bash
npm run generate
npm run push
```

### 4. Cache problématique

En cas de problèmes inexpliqués :
```bash
rm -rf .next
npm run dev
```

---

## Conclusion

Vous avez maintenant une application de facturation complète et fonctionnelle avec :

- Interface utilisateur moderne avec TailwindCSS v3
- Formulaires avec validation React Hook Form
- Base de données PostgreSQL via Xata
- API REST fonctionnelle
- CRUD complet pour les factures

L'application est prête pour être étendue avec d'autres fonctionnalités comme l'authentification, la génération de PDF, les notifications, etc. 
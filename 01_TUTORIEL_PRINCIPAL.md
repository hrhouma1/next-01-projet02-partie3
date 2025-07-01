
# Module 2 – Création du formulaire « Create Invoice » (/invoices/new)

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
          Application de Facturation
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            Plateforme moderne de gestion de factures développée avec Next.js 15 et TailwindCSS.
          </p>
          <p className="text-gray-600 mb-6">
            Base de données PostgreSQL intégrée via Drizzle ORM et Xata.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="/dashboard" 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
            >
              Dashboard
            </a>
            <a 
              href="/invoices/new" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
            >
              Créer une facture
            </a>
            <a 
              href="/invoices" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
            >
              Voir les factures
            </a>
            <a 
              href="/test" 
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
            >
              Test Drizzle DB
            </a>
            <a 
              href="/test-api" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold text-center"
            >
              Test API
            </a>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              Paramètres
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

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceForm {
  customer: string;
  email: string;
  value: string;
  description: string;
}

export default function NewInvoicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceForm>();

  const onSubmit = async (data: InvoiceForm) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitResult('Facture créée avec succès ! ID: ' + result.invoice.id);
        setIsSuccess(true);
        reset();
      } else {
        setSubmitResult('Erreur: ' + (result.error || 'Erreur inconnue'));
        setIsSuccess(false);
      }
    } catch (error) {
      setSubmitResult('Erreur de connexion au serveur');
      setIsSuccess(false);
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer une nouvelle facture
          </h1>
          <p className="text-gray-600">
            Remplissez les informations ci-dessous pour créer une facture.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Nom du client *</Label>
                <Input
                  id="customer"
                  {...register('customer', { 
                    required: 'Le nom du client est requis',
                    minLength: { value: 2, message: 'Minimum 2 caractères' }
                  })}
                  placeholder="Ex: Jean Dupont"
                  className={errors.customer ? 'border-red-500' : ''}
                />
                {errors.customer && (
                  <p className="text-sm text-red-500">{errors.customer.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email du client *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  placeholder="client@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Montant (€) *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                {...register('value', {
                  required: 'Le montant est requis',
                  min: { value: 0.01, message: 'Le montant doit être positif' }
                })}
                placeholder="0.00"
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Description des services ou produits..."
                rows={4}
              />
            </div>

            {submitResult && (
              <div className={`p-4 rounded ${
                isSuccess
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {submitResult}
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Création...' : 'Créer la facture'}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                onClick={() => window.history.back()}
                className="px-6"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
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

// Variable globale pour l'ID séquentiel (en production, utiliser une vraie séquence DB)
let nextId = 1;

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/invoices - Début de la requête');
    
    const body = await request.json();
    console.log('[API] Body reçu:', JSON.stringify(body, null, 2));
    
    const { customer, email, value, description } = body;

    // Validation basique
    if (!customer || !email || !value) {
      console.log('[API] Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Les champs customer, email et value sont requis' },
        { status: 400 }
      );
    }

    console.log('[API] Validation réussie');
    
    // Obtenir le prochain ID en interrogeant la base de données
    console.log('[API] Recherche du prochain ID disponible...');
    const maxIdResult = await db.execute(sql`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM invoices`);
    const nextAvailableId = maxIdResult.rows[0]?.next_id || 1;
    
    console.log('[API] Prochain ID disponible:', nextAvailableId);
    
    const insertData = {
      id: Number(nextAvailableId),
      customer,
      email,
      value: value.toString(),
      description: description || null,
      status: 'open' as const
    };
    
    console.log('[API] Données à insérer:', insertData);

    // Insertion dans la base de données
    console.log('[API] Tentative d\'insertion en base...');
    const newInvoice = await db.insert(invoices).values(insertData).returning();

    console.log('[API] Insertion réussie:', JSON.stringify(newInvoice[0], null, 2));

    return NextResponse.json({
      success: true,
      invoice: newInvoice[0],
      message: 'Facture créée avec succès !'
    });

  } catch (error) {
    console.error('[API] Erreur lors de la création de la facture:', error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('[API] Message d\'erreur:', error.message);
      console.error('[API] Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('[API] GET /api/invoices - Récupération des factures');
    
    // Récupération de toutes les factures
    const allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);

    console.log(`[API] ${allInvoices.length} factures récupérées`);

    return NextResponse.json({
      success: true,
      invoices: allInvoices,
      count: allInvoices.length
    });

  } catch (error) {
    console.error('[API] Erreur lors de la récupération des factures:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des factures',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
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
import { Button } from '@/components/ui/button';

type Invoice = typeof invoices.$inferSelect;

export default async function InvoicesPage() {
  let allInvoices: Invoice[] = [];
  let error = null;

  try {
    allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erreur de connexion à la base de données';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Liste des factures
            </h1>
            <p className="text-gray-600">
              Gérez toutes vos factures en un seul endroit.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              asChild
              className="bg-blue-500 hover:bg-blue-600"
            >
              <a href="/invoices/new">
                Nouvelle facture
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline"
            >
              <a href="/">
                Accueil
              </a>
            </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {allInvoices.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucune facture trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par créer votre première facture.
                </p>
                <Button asChild>
                  <a href="/invoices/new" className="inline-flex items-center">
                    Créer ma première facture
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Total: {allInvoices.length} facture{allInvoices.length > 1 ? 's' : ''}
                    </h2>
                    <span className="text-sm text-gray-600">
                      Montant total: {allInvoices.reduce((sum, inv) => sum + parseFloat(inv.value || '0'), 0).toFixed(2)} €
                    </span>
                  </div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
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
                              {invoice.status === 'open' ? 'Ouvert' : invoice.status === 'paid' ? 'Payé' : invoice.status || 'Ouvert'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
        )}
      </div>
    </div>
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

## Module 3 - Création du Dashboard (/dashboard)

### Objectif

Créer une page dashboard moderne qui affiche la liste des factures dans un format épuré et professionnel.

### 1. Création de la route dashboard

```bash
mkdir src/app/dashboard
```

### 2. Création de la page dashboard

Créer `src/app/dashboard/page.tsx` :

```tsx
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { Button } from '@/components/ui/button';

type Invoice = typeof invoices.$inferSelect;

export default async function DashboardPage() {
  let allInvoices: Invoice[] = [];
  let error = null;

  try {
    allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erreur de connexion à la base de données';
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Factures
          </h1>
          <Button 
            asChild
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-2"
            variant="outline"
          >
            <a href="/invoices/new">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une facture
            </a>
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white">
            {allInvoices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucune facture trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par créer votre première facture.
                </p>
                <Button asChild>
                  <a href="/invoices/new" className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer ma première facture
                  </a>
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>Date</div>
                  <div>Client</div>
                  <div>Email</div>
                  <div>Statut</div>
                  <div className="text-right">Montant</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {allInvoices.map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('fr-FR', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </div>
                      </div>
                      
                      {/* Customer */}
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {invoice.customer}
                        </span>
                      </div>
                      
                      {/* Email */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          {invoice.email}
                        </span>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                          {invoice.status === 'open' ? 'Ouvert' : invoice.status === 'paid' ? 'Payé' : invoice.status || 'Ouvert'}
                        </span>
                      </div>
                      
                      {/* Value */}
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-semibold text-gray-900">
                          {parseFloat(invoice.value || '0').toFixed(2)} €
                        </span>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white">
            {allInvoices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucune facture trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par créer votre première facture.
                </p>
                <Button asChild>
                  <a href="/invoices/new" className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer ma première facture
                  </a>
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>Date</div>
                  <div>Customer</div>
                  <div>Email</div>
                  <div>Status</div>
                  <div className="text-right">Value</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {allInvoices.map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </div>
                      </div>
                      
                      {/* Customer */}
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {invoice.customer}
                        </span>
                      </div>
                      
                      {/* Email */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          {invoice.email}
                        </span>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                          {invoice.status || 'open'}
                        </span>
                      </div>
                      
                      {/* Value */}
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-semibold text-gray-900">
                          ${parseFloat(invoice.value || '0').toFixed(2)}
                        </span>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Mise à jour de la page d'accueil

Ajouter le lien dashboard dans `src/app/page.tsx` :

```tsx
<a 
  href="/dashboard" 
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
>
  Dashboard
</a>
```

### 4. Test du dashboard

```bash
# Supprimer le cache
rm -rf .next

# Redémarrer le serveur
npm run dev
```

Accéder à `http://localhost:3000/dashboard` pour voir le résultat.

---

## Conclusion

Vous avez maintenant une application de facturation complète et fonctionnelle avec :

- Interface utilisateur moderne avec TailwindCSS v3
- Formulaires avec validation React Hook Form
- Base de données PostgreSQL via Xata
- API REST fonctionnelle
- CRUD complet pour les factures
- Dashboard moderne et épuré

L'application est prête pour être étendue avec d'autres fonctionnalités comme l'authentification, la génération de PDF, les notifications, etc. 
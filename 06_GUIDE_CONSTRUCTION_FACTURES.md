#  **06_GUIDE PRATIQUE : Construire votre Application de Facturation**

> **Objectif :** Créer de A à Z une application Next.js 15 moderne avec App Router, Drizzle ORM, TailwindCSS et React Hook Form

---

## 📋 **PRÉREQUIS**

Avant de commencer, assurez-vous d'avoir :
- **Node.js 20+** installé (requis pour Next.js 15)
- **npm ou pnpm** pour la gestion des packages
- **Git** pour le versioning
- **VSCode** (recommandé) avec extensions TypeScript
- **Compte Xata** (base de données PostgreSQL gratuite)



# **ÉTAPE 1 : Initialisation du projet Next.js**

### 1.1 Création du projet

```bash
# Créer un nouveau projet Next.js 15 avec TypeScript et TailwindCSS
npx create-next-app@latest mon-app-facturation --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Naviguer dans le dossier
cd mon-app-facturation

# Ouvrir dans VSCode
code .
```

### 1.2 Structure générée

Vérifiez que vous avez cette structure :
```
mon-app-facturation/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.ts
```

### 1.3 Premier test

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000 dans votre navigateur
# Vous devriez voir la page d'accueil Next.js
```

<br/>
<br/>


# **ÉTAPE 2 : Installation des dépendances**

### 2.1 Dépendances principales

```bash
# ORM et base de données
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg

# Composants UI (shadcn/ui)
npx shadcn-ui@latest init

# Formulaires et validation
npm install react-hook-form

# Utilitaires
npm install clsx class-variance-authority
```

### 2.2 Configuration shadcn/ui

Quand shadcn demande la configuration, choisissez :
- **Style :** Default
- **Base color :** Slate
- **CSS variables :** Yes

### 2.3 Installation des composants UI

```bash
# Installer les composants nécessaires
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
```


<br/>
<br/>

# **ÉTAPE 3 : Configuration de la base de données**

### 3.1 Création du compte Xata

1. Allez sur [https://xata.io](https://xata.io)
2. Créez un compte gratuit
3. Créez une nouvelle base de données : `facturation-app`
4. Copiez votre connection string

### 3.2 Configuration des variables d'environnement

Créez le fichier `.env.local` :

```bash
# .env.local
XATA_DATABASE_URL=postgresql://workspace-abc123:password@region.sql.xata.sh:5432/facturation-app?sslmode=require
```

### 3.3 Configuration Drizzle

Créez `drizzle.config.ts` :

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.XATA_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### 3.4 Scripts NPM pour la base de données

Ajoutez dans `package.json` :

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push"
  }
}
```


<br/>
<br/>

# **ÉTAPE 4 : Création du schéma de base de données**

### 4.1 Créer le dossier db

```bash
mkdir src/db
```

### 4.2 Créer le schéma (src/db/schema.ts)

```typescript
import { pgTable, integer, varchar, numeric, timestamp } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().notNull(),
  customer: varchar("customer", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  value: numeric("value").notNull(),
  description: varchar("description", { length: 255 }),
  status: varchar("status", { length: 32 }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types TypeScript inférés automatiquement
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
```

### 4.3 Configuration de la connexion (src/db/index.ts)

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL,
  max: 20,
});

export const db = drizzle(pool);
```

### 4.4 Première migration

```bash
# Générer la migration
npm run db:generate

# Appliquer la migration
npm run db:migrate

# Vérifier avec Drizzle Studio
npm run db:studio
```


<br/>
<br/>

# **ÉTAPE 5 : Configuration de l'interface utilisateur**

### 5.1 Mise à jour du layout principal (src/app/layout.tsx)

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon App Facturation",
  description: "Application de gestion des factures",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  💰 Facturation
                </h1>
                <nav className="space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Accueil
                  </a>
                  <a href="/invoices" className="text-gray-600 hover:text-gray-900">
                    Factures
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
```

### 5.2 Page d'accueil moderne (src/app/page.tsx)

```typescript
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Gestion de <span className="text-blue-600">Facturation</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Créez, gérez et suivez vos factures en toute simplicité avec notre 
          application moderne construite avec Next.js et Drizzle ORM.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/invoices">
              📋 Voir les factures
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/invoices/new">
              ➕ Créer une facture
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Rapide et moderne</h3>
            <p className="text-gray-600">
              Interface construite avec Next.js 15 App Router et TailwindCSS
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Sécurisé</h3>
            <p className="text-gray-600">
              Base de données PostgreSQL avec Drizzle ORM type-safe
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-semibrel mb-2">Responsive</h3>
            <p className="text-gray-600">
              Interface adaptée à tous les écrans et appareils
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```



<br/>
<br/>

# **ÉTAPE 6 : Création de l'API Backend**

### 6.1 Créer le dossier API

```bash
mkdir -p src/app/api/invoices
```

### 6.2 Route API pour les factures (src/app/api/invoices/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';

// GET - Récupérer toutes les factures
export async function GET() {
  try {
    const allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
    
    return NextResponse.json({
      success: true,
      data: allInvoices,
      count: allInvoices.length
    });
  } catch (error) {
    console.error('Erreur GET /api/invoices:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des factures' 
      },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const { customer, email, value, description } = body;
    
    if (!customer || !email || !value) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données manquantes : customer, email et value sont requis' 
        },
        { status: 400 }
      );
    }
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Format email invalide' 
        },
        { status: 400 }
      );
    }
    
    // Validation montant
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Le montant doit être un nombre positif' 
        },
        { status: 400 }
      );
    }
    
    // Générer un ID unique (vous pourriez utiliser une séquence PostgreSQL)
    const newId = Date.now();
    
    // Insertion en base
    const newInvoice = await db.insert(invoices).values({
      id: newId,
      customer,
      email,
      value: numericValue.toString(),
      description: description || null,
      status: 'open'
    }).returning();
    
    return NextResponse.json({
      success: true,
      message: 'Facture créée avec succès',
      data: newInvoice[0]
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur POST /api/invoices:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création de la facture' 
      },
      { status: 500 }
    );
  }
}
```

<br/>
<br/>

# **ÉTAPE 7 : Page de liste des factures**

### 7.1 Créer le dossier invoices

```bash
mkdir src/app/invoices
```

### 7.2 Page de liste (src/app/invoices/page.tsx)

```typescript
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Invoice = typeof invoices.$inferSelect;

export default async function InvoicesPage() {
  let allInvoices: Invoice[] = [];
  let error = null;

  try {
    allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
  } catch (err) {
    console.error('Erreur chargement factures:', err);
    error = 'Impossible de charger les factures';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            📋 Liste des Factures
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez toutes vos factures en un seul endroit
          </p>
        </div>
        
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button asChild>
            <Link href="/invoices/new">
              ➕ Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="mt-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">❌ {error}</div>
          </div>
        ) : allInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune facture
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre première facture
            </p>
            <Button asChild>
              <Link href="/invoices/new">
                Créer une facture
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parseFloat(invoice.value).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'open'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status === 'paid' ? '✅ Payée' : 
                         invoice.status === 'open' ? '⏳ Ouverte' : invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.createdAt 
                        ? new Date(invoice.createdAt).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```



<br/>
<br/>

# **ÉTAPE 8 : Formulaire de création de facture**

### 8.1 Créer le dossier new

```bash
mkdir src/app/invoices/new
```

### 8.2 Types TypeScript (src/types/invoice.ts)

```bash
mkdir src/types
```

```typescript
export interface InvoiceForm {
  customer: string;
  email: string;
  value: string;
  description?: string;
}
```

### 8.3 Page de création (src/app/invoices/new/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceForm } from '@/types/invoice';

export default function NewInvoicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
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
        setSubmitResult('✅ Facture créée avec succès !');
        setIsSuccess(true);
        reset(); // Réinitialiser le formulaire
      } else {
        setSubmitResult(`❌ Erreur : ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitResult('❌ Erreur de connexion au serveur');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ➕ Créer une nouvelle facture
            </h1>
            <p className="mt-2 text-gray-600">
              Remplissez les informations de votre facture
            </p>
          </div>

          {/* Résultat de soumission */}
          {submitResult && (
            <div className={`p-4 rounded-md mb-6 ${
              isSuccess
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitResult}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom du client */}
            <div>
              <Label htmlFor="customer">Nom du client *</Label>
              <Input
                id="customer"
                type="text"
                placeholder="ex: Société ABC"
                {...register('customer', {
                  required: 'Le nom du client est requis'
                })}
                className={errors.customer ? 'border-red-500' : ''}
              />
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customer.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ex: client@societe.com"
                {...register('email', {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide"
                  }
                })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Montant */}
            <div>
              <Label htmlFor="value">Montant (€) *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="ex: 1500.00"
                {...register('value', {
                  required: 'Le montant est requis',
                  min: {
                    value: 0,
                    message: 'Le montant doit être positif'
                  }
                })}
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.value.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="ex: Développement site web e-commerce"
                rows={3}
                {...register('description')}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
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



<br/>
<br/>

# **ÉTAPE 9 : Tests et débogage**

### 9.1 Page de test API (src/app/test-api/page.tsx)

```bash
mkdir src/app/test-api
```

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGetInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateInvoice = async () => {
    setIsLoading(true);
    try {
      const testData = {
        customer: 'Client Test',
        email: 'test@exemple.com',
        value: '999.99',
        description: 'Facture de test'
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Test de l'API</h1>
      
      <div className="space-y-4 mb-8">
        <Button onClick={testGetInvoices} disabled={isLoading}>
          Tester GET /api/invoices
        </Button>
        
        <Button onClick={testCreateInvoice} disabled={isLoading}>
          Tester POST /api/invoices
        </Button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Résultat :</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
```

### 9.2 Tests essentiels

```bash
# 1. Vérifier que le serveur démarre
npm run dev

# 2. Tester les routes principales
# - http://localhost:3000 (page d'accueil)
# - http://localhost:3000/invoices (liste des factures)
# - http://localhost:3000/invoices/new (création de facture)
# - http://localhost:3000/test-api (test de l'API)

# 3. Vérifier la base de données
npm run db:studio
```


<br/>
<br/>

# **ÉTAPE 10 : Finalisation et déploiement**

### 10.1 Vérification finale

Checklist avant déploiement :
- Toutes les pages se chargent correctement
- La création de facture fonctionne
- La liste des factures s'affiche
- L'API répond correctement
- La base de données est accessible
- Pas d'erreurs dans la console

### 10.2 Build de production  

```bash
# Construire l'application
npm run build

# Tester la version de production
npm start
```

### 10.3 Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer l'application
vercel

# Configurer les variables d'environnement sur Vercel
# Dashboard Vercel > Projet > Settings > Environment Variables
# Ajouter : XATA_DATABASE_URL
```


<br/>
<br/>

# **CHECKLIST DE VALIDATION**

###  **Fonctionnalités terminées :**
- [ ] Initialisation Next.js 15 avec TypeScript
- [ ] Configuration TailwindCSS
- [ ] Installation shadcn/ui
- [ ] Configuration Drizzle ORM
- [ ] Connexion base de données PostgreSQL (Xata)
- [ ] Schéma de base de données créé
- [ ] Migrations appliquées
- [ ] API Route GET /api/invoices
- [ ] API Route POST /api/invoices
- [ ] Page d'accueil moderne
- [ ] Page de liste des factures
- [ ] Formulaire de création avec validation
- [ ] Gestion des erreurs
- [ ] Interface responsive
- [ ] Tests API fonctionnels

### **Compétences acquises :**
- **Next.js 15 App Router** : Server/Client Components, routing
- **TypeScript** : Types stricts, inférence automatique
- **TailwindCSS** : Design responsive et moderne
- **Drizzle ORM** : Requêtes type-safe, migrations
- **PostgreSQL** : Base de données relationnelle
- **React Hook Form** : Formulaires et validation
- **API REST** : Endpoints backend complets
- **shadcn/ui** : Composants UI accessibles


<br/>
<br/>

# **DÉFIS SUPPLÉMENTAIRES** (Bonus)

Une fois l'application de base terminée, essayez ces améliorations :

### 1. **Authentification**
```bash
npm install next-auth
```
- Ajouter un système de connexion
- Protéger les routes privées

### 2. **États de facture avancés**
- Ajouter des boutons "Marquer comme payée"
- Système de notification par email

### 3. **Dashboard avancé**
- Graphiques avec Chart.js
- Statistiques de revenus
- Export PDF des factures

### 4. **Recherche et filtres**
- Barre de recherche clients
- Filtres par statut et date
- Pagination des résultats

### 5. **Mode sombre**
```bash
npm install next-themes
```
- Toggle light/dark mode
- Persistance des préférences



**🎉 Félicitations ! Vous avez construit une application de facturation complète et moderne !**

> **Durée estimée :** 4-6 heures selon votre niveau  
> **Niveau :** Intermédiaire  
> **Stack :** Next.js 15, TypeScript, TailwindCSS, Drizzle ORM, PostgreSQL
</rewritten_file>

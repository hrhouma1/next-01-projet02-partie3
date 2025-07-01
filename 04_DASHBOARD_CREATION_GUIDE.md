# Module 3 – Création du Dashboard (/dashboard)

## Objectif pédagogique

À la fin de ce module, l'étudiant doit être capable de :

1. Créer une nouvelle route `/dashboard` dans Next.js App Router
2. Concevoir une interface dashboard moderne et épurée
3. Afficher les données des factures dans un format tableau optimisé
4. Implémenter une interface responsive avec TailwindCSS
5. Gérer les états d'erreur et les cas vides

---

## Vue d'ensemble

Le dashboard sera accessible via `/dashboard` et affichera :
- Un titre "Invoices" 
- Un bouton "Create Invoice" pour créer de nouvelles factures
- Une liste des factures avec les colonnes : Date, Customer, Email, Status, Value
- Un design épuré et professionnel

---

## Étape 1 – Création de la structure de la route

### 1. Créer le dossier dashboard

```bash
mkdir src/app/dashboard
```

### 2. Créer le fichier page.tsx

Créer `src/app/dashboard/page.tsx` :

```tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Page dashboard en cours de développement...
        </p>
      </div>
    </div>
  );
}
```

### 3. Vérification

Naviguer vers `http://localhost:3000/dashboard` et vérifier que la page s'affiche.

---

## Étape 2 – Intégration de la base de données

### 1. Importer les dépendances nécessaires

Modifier `src/app/dashboard/page.tsx` :

```tsx
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { Button } from '@/components/ui/button';

type Invoice = typeof invoices.$inferSelect;
```

### 2. Créer la fonction de récupération des données

```tsx
export default async function DashboardPage() {
  let allInvoices: Invoice[] = [];
  let error = null;

  try {
    allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erreur de connexion à la base de données';
  }

  // Interface sera ajoutée à l'étape suivante
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Invoices
        </h1>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <p className="text-gray-600 mt-2">
          {allInvoices.length} factures trouvées
        </p>
      </div>
    </div>
  );
}
```

---

## Étape 3 – Création de l'interface header

### 1. Header avec titre et bouton

Remplacer le contenu de la fonction par :

```tsx
return (
  <div className="min-h-screen bg-white">
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Invoices
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
            Create Invoice
          </a>
        </Button>
      </div>
      
      {/* Le contenu sera ajouté à l'étape suivante */}
      <div className="bg-gray-100 p-4 rounded">
        Contenu du tableau sera ajouté ici
      </div>
    </div>
  </div>
);
```

---

## Étape 4 – Gestion des états d'erreur et vide

### 1. Gestion des erreurs

```tsx
{error ? (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-red-700 mb-2">
      Erreur de chargement
    </h2>
    <p className="text-red-600">{error}</p>
  </div>
) : (
  // Contenu normal ici
)}
```

### 2. Cas où il n'y a pas de factures

```tsx
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
  // Tableau des factures ici
)}
```

---

## Étape 5 – Création du tableau des factures

### 1. Structure du tableau avec grid CSS

```tsx
<div className="overflow-hidden">
  {/* Table Header */}
  <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
    <div>Date</div>
    <div>Customer</div>
    <div>Email</div>
    <div>Status</div>
    <div className="text-right">Value</div>
  </div>
  
  {/* Table Body sera ajouté à l'étape suivante */}
</div>
```

### 2. Contenu du tableau

```tsx
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
```

---

## Étape 6 – Code complet final

Voici le code complet de `src/app/dashboard/page.tsx` :

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
            Invoices
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
              Create Invoice
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

---

## Étape 7 – Mise à jour de la navigation

### 1. Ajouter le lien dashboard dans la page d'accueil

Modifier `src/app/page.tsx` pour ajouter un lien vers le dashboard :

```tsx
<a 
  href="/dashboard" 
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
>
  📊 Dashboard
</a>
```

---

## Étape 8 – Test et vérification

### 1. Redémarrage du serveur

```bash
# Supprimer le cache
rm -rf .next

# Redémarrer
npm run dev
```

### 2. Tests à effectuer

1. **Navigation vers le dashboard :**
   - Accéder à `http://localhost:3000/dashboard`
   - Vérifier que la page s'affiche correctement

2. **Fonctionnalité du bouton "Create Invoice" :**
   - Cliquer sur le bouton
   - Vérifier la redirection vers `/invoices/new`

3. **Affichage des données :**
   - Vérifier que les factures s'affichent dans le tableau
   - Contrôler le formatage des dates, montants, statuts

4. **Cas vide :**
   - Si aucune facture, vérifier l'affichage du message et du bouton de création

5. **Responsive design :**
   - Tester sur différentes tailles d'écran
   - Vérifier le comportement du tableau

---

## Résultat attendu

Après avoir suivi toutes ces étapes, vous devriez obtenir :

- Une page `/dashboard` accessible et fonctionnelle
- Un design épuré avec un header contenant le titre et le bouton "Create Invoice"
- Un tableau responsive affichant les factures avec les colonnes : Date, Customer, Email, Status, Value
- Une gestion appropriée des cas d'erreur et des états vides
- Une navigation fluide entre les différentes pages de l'application

Le dashboard devrait ressembler exactement à l'interface montrée dans l'image de référence, avec un design moderne et professionnel.

---

## Améliorations possibles

### Fonctionnalités avancées à ajouter plus tard :

1. **Tri des colonnes :** Permettre le tri par date, montant, client
2. **Filtres :** Filtrer par statut, période, montant
3. **Recherche :** Barre de recherche pour trouver des factures spécifiques
4. **Actions en lot :** Sélection multiple et actions groupées
5. **Pagination :** Pour les grandes listes de factures
6. **Détails en modal :** Affichage rapide des détails sans navigation

Ces fonctionnalités peuvent être ajoutées dans des modules suivants pour enrichir l'expérience utilisateur. 
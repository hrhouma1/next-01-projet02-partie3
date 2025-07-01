# Guide de création du Dashboard - Page /dashboard

## Objectif

Créer une page dashboard accessible via `/dashboard` qui affiche la liste des factures avec un design moderne et épuré.

## Résultat attendu

- Interface avec titre "Invoices" et bouton "Create Invoice"
- Tableau avec colonnes : Date, Customer, Email, Status, Value
- Design épuré et professionnel
- Gestion des erreurs et cas vides

---

## Étape 1 : Création de la structure

### 1.1 Créer le dossier dashboard
```bash
mkdir src/app/dashboard
```

### 1.2 Créer le fichier page.tsx
Créer `src/app/dashboard/page.tsx` avec le contenu suivant :

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

---

## Étape 2 : Mise à jour de la navigation

### 2.1 Ajouter le lien dashboard dans la page d'accueil

Modifier `src/app/page.tsx` pour ajouter le lien vers le dashboard :

```tsx
<a 
  href="/dashboard" 
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
>
  Dashboard
</a>
```

---

## Étape 3 : Test de l'application

### 3.1 Redémarrer le serveur
```bash
# Supprimer le cache
rm -rf .next

# Redémarrer le serveur
npm run dev
```

### 3.2 Vérifications

1. **Accéder au dashboard :** `http://localhost:3000/dashboard`
2. **Vérifier l'affichage :** Interface avec titre "Invoices" et bouton "Create Invoice"
3. **Tester le bouton :** Le bouton "Create Invoice" doit rediriger vers `/invoices/new`
4. **Vérifier les données :** Les factures doivent s'afficher dans le tableau
5. **Cas vide :** Si aucune facture, message d'invite à créer la première facture

---

## Fonctionnalités du dashboard

### Interface utilisateur
- **Header épuré :** Titre "Invoices" et bouton "Create Invoice"
- **Tableau responsive :** Colonnes Date, Customer, Email, Status, Value
- **Design moderne :** Couleurs neutres, espacement cohérent
- **Interactions :** Survol des lignes, bouton d'actions

### Fonctionnalités
- **Récupération des données :** Connexion à la base de données via Drizzle ORM
- **Gestion d'erreurs :** Affichage des erreurs de connexion
- **État vide :** Message et bouton de création si aucune facture
- **Formatage des données :** Dates, montants, statuts formatés

### Responsive design
- **Grid layout :** Utilisation de CSS Grid pour la structure du tableau
- **Breakpoints :** Adaptation aux différentes tailles d'écran
- **Spacing :** Espacement cohérent avec TailwindCSS

---

## Résultat attendu

Après avoir suivi ce guide, vous devriez avoir :

1. Une page `/dashboard` accessible et fonctionnelle
2. Un design identique à l'image de référence
3. Une navigation fluide avec bouton "Create Invoice"
4. Un tableau affichant toutes les factures
5. Une gestion appropriée des erreurs et cas vides

Le dashboard est maintenant prêt à être utilisé et peut être étendu avec des fonctionnalités supplémentaires comme la recherche, le tri, ou la pagination. 
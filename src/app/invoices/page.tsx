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
                📄 Nouvelle facture
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline"
            >
              <a href="/">
                🏠 Accueil
              </a>
            </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              ❌ Erreur de chargement
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
                    📄 Créer ma première facture
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
                              {invoice.status || 'open'}
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
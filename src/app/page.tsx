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
          <p className="text-gray-600 mb-6">
            Drizzle ORM + Xata PostgreSQL sont également configurés.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/invoices/new" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              📄 Créer une facture
            </a>
            <a 
              href="/invoices" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              📊 Voir les factures
            </a>
            <a 
              href="/test" 
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🗃️ Test Drizzle DB
            </a>
            <a 
              href="/test-api" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔧 Test API
            </a>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">
              ⚙️ Paramètres
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
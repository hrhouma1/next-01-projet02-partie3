import { db } from '@/db';
import { sql } from 'drizzle-orm';

export default async function TestPage() {
  let result = null;
  let error = null;

  try {
    // Tentative de création de la table si elle n'existe pas
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "invoices" (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "customer" varchar(120) NOT NULL,
        "email" varchar(160) NOT NULL,
        "value" numeric NOT NULL,
        "description" varchar(255),
        "status" varchar(32) DEFAULT 'open',
        "created_at" timestamp DEFAULT now()
      )
    `);

    // Test de la présence de la table
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'invoices'
    `);
    
    // Test d'insertion d'une facture exemple
    await db.execute(sql`
      INSERT INTO "invoices" ("customer", "email", "value", "description") 
      VALUES ('Jean Dupont', 'jean@example.com', 150.00, 'Facture de test')
      ON CONFLICT DO NOTHING
    `);

    // Compter les factures
    const count = await db.execute(sql`SELECT COUNT(*) FROM "invoices"`);
    const countValue = count.rows[0] as { count: string } | undefined;
    
    result = {
      success: true,
      tables_found: tables.rows,
      table_exists: tables.rows.length > 0,
      invoice_count: countValue?.count || '0',
      message: "Connexion Drizzle + Xata réussie ! Table créée automatiquement."
    };
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erreur inconnue';
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Test Drizzle + Xata
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {error ? (
            <div className="text-red-600">
              <h2 className="text-xl font-semibold mb-2">❌ Erreur :</h2>
              <p className="font-mono text-sm bg-red-50 p-3 rounded">{error}</p>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="font-semibold">💡 Solution suggérée :</p>
                <p className="text-sm mt-1">
                  Créez manuellement la table "invoices" dans l'interface web de Xata avec les colonnes : 
                  id, customer, email, value, description, status, created_at
                </p>
              </div>
            </div>
          ) : (
            <div className="text-green-600">
              <h2 className="text-xl font-semibold mb-2">✅ Succès !</h2>
              <p className="mb-4">{result?.message}</p>
              <div className="font-mono text-sm bg-green-50 p-3 rounded">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              
              {result?.table_exists && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                  <p className="font-semibold">🎉 Table "invoices" trouvée !</p>
                  <p className="text-sm mt-1">
                    Nombre de factures : {result.invoice_count}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex gap-4">
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            ← Retour à l'accueil
          </a>
          <a 
            href="/invoices/new" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            📄 Créer une facture
          </a>
        </div>
      </div>
    </main>
  );
} 
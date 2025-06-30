import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { sql } from 'drizzle-orm';

// Variable globale pour l'ID séquentiel (en production, utiliser une vraie séquence DB)
let nextId = 1;

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API POST /api/invoices - Début de la requête');
    
    const body = await request.json();
    console.log('📥 Body reçu:', JSON.stringify(body, null, 2));
    
    const { customer, email, value, description } = body;

    // Validation basique
    if (!customer || !email || !value) {
      console.log('❌ Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Les champs customer, email et value sont requis' },
        { status: 400 }
      );
    }

    console.log('✅ Validation réussie');
    
    // Obtenir le prochain ID en interrogeant la base de données
    console.log('🔍 Recherche du prochain ID disponible...');
    const maxIdResult = await db.execute(sql`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM invoices`);
    const nextAvailableId = maxIdResult.rows[0]?.next_id || 1;
    
    console.log('🆔 Prochain ID disponible:', nextAvailableId);
    
    const insertData = {
      id: Number(nextAvailableId),
      customer,
      email,
      value: value.toString(),
      description: description || null,
      status: 'open' as const
    };
    
    console.log('📊 Données à insérer:', insertData);

    // Insertion dans la base de données
    console.log('🗃️ Tentative d\'insertion en base...');
    const newInvoice = await db.insert(invoices).values(insertData).returning();

    console.log('✅ Insertion réussie:', JSON.stringify(newInvoice[0], null, 2));

    return NextResponse.json({
      success: true,
      invoice: newInvoice[0],
      message: 'Facture créée avec succès !'
    });

  } catch (error) {
    console.error('💥 Erreur lors de la création de la facture:', error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('📋 Message d\'erreur:', error.message);
      console.error('📋 Stack trace:', error.stack);
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
    console.log('🔵 API GET /api/invoices - Récupération des factures');
    
    // Récupération de toutes les factures
    const allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);

    console.log(`✅ ${allInvoices.length} factures récupérées`);

    return NextResponse.json({
      success: true,
      invoices: allInvoices,
      count: allInvoices.length
    });

  } catch (error) {
    console.error('💥 Erreur lors de la récupération des factures:', error);
    
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
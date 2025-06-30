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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceForm>();

  const onSubmit = async (data: InvoiceForm) => {
    setIsSubmitting(true);
    setSubmitResult(null);

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
        setSubmitResult('✅ Facture créée avec succès ! ID: ' + result.invoice.id);
        reset();
      } else {
        setSubmitResult('❌ Erreur: ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      setSubmitResult('❌ Erreur de connexion au serveur');
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
                submitResult.includes('✅') 
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
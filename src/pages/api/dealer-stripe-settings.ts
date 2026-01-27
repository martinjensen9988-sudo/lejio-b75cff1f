// API route: /api/dealer-stripe-settings?vehicleId=...
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { vehicleId } = req.query;
  if (!vehicleId || typeof vehicleId !== 'string') {
    return res.status(400).json({ error: 'Missing vehicleId' });
  }

  // Find bil og forhandler
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('id, owner_id')
    .eq('id', vehicleId)
    .single();
  if (vehicleError || !vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  const dealerId = vehicle.owner_id;

  // Find dealer_stripe_settings
  const { data: stripeSettings, error: stripeError } = await supabase
    .from('dealer_stripe_settings')
    .select('stripe_public_key, stripe_price_id_standard, stripe_price_id_premium')
    .eq('dealer_id', dealerId)
    .single();
  if (stripeError || !stripeSettings) {
    return res.status(404).json({ error: 'Stripe settings not found for dealer' });
  }

  return res.status(200).json(stripeSettings);
}

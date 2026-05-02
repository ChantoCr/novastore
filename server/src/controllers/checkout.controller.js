import { successResponse } from '../utils/apiResponse.js';
import { createCheckoutOrder } from '../services/checkout.service.js';

export async function createCheckout(req, res) {
  const data = await createCheckoutOrder(req.user.id, req.body);

  res.status(201).json(
    successResponse({
      message: 'Checkout processed successfully',
      data,
    }),
  );
}

export async function findProductsForCheckoutByIds(productIds, executor) {
  const [rows] = await executor.query(
    `
      SELECT
        id,
        name,
        slug,
        sku,
        price,
        stock,
        is_active,
        deleted_at
      FROM products
      WHERE id IN (?)
      FOR UPDATE
    `,
    [productIds],
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.price),
    stock: row.stock,
    isActive: Boolean(row.is_active),
    deletedAt: row.deleted_at,
  }));
}

export async function findCouponByCode(code, executor) {
  const [rows] = await executor.query(
    `
      SELECT
        id,
        code,
        discount_type,
        discount_value,
        min_purchase_amount,
        usage_limit,
        used_count,
        starts_at,
        expires_at,
        is_active
      FROM coupons
      WHERE code = ?
      LIMIT 1
    `,
    [code],
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minPurchaseAmount: Number(row.min_purchase_amount),
    usageLimit: row.usage_limit,
    usedCount: row.used_count,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    isActive: Boolean(row.is_active),
  };
}

export async function createOrderRecord(order, executor) {
  const [result] = await executor.query(
    `
      INSERT INTO orders (
        user_id,
        coupon_id,
        status,
        subtotal,
        discount_total,
        tax_total,
        total,
        payment_status,
        shipping_address,
        billing_address,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      order.userId,
      order.couponId,
      order.status,
      order.subtotal,
      order.discountTotal,
      order.taxTotal,
      order.total,
      order.paymentStatus,
      JSON.stringify(order.shippingAddress),
      JSON.stringify(order.billingAddress),
      order.notes,
    ],
  );

  return result.insertId;
}

export async function createOrderItemsRecords(orderId, items, executor) {
  const values = items.map((item) => [
    orderId,
    item.productId,
    item.productNameSnapshot,
    item.productSkuSnapshot,
    item.unitPrice,
    item.quantity,
    item.lineTotal,
  ]);

  await executor.query(
    `
      INSERT INTO order_items (
        order_id,
        product_id,
        product_name_snapshot,
        product_sku_snapshot,
        unit_price,
        quantity,
        line_total
      )
      VALUES ?
    `,
    [values],
  );
}

export async function createPaymentSimulationRecord(payment, executor) {
  const [result] = await executor.query(
    `
      INSERT INTO payments_simulated (
        order_id,
        provider_reference,
        status,
        amount,
        currency,
        simulated_card_last4,
        response_payload,
        processed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `,
    [
      payment.orderId,
      payment.providerReference,
      payment.status,
      payment.amount,
      payment.currency,
      payment.simulatedCardLast4,
      JSON.stringify(payment.responsePayload),
    ],
  );

  return result.insertId;
}

export async function updateProductStockById(productId, newStock, executor) {
  const [result] = await executor.query(
    `
      UPDATE products
      SET stock = ?
      WHERE id = ?
    `,
    [newStock, productId],
  );

  return result.affectedRows;
}

export async function createStockMovementRecords(movements, executor) {
  const values = movements.map((movement) => [
    movement.productId,
    movement.adminUserId,
    movement.movementType,
    movement.quantityChange,
    movement.previousStock,
    movement.newStock,
    movement.reason,
  ]);

  await executor.query(
    `
      INSERT INTO stock_movements (
        product_id,
        admin_user_id,
        movement_type,
        quantity_change,
        previous_stock,
        new_stock,
        reason
      )
      VALUES ?
    `,
    [values],
  );
}

export async function incrementCouponUsedCount(couponId, executor) {
  const [result] = await executor.query(
    `
      UPDATE coupons
      SET used_count = used_count + 1
      WHERE id = ?
    `,
    [couponId],
  );

  return result.affectedRows;
}

export async function createCouponUsageRecord(couponUsage, executor) {
  const [result] = await executor.query(
    `
      INSERT INTO coupon_usages (
        coupon_id,
        user_id,
        order_id,
        discount_amount
      )
      VALUES (?, ?, ?, ?)
    `,
    [couponUsage.couponId, couponUsage.userId, couponUsage.orderId, couponUsage.discountAmount],
  );

  return result.insertId;
}

export async function createNotificationRecord(notification, executor) {
  const [result] = await executor.query(
    `
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        metadata
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      notification.userId,
      notification.type,
      notification.title,
      notification.message,
      JSON.stringify(notification.metadata),
    ],
  );

  return result.insertId;
}

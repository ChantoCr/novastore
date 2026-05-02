import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithApp } from '../../../test/test-utils.jsx';
import ProductCard from './ProductCard.jsx';

describe('ProductCard', () => {
  it('renders product summary data and detail link', () => {
    renderWithApp(
      <ProductCard
        product={{
          id: 7,
          categoryName: 'Electronics',
          name: 'Aurora Wireless Headphones',
          slug: 'aurora-wireless-headphones',
          description: 'Premium over-ear headphones with active noise cancellation.',
          price: 129.99,
          stock: 24,
          lowStockThreshold: 5,
          primaryImageUrl: null,
        }}
      />,
      { withProvider: true },
    );

    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/aurora wireless headphones/i)).toBeInTheDocument();
    expect(screen.getByText(/24 in stock/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view product/i })).toHaveAttribute(
      'href',
      '/products/aurora-wireless-headphones',
    );
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LoginForm from './LoginForm.jsx';

describe('LoginForm', () => {
  it('shows validation messages for invalid values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm defaultValues={{ email: '', password: '' }} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm defaultValues={{ email: '', password: '' }} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'admin@novastore.dev');
    await user.type(screen.getByLabelText(/password/i), 'NovaStore123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          email: 'admin@novastore.dev',
          password: 'NovaStore123!',
        },
        expect.anything(),
      );
    });
  });
});

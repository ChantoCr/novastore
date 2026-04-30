import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { store } from '../app/store.js';

export function renderWithApp(ui, { route = '/', withProvider = false } = {}) {
  const wrappedUi = (
    <MemoryRouter initialEntries={[route]}>
      {withProvider ? <Provider store={store}>{ui}</Provider> : ui}
    </MemoryRouter>
  );

  return render(wrappedUi);
}

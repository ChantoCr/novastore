const AUTH_SESSION_STORAGE_KEY = 'nova-store.auth';

function hasSessionStorage() {
  return typeof window !== 'undefined' && Boolean(window.sessionStorage);
}

export function loadAuthSession() {
  if (!hasSessionStorage()) {
    return {
      refreshToken: null,
    };
  }

  try {
    const storedValue = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);

    if (!storedValue) {
      return {
        refreshToken: null,
      };
    }

    const parsedValue = JSON.parse(storedValue);
    const refreshToken =
      typeof parsedValue?.refreshToken === 'string' ? parsedValue.refreshToken.trim() : '';

    return {
      refreshToken: refreshToken || null,
    };
  } catch {
    clearAuthSession();

    return {
      refreshToken: null,
    };
  }
}

export function saveAuthSession({ refreshToken }) {
  if (!hasSessionStorage()) {
    return;
  }

  if (!refreshToken) {
    clearAuthSession();
    return;
  }

  window.sessionStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify({
      refreshToken,
    }),
  );
}

export function clearAuthSession() {
  if (!hasSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

import request from 'supertest';

import app from '../../src/app.js';

export const adminCredentials = {
  email: 'admin@novastore.dev',
  password: 'NovaStore123!',
};

export const userCredentials = {
  email: 'user@novastore.dev',
  password: 'NovaStore123!',
};

export async function loginWithCredentials(credentials) {
  return request(app).post('/api/auth/login').send(credentials);
}

export async function createAuthenticatedSession(credentials) {
  const response = await loginWithCredentials(credentials);

  if (response.status !== 200) {
    throw new Error(
      `Login failed for ${credentials.email}: ${response.status} ${response.body?.message ?? 'Unknown error'}`,
    );
  }

  const { accessToken, refreshToken, user } = response.body.data;

  return {
    user,
    accessToken,
    refreshToken,
    authHeader: `Bearer ${accessToken}`,
    async logout() {
      if (!this.refreshToken) {
        return;
      }

      await request(app).post('/api/auth/logout').send({
        refreshToken: this.refreshToken,
      });

      this.refreshToken = null;
    },
  };
}

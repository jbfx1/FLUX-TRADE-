import { Router } from 'express';
import axios from 'axios';
import { env } from '../config/env';
import { prisma } from '../db/client';
import { audit } from '../services/logger';

const router = Router();

router.post('/exchange', async (req, res) => {
  const { code, redirect_uri } = req.body as { code: string; redirect_uri: string };
  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }

  try {
    const tokenResponse = await axios.post('https://oauth.deriv.com/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: env.derivAppId,
        redirect_uri: redirect_uri ?? env.derivRedirectUri
      }
    });

    const { refresh_token, access_token, email, user_id } = tokenResponse.data;

    const user = await prisma.user.upsert({
      where: { derivUserId: user_id },
      create: {
        derivUserId: user_id,
        email,
        refreshToken: refresh_token,
        accessToken: access_token
      },
      update: {
        refreshToken: refresh_token,
        accessToken: access_token
      }
    });

    (req.session as any).userId = user.id;
    audit('auth', 'OAuth exchange success', { userId: user.id });

    res.json({ message: 'Authenticated' });
  } catch (error: any) {
    audit('auth', 'OAuth exchange failed', { error: error?.message });
    res.status(500).json({ message: 'Failed to exchange code' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('flux.sid');
    res.json({ message: 'Logged out' });
  });
});

export default router;

import fetch from 'node-fetch';

const BASE_URL = process.env.CORE_GO_BASE_URL;

if (!BASE_URL) {
  throw new Error('CORE_GO_BASE_URL is not set');
}

export async function getCoreInfo(requestId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${BASE_URL}/info`, {
      signal: controller.signal,
      headers: {
        'x-request-id': requestId,
      },
    });

    if (!res.ok) {
      throw new Error(`core-go responded with ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

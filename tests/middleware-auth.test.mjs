import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server.js';

const { middleware } = await import('../src/middleware.ts');

test('middleware returns 503 when admin credentials are not configured', () => {
  const originalUser = process.env.STORE_ADMIN_USERNAME;
  const originalPass = process.env.STORE_ADMIN_PASSWORD;
  delete process.env.STORE_ADMIN_USERNAME;
  delete process.env.STORE_ADMIN_PASSWORD;

  try {
    const req = new NextRequest('http://localhost:3000/admin');
    const res = middleware(req);
    assert.equal(res.status, 503);
    assert.match(res.headers.get('content-type') || '', /text\/plain/);
  } finally {
    process.env.STORE_ADMIN_USERNAME = originalUser;
    process.env.STORE_ADMIN_PASSWORD = originalPass;
  }
});

test('middleware returns 401 with WWW-Authenticate when no credentials provided', () => {
  process.env.STORE_ADMIN_USERNAME = 'testadmin';
  process.env.STORE_ADMIN_PASSWORD = 'supersecretpassword123';

  const req = new NextRequest('http://localhost:3000/admin');
  const res = middleware(req);
  assert.equal(res.status, 401);
  assert.ok(res.headers.get('www-authenticate')?.includes('Basic'));
});

test('middleware returns 401 when wrong username or password supplied', () => {
  process.env.STORE_ADMIN_USERNAME = 'testadmin';
  process.env.STORE_ADMIN_PASSWORD = 'supersecretpassword123';

  // Wrong password
  const badCreds = btoa('testadmin:wrongpassword');
  const req1 = new NextRequest('http://localhost:3000/admin', {
    headers: { authorization: `Basic ${badCreds}` },
  });
  const res1 = middleware(req1);
  assert.equal(res1.status, 401);

  // Wrong username
  const badUser = btoa('hacker:supersecretpassword123');
  const req2 = new NextRequest('http://localhost:3000/admin', {
    headers: { authorization: `Basic ${badUser}` },
  });
  const res2 = middleware(req2);
  assert.equal(res2.status, 401);
});

test('middleware returns 401 on malformed Basic auth', () => {
  process.env.STORE_ADMIN_USERNAME = 'testadmin';
  process.env.STORE_ADMIN_PASSWORD = 'supersecretpassword123';

  const req = new NextRequest('http://localhost:3000/admin', {
    headers: { authorization: 'Basic !!!not-valid-base64!!!' },
  });
  const res = middleware(req);
  assert.equal(res.status, 401);
});

test('middleware allows access when valid credentials provided', () => {
  process.env.STORE_ADMIN_USERNAME = 'testadmin';
  process.env.STORE_ADMIN_PASSWORD = 'supersecretpassword123';

  const validCreds = btoa('testadmin:supersecretpassword123');
  const req = new NextRequest('http://localhost:3000/admin', {
    headers: { authorization: `Basic ${validCreds}` },
  });
  const res = middleware(req);
  // NextResponse.next() returns a response that continues the request pipeline
  assert.notEqual(res.status, 401);
  assert.notEqual(res.status, 503);
  assert.equal(res.headers.get('www-authenticate'), null);
});

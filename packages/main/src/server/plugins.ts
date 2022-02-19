import type { FastifyInstance } from 'fastify';
import swaggerPlugin from 'fastify-swagger';
import fastifyCorsor from 'fastify-cors';
import fastifyCookie from 'fastify-cookie';
import fastifyCaching from 'fastify-caching';
import fastifyServerSession from 'fastify-server-session';

const SESSION_TTL = 86400; // 1 day in seconds

export default async function registerPlugins(fastify: FastifyInstance): Promise<void> {
  await fastify.register(swaggerPlugin, {
    routePrefix: '/docs/api',
    exposeRoute: true,
  });

  await fastify.register(fastifyCorsor, {
    // put your options here
    origin: true,
    credentials: true,
  });

  await fastify.register(fastifyCookie);

  await fastify.register(fastifyCaching);

  await fastify.register(fastifyServerSession, {
    secretKey: 'airhhhh0000000000011111111111222',
    sessionMaxAge: 900000, // 15 minutes
    cookie: {
      maxAge: SESSION_TTL,
      secure: true,
      httpOnly: true,
      domain: null,
      path: '/',
      sameSite: 'none',
    },
  });
}

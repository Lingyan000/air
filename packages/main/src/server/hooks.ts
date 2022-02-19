import { FastifyInstance } from 'fastify';
import air from '/@/apis/core/air';

export default function addHooks(fastify: FastifyInstance): void {
  fastify.ready(async (error) => {
    if (error) {
      throw error;
    }

    try {
      fastify.swagger();
    } catch (error: unknown) {
      air.log.error('Fastify error', error as string);
    }
  });

  fastify.addHook('onRequest', async (request) => {
    if (request.is404) {
      return;
    }

    const requestName = `${request.routerMethod} ${request.routerPath}`;

    const requestContext = {
      body: request.body,
      params: request.params,
      query: request.query,
    };

    air.log.info(request.id, requestName, requestContext as any);
  });
}

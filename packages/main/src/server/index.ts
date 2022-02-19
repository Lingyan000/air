import Fastify, { FastifyInstance } from 'fastify';
import routes from '/@/server/components/route';
import registerHooks from './hooks';
import registerPlugins from '/@/server/plugins';
import { RouteOptions } from 'fastify/types/route';

class Server {
  private readonly fastify: FastifyInstance;
  private port = 52020;

  constructor() {
    this.fastify = Fastify();
  }

  async start() {
    global.vmCpNumber = 1;

    await registerPlugins(this.fastify);

    registerHooks(this.fastify);

    this.fastify.get('/', async () => {
      return { hello: 'world' };
    });

    this.fastify.after(() => {
      for (const getRoute of routes) {
        this.fastify.route(getRoute() as RouteOptions);
      }
    });

    this.fastify.listen(this.port, () => {
      console.log(`Air app listening at http://localhost:${this.port}`);
    });
  }
}

export default new Server();

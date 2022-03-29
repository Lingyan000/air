import Fastify, { FastifyInstance } from 'fastify';
import routes from '/@/server/components/route';
import registerHooks from './hooks';
import registerPlugins from '/@/server/plugins';
import { RouteOptions } from 'fastify/types/route';

export class Server {
  public readonly fastify: FastifyInstance;
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

    this.fastify.ready((err) => {
      if (err) {
        throw err;
      }
      this.fastify.io.on('connect', (socket) => {
        socket.on('addGroup', (id) => {
          socket.join(id);
        });
      });
    });

    this.fastify.after(() => {
      for (const getRoute of routes) {
        this.fastify.route(getRoute() as RouteOptions);
      }
    });

    return new Promise((resolve, reject) => {
      this.fastify.listen(this.port, (err, address) => {
        if (err) {
          reject(err);
        }
        console.log(`Air app listening at http://localhost:${this.port}`);
        resolve(address);
      });
    });
  }
}

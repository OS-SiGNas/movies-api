import { server } from './server';
import type { IServer } from './server/types';

(function (server: IServer) {
  void server.run();
})(server);

/** if environment !== test server.app return undefined */
export default server.app;

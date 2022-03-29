import { routes as articlelistrule } from './articlelistrule/index';
import { routes as parse } from './parse/index';
import { routes as playerposhis } from './playerposhis/index';
import { routes as viewhistory } from './viewhistory/index';

// Manually doing this is required to avoid the compiler giving up and making these values any
const routes = [
  ...Object.values(articlelistrule),
  ...Object.values(parse),
  ...Object.values(playerposhis),
  ...Object.values(viewhistory),
] as const;

export default routes;

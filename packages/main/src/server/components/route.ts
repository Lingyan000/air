import { routes as articlelistrule } from './articlelistrule/index';
import { routes as parse } from './parse/index';

// Manually doing this is required to avoid the compiler giving up and making these values any
const routes = [...Object.values(articlelistrule), ...Object.values(parse)] as const;

export default routes;

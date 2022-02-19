import { join } from 'path';
import air from '/@/apis/core/air';
import fs from 'fs-extra';

const DB_VERSION = 50;

const dbDir = join(air.baseDir, 'db');
const exist = fs.existsSync(dbDir);
if (!exist) {
  fs.ensureDirSync(dbDir);
}

const dbUrl = join(dbDir, `./hiker_${DB_VERSION}.db`);

export { DB_VERSION, dbDir, dbUrl };

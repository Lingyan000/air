import { dbUrl, dbDir } from '/@/config';
import { Sequelize } from 'sequelize';
import fs from 'fs-extra';
import { join } from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbUrl,
});

// 升级数据库文件
export function upgradeDatabase() {
  fs.readdirSync(dbDir).forEach((file) => {
    if (/hiker_\d+/g.test(file)) {
      fs.moveSync(join(dbDir, file), dbUrl);
    }
  });
  sequelize.sync();
}

!fs.existsSync(dbUrl) && upgradeDatabase();

export default sequelize;

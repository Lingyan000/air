import AdmZip from 'adm-zip';
import { DB_VERSION, dbUrl } from '/@/config';
import fs from 'fs-extra';
import air from '/@/apis/core/air';

export function importBackup(fileNameOrRawData: string | Buffer): string[] {
  const messageArr: string[] = [];

  const zip = new AdmZip(fileNameOrRawData);
  const zipEntries = zip.getEntries();

  let hasEffectiveDb = false;
  let rulesTotal = 0;
  zipEntries.forEach((zipEntrie) => {
    if (zipEntrie.entryName == `hiker_${DB_VERSION}.db`) {
      hasEffectiveDb = true;
      const exist = fs.pathExistsSync(dbUrl);
      if (!exist) {
        fs.ensureFileSync(dbUrl);
      }
      fs.writeFileSync(dbUrl, zipEntrie.getData());
    } else if (zipEntrie.entryName === 'rules.zip') {
      const ruleZip = new AdmZip(zipEntrie.getData());
      const ruleZipEntries = ruleZip.getEntries();
      rulesTotal = ruleZipEntries.length;
      ruleZip.extractAllTo(air.rulesDir, true);
    }
  });
  if (rulesTotal) messageArr.push('已恢复' + rulesTotal + '个应用插件');
  if (!hasEffectiveDb) messageArr.push('没有获取到适合当前版本的db文件。');

  return messageArr;
}

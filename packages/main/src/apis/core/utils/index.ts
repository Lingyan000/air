import AdmZip from 'adm-zip';
import { DB_VERSION, dbUrl } from '/@/config';
import fs from 'fs-extra';
import air from '/@/apis/core/air';
import { getPasswordRuleType } from '/@/apis/core/utils/password';
import { PASSWORD_SIGN } from '#/config';
import { ImportRule } from '/@/apis/core/utils/importRule';
import { Notification } from 'electron';
import { isPath } from '/@/apis/core/air/utils';

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

export async function importHikerFile(path: string): Promise<void> {
  try {
    if (!(isPath(path) && path.endsWith('.hiker'))) return;
    const content = fs.readFileSync(path, 'utf8');
    const type = getPasswordRuleType(content);
    const rule = content.match(new RegExp(`.*${PASSWORD_SIGN[type].sign}(.*)`))![1] || '';
    const importRule = new ImportRule(type, rule);
    const articleListRule = await importRule.import().then((res) => {
      if ((['home_rule', 'home_rule_v2'] as PasswordSignType[]).includes(res.type)) {
        return res.data;
      } else {
        return {};
      }
    });
    new Notification({
      title: '导入成功',
      body: `成功导入小程序${articleListRule.get('title')}`,
    }).show();
  } catch (e: any) {
    const notification = new Notification({
      title: '小程序导入失败',
      body: e.message,
    });
    notification.show();
    air.log.error(e);
  }
}

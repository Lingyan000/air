import validator from 'validator';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import CryptoJS from 'crypto-js';

export class ImportRule {
  constructor(public readonly type: PasswordSignType, public rule: string) {}

  /**
   * 导入
   */
  public async import(): Promise<void> {
    switch (this.type) {
      case 'home_rule':
        await this.importHome();
        break;
      case 'home_rule_v2':
        await this.importHome();
        break;
    }
  }

  /**
   * 导入首页频道
   * @private
   */
  private async importHome(): Promise<void> {
    let rule: ArticleListRule;
    if (this.rule.startsWith('base64://')) {
      this.rule = CryptoJS.enc.Base64.parse(this.rule.replace(/base64:\/\/@.*@/, '')).toString(
        CryptoJS.enc.Utf8
      );
    }
    if (validator.isJSON(this.rule)) {
      rule = JSON.parse(this.rule);
    } else {
      throw new Error('链接有误！');
    }
    const [articleListRule] = await ArticleListRule.findOrCreate({
      where: { title: rule.title },
      defaults: rule as any,
    });
    if (articleListRule) {
      await articleListRule.update(rule);
    }
  }
}

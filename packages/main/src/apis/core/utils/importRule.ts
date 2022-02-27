import validator from 'validator';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import CryptoJS from 'crypto-js';

export class ImportRule {
  constructor(public readonly type: PasswordSignType, public rule: string) {}

  /**
   * 导入
   */
  public async import(): Promise<ArticleListRule> {
    switch (this.type) {
      case 'home_rule':
        return await this.importHome();
      case 'home_rule_v2':
        return await this.importHome();
      default:
        throw new Error(`不支持的导入类型: ${this.type}`);
    }
  }

  /**
   * 导入首页频道
   * @private
   */
  private async importHome(): Promise<ArticleListRule> {
    let rule: ArticleListRule;
    if (this.rule.startsWith('base64://')) {
      this.rule = CryptoJS.enc.Base64.parse(this.rule.replace(/base64:\/\/@.*@/, '')).toString(
        CryptoJS.enc.Utf8
      );
    }
    if (validator.isJSON(this.rule)) {
      rule = JSON.parse(this.rule);
      for (const key in rule) {
        rule[key.toLocaleLowerCase()] = rule[key];
      }
    } else {
      throw new Error('链接有误！');
    }
    let articleListRule = await ArticleListRule.findOne({
      where: { title: rule.title },
    });
    if (articleListRule) {
      await articleListRule.update(rule);
    } else {
      articleListRule = await ArticleListRule.create(rule as any);
    }
    return articleListRule;
  }
}

import { CLOUD_SHEAR_PLATE_MAP } from '#/config';
import axios from 'axios';
import cheerio from 'cheerio';

export class CloudShearPlate {
  public type: CloudShearPlateType | null = null;
  constructor(public readonly url: string) {
    for (const type in CLOUD_SHEAR_PLATE_MAP) {
      if (new RegExp(CLOUD_SHEAR_PLATE_MAP[type].validator, 'g').test(url)) {
        this.type = type as CloudShearPlateType;
      }
    }
  }

  getRes(): Promise<string> {
    switch (this.type) {
      case 'netcut.cn':
        return this.getCloud2();
      case 'cmd.im':
        return this.getCloud5();
      case 'pasteme.tyrantg.com':
        return this.getCloud6();
      default:
        throw new Error('不存在的云剪切板');
    }
  }

  private getCloud2(): Promise<string> {
    return axios
      .get('http://netcut.cn/api/note/data/?note_id=' + this.url.split('/p/')[1])
      .then((res) => {
        if (res.data.error) throw new Error(res.data.error);
        if (res.data && res.data.data) {
          return res.data.data.note_content;
        }
      });
  }

  private getCloud5(): Promise<string> {
    return axios.get(this.url).then((res) => {
      const $ = cheerio.load(res.data);
      return $('.test_box').text();
    });
  }

  private getCloud6(): Promise<string> {
    return axios.get(this.url.replace('xxxxxx', 'api/getContent')).then((res) => {
      if (res.data && res.data.result_code === 'SUCCESS') {
        return res.data.data;
      }
    });
  }
}

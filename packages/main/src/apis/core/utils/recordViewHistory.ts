import Viewhistory from '/@/apis/core/database/sqlite/models/viewhistory';
import dayjs from 'dayjs';
import { Attributes } from 'sequelize/types/model';

export interface RecordViewHistoryOption {
  type: '二级列表' | '网页浏览';
  title: string;
  url: string;
  rulebaseurl?: string;
}

export async function recordViewHistory({
  type = '二级列表',
  title,
  url,
  rulebaseurl = '',
}: RecordViewHistoryOption) {
  const insertData: Attributes<Viewhistory> = {
    type,
    title,
    url,
    rulebaseurl,
    params: '',
    videourl: '',
    group_lpcolumn: '',
    picurl: '',
    extradata: '',
    lastclick: '',
    time: dayjs().valueOf(),
  };

  const [viewHistory, create] = await Viewhistory.findOrCreate({
    where: {
      title,
      url,
    },
    defaults: insertData,
  });

  if (!create) {
    viewHistory.update(insertData);
  }
}

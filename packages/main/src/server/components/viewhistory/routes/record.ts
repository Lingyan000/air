import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { ViewHistory as ViewHistoryQuery } from '#/params';
import { Attributes } from 'sequelize/types/model';
import Viewhistory from '/@/apis/core/database/sqlite/models/viewhistory';
import dayjs from 'dayjs';
import { Articlelistrule } from '/@/apis/core/database/sqlite/models';
import { ViewHistoryType } from '#/enums';
import { URL } from 'url';
import validator from 'validator';
import isURL = validator.isURL;

export default function record() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ViewHistoryQuery.Record;
    }
  > = {
    url: '/viewhistory/record',
    method: 'PUT',
    schema: {
      body: ViewHistoryQuery.Record,
    },
    handler: async (request) => {
      // const lastclick =
      //   request.body.lastclickTile && request.body.lastclickIndex
      //     ? request.body.lastclickTile + '@@' + request.body.lastclickIndex
      //     : undefined;
      let params: any = {};
      let rulebaseurl = '';
      let historyUrl = request.body.url;

      if (request.body.type === ViewHistoryType['二级列表']) {
        let url = request.body.url;
        if (url.startsWith('hiker://empty#')) {
          url = url.replace(/hiker:\/\/empty(#+)/i, '');
        }
        try {
          rulebaseurl = new URL(url).origin;
        } catch (e) {
          rulebaseurl = '';
        }

        if (request.body.ruleId) {
          const articlelistrule = await Articlelistrule.findByPk(request.body.ruleId, {
            raw: true,
          });
          if (articlelistrule) {
            params = {
              ...params,
              last_chapter_rule: articlelistrule.last_chapter_rule,
              title: articlelistrule.title,
              version: articlelistrule.version,
              url: request.body.url,
              col_type: articlelistrule.col_type,
              find_rule: articlelistrule.find_rule,
              group: articlelistrule.group_lpcolumn,
              ua: articlelistrule.ua,
              preRule: articlelistrule.prerule,
              pages: articlelistrule.pages,
            };

            if (!isURL(rulebaseurl)) {
              rulebaseurl = new URL(articlelistrule.url).origin;
            }
          }
        }

        if (url.startsWith('hiker://page')) {
          try {
            const url2 = new URL(url);

            const page = JSON.parse(params.pages).find(
              (page) => page.path === url2.pathname.slice(1)
            );

            if (page) {
              params.find_rule = page.rule;
              params.col_type = page.col_type;
              historyUrl =
                url2.searchParams
                  .get('url')
                  ?.replace(/；；/g, ';')
                  .replace(/＆＆/g, '&')
                  .replace(/？？/g, '?') || historyUrl;
            }
          } catch (e) {}
        }
      }

      const insertData: Attributes<Viewhistory> = {
        type: ViewHistoryType[request.body.type],
        title: request.body.title,
        url: historyUrl,
        rulebaseurl: rulebaseurl,
        params: request.body.params
          ? JSON.stringify({ ...params, ...request.body.params, url: historyUrl })
          : undefined,
        videourl: request.body.videourl,
        group_lpcolumn: request.body.group_lpcolumn,
        picurl: request.body.picurl,
        extradata: request.body.extradata,
        // lastclick: lastclick,
        time: dayjs().valueOf(),
      };

      const [viewHistory, create] = await Viewhistory.findOrCreate({
        where: {
          title: request.body.title,
          url: historyUrl,
        },
        defaults: insertData,
      });

      if (!create) {
        await viewHistory.update(insertData);
      }
      return '成功';
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}

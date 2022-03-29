import { Static, Type } from '@sinclair/typebox';
import { ViewHistoryType } from '../../enums';

export const Record = Type.Object({
  ruleId: Type.Optional(Type.Number()),
  params: Type.Optional(
    Type.Object({
      last_chapter_rule: Type.Optional(Type.String()),
      title: Type.Optional(Type.String()),
      version: Type.Optional(Type.Number()),
      url: Type.Optional(Type.String()),
      col_type: Type.Optional(Type.String()),
      find_rule: Type.Optional(Type.String()),
      group: Type.Optional(Type.String()),
      ua: Type.Optional(Type.String()),
      preRule: Type.Optional(Type.String()),
      pages: Type.Optional(Type.String()),
    })
  ),
  rulebaseurl: Type.Optional(Type.String()),
  title: Type.String(),
  type: Type.Enum(ViewHistoryType),
  url: Type.String(),
  videourl: Type.Optional(Type.String()),
  group_lpcolumn: Type.Optional(Type.String()),
  picurl: Type.Optional(Type.String()),
  extradata: Type.Optional(Type.String()),
});

export type Record = Static<typeof Record>;

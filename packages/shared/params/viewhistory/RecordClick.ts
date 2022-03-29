import { Static, Type } from '@sinclair/typebox';

export const RecordClick = Type.Object({
  title: Type.String(),
  url: Type.String(),
  lastclickTitle: Type.String(),
  lastclickIndex: Type.Number(),
});

export type RecordClick = Static<typeof RecordClick>;

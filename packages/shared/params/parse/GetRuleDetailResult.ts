import { Static, Type } from '@sinclair/typebox';
import { From } from '../../enums';

const from = Type.Enum(From);

export const GetRuleDetailResult = Type.Object({
  id: Type.Number(),
  from: Type.Optional(from),
  url: Type.String(),
});

export type GetRuleDetailResult = Static<typeof GetRuleDetailResult>;

import { Static, Type } from '@sinclair/typebox';
import { From } from '../../enums';

const from = Type.Enum(From);

export const GetChildPageRuleResult = Type.Object({
  id: Type.Number(),
  from: Type.Optional(from),
  url: Type.String(),
  fypage: Type.Optional(Type.String()),
});

export type GetChildPageRuleResult = Static<typeof GetChildPageRuleResult>;

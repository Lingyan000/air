import { Static, Type } from '@sinclair/typebox';
import { From } from '../../enums';

const from = Type.Enum(From);

export const GetLazyRuleResult = Type.Object({
  id: Type.Optional(Type.Number()),
  from: Type.Optional(from),
  url: Type.String(),
  lazyRule: Type.String(),
  originRule: Type.Optional(Type.Any()),
});

export type GetLazyRuleResult = Static<typeof GetLazyRuleResult>;

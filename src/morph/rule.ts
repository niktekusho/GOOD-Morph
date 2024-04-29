import { ActionTypes } from "./actions";

import { Type, type Static } from "@sinclair/typebox";

export const Rule = Type.Object({
  id: Type.Integer(),
  name: Type.String({ minLength: 1 }),
  filter: Type.Object({
    type: Type.String({ minLength: 1 }),
    parameters: Type.Any(),
  }),
  action: Type.Object({
    type: Type.String({ minLength: 1 }),
    parameters: Type.Any(),
  }),
});

export type Rule = Static<typeof Rule>;

// export type Rule = {
//   name: string;
//   // TODO: use a "derived" type using TS magic
//   filter?: {
//     type: string;
//     [k: string]: string | number;
//   };
//   // TODO: use a "derived" type using TS magic
//   action?: {
//     type: ActionTypes;
//     [k: string]: string | number;
//   };
// };

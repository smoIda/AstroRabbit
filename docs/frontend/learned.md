# Preserving Discriminated Union Types

## Problem

Updating a shared property on `NodeData: HttpRequest | Database` caused TypeScript to lose the specific union member when reconstructing the node. Although both variants contain runtime, reconstructing the object with object spreads can make TypeScript lose the relationship between them.

## Solution

Use a generic constrained to `NodeData` and return the same type:

```ts
function _<T extends NodeData>(node: T, payload: Data): T {
    return {
        ...node,
        data: {
            ...node.data,
            payload,
        },
    };
}
```

# Preserving Discriminated Union Types (PT.2)

## Problem

When a function receives a discriminated union and returns different types depending on the discriminator, a **generic** does not automatically preserve the relationship between the input discriminator and the output type.

For example:

```ts
type Action =
    | {
          type: "EXECUTION";
          status: ExecutionStatus;
      }
    | {
          type: "STREAM";
          error?: string | null;
      }
    | {
          type: "NODE";
          id: string;
          status: NodeStatus;
      }
    | {
          type: "EDGE";
          id: string;
          status: EdgeStatus;
      };
```

The desired relationship is **EXECUTION / STREAM** -> `ActionExecutor` and **NODE / EDGE** -> `ActionEditor`

A generic such as:

```ts
function _<T extends ActionExecutor | ActionEditor>(props: Action): T;
```

does not establish this relationship. T is independent of props, so the caller could theoretically request an ActionEditor while providing an "EXECUTION" action.

_The important distinction is that the generic does not describe a relationship between the input and output._

## Solution

Use function overloads when there is a small, finite set of predefined input - output relationships.

```ts
function _(
  props: Extract<Action, { type: "EXECUTION" | "STREAM" }>,
): ActionExecutor;


function _(
  props: Extract<Action, { type: "NODE" | "EDGE" }>,
): ActionEditor;


function _(props: Action): ActionExecutor | ActionEditor {
  ...
}
```

# Event differentiation

## Problem

Attempted to cut down boilerplate lines with string splitting:

```ts
const [type, status] = event.type.split("_") as ["EXECUTION" | "NODE" | "EDGE", "STARTED" | "FINISHED" | "CANCELLED" | "ERROR"]

switch (type):
    case "EXECUTION": ...
    case "NODE": ...
    case "EDGE": ...
```

## Why it didn't work and was reverted to an explicit switch

- Action verbs "STARTED" do not map 1:1 to state statuses "RUNNING"
  -> If/Else til I die
- EDGE types strictly accept either "STARTED" or "FINISHED" statuses
  -> Unable/Difficult to preserve TypeScript's discriminated union type narrowing without requiring unsafe type assertions.
- Events require distinct side-effects, for example, "EXECUTION_ERROR` dispatches stream failure alerts, while "NODE_FINISHED" records execution duration.
  -> Asymmetrical payloads

## Conclusion

Clear explicit code is better than implicit DRY code when business logic branches off.

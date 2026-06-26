import { createSerializationAdapter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/**
 * `NamedError` extends the native `Error` class to include a strongly-typed `name` property.
 */
export class NamedError<TName extends string> extends Error {
  name: TName;
  constructor(args: { name: TName; message: string; cause?: any }) {
    super(args.message, { cause: args.cause });
    this.name = args.name;
  }
}

/**
 * Server function that throws a `NamedError` when called.
 */
export const throwNamedErrorFn = createServerFn().handler(() => {
  throw new NamedError({
    name: "CustomError",
    message: "Error thrown from server function",
  });
});

/**
 * Custom serialization adapter for SerializableError.
 */
export const namedErrorSerializationAdapter = createSerializationAdapter({
  key: "NamedError",
  test: (v) => v instanceof NamedError,
  toSerializable: ({ name, message }) => ({ name, message }),
  fromSerializable: ({ name, message }) => new NamedError({ name, message }),
});

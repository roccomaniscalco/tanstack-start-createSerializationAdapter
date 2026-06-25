import {
  createSerializationAdapter,
  isNotFound,
  isRedirect,
} from "@tanstack/react-router";
import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";

/**
 * Prevents cross-origin requests to server functions.
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

/**
 * `BaseError` extends the native `Error` class to include a strongly-typed `name` property.
 */
export class BaseError<TName extends string> extends Error {
  name: TName;

  constructor(args: { name: TName; message: string; cause?: any }) {
    super(args.message, { cause: args.cause });
    this.name = args.name;
  }
}

/**
 * A union of serializable error types that can be sent to the client.
 * Add custom error types to this union as needed.
 */
export type SerializableErrorName =
  | "AuthenticationError"
  | "ValidationError"
  | "InternalServerError";

/**
 * Throw `SerializableError` from server functions to send typed error information to the client.
 *
 * NOTE: `message` should be human-readable and client-safe.
 */
export class SerializableError extends BaseError<SerializableErrorName> {}

/**
 * Prevents unhandled errors from being leaked to the client.
 */
const errorMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, serverFnMeta }) => {
    try {
      return await next();
    } catch (error) {
      console.error("Error in server function:", serverFnMeta, error);

      if (isNotFound(error) || isRedirect(error)) {
        throw error;
      }

      if (error instanceof SerializableError) {
        throw error;
      }

      throw new SerializableError({
        name: "InternalServerError",
        message: "An unexpected error occurred.",
      });
    }
  },
);

/**
 * Custom serialization adapter for SerializableError.
 */
export const serializableErrorAdapter = createSerializationAdapter({
  key: "SerializableError",
  test: (v) => {
    const isSerializableError = v instanceof SerializableError;
    console.log('test', v, isSerializableError);
    return isSerializableError;
  },
  toSerializable: ({ name, message }) => ({ name, message }),
  fromSerializable: ({ name, message }) => new SerializableError({ name, message }),
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
  functionMiddleware: [errorMiddleware],
  serializationAdapters: [serializableErrorAdapter],
}));

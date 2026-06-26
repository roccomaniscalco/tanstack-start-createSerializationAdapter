import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { namedErrorSerializationAdapter } from "./error";
import { animalSerializationAdapter } from "./animal";

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
  /**
   * 1. Define custom serialization adapters
   */
  serializationAdapters: [
    namedErrorSerializationAdapter,
    animalSerializationAdapter,
  ],
}));

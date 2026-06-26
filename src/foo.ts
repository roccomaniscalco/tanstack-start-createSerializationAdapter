import { createServerFn } from "@tanstack/react-start";

/**
 * An arbitrary server function that returns a string "foo".
 */
export const getFooFn = createServerFn().handler(() => {
  return "foo";
});

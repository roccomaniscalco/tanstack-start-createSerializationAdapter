import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { getFooFn } from "./foo";

/**
 * 2. Call any server function from the client entry point
 * Commenting this out makes the custom serialization adapter work as expected
 */
getFooFn();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);

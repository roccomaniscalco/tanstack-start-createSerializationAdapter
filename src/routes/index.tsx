import { SerializableError } from "#/start";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const throwErrorFn = createServerFn().handler(() => {
  throw new Error("This is a test error from the server function.");
});

export const Route = createFileRoute("/")({ component: Repro });

function Repro() {
  const throwError = useServerFn(throwErrorFn);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <button
        onClick={() => {
          throwError();
          throwErrorFn();
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Cars
      </button>
    </div>
  );
}

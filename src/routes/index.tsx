import { Animal } from "#/animal";
import { NamedError } from "#/error";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

export const getAnimalFn = createServerFn().handler(() => {
  if (Math.random() < 0.5) {
    throw new NamedError({
      name: "AnimalError",
      message: "Sometimes, animals are just too much to handle",
    });
  }
  return new Animal("Elephant");
});

export const Route = createFileRoute("/")({ component: Index });

const PROJECT_STRUCTURE = `./src
├── animal.ts          # Defines a serializable Animal class
├── client.tsx         # Client entry – Calls an arbitrary server function
├── error.ts           # Defines a serializable NamedError class
├── foo.ts             # Defines an arbitrary server function
├── router.tsx
├── routes
│   ├── __root.tsx
│   └── index.tsx      # Index page – Reproduction example
├── routeTree.gen.ts
├── start.ts           # Start instance – Registers serialization adapters
└── styles.css
`;

function Index() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-8">
        Calling any server function from the client entry point breaks custom
        serialization adapters in React Start
      </h1>
      <h2 className="text-lg font-semibold mb-2">Expected behavior</h2>
      <p className="mb-8">
        Custom serialization adapters should work as expected, even if a server
        function is called from the client entry point.
      </p>
      <h2 className="text-lg font-semibold mb-2">Actual behavior</h2>
      <p className="mb-8">
        If any server function is called from the client entry point, then
        calling a server function that uses a custom serialization adapter will
        throw a <code>SerovalDeserializationError</code>.
      </p>
      <h2 className="text-lg font-semibold mb-2">Steps to reproduce</h2>
      <ol className="list-decimal list-inside mb-8">
        <li>Define custom serialization adapters</li>
        <li>Call any server function from the client entry point</li>
        <li>Call a server function that uses a custom serialization adapter</li>
        <li>
          A <code>SerovalDeserializationError</code> occurs
        </li>
      </ol>
      <h2 className="text-lg font-semibold mb-2">Example</h2>
      <p className="mb-8">
        <code>getAnimalFn</code> returns an <code>Animal</code> instance or
        throws a <code>NamedError</code>. Both should be serialized/deserialized
        by their respective serialization adapters, but instead a{" "}
        deserialization error occurs. Click <GetAnimalButton /> to call{" "}
        <code>getAnimalFn</code> and log the result. Comment out the call to{" "}
        <code>getFooFn</code> in <code>client.tsx</code> to see the expected
        behavior.
      </p>
      <h2 className="text-lg font-semibold mb-2">Project structure</h2>

      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {PROJECT_STRUCTURE}
      </pre>
    </div>
  );
}

function GetAnimalButton() {
  const getAnimal = useServerFn(getAnimalFn);

  return (
    <button
      onClick={() => {
        /**
         * 3. Call a server function that uses a custom serialization adapter
         */
        getAnimal()
          .then((animal) => console.log("animal", animal))
          .catch((error) => console.error("error", error));
      }}
      className="px-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 active:translate-y-px transition"
    >
      Get <code>Animal</code>
    </button>
  );
}

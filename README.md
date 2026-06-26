# Calling any server function from the client entry point breaks custom serialization adapters in React Start

## Run it locally

1. `pnpm install`
2. `pnpm dev`
3. Open localhost:3000

## Expected behavior

Custom serialization adapters should work as expected, even if a server function is called from the client entry point.

## Actual behavior

If any server function is called from the client entry point, then calling a server function that uses a custom serialization adapter will throw a `SerovalDeserializationError`.

## Steps to reproduce

1. Define custom serialization adapters
2. Call any server function from the client entry point
3. Call a server function that uses a custom serialization adapter
4. A `SerovalDeserializationError` occurs

## Example

`getAnimalFn` returns an `Animal` instance or throws a `NamedError`. Both should be serialized/deserialized by their respective serialization adapters, but instead a deserialization error occurs. Click `<GetAnimalButton />` to call `getAnimalFn` and log the result. Comment out the call to `getFooFn` in `client.tsx` to see the expected behavior.

## Project structure

```
./src
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
```

import { createSerializationAdapter } from "@tanstack/react-router";

/**
 * `Animal` class represents an animal with a specific kind.
 */
export class Animal {
  kind: string;
  constructor(kind: string) {
    this.kind = kind;
  }
}

/**
 * Custom serialization adapter for the `Animal` class.
 */
export const animalSerializationAdapter = createSerializationAdapter({
  key: "Animal",
  test: (v) => v instanceof Animal,
  toSerializable: ({ kind }) => ({ kind }),
  fromSerializable: ({ kind }) => new Animal(kind),
});

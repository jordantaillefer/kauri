import { randomUUID } from "crypto";

export class TestIdGenerator {
  private readonly _identifiant: string;

  constructor({ identifiant }: { identifiant: string }) {
    this._identifiant = identifiant;
  }

  getId() {
    return `${this._identifiant}-${randomUUID()}`;
  }
}

export class Profile {
  private readonly _id?: string

  private constructor({ id }: { id: string }) {
    this._id = id
  }

  static creerProfile(id: string) {
    return new Profile({ id })
  }

  get id(): string | undefined {
    return this._id
  }
}
import { injectable } from "inversify";
import { User } from "../models/users.models";

@injectable()
export class AuthQueryRepo {
    protected User;
    constructor() {
        this.User = User;
    }
}

@injectable()
export class AuthCommandRepo {
    protected User;
    constructor() {
        this.User = User;
    }
}
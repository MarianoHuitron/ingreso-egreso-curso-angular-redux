
export class User {

    constructor(
        public uid: string,
        public name: string,
        public email: string
    ) {}

    static fromFirebase({uid, name, email}) {
        return new User(uid,name, email);
    }
}
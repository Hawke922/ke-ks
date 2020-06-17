export interface User {
    uid: string;
    email: string;
    photoURL: string;
    displayName: string;
    password?: string;
    repeatPassword?: string;
    gender?: string;
    birthday?: any;
    bio?: string;
}
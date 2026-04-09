export type LogInPayload = {
    email: string;
    userPassword: string;
}

export type RegisterPayload = {
    email: string;
    userPassword: string
}

export type ResetPasswordPayload = {
    token: string;
    newPw: string
}
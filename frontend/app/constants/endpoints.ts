const BASE_URL = 'https://receptive-mundanely-emma.ngrok-free.dev'

export const LogInEndpoint = `${BASE_URL}/user/auth/login`
export const LogOutEndpoint = `${BASE_URL}/user/auth/log_out`

export const RegisterEndpoint = `${BASE_URL}/user/auth/register`

export const MissingPasswordEndpoint = `${BASE_URL}/user/auth/missing_password`
export const ResetPasswordEndpoint = `${BASE_URL}/user/auth/reset_password`
export const VerifyResetEndpoint = `${BASE_URL}/user/auth/verify_reset_token`
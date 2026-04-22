import type { LogInPayload, RegisterPayload, ResetPasswordPayload } from "~/types/auth"

export const useAuth = () => {

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();

    const siteUrl = useRequestURL().origin

    const logIn = async (payload: LogInPayload) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.userPassword
        })

        if ( error ) {
            toast.add({
                title: 'Đăng nhập thất bại!',
                description: error.message,
                color: 'error'
            })
            return
        }

        if ( !user.value ) {
            await new Promise<void>((resolve) => {
                const unwatch = watch(user, (newUser) => {
                    if (newUser) {
                        unwatch()
                        resolve()
                    }
                })
            })
        }

        toast.add({
            title: 'Đăng nhập thành công!',
            color: 'success'
        })
        return navigateTo('/dashboard')

    }

    const logOut = async () => {
        const { error } = await supabase.auth.signOut()

        clearNuxtData((key) => key.startsWith('current-profile-'))

        if ( error ) {
            toast.add({
                title: 'Đăng xuất thất bại!',
                description: error.message,
                color: 'error'
            })
            return
        }

        return navigateTo('/login')
    }

    const register = async (payload: RegisterPayload) => {
        const { error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.userPassword,
            options: {
                emailRedirectTo: `${siteUrl}/auth/callback`,
                data: {
                    role: 'STUDENT'
                }
            }
        })

        if ( error ) {
            toast.add({
                title: 'Đăng ký thất bại!',
                description: error.message,
                color: 'error'
            })
            return
        }

        return navigateTo('/login?status=register_success')
    }

    const missingPassword = async (email: string) => {
        try {
            const { data } = await $fetch<ApiResponse>(MissingPasswordEndpoint, {
                method: 'POST',
                query: { email }
            })

            toast.add({
                title: 'Đã gửi mail!',
                description: `Hướng dẫn phục hồi tài khoản đã được gửi về ${email}`
            })
            return data
        } catch {
            toast.add({
                title: 'Gửi mail thất bại!',
                description: 'Vui lòng thử lại sau.',
                color: 'error'
            })
            return false
        }
    }

    const resetPassword = async (payload: ResetPasswordPayload) => {
        try {
            const { message, data } = await $fetch<ApiResponse>(ResetPasswordEndpoint, {
                method: 'POST',
                body: payload
            })

            toast.add({
                title: 'Thay đổi mật khẩu thành công!',
                description: message
            })
            return data
        } catch {
            toast.add({
                title: 'Thay đổi mật khẩu thất bại!',
                description: 'Vui lòng thử lại sau.',
                color: 'error'
            })
        }
    }

    const verifyResetToken = async (token: string) => {
        try {
            await $fetch<ApiResponse>(VerifyResetEndpoint, {
                method: 'GET',
                query: { token: token }
            })
            return true
        } catch {
            return false
        }
    }


    return { logIn, logOut, register, missingPassword, resetPassword, verifyResetToken }
}
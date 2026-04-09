export default defineNuxtRouteMiddleware((to) => {

    const user = useSupabaseUser()

    if (to.path === '/') {
        if (!user.value) {
            return navigateTo('/login')
        }
        return navigateTo('/dashboard')
    }

    if (to.path.startsWith('/dashboard')) {

        if (!user.value) {
            return navigateTo('/login?status=unauthorized')
        }
    }
})
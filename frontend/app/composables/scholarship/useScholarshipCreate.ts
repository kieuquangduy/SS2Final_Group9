import type { Enums } from "~/types/database.types"

export const useScholarshipCreate = async () => {
    const toast = useToast()
    const supabase = useSupabaseClient()
    const isLoading = ref<boolean>(false)

    const createScholarship = async (payload: {
        title: string,
        description: string,
        tier: Enums<'scholarship_tier'>
    }) => {
        isLoading.value = true

        const { error } = await supabase
            .from('scholarships')
            .insert(payload)

        if (error) {
            isLoading.value = false
            toast.add({
                title: 'Error Creating Scholarship!',
                description: error.message,
                color: 'error'
            })
            return
        }

        isLoading.value = false
        toast.add({
                title: 'Scholarship Created!',
                color: 'success'
            })
    }
    return {createScholarship, isLoading}
}
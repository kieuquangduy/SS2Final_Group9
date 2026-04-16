export const useScholarshipList = async () => {
    const toast = useToast()
    const supabase = useSupabaseClient()

    const scholarshipListKey = computed(() => {
        return `scholarshipList`
    })

    const { data, error } = await useAsyncData(
        scholarshipListKey,
        async () => {
            const { data } = await supabase
                .from('scholarship')
                .select('*')
            return data
        }
    )
    if ( error.value ) {
        toast.add({
            title: 'Error Fetching Detail!',
            color: 'error'
        })
        return { data: ref(null) }
    }

    return { data }
}
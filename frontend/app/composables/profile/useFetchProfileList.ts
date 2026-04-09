export const useFetchProfileList = async () => {
    const toast = useToast()
    const supabase = useSupabaseClient()

    const profileDetailKey = computed(() => {
        return `profileList`
    })

    const { data, error } = await useAsyncData(
        profileDetailKey,
        async () => {
            const { data } = await supabase
                .from('students')
                .select('uid, full_name, student_id, university, major, class')
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
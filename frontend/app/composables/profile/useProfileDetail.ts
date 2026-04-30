export const useProfileDetail = async (id?: string) => {
  const toast = useToast()
  if (!id) {
    toast.add({
      title: 'Invalid Params!',
      description: 'Missing/Incorrect ID Params.',
      color: 'error',
    })
    return { data: ref(null) }
  }
  const supabase = useSupabaseClient()

  const profileDetailKey = computed(() => {
    return `profile-detail-${id}`
  })

  const { data, error } = await useAsyncData(
    profileDetailKey,
    async () => {
      const { data: role } = await supabase.from('profiles').select('role').eq('id', id).single()
      console.log(role)
      if (role!.role === 'STUDENT') {
        const { data, error } = await supabase
          .from('student_detail_view')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      }

      if (role!.role === 'ORGANIZER') {
        const { data, error } = await supabase
          .from('organizer_detail_view')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    },
  )

  if (error.value) {
    toast.add({
      title: 'Error Fetching Detail!',
      description: error.value.message,
      color: 'error',
    })
    return { data: ref(null) }
  }

  return { data }
}

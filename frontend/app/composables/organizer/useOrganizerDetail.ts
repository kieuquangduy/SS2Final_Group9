export const useOrganizerDetail = async (id?: string) => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const currentId = ref(id)

  const { data, status, error, execute } = await useAsyncData(
    () => `organizer-detail-${currentId.value || 'empty'}`,
    async () => {
      if (!currentId.value) return null

      const { data: result, error: fetchError } = await supabase
        .from('organizer_detail_view')
        .select('*')
        .eq('id', currentId.value)
        .single()

      if (fetchError) {
        toast.add({
          title: 'Error Fetching Detail!',
          description: fetchError.message,
          color: 'error',
        })
        throw fetchError
      }
      return result
    },
    {
      immediate: !!id,
      watch: [currentId],
    },
  )

  const fetchOrganizerDetail = async (newId: string) => {
    currentId.value = newId
    await execute()
  }

  return {
    data,
    isLoading: computed(() => status.value === 'pending'),
    error,
    fetchOrganizerDetail,
  }
}

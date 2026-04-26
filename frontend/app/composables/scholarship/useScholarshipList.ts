import type { Tables } from '~/types/database.types'

export const useScholarshipList = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const scholarshipListKey = computed(() => {
    return `scholarship-list`
  })

  const { data, error } = await useAsyncData(
    scholarshipListKey,
    async () => {
      const { data } = await supabase
        .from('scholarship_list_view')
        .select('*')
      return data
    },
  )
  if (error.value) {
    toast.add({
      title: 'Error Fetching Detail!',
      color: 'error',
    })
    return { data: ref(null) }
  }

  return { data }
}

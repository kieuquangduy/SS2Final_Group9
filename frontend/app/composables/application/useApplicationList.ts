import type { Tables } from '~/types/database.types'

export const useApplicationList = async () => {
  const supabase = useSupabaseClient()
  const toast = useToast()
  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const { data, error, refresh } = await useAsyncData(
    `application-list`,
    async () => {
      let query = supabase
        .from('application_list_view')
        .select('*', { count: 'exact' })
      if (curUser.value?.role === 'STUDENT') {
        query = query.eq('student_id', curUser.value.id)
      }
      else if (curUser.value?.role === 'ORGANIZER') {
        query = query.contains('organizers', JSON.stringify([{ id: curUser.value?.id }]))
        console.log(`running for ${curUser.value.id}`)
      }
      query = query.order('created_at', { ascending: false })

      const { data, count } = await query
      return { data, count }
    },
  )
  if (error.value) {
    toast.add({
      title: 'Error Fetching Detail!',
      color: 'error',
    })
    return { data: ref(null), count: ref(0) }
  }

  return {
    data,
    refresh,
  }
}

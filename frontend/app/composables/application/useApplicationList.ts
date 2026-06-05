type filterOptions = 'Applicants' | 'Scholarships' | 'Own'

export const useApplicationList = async () => {
  const supabase = useSupabaseClient()
  const toast = useToast()

  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const listByScholarship = async (sid: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('scholarship_id', sid)

    if (error) {
      toast.add({
        title: 'Error Fetching List!',
        description: error.message ?? 'Please try again later!',
        color: 'error',
      })
      return { data: ref(null) }
    }

    return { data }
  }

  return {
    listByScholarship,
  }
}

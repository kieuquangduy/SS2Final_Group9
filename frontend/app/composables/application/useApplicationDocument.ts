import type { Tables } from '~/types/database.types'

type FetchOptions = {
  studentId?: string
  applicationId?: string
}

export const useApplicationDocument = async ({ studentId, applicationId }: FetchOptions) => {
  const toast = useToast()
  const supabase = useSupabaseClient()

  if (!studentId && !applicationId) {
    console.warn('useDocumentList requires either a studentId or an applicationId')
    return { documents: ref([]), isLoading: ref(false), fetchError: ref(null) }
  }

  const cacheKey = studentId
    ? `student-docs-${studentId}`
    : `app-docs-${applicationId}`

  const { data: documents, status, error: fetchError } = await useAsyncData<Tables<'student_documents'>[]>(
    cacheKey,
    async () => {
      if (studentId) {
        const { data, error } = await supabase
          .from('student_documents')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      }

      if (applicationId) {
        const { data, error } = await supabase
          .from('application_documents')
          // The magic of Supabase: this fetches the joined row from user_documents!
          .select('user_documents(*)')
          .eq('application_id', applicationId)

        if (error) throw error

        return (data || [])
          .map(row => row.user_documents)
          .filter(doc => doc !== null) as Tables<'student_documents'>[]
      }

      return []
    },
  )

  if (fetchError.value) {
    toast.add({
      title: 'Error Fetching Documents',
      description: fetchError.value.message,
      color: 'error',
    })
  }

  return {
    documents,
    isLoading: computed(() => status.value === 'pending'),
    fetchError,
  }
}

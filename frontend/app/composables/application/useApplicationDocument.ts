import type { Tables } from '~/types/database.types'

type FetchOptions = {
  studentId?: string
  applicationId?: string
}

export const useApplicationDocument = async ({ studentId, applicationId }: FetchOptions) => {
  const toast = useToast()
  const supabase = useSupabaseClient()

  // Ensure we don't try to fetch if both are missing
  if (!studentId && !applicationId) {
    console.warn('useDocumentList requires either a studentId or an applicationId')
    return { documents: ref([]), isLoading: ref(false), fetchError: ref(null) }
  }

  // Create a unique cache key depending on what we are fetching
  const cacheKey = studentId 
    ? `student-docs-${studentId}` 
    : `app-docs-${applicationId}`

  const { data: documents, status, error: fetchError, refresh } = await useAsyncData<Tables<'student_documents'>[]>(
    cacheKey,
    async () => {
      // --- SCENARIO A: Fetch from the Student's Vault ---
      if (studentId) {
        const { data, error } = await supabase
          .from('student_documents')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      }

      // --- SCENARIO B: Fetch from the Application Junction Table ---
      if (applicationId) {
        const { data, error } = await supabase
          .from('application_documents')
          // The magic of Supabase: this fetches the joined row from user_documents!
          .select('user_documents(*)')
          .eq('application_id', applicationId)

        if (error) throw error

        // Supabase returns junction joins as [{ user_documents: { id: 1... } }]
        // We map it here so the frontend just gets a flat array of documents.
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
      color: 'error'
    })
  }

  return {
    documents,
    isLoading: computed(() => status.value === 'pending'),
    fetchError,
  }
}

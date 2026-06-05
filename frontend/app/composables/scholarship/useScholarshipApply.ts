import type { CompositeTypes, Tables } from '~/types/database.types'

type FilePayload = {
  fileName: string
  file: File | null
  fileUrl?: string
  fileId?: number
}

type FormPayload = {
  gpa?: CompositeTypes<'academic_info'>['gpa']
  accumulated_credits?: CompositeTypes<'academic_info'>['accumulated_credits']
  extracurricular_info?: CompositeTypes<'extracurricular_info'>[]
  father_occupation: string
  mother_occupation: string
  family_average_income: CompositeTypes<'background_info'>['family_average_income']
}

export const useScholarshipApply = async (sid: string) => {
  const supabase = useSupabaseClient()
  const toast = useToast()
  const isLoading = ref<boolean>(false)
  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const checkUnique = async () => {
    isLoading.value = true
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', curUser.value!.id)
      .eq('scholarship_id', sid)
      .limit(1)

    if (error) {
      toast.add({
        title: 'Error fetching data',
        description: error.message ?? 'Please try again later!',
        color: 'error',
      })
      isLoading.value = false
      return false
    }
    isLoading.value = false
    return data.length === 0
  }

  const applicationKey = computed(() => {
    return `application-${sid}-${curUser.value!.id}`
  })
  const { data: canApply } = await useAsyncData(applicationKey, checkUnique)

  const scholarshipApply = async (payload: FormPayload, files: FilePayload[] = []) => {
    isLoading.value = true

    const updatePayload = {
      academic_info: {
        gpa: payload.gpa,
        accumulated_credits: payload.accumulated_credits,
      },
      extracurricular_info: payload.extracurricular_info?.filter(row => row && row.club_name!.trim() !== '') || [],
      background_info: {
        father_occupation: payload.father_occupation,
        mother_occupation: payload.mother_occupation,
        family_average_income: payload.family_average_income,
      },
    }

    try {
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert({
          academic_info: updatePayload.academic_info,
          extracurricular_info: updatePayload.extracurricular_info,
          background_info: updatePayload.background_info,
          scholarship_id: sid,
          student_id: curUser.value!.id,
          status: 'APPLIED',
        })
        .select('id')
        .single()

      if (appError) throw appError

      const newAppId = appData.id

      if (files.length > 0) {
        const documentPromises = files.map(async (doc) => {
          if (doc.file instanceof File) {
            const safeName = doc.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
            const filePath = `${curUser.value!.id}/app-${newAppId}-${Date.now()}-${safeName}`

            const { error: storageError } = await supabase.storage.from('documents').upload(filePath, doc.file)
            if (storageError) throw storageError

            const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)

            return {
              application_id: newAppId,
              document_name: doc.file.name,
              file_url: urlData.publicUrl,
              file_type: doc.file.type || 'unknown',
              display_name: doc.fileName,
            }
          }

          else if (doc.fileId) {
            const { data: vaultDoc, error: vaultError } = await supabase
              .from('student_documents')
              .select('file_url, file_type, id')
              .eq('id', doc.fileId)
              .single()

            if (vaultError) throw vaultError

            return {
              application_id: newAppId,
              document_id: vaultDoc.id,
              document_name: doc.fileName,
              file_url: vaultDoc.file_url,
              file_type: vaultDoc.file_type,
              display_name: doc.fileName,
            }
          }

          return null
        })

        const dbRecords = (await Promise.all(documentPromises)).filter(Boolean)

        if (dbRecords.length > 0) {
          const { error: docError } = await supabase
            .from('application_documents')
            .insert(dbRecords)

          if (docError) throw docError
        }
      }

      refreshNuxtData(applicationKey.value)

      toast.add({
        title: 'Applied successfully',
        color: 'success',
      })
    }
    catch (error: any) {
      // Catch any error from Application Insert, Storage Upload, or Vault Fetch
      toast.add({
        title: 'Error during application',
        description: error.message ?? 'Please try again later.',
        color: 'error',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    canApply,
    scholarshipApply,
  }
}

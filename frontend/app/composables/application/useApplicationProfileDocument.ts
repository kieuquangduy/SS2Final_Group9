import type { Tables } from '~/types/database.types'

type payload = {
  fileName: string
  file: File | null
}

export const useApplicationProfileDocuments = () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const isLoading = ref<boolean>(false)

  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const uploadDocuments = async (payload: payload[]) => {
    if (!payload.length || !curUser.value) return 0

    isLoading.value = true
    let successCount = 0

    // Map the array of files into an array of Upload Promises
    const uploadPromises = payload.map(async (p) => {
      if (p.file === null || p.fileName === '') return
      try {
        const safeName = p.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
        const filePath = `${curUser.value!.id}/${Date.now()}-${safeName}`

        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .upload(filePath, p.file)

        if (storageError) throw storageError

        const { data: urlData } = supabase
          .storage
          .from('documents')
          .getPublicUrl(filePath)

        // 4. Save the reference to your SQL Database (The "Vault")
        const { error: dbError } = await supabase
          .from('student_documents')
          .insert({
            student_id: curUser.value!.id,
            document_name: p.file.name,
            file_type: p.file.type || 'unknown',
            file_url: urlData.publicUrl,
            display_name: p.fileName,
          })

        if (dbError) throw dbError

        successCount++
      }
      catch (error: any) {
        // If ONE file fails, we catch it here so it doesn't stop the OTHER files from uploading!
        console.error(`Failed to upload ${p.fileName}:`, error)
        toast.add({
          title: `Upload Failed: ${p.fileName}`,
          description: error.message,
          color: 'error',
        })
      }
    })

    await Promise.all(uploadPromises)

    isLoading.value = false

    if (successCount > 0) {
      toast.add({
        title: 'Upload Complete',
        description: `Successfully saved ${successCount} document(s) to your vault.`,
        color: 'success',
      })
    }

    return navigateTo(`/dashboard/${curUser.value!.id}`)
  }

  return { isLoading, uploadDocuments }
}

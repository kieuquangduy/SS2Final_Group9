export const useApplicationDelete = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()

  const isDeleting = ref<boolean>(false)

  const deleteApplication = async (id: string) => {
    isDeleting.value = true
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    isDeleting.value = false
    if (deleteError) {
      toast.add({
        title: 'Error Deleting Scholarship!',
        description: deleteError?.message,
        color: 'error',
      })
      return false
    }

    toast.add({
      title: 'Application Deleted!',
      color: 'success',
    })
    return true
  }

  return { deleteApplication, isDeleting }
}

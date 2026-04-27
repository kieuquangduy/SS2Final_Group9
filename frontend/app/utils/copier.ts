export const copier = (value: string | null, message?: string) => {
  if (!value) return
  const { copy, copied } = useClipboard()
  const toast = useToast()
  copy(value)
  if (copied) {
    toast.add({
      title: message ?? 'Value Copied to Clipboard',
      color: 'success',
    })
  }
}

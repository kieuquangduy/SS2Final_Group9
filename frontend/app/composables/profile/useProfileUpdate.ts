import type { CompositeTypes, Enums, Tables } from '~/types/database.types'

type FormPayload = {
  username?: string
  avatar_url?: string
  contact_info?: CompositeTypes<'profile_contact_type'>[]
  bio?: string
  full_name?: string
  gender?: Enums<'student_gender'>
  dob?: string
  province: string
  district: string
  detail: string
  student_code?: string
  field_of_study?: string
  university?: string
  class?: string
  website?: string
}

type ImagePayload = {
  isChanged: boolean
  file: File | null
}

export const useProfileUpdate = async () => {
  const toast = useToast()
  const supabase = useSupabaseClient()
  const isLoading = ref<boolean>(false)

  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  const updateProfile = async (payload: FormPayload, imgPayload: ImagePayload) => {
    isLoading.value = true

    let ProfileUpdatePayload = {}

    if (imgPayload.isChanged) {
      if (!imgPayload.file) {
        toast.add({
          title: 'Update Avatar Failure',
          color: 'error',
        })
        return
      }
      const fileExt = imgPayload.file.name.split('.').pop()
      const filePath = `profiles/${curUser.value!.id}/avatar-${curUser.value!.id}.${fileExt}`

      const { error } = await supabase
        .storage
        .from('public_images')
        .upload(filePath, imgPayload.file, {
          upsert: true,
        })
      if (error) {
        toast.add({
          title: 'Update Avatar Failure',
          description: error.message,
          color: 'error',
        })
        return
      }
      const { data } = supabase
        .storage
        .from('public_images')
        .getPublicUrl(filePath)

      ProfileUpdatePayload = {
        avatar_url: `${data.publicUrl}?t=${Date.now()}`,
      }
    }

    ProfileUpdatePayload = {
      ...ProfileUpdatePayload,
      username: payload.username,
      contact_info: payload.contact_info?.filter(row => row.value && row.value.trim() !== '') || [],
      bio: payload.bio,
      is_complete: true,
    }
    const StudentUpdatePayload = {
      full_name: payload.full_name,
      gender: payload.gender,
      dob: payload.dob,
      residence: { province: payload.province, district: payload.district, detail: payload.detail },
      student_code: payload.student_code,
      field_of_study: payload.field_of_study,
      university: payload.university,
      class: payload.class,
    }
    const OrganizerUpdatePayload = {
      website: payload.website,
    }

    try {
      const [profileRes, studentRes, organizerRes] = await Promise.all([
        supabase.from('profiles').update(ProfileUpdatePayload).eq('id', curUser.value!.id),
        supabase.from('students').update(StudentUpdatePayload).eq('id', curUser.value!.id),
        supabase.from('organizers').update(OrganizerUpdatePayload).eq('id', curUser.value!.id),
      ])

      if (profileRes.error) throw profileRes.error.message
      if (studentRes.error) throw studentRes.error.message
      if (organizerRes.error) throw organizerRes.error.message

      toast.add({
        title: 'Profile Updated',
        color: 'success',
      })

      await refreshNuxtData('user-detail')
      await refreshNuxtData(`profile-detail-${curUser.value!.id}`)

      return navigateTo(`/dashboard/${curUser.value!.id}`)
    }
    catch (error: unknown) {
      toast.add({
        title: 'Update Profile Failed',
        description: error as string,
        color: 'error',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, updateProfile }
}

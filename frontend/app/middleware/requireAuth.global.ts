import { useScholarshipDetail } from '~/composables/scholarship/useScholarshipDetail'
import type { Tables } from '~/types/database.types'

export default defineNuxtRouteMiddleware(async (to) => {
  const loggedIn = useSupabaseUser()
  const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

  if (to.path === '/') {
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
    return navigateTo('/dashboard')
  }

  if (to.path.startsWith('/dashboard')) {
    if (!loggedIn.value) return navigateTo('/login?status=unauthorized')
  }

  if (to.path.startsWith('/dashboard/admin')) {
    if (curUser.value?.role != 'ADMIN' && curUser.value?.role != 'ORGANIZER') {
      if (!loggedIn.value) return navigateTo('/login?status=unauthorized')
      return navigateTo('/dashboard')
    }
  }

  const editProfileRouteMatch = to.path.match(/^\/dashboard\/([^/]+)\/edit\/?$/)
  if (editProfileRouteMatch) {
    if (!loggedIn.value) return navigateTo('/login?status=unauthorized')
    const urlId = editProfileRouteMatch[1]
    if (curUser.value?.id !== urlId) {
      return navigateTo('/dashboard')
    }
  }
  const applicantProfileRouteMatch = to.path.match(/^\/dashboard\/([^/]+)\/applicant\/?$/)
  if (applicantProfileRouteMatch) {
    if (!loggedIn.value) return navigateTo('/login?status=unauthorized')
    if (curUser.value?.role != 'STUDENT') {
      return navigateTo('/dashboard')
    }
    const urlId = applicantProfileRouteMatch[1]
    if (curUser.value?.id !== urlId) {
      return navigateTo('/dashboard')
    }
  }

  const editScholarshipRouteMatch = to.path.match(/^\/dashboard\/admin\/manage-scholarships\/([^/]+)\/?$/)
  if (editScholarshipRouteMatch) {
    if (!loggedIn.value) return navigateTo('/login?status=unauthorized')
    const scholarshipId = editScholarshipRouteMatch[1]
    if (curUser.value?.role !== 'ADMIN' && curUser.value?.role !== 'ORGANIZER') {
      return navigateTo('/dashboard')
    }

    if (scholarshipId === 'create') {
      return
    }

    if (curUser.value?.role === 'ORGANIZER') {
      const { data: scholarshipDetail } = await useScholarshipDetail(scholarshipId)
      if (!scholarshipDetail.value) {
        return navigateTo('/dashboard')
      }
      const isOrganizer = scholarshipDetail.value.organizers!.some((org) => org.id === curUser.value!.id)
      if (!isOrganizer) {
        return navigateTo('/dashboard')
      }
    }
  }
})

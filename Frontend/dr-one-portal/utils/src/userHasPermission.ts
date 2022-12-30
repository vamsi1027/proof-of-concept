type StoragedUser = {
  email: string
  name: string
  organizationActive: string
  organizations: { [name: string]: string }
  permissions: string[]
}
export default function userHasPermission(roles: string[]): boolean {
  const user: StoragedUser = JSON.parse(localStorage.getItem('dr-user'))
  if (!!user && !!roles.length) {
    return user?.permissions?.some(permission => roles.includes(permission))
  }
  return false
}

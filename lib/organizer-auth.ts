// Organizer authentication helper - stores session in localStorage
export interface OrganizerSession {
  id: string
  email: string
  full_name: string
  isAuthenticated: boolean
}

const ORGANIZER_SESSION_KEY = "organizer_session"

// Hardcoded organizer credentials (should be replaced with backend auth)
const VALID_ORGANIZERS = [
  {
    id: "org_001",
    email: "roboticsclub.hitk@gmail.com",
    password: "Robotics@htk", // corrected password from "Robotics@htkk" to "Robotics@htk"
    full_name: "Robotics Club Admin",
  },
]

export function loginOrganizer(email: string, password: string): OrganizerSession | null {
  const normalizedEmail = email.toLowerCase().trim()
  const organizer = VALID_ORGANIZERS.find(
    (org) => org.email.toLowerCase() === normalizedEmail && org.password === password,
  )

  if (organizer) {
    const session: OrganizerSession = {
      id: organizer.id,
      email: organizer.email,
      full_name: organizer.full_name,
      isAuthenticated: true,
    }
    localStorage.setItem(ORGANIZER_SESSION_KEY, JSON.stringify(session))
    return session
  }

  return null
}

export function getOrganizerSession(): OrganizerSession | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(ORGANIZER_SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

export function logoutOrganizer(): void {
  localStorage.removeItem(ORGANIZER_SESSION_KEY)
}

export function isOrganizerAuthenticated(): boolean {
  const session = getOrganizerSession()
  return session?.isAuthenticated ?? false
}

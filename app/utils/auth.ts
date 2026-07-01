type AuthSession = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

const STORAGE_KEY = "auth";

function getSession(): AuthSession | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_AUTH_LOGIN_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Login failed");

    const session: AuthSession = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchCurrentUser() {
  try {
    const session = getSession();
    if (!session) throw new Error("Not logged in");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_AUTH_USER_URL}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch user");

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function refreshSession() {
  try {
    const session = getSession();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_AUTH_REFRESH_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(session?.refreshToken && { refreshToken: session.refreshToken }),
          expiresInMins: 30,
        }),
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Refresh failed");

    const tokens = await response.json();
    const updated = { ...session, ...tokens };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

const API_url = "https://localhost:5000"

export async function registerUser(email: string, password: string) {
  try {
    const response = await fetch(
      `${API_url}/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Error registering.');
    }

    // Parse the response
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { ok: false, error: error.message };
  }
}

export async function loginUser(email: string, password: string, rememberme: boolean) {
    const loginUrl = rememberme
      ? `${API_url}/login?useCookies=true`
      : `${API_url}/login?useSessionCookies=true`;
  
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // ✅ Ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      // Check for a non-empty response
      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }
  
      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }
  
      return { ok: true, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { ok: false, error: error.message || 'Error logging in.' };
    }
  }

  export async function pingAuth() {
    try {
      const response = await fetch(
        `${API_url}/pingauth`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
  
      const contentType = response.headers.get('content-type');
  
      // Check if response is valid JSON
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }
  
      const data = await response.json();
  
      if (data.email) {
        return { ok: true, email: data.email };
      } else {
        throw new Error('Invalid user session');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      return { ok: false };
    }
  }

  export async function logoutUser() {
    try {
      const response = await fetch(
        `${API_url}/logout`,
        {
          method: 'POST',
          credentials: 'include', // Ensure cookies are sent
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }
  
      return { ok: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { ok: false, error: error.message };
    }
  }
    
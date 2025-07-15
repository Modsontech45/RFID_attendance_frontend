// Authentication utilities using localStorage
export const setAuthData = (name: string, value: string): void => {
  try {
    localStorage.setItem(name, value);
    console.log(`Setting ${name}:`, value); // Debug log
  } catch (error) {
    console.error(`Failed to set ${name}:`, error);
  }
};

export const getAuthData = (name: string): string | null => {
  try {
    const value = localStorage.getItem(name);
    console.log(`Getting ${name}:`, value); // Debug log
    return value;
  } catch (error) {
    console.error(`Failed to get ${name}:`, error);
    return null;
  }
};

export const deleteAuthData = (name: string): void => {
  try {
    localStorage.removeItem(name);
    console.log(`Deleted ${name}`); // Debug log
  } catch (error) {
    console.error(`Failed to delete ${name}:`, error);
  }
};

// Cookie utilities (kept for compatibility)
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const expiresString = expires.toUTCString();

  const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expiresString}; path=/; SameSite=Lax`;
  document.cookie = cookieString;

  console.log(`Setting cookie: ${cookieString}`); // Debug log
  console.log(`Document.cookie after setting: ${document.cookie}`); // Debug log
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    console.log(`Getting cookie ${name}:`, cookieValue); // Debug log
    return cookieValue || null;
  }
  console.log(`Cookie ${name} not found`); // Debug log
  return null;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, "", -1);
};

export const logout = (): void => {
  deleteAuthData("token");
  deleteAuthData("role");
  deleteAuthData("api_key");
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  return !!getAuthData("token");
};

export const getUserRole = (): string | null => {
  return getAuthData("role");
};

export const getApiKey = (): string | null => {
  return getAuthData("api_key");
};

export const getAdminData = (): any | null => {
  const adminData = getAuthData("admin_data");
  return adminData ? JSON.parse(adminData) : null;
};

export const setAdminData = (adminData: any): void => {
  setAuthData("admin_data", JSON.stringify(adminData));
};

// API utilities
export const API_BASE = "https://rfid-attendancesystem-backend-project.onrender.com/api";

export const postData = async (url: string, data: any, headers: any = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const message =
        responseData.message || responseData.error || `HTTP error! status: ${response.status}`;

      const error = new Error(message);
      (error as any).status = response.status;
      (error as any).data = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

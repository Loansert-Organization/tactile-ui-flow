// Auto-generated shim for session manager utility
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('easy_momo_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('easy_momo_session_id', sessionId);
  }
  return sessionId;
};

export const clearSession = (): void => {
  localStorage.removeItem('easy_momo_session_id');
};

export const refreshSession = (): string => {
  clearSession();
  return getSessionId();
};

export default {
  getSessionId,
  clearSession,
  refreshSession
};

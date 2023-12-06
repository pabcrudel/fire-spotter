export function getWithTTL(key) {
  const value = localStorage.getItem(key);

  if (value) {
      const {content, expiry} = JSON.parse(value);
      const now = new Date();
    
    if (expiry && now.getTime() > expiry) localStorage.removeItem(key);
    
    return content;
  };
};

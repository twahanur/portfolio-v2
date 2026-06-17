let cachedContextPromise = null;
let cachedContextData = null;

export const fetchAiContext = async () => {
  // 1. If data is already cached in memory, return it instantly
  if (cachedContextData) {
    return cachedContextData;
  }
  
  // 2. If a fetch is already in progress, return the existing promise
  if (cachedContextPromise) {
    return cachedContextPromise;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  
  cachedContextPromise = fetch(`${apiUrl}/api/ai-context`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch context: ${res.statusText}`);
      }
      const payload = await res.json();
      cachedContextData = payload;
      cachedContextPromise = null;
      return payload;
    })
    .catch((err) => {
      cachedContextPromise = null;
      throw err;
    });

  return cachedContextPromise;
};

// Expose a function to clear cache when updating admin panel data
export const clearAiContextCache = () => {
  cachedContextData = null;
  cachedContextPromise = null;
};

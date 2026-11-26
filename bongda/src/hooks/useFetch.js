import { useEffect, useState } from 'react';

const useFetch = (url) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    fetch(url, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Request failed'); return response.json(); })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error }); });
    return () => controller.abort();
  }, [url]);
  return state;
};

export default useFetch;

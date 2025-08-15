import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAppData() {
  const [data, setData] = useState({
    finishingTypes: [],
    clotheTypes: [],
    colours: [],
    sillNames: [],
    qualities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [finishingRes, clothRes, colourRes, sillRes, qualityRes] = await Promise.all([
            axios.get('/api/menu/finishing-type'),
          axios.get('/api/menu/cloth-type'),
          axios.get('/api/menu/colour'),
         
          axios.get('/api/menu/sill-name'),
          axios.get('/api/menu/quality'),
        ]);

        setData({
          finishingTypes: finishingRes.data,
          clotheTypes: clothRes.data,
          colours: colourRes.data,
          sillNames: sillRes.data,
          qualities: qualityRes.data,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

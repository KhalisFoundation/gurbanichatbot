// utils/fetchGurbaniData.js
import { getSourceID } from './getSourceID';
import { fetchShabadDetails } from './fetchShabadDetails';
import { updateSourceCounts } from './updateSourceCounts';

export const fetchGurbaniData = async (query, selectedSource, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
    const data = await response.json();
    console.log('API Response Data:', data);

    const filteredData = data.results.filter(item => item.Payload.SourceID === getSourceID(selectedSource));
    setGurbaniData(filteredData);
    setHistory(prevHistory => [...prevHistory, query]);

    updateSourceCounts(data.results, setSourceCounts);

    const shabadData = await fetchShabadDetails(filteredData);
    setShabadDetails(shabadData);
  } catch (error) {
    console.error('Error fetching Gurbani data:', error);
  } finally {
    setLoading(false);
  }
};

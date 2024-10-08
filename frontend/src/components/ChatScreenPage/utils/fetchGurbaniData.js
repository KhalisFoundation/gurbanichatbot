import { getSourceID } from './getSourceID';
import { fetchShabadDetails } from './fetchShabadDetails';
import { updateSourceCounts } from './updateSourceCounts';

export const fetchGurbaniData = async (query, selectedSource, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
    const data = await response.json();
    console.log('API Response Data:', data);

    // Filter the gurbani data based on selected source
    const filteredData = data.results.filter(item => item.Payload && item.Payload.SourceID === getSourceID(selectedSource));
    setGurbaniData(filteredData);
    setHistory(prevHistory => [...prevHistory, query]);

    updateSourceCounts(data.results, setSourceCounts);

    // Fetch shabad details for all filtered data
    const shabadData = await fetchShabadDetails(filteredData);

    // Filter shabadData based on selected source
    const filteredShabadDetails = shabadData.filter(item => item.source === getSourceID(selectedSource));
    
    setShabadDetails(filteredShabadDetails);
  } catch (error) {
    console.error('Error fetching Gurbani data:', error);
  } finally {
    setLoading(false);
  }
};
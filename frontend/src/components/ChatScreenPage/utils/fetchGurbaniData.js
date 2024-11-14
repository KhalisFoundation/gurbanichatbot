import { getSourceID } from './getSourceID';
import { fetchShabadDetails } from './fetchShabadDetails';
import { updateSourceCounts } from './updateSourceCounts';

let cachedData = {};

export const fetchGurbaniData = async (
  query,
  selectedSource,
  setGurbaniData,
  setHistory,
  setSourceCounts,
  setShabadDetails,
  setLoading
) => {
  setLoading(true);
  console.log(`Fetching Gurbani data for query: "${query}" from source: "${selectedSource}"`);

  const sourceID = getSourceID(selectedSource);

  if (cachedData[query] && cachedData[query][sourceID]) {
    console.log(`Cache hit for query: "${query}" and source: "${selectedSource}"`);

    const filteredData = cachedData[query][sourceID];
    console.log(`Filtered data for source "${selectedSource}" (SourceID: ${sourceID}):`, filteredData);

    if (filteredData.length === 0) {
      console.log('No data found for the selected source. Fetching fresh data...');
      await fetchAndSetGurbaniData(query, selectedSource, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading);
      return;
    }

    setGurbaniData(filteredData);
    setShabadDetails(filteredData);
    updateSourceCounts(filteredData, setSourceCounts);  // Corrected to pass filteredData
    setLoading(false);
    return;
  }

  console.log('No cached data found. Fetching fresh data...');
  await fetchAndSetGurbaniData(query, selectedSource, setGurbaniData, setHistory, setSourceCounts, setShabadDetails, setLoading);
};

const fetchAndSetGurbaniData = async (
  query,
  selectedSource,
  setGurbaniData,
  setHistory,
  setSourceCounts,
  setShabadDetails,
  setLoading
) => {
  try {
    console.log(`Making request to external API for query: "${query}"`);
    const response = await fetch(`https://gurbanichatbot.sikhitothemax.org/search/?query=${query}`);
    const data = await response.json();

    console.log('API Response Data:', data);

    if (data && Array.isArray(data.results)) {
      const sourceID = getSourceID(selectedSource);
      const filteredData = data.results.filter(
        (item) => item.Payload && item.Payload.SourceID === sourceID
      );

      console.log(`Filtered results for source "${selectedSource}" (SourceID: ${sourceID}):`, filteredData);

      // Cache data by query and sourceID
      if (!cachedData[query]) {
        cachedData[query] = {};
      }
      cachedData[query][sourceID] = filteredData;

      setGurbaniData(filteredData);
      setHistory((prevHistory) => [...prevHistory, query]);
      updateSourceCounts(filteredData, setSourceCounts);  // Corrected to pass filteredData

      const shabadData = await fetchShabadDetails(filteredData);
      console.log('Fetched Shabad details:', shabadData);
      setShabadDetails(shabadData);
    } else {
      console.error('Invalid data format:', data);
    }
  } catch (error) {
    console.error('Error fetching Gurbani data:', error);
  } finally {
    setLoading(false);
  }
};

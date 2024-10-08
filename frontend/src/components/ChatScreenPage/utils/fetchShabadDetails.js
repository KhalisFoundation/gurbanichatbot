// utils/fetchShabadDetails.js
export const fetchShabadDetails = async (gurbaniData) => {
    const shabadDetails = [];
    for (const item of gurbaniData) {
      const shabadId = item.Payload.ShabadID;
      try {
        const response = await fetch(`https://api.banidb.com/v2/shabads/${shabadId}`);
        const data = await response.json();
        
        const verses = data.verses.slice(0, 5).map(verse => ({
          verse: verse.verse.unicode,
          translation: verse.translation?.en?.bdb || 'Translation not available',
        }));
  
        shabadDetails.push({
          shabadId,
          source: item.Payload.SourceID,
          verses,
        });
      } catch (error) {
        console.error(`Error fetching details for Shabad ID ${shabadId}:`, error);
      }
    }
    return shabadDetails;
  };
  
export const updateSourceCounts = (data, setSourceCounts) => {
  if (!Array.isArray(data)) {
    console.error("Expected 'data' to be an array, but received:", data);
    return;  // Exit if it's not an array
  }

  const counts = {
    'Sri Guru Granth Sahib Ji': 0,
    'Sri Dasam Granth Sahib': 0,
    'Vaaran Bhai Gurdas Ji': 0,
    'Mahan Kosh': 0,
  };

  data.forEach(item => {
    switch (item.Payload.SourceID) {
      case 'G':
        counts['Sri Guru Granth Sahib Ji'] += 1;
        break;
      case 'D':
        counts['Sri Dasam Granth Sahib'] += 1;
        break;
      case 'B':
        counts['Vaaran Bhai Gurdas Ji'] += 1;
        break;
      case 'M':
        counts['Mahan Kosh'] += 1;
        break;
      default:
        break;
    }
  });

  setSourceCounts(counts);
};

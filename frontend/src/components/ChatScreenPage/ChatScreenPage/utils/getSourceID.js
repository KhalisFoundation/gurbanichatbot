// utils/getSourceID.js
export const getSourceID = (source) => {
    switch (source) {
      case 'Sri Guru Granth Sahib Ji':
        return 'G';
      case 'Sri Dasam Granth Sahib':
        return 'D';
      case 'Vaaran Bhai Gurdas Ji':
        return 'B';
      case 'Mahan Kosh':
        return 'M';
      default:
        return 'G';
    }
  };
  
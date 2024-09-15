// Utility function to convert time to minutes from midnight
const timeToMinutes = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  };

  // Export the function
module.exports = { timeToMinutes };
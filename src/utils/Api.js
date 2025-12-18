
import axios from 'axios';

export async function getAddressFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
      },
    });
    return response.data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}

// Get prayer timings from address and date
export async function getPrayerTimings(address, date) {
  const url = `https://api.aladhan.com/v1/timingsByAddress/${date}`;
  try {
    const response = await axios.get(url, {
      params: {
        address: address,
        method: '1',
        shafaq: 'general',
        tune: '1,2,3,4,5',
        calendarMethod: 'UAQ',
      },
      headers: {
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prayer timings:', error);
    return null;
  }
}

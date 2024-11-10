// Function to get coordinates from city names using OpenStreetMap API
async function getCoordinates(location) {
  // If input is in "latitude,longitude" format, parse it directly
  if (location.includes(',')) {
    const [lat, lon] = location.split(',').map(Number);
    return { lat, lon };
  }

  // Fetch coordinates for city name
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } else {
    throw new Error("Location not found");
  }
}

// Haversine formula to calculate distance between two coordinates
function haversineDistance(coords1, coords2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
  const dLon = (coords2.lon - coords1.lon) * (Math.PI / 180);
  const lat1 = coords1.lat * (Math.PI / 180);
  const lat2 = coords2.lat * (Math.PI / 180);

  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Form handler for calculating shortest path
document.getElementById('pathForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const startInput = document.getElementById('start').value;
  const endInput = document.getElementById('end').value;

  try {
    // Get coordinates for start and end locations
    const startCoords = await getCoordinates(startInput);
    const endCoords = await getCoordinates(endInput);

    // Calculate the shortest path (straight-line distance)
    const distance = haversineDistance(startCoords, endCoords);
    document.getElementById('result').innerText = `Shortest path distance from ${startInput} to ${endInput}: ${distance.toFixed(2)} km`;
  } catch (error) {
    document.getElementById('result').innerText = error.message;
  }
});

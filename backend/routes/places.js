const express = require('express');
const router = express.Router();

// Use Node.js built-in modules for HTTP requests
const https = require('https');
const { URL } = require('url');

// Robust HTTP request function
function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    console.log('Making HTTPS request to:', url);
    
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'QuickSnack/1.0 (vyomverma2873@gmail.com)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        ...options.headers
      },
      timeout: 20000 // 20 second timeout
    };

    console.log('Request options:', requestOptions);

    const req = https.request(requestOptions, (res) => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Raw response data:', data.substring(0, 500) + '...');
        
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError.message);
          console.error('Raw data:', data);
          reject(new Error(`Invalid JSON response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Request timeout after 20 seconds'));
    });

    req.setTimeout(20000);
    req.end();
  });
}

// POST /api/places/reverse-geocode - Real geocoding with Nominatim
router.post('/reverse-geocode', async (req, res) => {
  console.log('\n=== REAL REVERSE GEOCODING REQUEST ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    const { lat, lng } = req.body;

    // Validate coordinates
    if (!lat || !lng) {
      console.log('❌ Missing coordinates');
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.log('❌ Invalid coordinates');
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    console.log('✅ Valid coordinates:', { latitude, longitude });

    // Build Nominatim URL
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`;
    
    console.log('🌍 Calling Nominatim API...');
    
    // Make request to Nominatim
    const response = await makeHttpsRequest(nominatimUrl);
    
    console.log('✅ Nominatim responded with status:', response.status);
    
    if (response.status !== 200) {
      console.log('❌ Nominatim returned non-200 status');
      return res.status(500).json({
        success: false,
        message: `Geocoding service returned status ${response.status}`
      });
    }

    const data = response.data;
    console.log('📍 Nominatim data received:', JSON.stringify(data, null, 2));

    // Check for errors
    if (data.error) {
      console.log('❌ Nominatim error:', data.error);
      return res.status(404).json({
        success: false,
        message: 'Location not found',
        error: data.error
      });
    }

    // Check if we have location data
    if (!data.display_name) {
      console.log('❌ No display_name in response');
      return res.status(404).json({
        success: false,
        message: 'No location details found'
      });
    }

    // Format the real location data
    const result = {
      formatted_address: data.display_name,
      place_id: (data.place_id || data.osm_id || Date.now()).toString(),
      geometry: {
        location: {
          lat: parseFloat(data.lat) || latitude,
          lng: parseFloat(data.lon) || longitude
        }
      }
    };

    console.log('✅ REAL location found:', result.formatted_address);
    console.log('📤 Sending response...');

    const responseData = {
      success: true,
      results: [result]
    };

    res.json(responseData);
    console.log('=== REQUEST COMPLETED SUCCESSFULLY ===\n');

  } catch (error) {
    console.error('\n❌ GEOCODING ERROR:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    let errorMessage = 'Failed to get real location';
    let errorCode = 'GEOCODING_ERROR';

    if (error.message.includes('timeout')) {
      errorMessage = 'Location service timeout - please try again';
      errorCode = 'TIMEOUT';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to location service';
      errorCode = 'CONNECTION_ERROR';
    } else if (error.message.includes('Invalid JSON')) {
      errorMessage = 'Invalid response from location service';
      errorCode = 'INVALID_RESPONSE';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error_code: errorCode,
      timestamp: new Date().toISOString()
    });

    console.log('=== REQUEST FAILED ===\n');
  }
});

// GET /api/places/autocomplete - Real autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('🔍 Autocomplete query:', q);

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        predictions: []
      });
    }

    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(q)}`;
    
    const response = await makeHttpsRequest(searchUrl);
    
    if (response.status !== 200) {
      throw new Error(`Search API returned status ${response.status}`);
    }

    const predictions = response.data.map(item => ({
      place_id: (item.place_id || item.osm_id || Date.now()).toString(),
      description: item.display_name || 'Unknown location',
      structured_formatting: {
        main_text: item.name || item.display_name?.split(',')[0] || 'Unknown',
        secondary_text: item.display_name?.split(',').slice(1).join(',').trim() || ''
      }
    }));

    res.json({
      success: true,
      predictions,
      apiUsed: 'nominatim'
    });

  } catch (error) {
    console.error('Autocomplete error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location suggestions'
    });
  }
});

// GET /api/places/health - Health check with real API test
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Health check - testing real API...');
    
    // Test Nominatim with a simple query
    const testUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=Delhi,India';
    const testResponse = await makeHttpsRequest(testUrl);
    
    const isHealthy = testResponse.status === 200 && testResponse.data.length > 0;
    
    res.json({
      success: true,
      message: 'Places API is healthy',
      nominatim_working: isHealthy,
      node_version: process.version,
      timestamp: new Date().toISOString(),
      test_location: testResponse.data[0]?.display_name || 'No test data'
    });
    
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      node_version: process.version,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/places/test - Test with real coordinates
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing with real coordinates...');
    
    // Test with New Delhi coordinates
    const testLat = 28.6139;
    const testLng = 77.2090;
    
    const testUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${testLat}&lon=${testLng}&addressdetails=1`;
    const response = await makeHttpsRequest(testUrl);
    
    res.json({
      success: true,
      test_coordinates: { lat: testLat, lng: testLng },
      response_status: response.status,
      real_location: response.data.display_name || 'No location found',
      full_data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

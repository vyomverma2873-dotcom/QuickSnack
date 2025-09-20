# Geocoding Fix for QuickSnack

## Problem
The reverse geocoding feature was failing with a 500 error because the backend was using the native `fetch` API, which is not available in Node.js versions prior to 18. Render was likely using Node.js 16 or 17, causing the geocoding requests to fail.

## Solution
1. **Added axios dependency**: Replaced native `fetch` with `axios` HTTP client that works across all Node.js versions
2. **Updated Node.js version requirement**: Changed from `>=16.0.0` to `>=18.0.0` for better compatibility
3. **Updated Render configuration**: Added NODE_VERSION environment variable to ensure Render uses Node.js 18

## Changes Made

### 1. Backend Package Dependencies
- Added `axios: ^1.5.0` to package.json dependencies
- Updated Node.js engine requirement to `>=18.0.0`

### 2. Places API Routes (`backend/routes/places.js`)
- Replaced all `fetch()` calls with `axios.get()`
- Added proper timeout configuration (10 seconds)
- Updated error handling to work with axios response structure
- Maintained all existing functionality and response formats

### 3. Render Configuration (`render.yaml`)
- Added `NODE_VERSION: 18` environment variable to backend service
- Added `runtime: node` specification

## Files Modified
- `backend/package.json` - Added axios dependency and updated Node.js version
- `backend/routes/places.js` - Replaced fetch with axios
- `render.yaml` - Added Node.js version specification

## Deployment Instructions
1. Commit and push these changes to your repository
2. Render will automatically detect the changes and redeploy
3. The new deployment will use Node.js 18 and axios for HTTP requests
4. Test the location detection feature in your app

## Testing
After deployment, test the following features:
1. Auto-detect location button in the location picker
2. Manual location search
3. Reverse geocoding when selecting coordinates

The error "Request failed with status code 500" should be resolved, and location services should work properly.

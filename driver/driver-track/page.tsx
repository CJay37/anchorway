'use client';

import { useEffect, useState } from 'react';

const TRIP_REFERENCE = 'BW-3608';
const DRIVER_NAME = 'Test Driver';

const UPDATE_LOCATION_URL =
`https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/update-driver-location?trip_reference=${TRIP_REFERENCE}`;

export default function DriverTrackPage() {
const [status, setStatus] = useState('Starting GPS...');
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
const [lastUpdated, setLastUpdated] = useState('');

useEffect(() => {
if (!navigator.geolocation) {
setStatus('GPS is not supported on this device.');
return;
}

const watchId = navigator.geolocation.watchPosition(
async (position) => {
const lat = position.coords.latitude;
const lng = position.coords.longitude;

setLatitude(lat);
setLongitude(lng);
setStatus('Sending live location...');

try {
const response = await fetch(UPDATE_LOCATION_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
driver_name: DRIVER_NAME,
latitude: lat,
longitude: lng,
}),
});

const data = await response.json();

if (response.ok && data.success) {
setStatus('Live GPS connected');
setLastUpdated(new Date().toLocaleTimeString());
} else {
setStatus('Could not update location');
}
} catch (error) {
console.error(error);
setStatus('Connection error');
}
},
(error) => {
console.error(error);

if (error.code === 1) {
setStatus('Location permission denied');
} else {
setStatus('Waiting for GPS signal...');
}
},
{
enableHighAccuracy: true,
maximumAge: 5000,
timeout: 10000,
}
);

return () => navigator.geolocation.clearWatch(watchId);
}, []);

return (
<main
style={{
minHeight: '100vh',
background: '#f7faf9',
padding: '24px',
fontFamily: 'Arial, sans-serif',
}}
>
<div
style={{
maxWidth: '520px',
margin: '40px auto',
background: 'white',
borderRadius: '24px',
padding: '32px',
boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
}}
>
<h1 style={{ marginBottom: '8px' }}>🚑 AnchorWay Driver</h1>

<p style={{ color: '#667085', marginBottom: '28px' }}>
Live transport location sharing
</p>

<div
style={{
background: '#eaf8f1',
borderRadius: '16px',
padding: '20px',
marginBottom: '20px',
}}
>
<strong>GPS Status</strong>

<h2 style={{ margin: '10px 0 0' }}>{status}</h2>
</div>

<p>
<strong>Trip:</strong> {TRIP_REFERENCE}
</p>

<p>
<strong>Driver:</strong> {DRIVER_NAME}
</p>

<p>
<strong>Latitude:</strong>{' '}
{latitude !== null ? latitude : 'Waiting...'}
</p>

<p>
<strong>Longitude:</strong>{' '}
{longitude !== null ? longitude : 'Waiting...'}
</p>

<p>
<strong>Last sent:</strong>{' '}
{lastUpdated || 'Waiting for first GPS update...'}
</p>

<div
style={{
marginTop: '28px',
padding: '16px',
borderRadius: '14px',
background: '#fff8e7',
}}
>
Keep this page open while the transport is active.
</div>
</div>
</main>
);
}

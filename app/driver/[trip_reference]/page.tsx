'use client';

import { useState } from 'react';
import Link from 'next/link';

const LOCATION_URL =
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/update-driver-location';

export default function DriverPage({
params,
}: {
params: { trip_reference: string };
}) {
const tripReference = params.trip_reference;

const [gpsStatus, setGpsStatus] = useState('GPS not started');
const [latitude, setLatitude] = useState('');
const [longitude, setLongitude] = useState('');
const [lastSent, setLastSent] = useState('');

async function sendLocation(lat: number, lng: number) {
headers: {
'Content-Type': 'application/json',
'apikey': 'sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3',
'Authorization': 'Bearer sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3',
},
body: JSON.stringify({
trip_reference: tripReference,
driver_name: 'Driver',
latitude: lat,
longitude: lng,
eta: 'Updating',
}),
});

const json = await res.json();

if (!json.success) {
throw new Error(json.message || 'Location upload failed');
}

setLastSent(new Date().toLocaleTimeString());
}

function startGPS() {
if (!navigator.geolocation) {
setGpsStatus('GPS is not supported on this device');
return;
}

setGpsStatus('Requesting GPS permission...');

navigator.geolocation.watchPosition(
async (position) => {
const lat = position.coords.latitude;
const lng = position.coords.longitude;

setLatitude(String(lat));
setLongitude(String(lng));
setGpsStatus('GPS connected - uploading live location');

try {
await sendLocation(lat, lng);
setGpsStatus('GPS connected - live location sent');
} catch (err: any) {
setGpsStatus(err.message || 'GPS connected but upload failed');
}
},
() => {
setGpsStatus('GPS permission denied or unavailable');
},
{
enableHighAccuracy: true,
maximumAge: 0,
timeout: 10000,
}
);
}

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">Driver GPS Link</span>
<h1>Driver live location</h1>
<p>Trip Reference: {tripReference}</p>
</div>
</section>

<section className="detailPanel">
<h2>🚑 AnchorWay Driver</h2>

<p><strong>Status:</strong> {gpsStatus}</p>
<p><strong>Latitude:</strong> {latitude || 'Waiting...'}</p>
<p><strong>Longitude:</strong> {longitude || 'Waiting...'}</p>
<p><strong>Last Sent:</strong> {lastSent || 'Not sent yet'}</p>

<div className="statusGrid">
<button onClick={startGPS}>▶ Start GPS</button>
<button>👤 Patient Onboard</button>
<button>🏁 Complete Trip</button>
</div>
</section>
</main>
);
}

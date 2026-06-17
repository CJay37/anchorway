'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const LOCATION_URL =
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-driver-location?trip_reference=BW-3608';

export default function DispatcherDashboard() {
const [location, setLocation] = useState<any>(null);
const [status, setStatus] = useState('Loading live GPS...');

async function loadLocation() {
try {
const res = await fetch(LOCATION_URL);
const json = await res.json();

if (!json.success || !json.location) {
setStatus('No live driver location found yet');
return;
}

setLocation(json.location);
setStatus('Live GPS connected');
} catch {
setStatus('Could not load live GPS');
}
}

useEffect(() => {
loadLocation();
const timer = setInterval(loadLocation, 2000);
return () => clearInterval(timer);
}, []);

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>

<Link href="/track/BW-3608" className="navLink">
View Public Tracker
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">Live Dispatcher Map</span>
<h1>Dispatcher live transport view</h1>
<p>Monitor active transport location in real time.</p>
</div>

<div className="summaryCard">
<span>Status</span>
<strong>{status}</strong>
</div>
</section>

<section className="detailPanel">
<h2>🚑 BW-3608</h2>
<p><strong>Driver:</strong> {location?.driver_name || 'Waiting...'}</p>
<p><strong>Latitude:</strong> {location?.latitude || 'Waiting...'}</p>
<p><strong>Longitude:</strong> {location?.longitude || 'Waiting...'}</p>
<p><strong>ETA:</strong> {location?.eta || 'Updating'}</p>
<p><strong>Last Updated:</strong> {location?.updated_at || 'Waiting...'}</p>

{location?.latitude && location?.longitude && (
<iframe
width="100%"
height="360"
style={{ border: 0, borderRadius: '24px', marginTop: '20px' }}
loading="lazy"
src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
/>
)}
</section>
</main>
);
}

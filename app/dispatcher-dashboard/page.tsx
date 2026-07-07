'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TRACKING_REF = 'BW-3608';

const LOCATION_URL =
`https://xjqxtgejkrarlteximpy.supabase.co/rest/v1/get-driver-location?trip_reference=${TRACKING_REF}`;

const READINESS_URL =
`https://xjqxtgejkrarlteximpy.supabase.co/rest/v1/update-readiness-score?trip_reference=${TRACKING_REF}`;



export default function DispatcherDashboard() {
const [location, setLocation] = useState<any>(null);
const [gpsStatus, setGpsStatus] = useState('Loading live GPS...');
const [readiness, setReadiness] = useState<any>(null);
const [readinessStatus, setReadinessStatus] =
useState('Loading readiness...');

async function loadLocation() {
try {
const res = await fetch(LOCATION_URL);
const json = await res.json();

if (!json.success || !json.location) {
setGpsStatus('No live driver location found yet');
return;
}

setLocation(json.location);
setGpsStatus('Live GPS connected');
} catch {
setGpsStatus('Could not load live GPS');
}
}

async function loadReadiness() {
try {
const res = await fetch(READINESS_URL);
const json = await res.json();

if (!json.success) {
setReadinessStatus(
json.error || 'Could not load readiness'
);
return;
}

setReadiness(json);
setReadinessStatus('Readiness connected');
} catch {
setReadinessStatus('Could not load readiness');
}
}

useEffect(() => {
loadLocation();
loadReadiness();

const timer = setInterval(() => {
loadLocation();
loadReadiness();
}, 20000);

return () => clearInterval(timer);
}, []);

const readinessScore = readiness?.readiness_score;
const readinessLabel = readiness?.readiness_label;
const readinessIssues = readiness?.readiness_issues || [];

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>

<Link
href={`/track/${TRACKING_REF}`}
className="navLink"
>
View Public Tracker
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">
Live Dispatcher Map
</span>

<h1>Dispatcher live transport view</h1>

<p>
Monitor active transport location, readiness,
and delays in real time.
</p>
</div>

<div className="summaryCard">
<span>GPS Status</span>
<strong>{gpsStatus}</strong>
</div>
</section>

<section className="detailPanel">
<h2>🚑 {TRACKING_REF}</h2>

<p>
<strong>Driver:</strong>{' '}
{location?.driver_name || 'Waiting...'}
</p>

<p>
<strong>Latitude:</strong>{' '}
{location?.latitude || 'Waiting...'}
</p>

<p>
<strong>Longitude:</strong>{' '}
{location?.longitude || 'Waiting...'}
</p>

<p>
<strong>ETA:</strong>{' '}
{location?.eta || 'Updating'}
</p>

<p>
<strong>Last Updated:</strong>{' '}
{location?.updated_at || 'Waiting...'}
</p>

{location?.latitude && location?.longitude && (
<iframe
width="100%"
height="360"
style={{
border: 0,
borderRadius: '24px',
marginTop: '20px',
}}
loading="lazy"
src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
/>
)}
</section>

<section className="detailPanel">
<h2>Patient Readiness</h2>

<p>
<strong>Connection:</strong>{' '}
{readinessStatus}
</p>

{readiness ? (
<>
<div
style={{
fontSize: '42px',
fontWeight: 'bold',
}}
>
{readinessScore}%
</div>

<p>
<strong>Status:</strong>{' '}
{readinessLabel}
</p>

<div
style={{
height: '12px',
background: '#e5e7eb',
borderRadius: '999px',
overflow: 'hidden',
marginTop: '12px',
}}
>
<div
style={{
width: `${readinessScore}%`,
height: '100%',
background:
readinessScore >= 80
? '#22c55e'
: readinessScore >= 50
? '#f59e0b'
: '#ef4444',
}}
/>
</div>

<div style={{ marginTop: '18px' }}>
<strong>Remaining blockers:</strong>

{readinessIssues.length === 0 ? (
<p>
✅ No readiness blockers. Patient is ready.
</p>
) : (
<ul>
{readinessIssues.map((issue: string) => (
<li key={issue}>{issue}</li>
))}
</ul>
)}
</div>
</>
) : (
<p>Waiting for readiness data...</p>
)}
</section>
</main>
);
}

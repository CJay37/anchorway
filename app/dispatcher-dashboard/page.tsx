'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TRACKING_REF = 'BW-3608';

const LOCATION_URL =
`https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-driver-location?trip_reference=${TRACKING_REF}`;

const READINESS_URL =
`https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/update-readiness-score?trip_reference=${TRACKING_REF}`;



export default function DispatcherDashboard() {
const [location, setLocation] = useState<any>(null);
const [mapLocation, setMapLocation] = useState<any>(null);
const [gpsStatus, setGpsStatus] = useState('Loading live GPS...');
const [readiness, setReadiness] = useState<any>(null);
const [readinessStatus, setReadinessStatus] =
useState('Loading readiness...');
function getConnectionHealth(updatedAt?: string) {
if (!updatedAt) {
return {
label: 'Waiting',
message: 'Waiting for first GPS update'
};
}

const seconds =
(Date.now() - new Date(updatedAt).getTime()) / 1000;

if (seconds < 45)
return {
label: '🟢 Live',
message: `Updated ${Math.floor(seconds)} sec ago`
};

if (seconds < 90)
return {
label: '🟡 Weak Signal',
message: `Last update ${Math.floor(seconds)} sec ago`
};

if (seconds < 180)
return {
label: '🟠 Paused',
message: 'GPS temporarily stopped'
};

return {
label: '🔴 Offline',
message: 'Driver device disconnected'
};
}

const connectionHealth =
getConnectionHealth(location?.updated_at);
const connectionTheme =
connectionHealth.label.includes('Live')
? {
background: '#ecfdf3',
border: '#22c55e',
color: '#166534',
icon: '●',
}
: connectionHealth.label.includes('Weak')
? {
background: '#fffbeb',
border: '#f59e0b',
color: '#92400e',
icon: '●',
}
: connectionHealth.label.includes('Paused')
? {
background: '#fff7ed',
border: '#f97316',
color: '#9a3412',
icon: '●',
}
: connectionHealth.label.includes('Offline')
? {
background: '#fef2f2',
border: '#ef4444',
color: '#991b1b',
icon: '●',
}
: {
background: '#f8fafc',
border: '#94a3b8',
color: '#475569',
icon: '●',
};
async function loadLocation() {
try {
const res = await fetch(LOCATION_URL);
const json = await res.json();

if (!json.success || !json.location) {
setGpsStatus('No live driver location found yet');
return;
}

setLocation(json.location);
setMapLocation((current: any) => {
if (!current) return json.location;

const latDifference = Math.abs(
Number(json.location.latitude) - Number(current.latitude)
);

const lngDifference = Math.abs(
Number(json.location.longitude) - Number(current.longitude)
);

const hasMovedEnough =
latDifference > 0.00015 || lngDifference > 0.00015;

return hasMovedEnough ? json.location : current;
});
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

const locationTimer = setInterval(() => {
loadLocation();
}, 5000);

const readinessTimer = setInterval(() => {
loadReadiness();
}, 20000);

const mapTimer = setInterval(async () => {
try {
const res = await fetch(LOCATION_URL);
const json = await res.json();

if (json.success && json.location) {
setMapLocation(json.location);
}
} catch {
console.error('Could not refresh map location');
}
}, 20000);

return () => {
clearInterval(locationTimer);
clearInterval(readinessTimer);
clearInterval(mapTimer);
};
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

<div
className="summaryCard"
style={{
background: connectionTheme.background,
border: `1px solid ${connectionTheme.border}`,
borderLeft: `6px solid ${connectionTheme.border}`,
color: connectionTheme.color,
padding: '22px',
borderRadius: '18px',
minHeight: '150px',
}}
>
<span
style={{
display: 'block',
fontSize: '13px',
fontWeight: 700,
letterSpacing: '0.08em',
textTransform: 'uppercase',
opacity: 0.75,
marginBottom: '12px',
}}
>
Driver GPS Connection
</span>

<div
style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
marginBottom: '10px',
}}
>
<span
style={{
color: connectionTheme.border,
fontSize: '24px',
lineHeight: 1,
}}
>
{connectionTheme.icon}
</span>

<strong
style={{
fontSize: '22px',
lineHeight: 1.2,
}}
>
{connectionHealth.label.replace(/^[^A-Za-z]+/, '')}
</strong>
</div>

<div
style={{
marginTop: '12px',
fontSize: '13px',
lineHeight: '1.5',
}}
>
<strong>Last Update</strong>

<div>
{location?.updated_at
? new Date(location.updated_at).toLocaleTimeString()
: 'Waiting...'}
</div>
</div>

<div
style={{
paddingTop: '12px',
borderTop: `1px solid ${connectionTheme.border}40`,
fontSize: '13px',
fontWeight: 600,
}}
>
Trip {TRACKING_REF}
</div>
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
{location?.updated_at
? new Date(location.updated_at).toLocaleString()
: 'Waiting...'}
</p>

{mapLocation?.latitude && mapLocation?.longitude && (
<iframe
width="100%"
height="360"
style={{
border: 0,
borderRadius: '24px',
marginTop: '20px',
}}
loading="lazy"
src={`https://maps.google.com/maps?q=${mapLocation.latitude},${mapLocation.longitude}&z=15&output=embed`}
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

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
const currentTransportStep = 'driver_en_route';
const currentTripStatus = 'Driver en route to pickup';
const displayedEta = location?.eta || 'Updating';
const displayedReadiness =
typeof readinessScore === 'number'
? `${readinessScore}%`
: 'Checking';
const transportSteps = [
{
id: 'request_received',
label: 'Request received',
description: 'The transport request was successfully created.',
},
{
id: 'driver_assigned',
label: 'Driver assigned',
description: 'A driver has been assigned to this trip.',
},
{
id: 'driver_en_route',
label: 'Driver en route to pickup',
description: 'The driver is traveling to the pickup location.',
},
{
id: 'arrived_pickup',
label: 'Arrived at pickup',
description: 'The driver has reached the pickup location.',
},
{
id: 'patient_onboard',
label: 'Patient onboard',
description: 'The patient is safely inside the vehicle.',
},
{
id: 'en_route_destination',
label: 'En route to destination',
description: 'The transport is traveling to the destination.',
},
{
id: 'arrived_destination',
label: 'Arrived at destination',
description: 'The vehicle has reached the destination.',
},
{
id: 'trip_complete',
label: 'Transport complete',
description: 'The patient transfer has been completed.',
},
];

const currentTransportIndex = transportSteps.findIndex(
(step) => step.id === currentTransportStep
);
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
<div
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
gap: '20px',
marginBottom: '28px',
flexWrap: 'wrap',
}}
>
<div>
<div
style={{
display: 'flex',
gap: '12px',
flexWrap: 'wrap',
marginTop: '18px',
}}
>
  
<div
style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
gap: '14px',
marginBottom: '28px',
}}
>
{/* Current transport status */}
<div
style={{
padding: '18px',
borderRadius: '18px',
border: '1px solid #dbe7e2',
background: '#ffffff',
boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
}}
>
<span
style={{
display: 'block',
fontSize: '12px',
fontWeight: 700,
letterSpacing: '0.08em',
textTransform: 'uppercase',
color: '#64748b',
marginBottom: '10px',
}}
>
Current Status
</span>

<div
style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
}}
>
<span style={{ fontSize: '22px' }}>🚑</span>

<strong
style={{
fontSize: '18px',
lineHeight: 1.3,
color: '#163f38',
}}
>
{currentTripStatus}
</strong>
</div>
</div>

{/* Estimated arrival */}
<div
style={{
padding: '18px',
borderRadius: '18px',
border: '1px solid #dbe7e2',
background: '#ffffff',
boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
}}
>
<span
style={{
display: 'block',
fontSize: '12px',
fontWeight: 700,
letterSpacing: '0.08em',
textTransform: 'uppercase',
color: '#64748b',
marginBottom: '10px',
}}
>
Estimated Arrival
</span>

<div
style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
}}
>
<span style={{ fontSize: '22px' }}>⏱️</span>

<strong
style={{
fontSize: '18px',
lineHeight: 1.3,
color: '#163f38',
}}
>
{displayedEta}
</strong>
</div>
</div>

{/* Patient readiness */}
<div
style={{
padding: '18px',
borderRadius: '18px',
border: '1px solid #dbe7e2',
background: '#ffffff',
boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
}}
>
<span
style={{
display: 'block',
fontSize: '12px',
fontWeight: 700,
letterSpacing: '0.08em',
textTransform: 'uppercase',
color: '#64748b',
marginBottom: '10px',
}}
>
Patient Readiness
</span>

<div
style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
}}
>
<span style={{ fontSize: '22px' }}>✅</span>

<strong
style={{
fontSize: '18px',
lineHeight: 1.3,
color: '#163f38',
}}
>
{displayedReadiness}
</strong>
</div>
</div>
</div>
</div>

<div
style={{
padding: '10px 14px',
borderRadius: '999px',
background: '#ecfdf3',
border: '1px solid #22c55e',
color: '#166534',
fontWeight: 700,
whiteSpace: 'nowrap',
}}
>
Live trip
</div>
</div>

<div style={{ display: 'grid', gap: '0' }}>
{transportSteps.map((step, index) => {
const isComplete = index < currentTransportIndex;
const isCurrent = index === currentTransportIndex;
const isUpcoming = index > currentTransportIndex;

return (
<div
key={step.id}
style={{
display: 'grid',
gridTemplateColumns: '42px 1fr',
gap: '14px',
minHeight: '92px',
}}
>
<div
style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
}}
>
<div
style={{
width: '34px',
height: '34px',
borderRadius: '50%',
display: 'grid',
placeItems: 'center',
flexShrink: 0,
fontWeight: 800,
background: isComplete
? '#22c55e'
: isCurrent
? '#dcfce7'
: '#f3f4f6',
border: isCurrent
? '3px solid #22c55e'
: isUpcoming
? '1px solid #d1d5db'
: 'none',
color: isComplete
? '#ffffff'
: isCurrent
? '#166534'
: '#6b7280',
}}
>
{isComplete ? '✓' : isCurrent ? '●' : index + 1}
</div>

{index < transportSteps.length - 1 && (
<div
style={{
width: '3px',
flex: 1,
minHeight: '46px',
background:
index < currentTransportIndex
? '#22c55e'
: '#e5e7eb',
}}
/>
)}
</div>

<div
style={{
paddingBottom: '24px',
opacity: isUpcoming ? 0.55 : 1,
}}
>
<div
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
gap: '12px',
flexWrap: 'wrap',
}}
>
<strong style={{ fontSize: '18px' }}>{step.label}</strong>

{isCurrent && (
<span
style={{
padding: '5px 10px',
borderRadius: '999px',
background: '#dcfce7',
color: '#166534',
fontSize: '12px',
fontWeight: 800,
}}
>
CURRENT
</span>
)}

{isComplete && (
<span
style={{
color: '#15803d',
fontSize: '13px',
fontWeight: 700,
}}
>
Complete
</span>
)}
</div>

<p
style={{
marginTop: '7px',
marginBottom: 0,
lineHeight: 1.5,
}}
>
{step.description}
</p>
</div>
</div>
);
})}
</div>
</div>
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

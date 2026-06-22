'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL =
'https://xjqxtgejkralrteximpy.supabase.co/functions/v1/get-public-tracking';

const SUPABASE_KEY = 'sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3';

const stages = [
'Requested',
'Confirmed',
'Driver Assigned',
'Driver En Route',
'Arrived at Pickup',
'Patient Onboard',
'Transport In Progress',
'Arrived at Destination',
'Completed',
];

type Tracking = {
trip_reference: string;
current_status: string;
current_step: string;
eta: string;
last_updated: string;
};

export default function TrackPage() {
const [data, setData] = useState<Tracking | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const ref =
typeof window !== 'undefined'
? decodeURIComponent(window.location.pathname.split('/').pop() || '')
: '';

useEffect(() => {
async function load() {
if (!ref) return;

try {
const res = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: SUPABASE_KEY,
Authorization: SUPABASE_KEY,
},
body: JSON.stringify({ trip_reference: ref }),
});

const text = await res.text();
const json = JSON.parse(text);

if (!json.success) {
throw new Error(json.message || 'Tracking not found');
}

setData(json.tracking);
} catch (err: any) {
setError(err.message || 'Unable to load tracking');
} finally {
setLoading(false);
}
}

load();
const timer = setInterval(load, 30000);

return () => clearInterval(timer);
}, [ref]);

const current = data?.current_status || data?.current_step || '';
const normalize = (value: string) =>
value.toLowerCase().replace(/[^a-z]/g, '').trim();

const currentIndex = Math.max(
0,
stages.findIndex((stage) => normalize(stage) === normalize(current))
);

const percent = Math.round(((currentIndex + 1) / stages.length) * 100);

const explanation =
data?.current_status === 'Driver En Route'
? 'Your transport team has been assigned and is currently traveling to the pickup location.'
: data?.current_status === 'Arrived at Pickup'
? 'The crew has arrived and is preparing for patient transfer.'
: data?.current_status === 'Patient Onboard'
? 'The patient has been safely loaded and transport is underway.'
: data?.current_status === 'Transport In Progress'
? 'The patient is currently being transported to the destination facility.'
: data?.current_status === 'Arrived at Destination'
? 'The patient has arrived at the destination facility.'
: data?.current_status === 'Completed'
? 'Transport completed successfully.'
: 'The transport request is active and being updated.';

return (
<main className="trackPage">
<div className="trackWrap">
<div className="trackHeader">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>

<Link href="/contact" className="btn secondary">
Need Help?
</Link>
</div>

<section className="statusBox">
<span className="statusPill">Live Transport Tracker</span>
<p>Trip Reference</p>
<h1>{ref}</h1>

{loading && <p>Loading live status...</p>}
{error && <p>{error}</p>}

{data && (
<>
<div className="bigStatus">🚑 {data.current_status}</div>
<p className="lead">{data.current_step}</p>

<div className="metricGrid">
<div className="metric">
<span>ETA</span>
<strong>{data.eta || 'Updating'}</strong>
</div>

<div className="metric">
<span>Last Updated</span>
<strong>
{data.last_updated
? new Date(data.last_updated).toLocaleTimeString([], {
hour: 'numeric',
minute: '2-digit',
})
: 'Just now'}
</strong>
</div>
</div>

<div className="statusExplanation">
<h3>What’s Happening Now</h3>
<p>{explanation}</p>
</div>

<div className="progressWrap">
<div className="progressTop">
<span>Transport Progress</span>
<strong>{percent}% complete</strong>
</div>

<div className="progressTrack">
<div
className="progressFill"
style={{ width: `${percent}%` }}
/>

<div
className="ambulanceMarker"
style={{ left: `${percent}%` }}
>
🚑
</div>
</div>
</div>

<div className="timeline">
{stages.map((stage, idx) => (
<div
key={stage}
className={`step ${
idx < currentIndex
? 'done'
: idx === currentIndex
? 'active'
: ''
}`}
>
{idx < currentIndex
? '✓'
: idx === currentIndex
? '•'
: '○'}{' '}
{stage}
</div>
))}
</div>
</>
)}
</section>
</div>
</main>
);
}

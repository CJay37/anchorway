'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL =
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-public-tracking';

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
try {
const res = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`,
},
body: JSON.stringify({ trip_reference: ref }),
});

const json = await res.json();

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

if (ref) {
load();
const timer = setInterval(load, 30000);
return () => clearInterval(timer);
}
}, [ref]);

const current = data?.current_status || data?.current_step || '';

const normalize = (value: string) =>
value.toLowerCase().replace(/[^a-z]/g, '').trim();

const currentIndex = Math.max(
0,
stages.findIndex((stage) => normalize(stage) === normalize(current))
);


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
{idx < currentIndex ? '✓' : idx === currentIndex ? '●' : '○'}{' '}
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

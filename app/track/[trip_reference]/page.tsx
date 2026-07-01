'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL =
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-public-tracking';

const SUPABASE_KEY =
'sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3';

const stages = [
'Requested',
'Confirmed',
'Driver Assigned',
'Driver En Route',
'Arrived at Pickup',
'Patient Loaded',
'Transport In Progress',
'Arrived at Destination',
'Completed',
];

type Tracking = {
trip_reference: string;
current_status: string;
eta?: string;
last_updated?: string;
pickup_address?: string;
destination_address?: string;
mobility?: string;
transport_level?: string;
driver_name?: string;
transport_company?: string;
vehicle_unit?: string;
};

export default function TrackPage() {
const [data, setData] = useState<Tracking | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const params = useParams();
const ref = decodeURIComponent(String(params.trip_reference || ''));

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

setError('');
setData(json.tracking);
} catch (err: any) {
setError(err.message || 'Unable to load tracking');
} finally {
setLoading(false);
}
}

load();
const timer = setInterval(load, 5000);

return () => clearInterval(timer);
}, [ref]);

const current = data?.current_status || 'Requested';

const normalize = (value: string) =>
value.toLowerCase().replace(/[^a-z]/g, '').trim();

const currentIndex = Math.max(
0,
stages.findIndex((stage) => normalize(stage) === normalize(current))
);

const percent = Math.round(((currentIndex + 1) / stages.length) * 100);

const explanation =
current === 'Driver En Route'
? 'Your transport team has been assigned and is currently traveling to the pickup location.'
: current === 'Arrived at Pickup'
? 'The crew has arrived and is preparing for patient transfer.'
: current === 'Patient Loaded'
? 'The patient has been safely loaded and transport is underway.'
: current === 'Transport In Progress'
? 'The patient is currently being transported to the destination facility.'
: current === 'Arrived at Destination'
? 'The patient has arrived at the destination facility.'
: current === 'Completed'
? 'Transport completed successfully.'
: 'The transport request is active and being updated.';

return (
<main className="trackPage">
<section className="statusBox">
<Link href="/" className="brand">
AnchorWay
</Link>

<p>Trip Reference</p>
<h1>{ref}</h1>

{loading && <p>Loading live status...</p>}
{error && <p>{error}</p>}

{data && (
<>
<div className="bigStatus">🚑 {data.current_status}</div>
<p className="lead">{explanation}</p>

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

<div className="metric">
<span>Driver</span>
<strong>{data.driver_name || 'Assigned Soon'}</strong>
</div>

<div className="metric">
<span>Company</span>
<strong>{data.transport_company || 'Not listed yet'}</strong>
</div>

<div className="metric">
<span>Vehicle</span>
<strong>{data.vehicle_unit || 'Not listed yet'}</strong>
</div>
</div>

<div className="detailsCard">
<h3>Transport Details</h3>

<p>
<strong>Pickup:</strong>{' '}
{data.pickup_address || 'Not listed'}
</p>

<p>
<strong>Destination:</strong>{' '}
{data.destination_address || 'Not listed'}
</p>

<p>
<strong>Mobility:</strong> {data.mobility || 'Not listed'}
</p>

<p>
<strong>Level:</strong>{' '}
{data.transport_level || 'Not listed'}
</p>
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
<span>
{idx < currentIndex
? '✓'
: idx === currentIndex
? '•'
: '○'}
</span>
{stage}
</div>
))}
</div>
</>
)}
</section>
</main>
);
}

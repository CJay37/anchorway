'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL =
process.env.NEXT_PUBLIC_TRACKING_API_URL ||
'PASTE_SUPABASE_GET_PUBLIC_TRACKING_URL_HERE';

const SUPABASE_ANON_KEY =
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const statuses = [
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

export default function DispatcherDashboard() {
const [tripRef, setTripRef] = useState('BW-3608');
const [eta, setEta] = useState('12 minutes');
const [message, setMessage] = useState('');

const restUrl = API_URL.replace('/functions/v1/get-public-tracking', '/rest/v1');

async function updateStatus(status: string) {
setMessage('Updating...');

const res = await fetch(
`${restUrl}/transport_status?trip_reference=eq.${tripRef}`,
{
method: 'PATCH',
headers: {
apikey: SUPABASE_ANON_KEY,
Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
'Content-Type': 'application/json',
Prefer: 'return=representation',
},
body: JSON.stringify({
current_status: status,
current_step: status,
eta,
updated_at: new Date().toISOString(),
last_status_update_timestamp: new Date().toISOString(),
visible_to_patient: true,
}),
}
);

if (!res.ok) {
const text = await res.text();
setMessage(`Update failed: ${text}`);
return;
}

setMessage(`Updated ${tripRef} to ${status}`);
}

return (
<main className="dashboard">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
<span>AnchorWay</span>
</Link>
<Link href={`/track/${tripRef}`} className="btn secondary">
View Public Tracker
</Link>
</nav>

<section className="dashboardWrap">
<div className="panel">
<p className="statusPill">Dispatcher Control</p>
<h1>Update transport status</h1>
<p className="lead">
Change the trip status here. The public tracking page will reflect
the update after refresh or auto-check.
</p>

<label>Trip Reference</label>
<input
value={tripRef}
onChange={(e) => setTripRef(e.target.value)}
placeholder="BW-3608"
/>

<label>ETA</label>
<input
value={eta}
onChange={(e) => setEta(e.target.value)}
placeholder="12 minutes"
/>

<div className="buttonGrid">
{statuses.map((status) => (
<button key={status} onClick={() => updateStatus(status)}>
{status}
</button>
))}
</div>

{message && <p className="message">{message}</p>}
</div>
</section>
</main>
);
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const UPDATE_URL =
process.env.NEXT_PUBLIC_UPDATE_TRANSPORT_STATUS_URL ||
'https://xjqxtgejkrarIteximpy.supabase.co/functions/v1/update-transport-status';

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
const [tripReference, setTripReference] = useState('BW-3608');
const [eta, setEta] = useState('12 minutes');
const [selectedStatus, setSelectedStatus] = useState('Driver En Route');
const [message, setMessage] = useState('');

async function updateStatus(status: string) {
setSelectedStatus(status);
setMessage('Updating...');

try {
const res = await fetch(UPDATE_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: ANON_KEY,
Authorization: `Bearer ${ANON_KEY}`,
},
body: JSON.stringify({
trip_reference: tripReference,
current_status: status,
current_step: status,
eta,
visible_to_patient: true,
}),
});

const json = await res.json();

if (!json.success) {
throw new Error(json.message || 'Update failed');
}

setMessage(`Updated to ${status}`);
} catch (err: any) {
setMessage(err.message || 'Something went wrong');
}
}

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>

<Link href={`/track/${tripReference}`} className="topLink">
View Public Tracker
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">Dispatcher Control</span>
<h1>Update transport status</h1>
<p>
Change trip progress here. The public tracking page will update for
facilities, patients, and families.
</p>
</div>

<div className="summaryCard">
<span>Current Status</span>
<strong>{selectedStatus}</strong>
<p>ETA: {eta}</p>
</div>
</section>

<section className="controlPanel">
<div className="fieldGrid">
<label>
Trip Reference
<input
value={tripReference}
onChange={(e) => setTripReference(e.target.value)}
placeholder="BW-3608"
/>
</label>

<label>
ETA
<input
value={eta}
onChange={(e) => setEta(e.target.value)}
placeholder="12 minutes"
/>
</label>
</div>

<div className="statusGrid">
{statuses.map((status) => (
<button
key={status}
onClick={() => updateStatus(status)}
className={selectedStatus === status ? 'activeStatus' : ''}
>
{selectedStatus === status ? '● ' : ''}
{status}
</button>
))}
</div>

{message && <div className="messageBox">{message}</div>}
</section>
</main>
);
}

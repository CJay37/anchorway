'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const GET_TRIPS_URL =
process.env.NEXT_PUBLIC_GET_ACTIVE_TRIPS_URL ||
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-active-trips';

const UPDATE_URL =
process.env.NEXT_PUBLIC_UPDATE_TRANSPORT_STATUS_URL ||
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/update-transport-status';

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

type Trip = {
trip_reference: string;
patient: string;
pickup: string;
destination: string;
eta: string;
status: string;
};

export default function DispatcherDashboard() {
const [trips, setTrips] = useState<Trip[]>([]);
const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(true);

async function loadTrips() {
try {
const res = await fetch(GET_TRIPS_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: ANON_KEY,
Authorization: `Bearer ${ANON_KEY}`,
},
});

const json = await res.json();

if (!json.success) throw new Error(json.message || 'Could not load trips');

setTrips(json.trips || []);

if (!selectedTrip && json.trips?.length > 0) {
setSelectedTrip(json.trips[0]);
}

setLoading(false);
} catch (err: any) {
setMessage(err.message || 'Unable to load trips');
setLoading(false);
}
}

useEffect(() => {
loadTrips();
const interval = setInterval(loadTrips, 10000);
return () => clearInterval(interval);
}, []);

async function updateTrip(status: string) {
if (!selectedTrip) return;

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
trip_reference: selectedTrip.trip_reference,
current_status: status,
current_step: status,
eta: selectedTrip.eta,
visible_to_patient: true,
}),
});

const json = await res.json();

if (!json.success) throw new Error(json.message || 'Update failed');

setSelectedTrip({ ...selectedTrip, status });

setTrips((current) =>
current.map((trip) =>
trip.trip_reference === selectedTrip.trip_reference
? { ...trip, status }
: trip
)
);

setMessage(`Updated ${selectedTrip.trip_reference} to ${status}`);
} catch (err: any) {
setMessage(err.message || 'Something went wrong');
}
}

const activeCount = trips.filter((t) => t.status !== 'Completed').length;
const waitingCount = trips.filter((t) => t.status === 'Requested').length;
const completedCount = trips.filter((t) => t.status === 'Completed').length;

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>

{selectedTrip && (
<Link href={`/track/${selectedTrip.trip_reference}`} className="topLink">
View Public Tracker
</Link>
)}
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">AnchorWay Operations Center</span>
<h1>Live transport board</h1>
<p>Every active trip from Supabase appears here automatically.</p>
</div>
</section>

<section className="statsGrid">
<div className="summaryCard">
<span>Active Trips</span>
<strong>{activeCount}</strong>
</div>

<div className="summaryCard">
<span>Waiting Assignment</span>
<strong>{waitingCount}</strong>
</div>

<div className="summaryCard">
<span>Completed</span>
<strong>{completedCount}</strong>
</div>
</section>

{loading && <p>Loading active transports...</p>}
{message && <div className="messageBox">{message}</div>}

<section className="controlPanel">
<table className="dispatchTable">
<thead>
<tr>
<th>Trip</th>
<th>Patient</th>
<th>Pickup</th>
<th>Destination</th>
<th>ETA</th>
<th>Status</th>
</tr>
</thead>

<tbody>
{trips.map((trip) => (
<tr
key={trip.trip_reference}
onClick={() => setSelectedTrip(trip)}
className={
selectedTrip?.trip_reference === trip.trip_reference
? 'selectedRow'
: ''
}
>
<td>{trip.trip_reference}</td>
<td>{trip.patient}</td>
<td>{trip.pickup}</td>
<td>{trip.destination}</td>
<td>{trip.eta}</td>
<td>{trip.status}</td>
</tr>
))}
</tbody>
</table>

{selectedTrip && (
<div className="detailPanel">
<h2>{selectedTrip.trip_reference}</h2>
<p><strong>{selectedTrip.patient}</strong></p>
<p>{selectedTrip.pickup} → {selectedTrip.destination}</p>
<p>ETA: {selectedTrip.eta}</p>

<div className="statusGrid">
{statuses.map((status) => (
<button
key={status}
onClick={() => updateTrip(status)}
className={selectedTrip.status === status ? 'activeStatus' : ''}
>
{selectedTrip.status === status ? '● ' : ''}
{status}
</button>
))}
</div>
</div>
)}
</section>
</main>
);
}

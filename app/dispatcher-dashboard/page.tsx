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

const startingTrips = [
{
trip_reference: 'BW-3608',
patient: 'John Smith',
pickup: '37 Main Street',
destination: '123 Main Street',
eta: '12 minutes',
status: 'Driver En Route',
},
{
trip_reference: 'BW-5445',
patient: 'Test Patient',
pickup: '1595 Metropolitan Avenue',
destination: 'Mount Sinai',
eta: '18 minutes',
status: 'Requested',
},
];

export default function DispatcherDashboard() {
const [trips, setTrips] = useState(startingTrips);
const [selectedTrip, setSelectedTrip] = useState(startingTrips[0]);
const [message, setMessage] = useState('');

async function updateTrip(status: string) {
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

if (!json.success) {
throw new Error(json.message || 'Update failed');
}

const updatedTrips = trips.map((trip) =>
trip.trip_reference === selectedTrip.trip_reference
? { ...trip, status }
: trip
);

setTrips(updatedTrips);
setSelectedTrip({ ...selectedTrip, status });
setMessage(`Updated ${selectedTrip.trip_reference} to ${status}`);
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

<Link href={`/track/${selectedTrip.trip_reference}`} className="topLink">
View Public Tracker
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">Live Dispatcher Queue</span>
<h1>Active transports</h1>
<p>
View active trips, select a transport, and update its public status
in one place.
</p>
</div>

<div className="summaryCard">
<span>Selected Trip</span>
<strong>{selectedTrip.trip_reference}</strong>
<p>{selectedTrip.status}</p>
</div>
</section>

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
selectedTrip.trip_reference === trip.trip_reference
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

<div className="detailPanel">
<h2>{selectedTrip.trip_reference}</h2>
<p>
<strong>{selectedTrip.patient}</strong>
</p>
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

{message && <div className="messageBox">{message}</div>}
</div>
</section>
</main>
);
}

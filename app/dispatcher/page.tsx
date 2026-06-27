'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';


const API_URL = 'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-active-trips';


const SUPABASE_KEY = 'sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3';

type Trip = {
trip_reference: string;
current_transport_status?: string;
pickup_address?: string;
destination?: string;
mobility?: string;
transport_level?: string;
estimated_pickup_eta?: string;
};

export default function DispatcherPage() {
const [trips, setTrips] = useState<Trip[]>([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState('');

async function loadTrips() {
const res = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`,
},
body: JSON.stringify({}),
});

const json = await res.json();

if (json.success) {
setTrips(json.trips || []);
}

setLoading(false);
}
async function updateStatus(
tripReference: string,
newStatus: string
) {
try {
const res = await fetch(
"https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/update-transport-status",
{
method: "POST",
headers: {
"Content-Type": "application/json",
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`,
},
body: JSON.stringify({
trip_reference: tripReference,
current_status: newStatus,
}),
}
);

const json = await res.json();

if (!json.success) {
setMessage(`Update failed: ${json.message || json.error || "Unknown error"}`);
return;
}

await new Promise(resolve => setTimeout(resolve, 300));setTrips((currentTrips) =>
currentTrips.map((trip) =>
trip.trip_reference === tripReference
? { ...trip, current_transport_status: newStatus }
: trip
)
);
loadTrips();
setMessage(`${tripReference} updated to ${newStatus}`);
setTimeout(() => setMessage(''), 3000);
} catch (error) {
console.error(error);
}
}
useEffect(() => {
loadTrips();
const timer = setInterval(loadTrips, 5000);
return () => clearInterval(timer);
}, []);

return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>
</nav>

<section className="dashboardHero">
<span className="eyebrow">Live Dispatch Board</span>
<h1>AnchorWay Dispatcher</h1>
<p>View active transports and open each tracking page.</p>
</section>

{loading && <p>Loading trips...</p>}
{message && (
<p style={{ color: "green", fontWeight: "bold" }}>
{message}
</p>
)}


<section className="cards">
{trips.map((trip) => (
<div className="card" key={trip.trip_reference}>
<h2>{trip.trip_reference}</h2>

<p><strong>Status:</strong> {trip.current_transport_status || 'Requested'}</p>
<p><strong>Pickup:</strong> {trip.pickup_address || 'Not listed'}</p>
<p><strong>Destination:</strong> {trip.destination || 'Not listed'}</p>
<p><strong>Mobility:</strong> {trip.mobility || 'Not listed'}</p>
<p><strong>Level:</strong> {trip.transport_level || 'Not listed'}</p>
<p><strong>ETA:</strong> {trip.estimated_pickup_eta || 'Updating'}</p>

<div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
<Link className="btn" href={`/track/${trip.trip_reference}`}>
Patient View
</Link>

<Link className="btn secondary" href={`/driver/${trip.trip_reference}`}>
Driver GPS
</Link>
<select
defaultValue=""
onChange={(e) =>
updateStatus(
trip.trip_reference,
e.target.value
)
}
style={{
padding: "8px",
borderRadius: "8px",
border: "1px solid #ccc",
minWidth: "180px",
}}
>
<option value="">Update Status</option>
<option value="Requested">Requested</option>
<option value="Confirmed">Confirmed</option>
<option value="Driver Assigned">Driver Assigned</option>
<option value="Driver En Route">Driver En Route</option>
<option value="Arrived at Pickup">Arrived at Pickup</option>
<option value="Patient Loaded">Patient Loaded</option>
<option value="Transport In Progress">Transport In Progress</option>
<option value="Arrived at Destination">Arrived at Destination</option>
<option value="Completed">Completed</option>
</select>

</div>
</div>
))}
</section>
</main>
);
}

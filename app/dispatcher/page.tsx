'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL =
'https://xjqxtgejkrarIteximpy.supabase.co/functions/v1/get-active-trips';

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

useEffect(() => {
loadTrips();
const timer = setInterval(loadTrips, 30000);
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
</div>
</div>
))}
</section>
</main>
);
}

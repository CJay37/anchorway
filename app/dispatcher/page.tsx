'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const GET_ACTIVE_TRIPS_URL =
'https://xjqxtgejkrarlteximpy.supabase.co/functions/v1/get-active-trips';

const SUPABASE_KEY = 'sb_publishable_zO1MvX-5uBHRFwWs_KonpA_eMXueki3';

type Trip = {
trip_reference: string;
patient_name?: string;
current_status?: string;
current_step?: string;
eta?: string;
last_updated?: string;
};

export default function DispatcherPage() {
const [trips, setTrips] = useState<Trip[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

async function loadTrips() {
try {
const res = await fetch(GET_ACTIVE_TRIPS_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`,
},
body: JSON.stringify({}),
});

const json = await res.json();

if (!json.success) {
throw new Error(json.message || 'Could not load trips');
}

setTrips(json.trips || []);
} catch (err: any) {
setError(err.message || 'Unable to load dispatcher dashboard');
} finally {
setLoading(false);
}
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
<p>View active transports and open any trip tracking page.</p>
</section>

{loading && <p>Loading active trips...</p>}
{error && <p>{error}</p>}

<section className="cards">
{trips.map((trip) => (
<div className="card" key={trip.trip_reference}>
<h2>{trip.trip_reference}</h2>

<p>
<strong>Patient:</strong>{' '}
{trip.patient_name || 'Not listed'}
</p>

<p>
<strong>Status:</strong>{' '}
{trip.current_step || trip.current_status || 'Requested'}
</p>

<p>
<strong>ETA:</strong>{' '}
{trip.eta || 'Updating'}
</p>

<Link className="btn" href={`/track/${trip.trip_reference}`}>
Open Trip
</Link>
</div>
))}
</section>
</main>
);
}

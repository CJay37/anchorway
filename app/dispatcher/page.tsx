import Link from 'next/link';

const trips = [
{
ref: 'BW-5445',
patient: 'Not listed',
status: 'Requested',
eta: 'Updating',
},
{
ref: 'BW-3608',
patient: 'Not listed',
status: 'Requested',
eta: 'Updating',
},
];

export default function DispatcherPage() {
return (
<main className="dashboardPage">
<nav className="nav">
<Link href="/" className="brand">
<span className="logo">⚓</span>
AnchorWay
</Link>
</nav>

<section className="dashboardHero">
<div>
<span className="eyebrow">Live Dispatch Board</span>
<h1>AnchorWay Dispatcher</h1>
</div>
<p>View active transports and open any trip tracking page.</p>
</section>

<section className="cards">
{trips.map((trip) => (
<div className="card" key={trip.ref}>
<h2>{trip.ref}</h2>
<p><strong>Patient:</strong> {trip.patient}</p>
<p><strong>Status:</strong> {trip.status}</p>
<p><strong>ETA:</strong> {trip.eta}</p>

<div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
<Link className="btn" href={`/track/${trip.ref}`}>
Patient View
</Link>

<Link className="btn secondary" href={`/driver/${trip.ref}`}>
Driver GPS
</Link>
</div>
</div>
))}
</section>
</main>
);
}

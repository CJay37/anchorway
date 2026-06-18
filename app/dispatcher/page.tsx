'use client';

export default function DispatcherPage() {
const trips = [
{
id: 'BW-3608',
patient: 'John Smith',
status: 'Driver En Route',
eta: '12 min',
},
{
id: 'BW-3610',
patient: 'Mary Jones',
status: 'Confirmed',
eta: '--',
},
{
id: 'BW-3612',
patient: 'Robert Lee',
status: 'Patient Onboard',
eta: '18 min',
},
];

return (
<main
style={{
maxWidth: 900,
margin: '40px auto',
padding: 20,
fontFamily: 'Arial'
}}
>
<h1>🚑 AnchorWay Dispatcher</h1>

<br />

{trips.map((trip) => (
<div
key={trip.id}
style={{
border: '1px solid #ddd',
borderRadius: 12,
padding: 20,
marginBottom: 20,
background: '#fff'
}}
>
<h2>{trip.id}</h2>

<p>
<strong>Patient:</strong> {trip.patient}
</p>

<p>
<strong>Status:</strong> {trip.status}
</p>

<p>
<strong>ETA:</strong> {trip.eta}
</p>

<button
style={{
background: '#0070f3',
color: 'white',
padding: '10px 20px',
borderRadius: 8,
border: 'none',
cursor: 'pointer'
}}
>
Open Trip
</button>
</div>
))}
</main>
);
}

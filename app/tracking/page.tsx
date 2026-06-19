'use client';

import { useState } from 'react';

export default function TrackingSearchPage() {
const [ref, setRef] = useState('');

function handleSubmit(e: React.FormEvent) {
e.preventDefault();

const cleanRef = ref.trim().toUpperCase();

if (!cleanRef) return;

window.location.href = `/track/${encodeURIComponent(cleanRef)}`;
}

return (
<main className="trackingSearchPage">
<div className="trackingSearchCard">
<p className="statusPill">Live Transport Tracking</p>

<h1>Track a Transport</h1>

<p className="lead">
Enter your trip reference to view the latest transport status, ETA,
and progress updates.
</p>

<form onSubmit={handleSubmit} className="trackingSearchForm">
<label htmlFor="tripRef">Trip Reference</label>

<input
id="tripRef"
type="text"
value={ref}
onChange={(e) => setRef(e.target.value)}
placeholder="Example: BW-3608"
/>

<button type="submit">View Transport Status</button>
</form>
</div>
</main>
);
}

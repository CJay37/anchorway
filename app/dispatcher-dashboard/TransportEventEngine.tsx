'use client';

export type TransportEvent = {
id: string;
time: string;
event: string;
createdBy: string;
waitingOn?: string;
notify: string[];
};

const demoEvents: TransportEvent[] = [
{
id: '1',
time: '7:14 PM',
event: 'Transport Requested',
createdBy: 'Sending Facility',
waitingOn: 'Transport Coordination',
notify: ['Operations Center'],
},
{
id: '2',
time: '7:15 PM',
event: 'Transport Accepted',
createdBy: 'AnchorWay',
waitingOn: 'Transport Crew Assignment',
notify: [
'Sending Facility',
'Operations Center',
],
},
];

export default function TransportEventEngine() {
return (
<section
style={{
marginTop: 24,
padding: 24,
borderRadius: 18,
border: '1px solid #e5e7eb',
background: '#ffffff',
}}
>
<div
style={{
marginBottom: 20,
}}
>
<div
style={{
fontSize: 12,
fontWeight: 800,
textTransform: 'uppercase',
letterSpacing: '.7px',
color: '#2563eb',
}}
>
AnchorWay Core
</div>

<h2
style={{
marginTop: 6,
marginBottom: 8,
fontSize: 24,
fontWeight: 800,
}}
>
Event Engine
</h2>

<p
style={{
color: '#64748b',
margin: 0,
}}
>
Every transport action becomes an event that powers tracking,
automation, AI, notifications, and analytics.
</p>
</div>

{demoEvents.map((item) => (
<div
key={item.id}
style={{
border: '1px solid #e5e7eb',
borderRadius: 12,
padding: 16,
marginBottom: 14,
}}
>
<div
style={{
display: 'flex',
justifyContent: 'space-between',
marginBottom: 8,
}}
>
<strong>{item.event}</strong>

<span
style={{
color: '#64748b',
fontSize: 13,
}}
>
{item.time}
</span>
</div>

<div
style={{
fontSize: 14,
marginBottom: 6,
}}
>
<strong>Created By:</strong> {item.createdBy}
</div>

<div
style={{
fontSize: 14,
marginBottom: 10,
}}
>
<strong>Waiting On:</strong> {item.waitingOn}
</div>

<div
style={{
fontSize: 13,
color: '#2563eb',
}}
>
<strong>Automatic Updates:</strong>{' '}
{item.notify.join(', ')}
</div>
</div>
))}
</section>
);
}

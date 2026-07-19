'use client';

export type TransportEvent = {
id: string;
time: string;
eventName: string;
createdBy: string;
waitingOn: string;
impact: 'positive' | 'neutral' | 'warning' | 'critical';
healthScoreChange: number;
requiredAction: string;
notify: string[];
journeyStep: string;
etaImpactMinutes: number;
aiSummary: string;
};

const demoEvents: TransportEvent[] = [
{
id: '1',
time: '7:14 PM',
eventName: 'Transport Requested',
createdBy: 'Sending Facility',
waitingOn: 'Transport Coordination',
impact: 'neutral',
healthScoreChange: 0,
requiredAction: 'Review request and begin transport coordination.',
notify: ['Operations Center'],
journeyStep: 'Requested',
etaImpactMinutes: 0,
aiSummary:
'The transport request has been received and is awaiting coordination.',
},
{
id: '2',
time: '7:15 PM',
eventName: 'Transport Accepted',
createdBy: 'AnchorWay',
waitingOn: 'Transport Crew Assignment',
impact: 'positive',
healthScoreChange: 3,
requiredAction: 'Assign an available transport crew.',
notify: ['Sending Facility', 'Operations Center'],
journeyStep: 'Accepted',
etaImpactMinutes: 0,
aiSummary:
'The request has been accepted. Crew assignment is now the next required step.',
},
{
id: '3',
time: '7:22 PM',
eventName: 'Crew Assignment Delayed',
createdBy: 'AnchorWay Event Engine',
waitingOn: 'Transport Provider',
impact: 'warning',
healthScoreChange: -8,
requiredAction:
'Confirm crew availability or escalate to another transport provider.',
notify: [
'Sending Facility',
'Transport Company',
'Operations Center',
],
journeyStep: 'Crew Assigned',
etaImpactMinutes: 12,
aiSummary:
'No crew has been assigned within the expected window. The transport may be delayed by approximately 12 minutes.',
},
];

function getImpactStyles(impact: TransportEvent['impact']) {
if (impact === 'positive') {
return {
background: '#f0fdf4',
border: '#bbf7d0',
text: '#166534',
label: 'Positive',
};
}

if (impact === 'warning') {
return {
background: '#fff7ed',
border: '#fed7aa',
text: '#9a3412',
label: 'Warning',
};
}

if (impact === 'critical') {
return {
background: '#fef2f2',
border: '#fecaca',
text: '#991b1b',
label: 'Critical',
};
}

return {
background: '#f8fafc',
border: '#e2e8f0',
text: '#475569',
label: 'Neutral',
};
}

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
marginBottom: 22,
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
color: '#1f2937',
}}
>
Event Engine
</h2>

<p
style={{
color: '#64748b',
margin: 0,
lineHeight: 1.6,
}}
>
Every transport action becomes a shared event that powers tracking,
notifications, journey updates, AI recommendations, and analytics.
</p>
</div>

<div
style={{
display: 'grid',
gap: 16,
}}
>
{demoEvents.map((item) => {
const impactStyles = getImpactStyles(item.impact);

return (
<article
key={item.id}
style={{
border: `1px solid ${impactStyles.border}`,
borderRadius: 14,
padding: 18,
background: impactStyles.background,
}}
>
<div
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
gap: 16,
marginBottom: 14,
}}
>
<div>
<div
style={{
fontSize: 18,
fontWeight: 800,
color: '#1f2937',
}}
>
{item.eventName}
</div>

<div
style={{
marginTop: 4,
fontSize: 13,
color: '#64748b',
}}
>
Created by {item.createdBy}
</div>
</div>

<div
style={{
textAlign: 'right',
}}
>
<div
style={{
fontSize: 13,
color: '#64748b',
marginBottom: 5,
}}
>
{item.time}
</div>

<span
style={{
display: 'inline-block',
padding: '4px 8px',
borderRadius: 999,
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
letterSpacing: '.5px',
color: impactStyles.text,
border: `1px solid ${impactStyles.border}`,
background: '#ffffff',
}}
>
{impactStyles.label}
</span>
</div>
</div>

<div
style={{
display: 'grid',
gridTemplateColumns:
'repeat(auto-fit, minmax(180px, 1fr))',
gap: 12,
marginBottom: 14,
}}
>
<div
style={{
padding: 12,
borderRadius: 10,
background: '#ffffff',
border: '1px solid rgba(148, 163, 184, 0.25)',
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#64748b',
marginBottom: 5,
}}
>
Waiting On
</div>

<div
style={{
fontSize: 14,
fontWeight: 700,
color: '#1f2937',
}}
>
{item.waitingOn}
</div>
</div>

<div
style={{
padding: 12,
borderRadius: 10,
background: '#ffffff',
border: '1px solid rgba(148, 163, 184, 0.25)',
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#64748b',
marginBottom: 5,
}}
>
Journey Step
</div>

<div
style={{
fontSize: 14,
fontWeight: 700,
color: '#1f2937',
}}
>
{item.journeyStep}
</div>
</div>

<div
style={{
padding: 12,
borderRadius: 10,
background: '#ffffff',
border: '1px solid rgba(148, 163, 184, 0.25)',
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#64748b',
marginBottom: 5,
}}
>
Health Change
</div>

<div
style={{
fontSize: 14,
fontWeight: 800,
color:
item.healthScoreChange > 0
? '#15803d'
: item.healthScoreChange < 0
? '#b91c1c'
: '#475569',
}}
>
{item.healthScoreChange > 0 ? '+' : ''}
{item.healthScoreChange}
</div>
</div>

<div
style={{
padding: 12,
borderRadius: 10,
background: '#ffffff',
border: '1px solid rgba(148, 163, 184, 0.25)',
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#64748b',
marginBottom: 5,
}}
>
ETA Impact
</div>

<div
style={{
fontSize: 14,
fontWeight: 800,
color:
item.etaImpactMinutes > 0
? '#b45309'
: '#15803d',
}}
>
{item.etaImpactMinutes > 0
? `+${item.etaImpactMinutes} minutes`
: 'No delay'}
</div>
</div>
</div>

<div
style={{
padding: 14,
borderRadius: 10,
background: '#ffffff',
border: '1px solid rgba(148, 163, 184, 0.25)',
marginBottom: 12,
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#64748b',
marginBottom: 6,
}}
>
Required Action
</div>

<div
style={{
fontSize: 14,
fontWeight: 700,
color: '#1f2937',
lineHeight: 1.5,
}}
>
{item.requiredAction}
</div>
</div>

<div
style={{
padding: 14,
borderRadius: 10,
background: '#eff6ff',
border: '1px solid #bfdbfe',
marginBottom: 12,
}}
>
<div
style={{
fontSize: 11,
fontWeight: 800,
textTransform: 'uppercase',
color: '#1d4ed8',
marginBottom: 6,
}}
>
AI Summary
</div>

<div
style={{
fontSize: 14,
color: '#1e3a8a',
lineHeight: 1.55,
}}
>
{item.aiSummary}
</div>
</div>

<div
style={{
fontSize: 13,
color: '#2563eb',
lineHeight: 1.5,
}}
>
<strong>Automatic Updates:</strong>{' '}
{item.notify.join(', ')}
</div>
</article>
);
})}
</div>
</section>
);
}

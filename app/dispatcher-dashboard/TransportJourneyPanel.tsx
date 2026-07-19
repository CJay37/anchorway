'use client';

type JourneyStep = {
id: string;
label: string;
description: string;
};

type Props = {
currentStatus?: string;
};

const journeySteps: JourneyStep[] = [
{
id: 'requested',
label: 'Requested',
description: 'Transport request received',
},
{
id: 'accepted',
label: 'Accepted',
description: 'Request accepted for coordination',
},
{
id: 'patient_preparing',
label: 'Patient Preparing',
description: 'Patient, paperwork, and discharge needs being prepared',
},
{
id: 'crew_assigned',
label: 'Crew Assigned',
description: 'Transport crew assigned',
},
{
id: 'crew_en_route',
label: 'Crew En Route',
description: 'Transport crew traveling to pickup',
},
{
id: 'crew_arrived',
label: 'Crew Arrived',
description: 'Transport crew at pickup location',
},
{
id: 'patient_loaded',
label: 'Patient Loaded',
description: 'Patient secured and ready to depart',
},
{
id: 'transporting',
label: 'In Transport',
description: 'Patient traveling to destination',
},
{
id: 'arrived',
label: 'Arrived',
description: 'Patient and crew at destination',
},
{
id: 'completed',
label: 'Completed',
description: 'Transport handoff completed',
},
];

export default function TransportJourneyPanel({
currentStatus = 'requested',
}: Props) {
const currentIndex = journeySteps.findIndex(
(step) => step.id === currentStatus
);

const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

return (
<section
style={{
marginTop: 24,
padding: 24,
background: '#ffffff',
border: '1px solid #e5e7eb',
borderRadius: 18,
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
letterSpacing: 0.7,
textTransform: 'uppercase',
color: '#15803d',
marginBottom: 8,
}}
>
Shared Transport Journey
</div>

<h2
style={{
margin: 0,
fontSize: 24,
fontWeight: 800,
color: '#1f2937',
}}
>
Digital Patient Journey
</h2>

<p
style={{
marginTop: 8,
marginBottom: 0,
fontSize: 14,
lineHeight: 1.6,
color: '#64748b',
}}
>
One shared view of what is complete, what is happening now, and what
comes next.
</p>
</div>

<div
style={{
display: 'grid',
gap: 12,
}}
>
{journeySteps.map((step, index) => {
const isComplete = index < safeCurrentIndex;
const isCurrent = index === safeCurrentIndex;
const isUpcoming = index > safeCurrentIndex;

return (
<div
key={step.id}
style={{
display: 'grid',
gridTemplateColumns: '42px 1fr auto',
alignItems: 'center',
gap: 14,
padding: 16,
borderRadius: 14,
border: isCurrent
? '1px solid #86efac'
: '1px solid #e5e7eb',
background: isComplete
? '#f0fdf4'
: isCurrent
? '#ecfdf5'
: '#ffffff',
opacity: isUpcoming ? 0.68 : 1,
}}
>
<div
style={{
width: 36,
height: 36,
borderRadius: '50%',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontWeight: 800,
background: isComplete
? '#16a34a'
: isCurrent
? '#dcfce7'
: '#f1f5f9',
color: isComplete
? '#ffffff'
: isCurrent
? '#166534'
: '#64748b',
border: isCurrent ? '2px solid #22c55e' : 'none',
}}
>
{isComplete ? '✓' : index + 1}
</div>

<div>
<div
style={{
fontSize: 15,
fontWeight: 800,
color: '#1f2937',
marginBottom: 4,
}}
>
{step.label}
</div>

<div
style={{
fontSize: 13,
lineHeight: 1.5,
color: '#64748b',
}}
>
{step.description}
</div>
</div>

<div
style={{
fontSize: 12,
fontWeight: 800,
whiteSpace: 'nowrap',
color: isComplete
? '#15803d'
: isCurrent
? '#166534'
: '#94a3b8',
}}
>
{isComplete
? 'Complete'
: isCurrent
? 'Current'
: 'Upcoming'}
</div>
</div>
);
})}
</div>
</section>
);
}

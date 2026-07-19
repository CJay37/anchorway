export type ResponsibilityEvent = {
eventName: string;
waitingOn?: string;
requiredAction?: string;
etaImpactMinutes?: number;
impact?: 'positive' | 'neutral' | 'warning' | 'critical';
};

export type ResponsibilityAnalysis = {
waitingOn: string;
reason: string;
requiredAction: string;
estimatedImpactMinutes: number;
severity: 'normal' | 'attention' | 'urgent';
shouldEscalate: boolean;
};

function normalizeWaitingOn(waitingOn?: string): string {
if (!waitingOn) {
return 'Nobody';
}

const normalized = waitingOn.trim().toLowerCase();

if (
normalized === 'nobody' ||
normalized === 'none' ||
normalized === 'no party currently identified'
) {
return 'Nobody';
}

if (
normalized.includes('crew') ||
normalized.includes('transport provider') ||
normalized.includes('crew assignment')
) {
return 'Transport Provider';
}

if (
normalized.includes('sending facility') ||
normalized.includes('patient readiness') ||
normalized.includes('discharge') ||
normalized.includes('paperwork')
) {
return 'Sending Facility';
}

if (
normalized.includes('receiving facility') ||
normalized.includes('receiving staff') ||
normalized.includes('destination')
) {
return 'Receiving Facility';
}

if (normalized.includes('patient')) {
return 'Patient';
}

if (
normalized.includes('insurance') ||
normalized.includes('authorization')
) {
return 'Insurance Authorization';
}

return waitingOn;
}

export function analyzeResponsibility(
events: ResponsibilityEvent[]
): ResponsibilityAnalysis {
const latestEvent = events.at(-1);

if (!latestEvent) {
return {
waitingOn: 'Nobody',
reason: 'No active transport bottleneck has been identified.',
requiredAction: 'Continue monitoring.',
estimatedImpactMinutes: 0,
severity: 'normal',
shouldEscalate: false,
};
}

const waitingOn = normalizeWaitingOn(latestEvent.waitingOn);
const estimatedImpactMinutes = Math.max(
0,
latestEvent.etaImpactMinutes ?? 0
);

const shouldEscalate =
latestEvent.impact === 'critical' ||
estimatedImpactMinutes >= 20;

const severity =
shouldEscalate
? 'urgent'
: latestEvent.impact === 'warning' ||
estimatedImpactMinutes >= 10
? 'attention'
: 'normal';

const reason =
waitingOn === 'Nobody'
? 'No active transport bottleneck has been identified.'
: latestEvent.eventName;

return {
waitingOn,
reason,
requiredAction:
latestEvent.requiredAction ?? 'Continue monitoring.',
estimatedImpactMinutes,
severity,
shouldEscalate,
};
}

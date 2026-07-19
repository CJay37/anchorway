export type IntelligenceInputEvent = {
eventName: string;
waitingOn?: string;
impact?: 'positive' | 'neutral' | 'warning' | 'critical';
healthScoreChange?: number;
requiredAction?: string;
etaImpactMinutes?: number;
aiSummary?: string;
};

export type TransportIntelligence = {
healthScore: number;
healthStatus: 'Healthy' | 'Watch' | 'At Risk';
waitingOn: string;
operationalRisk: 'Low' | 'Moderate' | 'High';
recommendedAction: string;
etaImpactMinutes: number;
aiSummary: string;
};

export function analyzeTransport(
events: IntelligenceInputEvent[]
): TransportIntelligence {
const healthScore = Math.max(
0,
Math.min(
100,
96 +
events.reduce(
(total, event) => total + (event.healthScoreChange ?? 0),
0
)
)
);

const latestEvent = events.at(-1);

const etaImpactMinutes = events.reduce(
(total, event) => total + (event.etaImpactMinutes ?? 0),
0
);

const healthStatus =
healthScore >= 85
? 'Healthy'
: healthScore >= 65
? 'Watch'
: 'At Risk';

const operationalRisk =
healthScore >= 85
? 'Low'
: healthScore >= 65
? 'Moderate'
: 'High';

return {
healthScore,
healthStatus,
waitingOn: latestEvent?.waitingOn ?? 'Nobody',
operationalRisk,
recommendedAction:
latestEvent?.requiredAction ?? 'Continue monitoring.',
etaImpactMinutes,
aiSummary:
latestEvent?.aiSummary ??
'No significant operational issues are currently detected.',
};
}

export type NotificationRecipient =
| 'Operations Center'
| 'Sending Facility'
| 'Receiving Facility'
| 'Transport Provider'
| 'Transport Crew'
| 'Patient'
| 'Family'
| 'Billing'
| 'Analytics';

export type NotificationChannel =
| 'sms'
| 'email'
| 'push'
| 'voice'
| 'dashboard';

export type NotificationPolicyInput = {
eventName: string;
etaImpactMinutes?: number;
waitingOn?: string;
};

export type NotificationPolicyResult = {
recipients: NotificationRecipient[];
priority: 'low' | 'normal' | 'high' | 'critical';
channels: NotificationChannel[];
requiresAcknowledgement: boolean;
escalateAfterMinutes?: number;
};

export function determineCommunicationPolicy(
input: NotificationPolicyInput
): NotificationPolicyResult {
switch (input.eventName) {
case 'Transport Requested':
return {
recipients: [
'Operations Center',
'Transport Provider',
'Sending Facility',
'Receiving Facility',
'Patient',
],
priority: 'normal',
channels: ['dashboard', 'sms'],
requiresAcknowledgement: false,
};

case 'Transport Accepted':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Operations Center',
'Patient',
],
priority: 'normal',
channels: ['dashboard', 'sms'],
requiresAcknowledgement: false,
};

case 'Crew Assigned':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Transport Crew',
'Patient',
'Family',
'Operations Center',
],
priority: 'normal',
channels: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: false,
};

case 'Crew En Route':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Patient',
'Family',
'Operations Center',
],
priority: 'normal',
channels: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: false,
};

case 'Crew Arrived':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Transport Crew',
'Patient',
'Operations Center',
],
priority: 'high',
channels: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: true,
escalateAfterMinutes: 10,
};

case 'Patient Loaded':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Patient',
'Family',
'Operations Center',
],
priority: 'high',
channels: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: false,
};

case 'ETA Updated':
case 'Traffic Delay': {
const etaImpactMinutes = Math.max(
0,
input.etaImpactMinutes ?? 0
);

const isMajorDelay = etaImpactMinutes >= 20;

return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Transport Crew',
'Patient',
'Family',
'Operations Center',
],
priority: isMajorDelay ? 'critical' : 'high',
channels: isMajorDelay
? ['dashboard', 'sms', 'push', 'voice']
: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: isMajorDelay,
escalateAfterMinutes: isMajorDelay ? 5 : undefined,
};
}

case 'Arrived at Receiving Facility':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Patient',
'Family',
'Operations Center',
],
priority: 'high',
channels: ['dashboard', 'sms', 'push'],
requiresAcknowledgement: true,
escalateAfterMinutes: 10,
};

case 'Transport Completed':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Transport Provider',
'Patient',
'Family',
'Billing',
'Analytics',
'Operations Center',
],
priority: 'normal',
channels: ['dashboard', 'sms', 'email', 'push'],
requiresAcknowledgement: false,
};

default:
return {
recipients: ['Operations Center'],
priority: 'low',
channels: ['dashboard'],
requiresAcknowledgement: false,
};
}
}

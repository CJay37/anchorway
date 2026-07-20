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

export type NotificationPolicyInput = {
eventName: string;
etaImpactMinutes?: number;
waitingOn?: string;
};

export type NotificationPolicyResult = {
recipients: NotificationRecipient[];
priority: 'low' | 'normal' | 'high' | 'critical';
};

export function determineNotificationRecipients(
input: NotificationPolicyInput
): NotificationPolicyResult {

switch (input.eventName) {

case 'Transport Requested':
return {
recipients: [
'Operations Center',
'Transport Provider',
],
priority: 'normal',
};

case 'Transport Accepted':
return {
recipients: [
'Sending Facility',
'Operations Center',
],
priority: 'normal',
};

case 'Crew Assigned':
return {
recipients: [
'Sending Facility',
'Patient',
'Family',
'Operations Center',
],
priority: 'normal',
};

case 'Crew En Route':
return {
recipients: [
'Sending Facility',
'Patient',
'Family',
],
priority: 'normal',
};

case 'Crew Arrived':
return {
recipients: [
'Sending Facility',
'Operations Center',
],
priority: 'high',
};

case 'Patient Loaded':
return {
recipients: [
'Receiving Facility',
'Family',
'Operations Center',
],
priority: 'high',
};

case 'Transport Completed':
return {
recipients: [
'Sending Facility',
'Receiving Facility',
'Patient',
'Family',
'Transport Provider',
'Billing',
'Analytics',
'Operations Center',
],
priority: 'normal',
};

default:
return {
recipients: [
'Operations Center',
],
priority: 'low',
};
}
}

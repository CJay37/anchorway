export type TransportLifecycleEventName =
| "Transport Cancelled"
| "Transport Restarted"

export type TransportLifecycleActor =
| "Operations Center"
| "Sending Facility"
| "Receiving Facility"
| "Transport Provider"
| "Transport Crew"
| "Patient"
| "Family"
| "AnchorWay System"

export type TransportLifecycleStatus =
| "Active"
| "Cancelled"
| "Awaiting Reschedule"

export type TransportLifecycleEvent = {
eventId: string;
tripReference: string;
eventName: TransportLifecycleEventName;
previousStatus: TransportLifecycleStatus;
newStatus: TransportLifecycleStatus;
createdAt: string;
createdBy: TransportLifecycleActor;
reason?: string;
restartPreserved?: boolean;
aiSummary: string;
notificationRecipients: string[];
};

export type CreateCancellationEventInput = {
tripReference: string;
reason: string;
allowRestart: boolean;
createdBy?: TransportLifecycleActor;
createdAt?: string;
notificationRecipients?: string[];
};

export type CreateRestartEventInput = {
tripReference: string;
previousStatus: "Cancelled" | "Awaiting Reschedule"
createdBy?: TransportLifecycleActor;
createdAt?: string;
notificationRecipients?: string[];
};

const defaultCancellationRecipients = [
"Operations Center",
"Sending Facility",
"Receiving Facility",
"Transport Provider",
"Transport Crew",
"Patient",
"Family",
];

const defaultRestartRecipients = [
"Operations Center",
"Sending Facility",
"Receiving Facility",
"Transport Provider",
"Patient",
"Family",
];

function createEventId(
tripReference: string,
eventName: TransportLifecycleEventName,
createdAt: string
): string {
const normalizedEventName = eventName
.toLowerCase()
.replaceAll(" ", "-");

const normalizedTimestamp = createdAt.replace(
/[^0-9]/g,
""
);

return `${tripReference}-${normalizedEventName}-${normalizedTimestamp}`;
}

export function createTransportCancellationEvent(
input: CreateCancellationEventInput
): TransportLifecycleEvent {
const createdAt =
input.createdAt ?? new Date().toISOString();

const newStatus: TransportLifecycleStatus =
input.allowRestart
? "Awaiting Reschedule"
: "Cancelled"

return {
eventId: createEventId(
input.tripReference,
"Transport Cancelled",
createdAt
),

tripReference: input.tripReference,

eventName: "Transport Cancelled",

previousStatus: "Active",

newStatus,

createdAt,

createdBy:
input.createdBy ?? "Operations Center",

reason: input.reason,

restartPreserved: input.allowRestart,

aiSummary: input.allowRestart
? `Transport ${input.tripReference} was cancelled and preserved for restart. Reason: ${input.reason}.`
: `Transport ${input.tripReference} was cancelled without restart preservation. Reason: ${input.reason}.`,

notificationRecipients:
input.notificationRecipients ??
defaultCancellationRecipients,
};
}

export function createTransportRestartEvent(
input: CreateRestartEventInput
): TransportLifecycleEvent {
const createdAt =
input.createdAt ?? new Date().toISOString();

return {
eventId: createEventId(
input.tripReference,
"Transport Restarted",
createdAt
),

tripReference: input.tripReference,

eventName: "Transport Restarted",

previousStatus: input.previousStatus,

newStatus: "Active",

createdAt,

createdBy:
input.createdBy ?? "Operations Center",

restartPreserved: true,

aiSummary: `Transport ${input.tripReference} was restarted using its preserved trip information.`,

notificationRecipients:
input.notificationRecipients ??
defaultRestartRecipients,
};
}

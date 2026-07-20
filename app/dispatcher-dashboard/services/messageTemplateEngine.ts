import type {
NotificationRecipient,
} from "./notificationPolicyEngine"

export type MessageTemplateInput = {
recipient: NotificationRecipient;
eventName: string;
patientName?: string;
eta?: string;
delayMinutes?: number;
reason?: string;
};

export type MessageTemplate = {
title: string;
message: string;
};

export function buildMessageTemplate(
input: MessageTemplateInput
): MessageTemplate {
switch (input.recipient) {
case "Patient":
return {
title: input.eventName,
message:
input.delayMinutes && input.delayMinutes > 0
? `Your transport is delayed approximately ${input.delayMinutes} minutes. Updated ETA: ${input.eta ?? "Pending"}.`
: `Your transport status has been updated. Current status: ${input.eventName}.`,
};

case "Family":
return {
title: input.eventName,
message:
input.delayMinutes && input.delayMinutes > 0
? `${input.patientName ?? "The patient"} is delayed approximately ${input.delayMinutes} minutes. Updated ETA: ${input.eta ?? "Pending"}.`
: `${input.patientName ?? "The patient"} transport status has changed to "${input.eventName}".`,
};

case "Sending Facility":
return {
title: "Transport Update",
message: `Current status: ${input.eventName}. Estimated arrival: ${input.eta ?? "Pending"}.`,
};

case "Receiving Facility":
return {
title: "Inbound Patient Update",
message: `Incoming patient ETA: ${input.eta ?? "Pending"}. Current status: ${input.eventName}.`,
};

case "Transport Provider":
return {
title: "Transport Assignment",
message: `Operational update: ${input.eventName}.`,
};

case "Transport Crew":
return {
title: "Crew Update",
message: `Current assignment status: ${input.eventName}.`,
};

case "Operations Center":
return {
title: "Operations Intelligence",
message: `Transport event received: ${input.eventName}.`,
};

case "Billing":
return {
title: "Billing Event",
message: `Transport has reached billing stage: ${input.eventName}.`,
};

case "Analytics":
return {
title: "Analytics Event",
message: `Log operational event: ${input.eventName}.`,
};

default:
return {
title: "Transport Update",
message: `Transport status updated: ${input.eventName}.`,
};
}
}

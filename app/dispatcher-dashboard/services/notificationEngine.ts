import {
determineCommunicationPolicy,
NotificationChannel,
NotificationRecipient,
} from "./notificationPolicyEngine"

import {
buildMessageTemplate,
} from "./messageTemplateEngine"

export type NotificationEngineInput = {
eventName: string;
patientName?: string;
eta?: string;
etaImpactMinutes?: number;
waitingOn?: string;
reason?: string;
};

export type NotificationJob = {
recipient: NotificationRecipient;
channels: NotificationChannel[];
priority: "low" | "normal" | "high" | "critical"
title: string;
message: string;
requiresAcknowledgement: boolean;
escalateAfterMinutes?: number;
};

export type NotificationEngineResult = {
eventName: string;
jobs: NotificationJob[];
};

export function createNotificationJobs(
input: NotificationEngineInput
): NotificationEngineResult {
const policy = determineCommunicationPolicy({
eventName: input.eventName,
etaImpactMinutes: input.etaImpactMinutes,
waitingOn: input.waitingOn,
});

const jobs = policy.recipients.map((recipient) => {
const template = buildMessageTemplate({
recipient,
eventName: input.eventName,
patientName: input.patientName,
eta: input.eta,
delayMinutes: input.etaImpactMinutes,
reason: input.reason,
});

return {
recipient,
channels: policy.channels,
priority: policy.priority,
title: template.title,
message: template.message,
requiresAcknowledgement:
policy.requiresAcknowledgement,
escalateAfterMinutes:
policy.escalateAfterMinutes,
};
});

return {
eventName: input.eventName,
jobs,
};
}

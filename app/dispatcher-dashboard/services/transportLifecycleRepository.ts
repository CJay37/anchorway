import type { SupabaseClient } from "@supabase/supabase-js"

import type {
TransportLifecycleEvent,
} from "./transportLifecycleEngine"

export type SaveLifecycleEventResult = {
success: boolean;
event: TransportLifecycleEvent;
errorMessage?: string;
};

type TransportLifecycleEventRow = {
event_id: string;
trip_reference: string;
event_name: TransportLifecycleEvent["eventName"];
previous_status: TransportLifecycleEvent["previousStatus"];
new_status: TransportLifecycleEvent["newStatus"];
created_at: string;
created_by: TransportLifecycleEvent["createdBy"];
reason: string | null;
restart_preserved: boolean | null;
ai_summary: string;
notification_recipients: string[];
metadata: {
source: string;
repositoryVersion: number;
};
};

function convertLifecycleEventToRow(
event: TransportLifecycleEvent
): TransportLifecycleEventRow {
return {
event_id: event.eventId,

trip_reference: event.tripReference,

event_name: event.eventName,

previous_status: event.previousStatus,

new_status: event.newStatus,

created_at: event.createdAt,

created_by: event.createdBy,

reason: event.reason ?? null,

restart_preserved:
event.restartPreserved ?? null,

ai_summary: event.aiSummary,

notification_recipients:
event.notificationRecipients,

metadata: {
source: "AnchorWay Transport Operations Center",
repositoryVersion: 1,
},
};
}

export async function saveTransportLifecycleEvent(
supabase: SupabaseClient,
event: TransportLifecycleEvent
): Promise<SaveLifecycleEventResult> {
const row = convertLifecycleEventToRow(event);

const { error } = await supabase
.from("transport_lifecycle_events")
.upsert(row, {
onConflict: "event_id",
ignoreDuplicates: true,
});

if (error) {
console.error(
"Unable to save transport lifecycle event:",
error
);

return {
success: false,
event,
errorMessage: error.message,
};
}

return {
success: true,
event,
};
}

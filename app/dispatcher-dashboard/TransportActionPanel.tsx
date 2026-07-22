"use client"

import { useState } from "react"
import CancelTransportPanel, {
type CancellationResult,
} from "./CancelTransportPanel"

export type TransportAction =
| "Update ETA"
| "Notify Stakeholders"
| "Add Delay Reason"
| "Change Transport Provider"
| "Escalate Transport"
| "Pause Transport"
| "Cancel Transport"
| "Restart Transport"
| "Duplicate Transport"
| "Download Timeline"

type TransportActionPanelProps = {
tripReference: string;
cancellationStatus?:
| "Active"
| "Cancelled"
| "Awaiting Reschedule"
| "Completed Internally"
| "Superseded"
onCancellationConfirmed?: (
result: CancellationResult
) => void;
};

const activeActions: TransportAction[] = [
"Update ETA",
"Notify Stakeholders",
"Add Delay Reason",
"Change Transport Provider",
"Escalate Transport",
"Pause Transport",
"Cancel Transport",
"Duplicate Transport",
"Download Timeline",
];

const inactiveActions: TransportAction[] = [
"Restart Transport",
"Duplicate Transport",
"Download Timeline",
];

function isInactiveTransport(
cancellationStatus?: TransportActionPanelProps["cancellationStatus"]
): boolean {
return (
cancellationStatus === "Cancelled" ||
cancellationStatus === "Awaiting Reschedule" ||
cancellationStatus === "Completed Internally" ||
cancellationStatus === "Superseded"
);
}

function getActionDescription(action: TransportAction): string {
switch (action) {
case "Update ETA":
return "Adjust the expected pickup or arrival time."

case "Notify Stakeholders":
return "Prepare an update for facilities, patient, family, and provider."

case "Add Delay Reason":
return "Record the operational cause of the delay."

case "Change Transport Provider":
return "Move the request to another available provider."

case "Escalate Transport":
return "Flag the transport for immediate operational attention."

case "Pause Transport":
return "Temporarily stop progress while preserving all trip information."

case "Cancel Transport":
return "End the active request and record the cancellation reason."

case "Restart Transport":
return "Resume the transport without re-entering the original information."

case "Duplicate Transport":
return "Create a new transport using the current trip details."

case "Download Timeline":
return "Generate a complete record of transport events."

default:
return "Manage this transport."
}
}

function isDestructiveAction(action: TransportAction): boolean {
return action === "Cancel Transport"
}

export default function TransportActionPanel({
tripReference,
cancellationStatus = "Active",
onCancellationConfirmed,
}: TransportActionPanelProps) {
const [isOpen, setIsOpen] = useState(false);
const [showCancellation, setShowCancellation] = useState(false);
const actions = isInactiveTransport(cancellationStatus)
? inactiveActions
: activeActions;

return (
<section
aria-label={`Actions for transport ${tripReference}`}
style={{
border: "1px solid #e2e8f0",
borderRadius: "16px",
background: "#ffffff",
overflow: "hidden",
}}
>
<button
type="button"
onClick={() => setIsOpen((current) => !current)}
aria-expanded={isOpen}
aria-controls={`transport-actions-${tripReference}`}
style={{
width: "100%",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "16px",
padding: "16px 18px",
border: 0,
background: "#f8fafc",
textAlign: "left",
cursor: "pointer",
}}
>
<span>
<span
style={{
display: "block",
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#64748b",
}}
>
Operations Actions
</span>

<span
style={{
display: "block",
marginTop: "5px",
fontSize: "16px",
fontWeight: 800,
color: "#0f172a",
}}
>
Manage {tripReference}
</span>
</span>

<span
aria-hidden="true"
style={{
fontSize: "20px",
color: "#64748b",
transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
transition: "transform 160ms ease",
}}
>
›
</span>
</button>

{isOpen && (
<div id={`transport-actions-${tripReference}`}>
<div
style={{
padding: "14px 18px",
borderTop: "1px solid #e2e8f0",
borderBottom: "1px solid #e2e8f0",
}}
>
<p
style={{
margin: 0,
fontSize: "13px",
lineHeight: 1.5,
color: "#64748b",
}}
>
Choose an operational action. No changes are made until the action
is confirmed.
</p>
</div>

<div
style={{
display: "grid",
gap: "10px",
padding: "14px",
}}
>
{actions.map((action) => {
const destructive = isDestructiveAction(action);

return (
<button
key={action}
type="button"
onClick={() => {
if (action === "Cancel Transport") {
setShowCancellation(true);
}
}}
aria-label={`${action} for transport ${tripReference}`}
style={{
width: "100%",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "14px",
padding: "13px 14px",
borderRadius: "12px",
border: destructive
? "1px solid #fecaca"
: "1px solid #e2e8f0",
background: destructive ? "#fef2f2" : "#ffffff",
textAlign: "left",
cursor: "pointer",
}}
>
<span>
<span
style={{
display: "block",
fontSize: "14px",
fontWeight: 800,
color: destructive ? "#991b1b" : "#0f172a",
}}
>
{action}
</span>

<span
style={{
display: "block",
marginTop: "3px",
fontSize: "12px",
lineHeight: 1.45,
color: destructive ? "#b91c1c" : "#64748b",
}}
>
{getActionDescription(action)}
</span>
</span>

<span
aria-hidden="true"
style={{
flexShrink: 0,
fontSize: "18px",
color: destructive ? "#b91c1c" : "#94a3b8",
}}
>
›
</span>
</button>
);
})}
</div>
</div>
)}
{showCancellation && (
<div
style={{
padding: "0 14px 14px",
}}
>
<CancelTransportPanel
tripReference={tripReference}
onClose={() => setShowCancellation(false)}
onConfirm={(result) => {
onCancellationConfirmed?.(result);
setShowCancellation(false);
}}
/>
</div>
)}
</section>
);
}

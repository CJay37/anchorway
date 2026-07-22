"use client"

import { useState } from "react"

export type CancellationReason =
| "Patient not ready"
| "Physician cancelled discharge"
| "Testing still pending"
| "Patient condition changed"
| "Receiving facility unavailable"
| "Insurance or authorization issue"
| "Family requested cancellation"
| "Duplicate request"
| "Transport no longer needed"
| "Sending facility handling internally"
| "Other"

export type CancellationResult = {
tripReference: string;
reason: string;
allowRestart: boolean;
cancellationStatus: "Cancelled" | "Awaiting Reschedule"
cancelledAt: string;
notificationRecipients: string[];
};

type CancelTransportPanelProps = {
tripReference: string;
onClose: () => void;
onConfirm?: (result: CancellationResult) => void;
};

const cancellationReasons: CancellationReason[] = [
"Patient not ready",
"Physician cancelled discharge",
"Testing still pending",
"Patient condition changed",
"Receiving facility unavailable",
"Insurance or authorization issue",
"Family requested cancellation",
"Duplicate request",
"Transport no longer needed",
"Sending facility handling internally",
"Other",
];

const notificationRecipients = [
"Sending Facility",
"Receiving Facility",
"Transport Provider",
"Transport Crew",
"Patient",
"Family",
"Operations Center",
];

export default function CancelTransportPanel({
tripReference,
onClose,
onConfirm,
}: CancelTransportPanelProps) {
const [selectedReason, setSelectedReason] =
useState<CancellationReason | "">("");

const [otherReason, setOtherReason] = useState("");
const [allowRestart, setAllowRestart] = useState(true);
const [confirmed, setConfirmed] = useState(false);
const [cancellationResult, setCancellationResult] =
useState<CancellationResult | null>(null);

const finalReason =
selectedReason === "Other" ? otherReason.trim() : selectedReason;

const canConfirm =
finalReason.length > 0 &&
!confirmed;

function handleConfirm() {
if (!canConfirm) {
return;
}

const result: CancellationResult = {
tripReference,
reason: finalReason,
allowRestart,
cancellationStatus: allowRestart
? "Awaiting Reschedule"
: "Cancelled",
cancelledAt: new Date().toISOString(),
notificationRecipients,
};

setCancellationResult(result);
setConfirmed(true);
onConfirm?.(result);
}

return (
<section
aria-label={`Cancel transport ${tripReference}`}
style={{
marginTop: "12px",
border: "1px solid #fecaca",
borderRadius: "16px",
background: "#fff7f7",
overflow: "hidden",
}}
>
<div
style={{
padding: "18px",
borderBottom: "1px solid #fecaca",
background: "#fef2f2",
}}
>
<p
style={{
margin: 0,
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#991b1b",
}}
>
Cancellation Workflow
</p>

<h3
style={{
margin: "6px 0 0",
fontSize: "19px",
color: "#7f1d1d",
}}
>
Cancel {tripReference}
</h3>

<p
style={{
margin: "7px 0 0",
fontSize: "13px",
lineHeight: 1.5,
color: "#991b1b",
}}
>
The transport will remain in the operational record. No information
will be deleted.
</p>
</div>

{!confirmed ? (
<div
style={{
display: "grid",
gap: "18px",
padding: "18px",
}}
>
<div>
<label
htmlFor={`cancel-reason-${tripReference}`}
style={{
display: "block",
marginBottom: "8px",
fontSize: "13px",
fontWeight: 800,
color: "#0f172a",
}}
>
Primary cancellation reason
</label>

<select
id={`cancel-reason-${tripReference}`}
value={selectedReason}
onChange={(event) =>
setSelectedReason(
event.target.value as CancellationReason | ""
)
}
style={{
width: "100%",
border: "1px solid #cbd5e1",
borderRadius: "10px",
padding: "11px 12px",
background: "#ffffff",
color: "#0f172a",
fontSize: "14px",
}}
>
<option value="">Select a reason</option>

{cancellationReasons.map((reason) => (
<option key={reason} value={reason}>
{reason}
</option>
))}
</select>
</div>

{selectedReason === "Other" && (
<div>
<label
htmlFor={`other-reason-${tripReference}`}
style={{
display: "block",
marginBottom: "8px",
fontSize: "13px",
fontWeight: 800,
color: "#0f172a",
}}
>
Describe the reason
</label>

<textarea
id={`other-reason-${tripReference}`}
value={otherReason}
onChange={(event) =>
setOtherReason(event.target.value)
}
rows={3}
style={{
width: "100%",
resize: "vertical",
border: "1px solid #cbd5e1",
borderRadius: "10px",
padding: "11px 12px",
background: "#ffffff",
color: "#0f172a",
fontSize: "14px",
fontFamily: "inherit",
boxSizing: "border-box",
}}
/>
</div>
)}

<div
style={{
border: "1px solid #e2e8f0",
borderRadius: "12px",
padding: "14px",
background: "#ffffff",
}}
>
<label
style={{
display: "flex",
alignItems: "flex-start",
gap: "10px",
cursor: "pointer",
}}
>
<input
type="checkbox"
checked={allowRestart}
onChange={(event) =>
setAllowRestart(event.target.checked)
}
style={{
marginTop: "3px",
}}
/>

<span>
<span
style={{
display: "block",
fontSize: "14px",
fontWeight: 800,
color: "#0f172a",
}}
>
Preserve for one-click restart
</span>

<span
style={{
display: "block",
marginTop: "4px",
fontSize: "12px",
lineHeight: 1.5,
color: "#64748b",
}}
>
Keep the patient, pickup, destination, transport level,
special requirements, contacts, and other AI-collected trip
details available.
</span>
</span>
</label>
</div>

<div>
<p
style={{
margin: "0 0 10px",
fontSize: "13px",
fontWeight: 800,
color: "#0f172a",
}}
>
Planned stakeholder updates
</p>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "8px",
}}
>
{notificationRecipients.map((recipient) => (
<span
key={recipient}
style={{
borderRadius: "999px",
padding: "6px 10px",
border: "1px solid #cbd5e1",
background: "#ffffff",
color: "#475569",
fontSize: "12px",
fontWeight: 700,
}}
>
{recipient}
</span>
))}
</div>
</div>

<div
style={{
display: "flex",
justifyContent: "flex-end",
flexWrap: "wrap",
gap: "10px",
}}
>
<button
type="button"
onClick={onClose}
style={{
border: "1px solid #cbd5e1",
borderRadius: "10px",
padding: "10px 14px",
background: "#ffffff",
color: "#334155",
fontSize: "13px",
fontWeight: 800,
cursor: "pointer",
}}
>
Keep Transport Active
</button>

<button
type="button"
disabled={!canConfirm}
onClick={handleConfirm}
style={{
border: 0,
borderRadius: "10px",
padding: "10px 14px",
background: canConfirm ? "#b91c1c" : "#fecaca",
color: canConfirm ? "#ffffff" : "#991b1b",
fontSize: "13px",
fontWeight: 800,
cursor: canConfirm ? "pointer" : "not-allowed",
}}
>
Confirm Cancellation
</button>
</div>
</div>
) : (
<div
style={{
padding: "18px",
}}
>
<p
style={{
margin: 0,
fontSize: "16px",
fontWeight: 800,
color: "#7f1d1d",
}}
>
Cancellation preview confirmed
</p>

<p
style={{
margin: "8px 0 0",
fontSize: "13px",
lineHeight: 1.6,
color: "#991b1b",
}}
>
Reason: {cancellationResult?.reason}
</p>

<p
style={{
margin: "5px 0 0",
fontSize: "13px",
lineHeight: 1.6,
color: "#991b1b",
}}
>
Restart preserved:{" "}
{cancellationResult?.allowRestart ? "Yes" : "No"}
</p>
<p
style={{
margin: "5px 0 0",
fontSize: "13px",
lineHeight: 1.6,
color: "#991b1b",
}}
>
Status: {cancellationResult?.cancellationStatus}
</p>

<p
style={{
margin: "5px 0 0",
fontSize: "13px",
lineHeight: 1.6,
color: "#991b1b",
}}
>
Recorded at:{" "}
{cancellationResult
? new Date(cancellationResult.cancelledAt).toLocaleString()
: "Pending"}
</p>
<p
style={{
margin: "12px 0 0",
fontSize: "12px",
lineHeight: 1.5,
color: "#64748b",
}}
>
Preview only. No database update or stakeholder message has been
sent.
</p>

<button
type="button"
onClick={onClose}
style={{
marginTop: "14px",
border: "1px solid #cbd5e1",
borderRadius: "10px",
padding: "10px 14px",
background: "#ffffff",
color: "#334155",
fontSize: "13px",
fontWeight: 800,
cursor: "pointer",
}}
>
Close Preview
</button>
</div>
)}
</section>
);
}

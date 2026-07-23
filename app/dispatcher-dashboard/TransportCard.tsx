"use client"

import { useState } from "react"

import TransportActionPanel from "./TransportActionPanel"
import type { CancellationResult } from "./CancelTransportPanel"
export type TransportCardData = {
tripReference: string;
patientName: string;
sendingFacility: string;
receivingFacility: string;
status: string;
etaLabel: string;
healthScore: number;
healthStatus: "Healthy" | "Attention" | "Critical" | "Completed"
waitingOn: string;
aiSummary: string;
notificationRecipients: string[];
gpsStatus: "Online" | "Offline" | "Unavailable"
delayMinutes?: number;
cancellationStatus?:
| "Active"
| "Cancelled"
| "Awaiting Reschedule"
| "Completed Internally"
| "Superseded"
};

type TransportCardProps = {
transport: TransportCardData;
};

function getStatusSymbol(
healthStatus: TransportCardData["healthStatus"]
): string {
switch (healthStatus) {
case "Critical":
return "🔴"
case "Attention":
return "🟠"
case "Completed":
return "🔵"
case "Healthy":
default:
return "🟢"
}
}

function getGpsLabel(
gpsStatus: TransportCardData["gpsStatus"]
): string {
switch (gpsStatus) {
case "Online":
return "GPS Online"
case "Offline":
return "GPS Offline"
case "Unavailable":
default:
return "GPS Unavailable"
}
}

export default function TransportCard({
transport,
}: TransportCardProps) {
const [cancellationResult, setCancellationResult] =
useState<CancellationResult | null>(null);

const currentCancellationStatus =
cancellationResult?.cancellationStatus ??
transport.cancellationStatus ??
"Active"
const isCancelled =
currentCancellationStatus === "Cancelled" ||
currentCancellationStatus === "Awaiting Reschedule" ||
currentCancellationStatus === "Completed Internally" ||
currentCancellationStatus === "Superseded"

return (
<article
style={{
background: "#ffffff",
border: "1px solid #e2e8f0",
borderRadius: "20px",
overflow: "hidden",
boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
}}
>
<div
style={{
padding: "20px",
borderBottom: "1px solid #e2e8f0",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
gap: "16px",
}}
>
<div>
<div
style={{
display: "flex",
alignItems: "center",
gap: "8px",
marginBottom: "8px",
}}
>
<span aria-hidden="true">
{getStatusSymbol(transport.healthStatus)}
</span>

<span
style={{
fontSize: "13px",
fontWeight: 800,
color: "#334155",
letterSpacing: "0.04em",
}}
>
{transport.tripReference}
</span>
</div>

<h3
style={{
margin: 0,
fontSize: "21px",
color: "#0f172a",
}}
>
{transport.patientName}
</h3>

<p
style={{
margin: "7px 0 0",
fontSize: "14px",
color: "#64748b",
}}
>
{transport.sendingFacility}
{" → "}
{transport.receivingFacility}
</p>
</div>

<div
style={{
borderRadius: "999px",
padding: "8px 12px",
background: isCancelled ? "#fef2f2" : "#f1f5f9",
color: isCancelled ? "#991b1b" : "#334155",
fontSize: "12px",
fontWeight: 800,
whiteSpace: "nowrap",
}}
>
{isCancelled
? currentCancellationStatus
: transport.healthStatus}
</div>
</div>

<div
style={{
marginTop: "16px",
padding: "12px 14px",
borderRadius: "12px",
background: isCancelled ? "#fff7ed" : "#f8fafc", 
color: isCancelled ? "#9a3412" : "#334155",
fontSize: "14px",
fontWeight: 700,
}}
>
{isCancelled
? `Transport status: ${currentCancellationStatus}`
: transport.status} 
</div>
</div>
{cancellationResult && (
<div
style={{
marginTop: "10px",
padding: "12px 14px",
borderRadius: "12px",
border: "1px solid #fecaca",
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
Cancellation Reason
</p>

<p
style={{
margin: "6px 0 0",
fontSize: "14px",
lineHeight: 1.5,
color: "#7f1d1d",
}}
>
{cancellationResult.reason}
</p>
</div>
)}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
gap: "12px",
padding: "18px 20px",
borderBottom: "1px solid #e2e8f0",
}}
>
<div>
<p
style={{
margin: 0,
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#94a3b8",
}}
>
ETA
</p>

<p
style={{
margin: "6px 0 0",
fontSize: "18px",
fontWeight: 800,
color: "#0f172a",
}}
>
{transport.etaLabel}
</p>
</div>

<div>
<p
style={{
margin: 0,
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#94a3b8",
}}
>
Health
</p>

<p
style={{
margin: "6px 0 0",
fontSize: "18px",
fontWeight: 800,
color: "#0f172a",
}}
>
{transport.healthScore}%
</p>
</div>

<div>
<p
style={{
margin: 0,
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#94a3b8",
}}
>
Waiting On
</p>

<p
style={{
margin: "6px 0 0",
fontSize: "15px",
fontWeight: 800,
color: "#0f172a",
}}
>
{transport.waitingOn}
</p>
</div>
</div>

<div
style={{
padding: "18px 20px",
borderBottom: "1px solid #e2e8f0",
}}
>
<p
style={{
margin: 0,
fontSize: "11px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#94a3b8",
}}
>
AI Summary
</p>

<p
style={{
margin: "8px 0 0",
fontSize: "14px",
lineHeight: 1.6,
color: "#334155",
}}
>
{transport.aiSummary}
</p>

{transport.delayMinutes !== undefined &&
transport.delayMinutes > 0 && (
<p
style={{
margin: "10px 0 0",
fontSize: "13px",
fontWeight: 800,
color: "#b45309",
}}
>
Estimated delay: +{transport.delayMinutes} minutes
</p>
)}
</div>

<div
style={{
padding: "16px 20px",
}}
>
<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "8px",
marginBottom: "14px",
}}
>
{transport.notificationRecipients.map((recipient) => (
<span
key={recipient}
style={{
borderRadius: "999px",
padding: "6px 10px",
background: "#f8fafc",
border: "1px solid #cbd5e1",
color: "#475569",
fontSize: "12px",
fontWeight: 700,
}}
>
{recipient}
</span>
))}
</div>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "10px",
justifyContent: "space-between",
alignItems: "center",
}}
>
<span
style={{
fontSize: "12px",
fontWeight: 800,
color:
transport.gpsStatus === "Online"
? "#166534"
: "#991b1b",
}}
>
{getGpsLabel(transport.gpsStatus)}
</span>

<button
type="button"
style={{
border: "1px solid #cbd5e1",
borderRadius: "10px",
padding: "9px 13px",
background: "#ffffff",
color: "#0f172a",
fontSize: "13px",
fontWeight: 800,
cursor: "pointer",
}}
>
View Details
</button>
</div>
</div>
<TransportActionPanel
tripReference={transport.tripReference}
cancellationStatus={currentCancellationStatus}
onCancellationConfirmed={(result) => {
setCancellationResult(result);
}}
onRestartRequested={() => {
setCancellationResult(null);
}}
/>
</article>
);
}

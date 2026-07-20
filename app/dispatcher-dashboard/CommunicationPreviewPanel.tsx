import type {
NotificationEngineResult,
NotificationJob,
} from "./services/notificationEngine"

type CommunicationPreviewPanelProps = {
preview: NotificationEngineResult;
};

function formatChannel(channel: string): string {
switch (channel) {
case "sms":
return "SMS"
case "email":
return "Email"
case "push":
return "Push"
case "voice":
return "Voice"
case "dashboard":
return "Dashboard"
default:
return channel;
}
}

function getPriorityLabel(
priority: NotificationJob["priority"]
): string {
switch (priority) {
case "critical":
return "Critical"
case "high":
return "High"
case "normal":
return "Normal"
case "low":
return "Low"
default:
return priority;
}
}

export default function CommunicationPreviewPanel({
preview,
}: CommunicationPreviewPanelProps) {
return (
<section
style={{
background: "#ffffff",
border: "1px solid #e5e7eb",
borderRadius: "18px",
padding: "22px",
boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
}}
>
<div
style={{
display: "flex",
alignItems: "flex-start",
justifyContent: "space-between",
gap: "16px",
marginBottom: "18px",
}}
>
<div>
<p
style={{
margin: 0,
fontSize: "12px",
fontWeight: 700,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#64748b",
}}
>
Communication Preview
</p>

<h2
style={{
margin: "6px 0 0",
fontSize: "22px",
lineHeight: 1.2,
color: "#0f172a",
}}
>
Planned Stakeholder Updates
</h2>

<p
style={{
margin: "8px 0 0",
fontSize: "14px",
lineHeight: 1.5,
color: "#64748b",
}}
>
Preview only. No messages are being sent.
</p>
</div>

<div
style={{
background: "#f1f5f9",
borderRadius: "999px",
padding: "8px 12px",
fontSize: "13px",
fontWeight: 700,
color: "#334155",
whiteSpace: "nowrap",
}}
>
{preview.jobs.length} planned
</div>
</div>

<div
style={{
display: "grid",
gap: "14px",
}}
>
{preview.jobs.map((job, index) => (
<article
key={`${job.recipient}-${index}`}
style={{
border: "1px solid #e2e8f0",
borderRadius: "14px",
padding: "16px",
background: "#f8fafc",
}}
>
<div
style={{
display: "flex",
alignItems: "flex-start",
justifyContent: "space-between",
gap: "12px",
}}
>
<div>
<h3
style={{
margin: 0,
fontSize: "16px",
color: "#0f172a",
}}
>
{job.recipient}
</h3>

<p
style={{
margin: "4px 0 0",
fontSize: "13px",
color: "#64748b",
}}
>
{job.title}
</p>
</div>

<span
style={{
borderRadius: "999px",
padding: "6px 10px",
background: "#e2e8f0",
color: "#334155",
fontSize: "12px",
fontWeight: 700,
whiteSpace: "nowrap",
}}
>
{getPriorityLabel(job.priority)}
</span>
</div>

<p
style={{
margin: "14px 0",
fontSize: "14px",
lineHeight: 1.6,
color: "#334155",
}}
>
{job.message}
</p>

<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "8px",
}}
>
{job.channels.map((channel) => (
<span
key={channel}
style={{
borderRadius: "999px",
padding: "6px 10px",
background: "#ffffff",
border: "1px solid #cbd5e1",
color: "#475569",
fontSize: "12px",
fontWeight: 600,
}}
>
{formatChannel(channel)}
</span>
))}

{job.requiresAcknowledgement && (
<span
style={{
borderRadius: "999px",
padding: "6px 10px",
background: "#fff7ed",
border: "1px solid #fed7aa",
color: "#9a3412",
fontSize: "12px",
fontWeight: 700,
}}
>
Acknowledgement required
</span>
)}

{job.escalateAfterMinutes !== undefined && (
<span
style={{
borderRadius: "999px",
padding: "6px 10px",
background: "#fef2f2",
border: "1px solid #fecaca",
color: "#991b1b",
fontSize: "12px",
fontWeight: 700,
}}
>
Escalate after {job.escalateAfterMinutes} min
</span>
)}
</div>
</article>
))}
</div>
</section>
);
}

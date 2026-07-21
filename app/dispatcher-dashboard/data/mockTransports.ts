import type { TransportCardData } from "../TransportCard"

export const mockTransports: TransportCardData[] = [
{
tripReference: "AW-24001",
patientName: "John Smith",
sendingFacility: "BronxCare Hospital",
receivingFacility: "Montefiore Medical Center",
status: "Crew En Route",
etaLabel: "8 min",
healthScore: 96,
healthStatus: "Healthy",
waitingOn: "Nobody",
aiSummary:
"Transport is progressing normally with no operational concerns detected.",
notificationRecipients: [
"Patient",
"Family",
"Sending Facility",
"Receiving Facility",
"Transport Provider",
],
gpsStatus: "Online",
},

{
tripReference: "AW-24002",
patientName: "Maria Lopez",
sendingFacility: "Lincoln Hospital",
receivingFacility: "NYU Langone",
status: "Waiting on Sending Facility",
etaLabel: "Delayed",
healthScore: 71,
healthStatus: "Attention",
waitingOn: "Sending Facility",
aiSummary:
"Patient discharge paperwork remains incomplete. Recommend contacting the discharge nurse.",
notificationRecipients: [
"Sending Facility",
"Receiving Facility",
"Transport Provider",
"Patient",
"Family",
],
gpsStatus: "Unavailable",
delayMinutes: 12,
},

{
tripReference: "AW-24003",
patientName: "Robert Taylor",
sendingFacility: "Jacobi Medical Center",
receivingFacility: "NewYork-Presbyterian",
status: "No Crew Assigned",
etaLabel: "Unknown",
healthScore: 28,
healthStatus: "Critical",
waitingOn: "Transport Provider",
aiSummary:
"No transport crew has accepted this request. Escalation is recommended.",
notificationRecipients: [
"Operations Center",
"Sending Facility",
"Receiving Facility",
"Transport Provider",
],
gpsStatus: "Offline",
delayMinutes: 25,
},
];

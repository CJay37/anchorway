import TransportCard, {
TransportCardData,
} from "./TransportCard"

type Props = {
transports: TransportCardData[];
};

export default function TransportCommandBoard({
transports,
}: Props) {
return (
<section
style={{
marginTop: "32px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "18px",
}}
>
<div>
<p
style={{
margin: 0,
fontSize: "12px",
fontWeight: 800,
letterSpacing: "0.08em",
textTransform: "uppercase",
color: "#64748b",
}}
>
Live Transport Operations
</p>

<h2
style={{
margin: "6px 0 0",
fontSize: "30px",
color: "#0f172a",
}}
>
Active Transport Command Board
</h2>
</div>

<div
style={{
background: "#f1f5f9",
borderRadius: "999px",
padding: "10px 16px",
fontWeight: 800,
color: "#334155",
}}
>
{transports.length} Active
</div>
</div>

<div
style={{
display: "grid",
gap: "18px",
}}
>
{transports.map((transport) => (
<TransportCard
key={transport.tripReference}
transport={transport}
/>
))}
</div>
</section>
);
}

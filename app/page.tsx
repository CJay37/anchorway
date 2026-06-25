import Link from 'next/link';
import { useParams } from 'next/navigation';

const features = [
  ['🤖','AI Intake','Phone-based intake that gathers transport details and reduces repetitive coordination calls.'],
  ['🔁','Recurring Scheduling','Dialysis, therapy, and standing orders can be organized without re-entering the same information.'],
  ['🚑','Live Tracking','Patients, families, providers, and facilities can see the same transport progress in real time.'],
  ['🏥','Facility Visibility','Hospitals and care teams can view ETA and transport status without calling dispatch.'],
  ['📋','Dispatcher Workflow','Transport coordinators can update trip status and keep every party informed.'],
  ['💬','Family Updates','Simple, secure status updates designed to reduce confusion and unnecessary phone calls.']
];

export default function Home(){
  return <main>
    <nav className="nav">
      <Link href="/" className="brand"><span className="logo">⚓</span>AnchorWay</Link>
      <div className="navlinks"><Link href="/track/BW-3608">Tracking</Link><Link href="/facility-dashboard">Facilities</Link><Link href="/dispatcher-dashboard">Dispatch</Link><Link href="/contact">Contact</Link></div>
      <Link href="/contact" className="btn secondary">Request Demo</Link>
    </nav>
    <section className="hero">
      <div className="heroGrid">
        <div>
          <div className="eyebrow">AI-powered healthcare transport coordination</div>
          <h1>Medical transportation coordination made clear, simple, and connected.</h1>
          <p className="lead">AnchorWay helps hospitals, healthcare facilities, transport providers, patients, and families stay aligned from intake to arrival.</p>
          <div className="actions">
            <Link className="btn" href="/track/BW-3608">Track a Transport</Link>
            <Link className="btn secondary" href="/facility-dashboard">Provider Login</Link>
            <Link className="btn secondary" href="/dispatcher-dashboard">Dispatcher Login</Link>
          </div>
        </div>
        <div className="previewCard">
          <span className="statusPill">Live Transport Tracker</span>
          <h3>🚑 Driver En Route</h3>
          <p>Trip Reference: BW-3608</p>
          <div className="metricGrid">
            <div className="metric"><span>ETA</span><strong>12 min</strong></div>
            <div className="metric"><span>Status</span><strong>Live</strong></div>
          </div>
          <div className="timeline">
            <div className="step done">✓ Requested</div>
            <div className="step done">✓ Confirmed</div>
            <div className="step done">✓ Driver Assigned</div>
            <div className="step active">🟢 Driver En Route</div>
            <div className="step">○ Arrived at Pickup</div>
            <div className="step">○ Patient Onboard</div>
            <div className="step">○ Completed</div>
          </div>
        </div>
      </div>
    </section>
    <section className="section">
      <h2>Built for the transport moments where communication breaks down.</h2>
      <p>AnchorWay brings intake, live tracking, and facility visibility into one clean workflow.</p>
      <div className="cards">{features.map(([i,t,d])=><div className="card" key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p></div>)}</div>
    </section>
    <section className="section">
      <h2>One link. One shared source of truth.</h2>
      <p>A patient, family member, nurse, case manager, dispatcher, or transport provider can open the same secure tracking link and instantly understand where the transport stands.</p>
      <div className="cards">
        <div className="card"><h3>For facilities</h3><p>Reduce repeated calls and give care teams a clear view of active transport progress.</p></div>
        <div className="card"><h3>For transport providers</h3><p>Keep status updates organized and visible without creating extra dispatcher workload.</p></div>
        <div className="card"><h3>For patients and families</h3><p>Provide simple, reassuring updates without showing unnecessary private health information.</p></div>
      </div>
    </section>
    <footer className="footer"><strong>AnchorWay</strong><span>Healthcare transport coordination, tracking, and visibility.</span></footer>
  </main>
}

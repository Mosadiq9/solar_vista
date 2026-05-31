import { Settings, ClipboardList, PenTool, Wrench, Zap } from 'lucide-react';
export default function Process() {
  return (
    <section id="process" className="process-section" aria-label="How it works">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><Settings></Settings> How It Works</span>
          <h2>Your Path to <span>Solar Energy</span></h2>
          <p className="section-subtitle">Going solar is simple. Our proven four-step process takes you from initial consultation to generating clean energy in as little as two weeks.</p>
        </div>

        <div className="process-timeline">
          <div className="process-line" aria-hidden="true"></div>

          <div className="process-step" data-step="1" data-animate>
            <div className="step-number">01</div>
            <div className="step-icon-wrap"><ClipboardList></ClipboardList></div>
            <h3 className="step-title">Free Consultation</h3>
            <p className="step-desc">We analyze your energy needs, roof orientation, and local incentives to craft a personalized solar strategy at zero cost to you.</p>
          </div>

          <div className="process-step" data-step="2" data-animate>
            <div className="step-number">02</div>
            <div className="step-icon-wrap"><PenTool></PenTool></div>
            <h3 className="step-title">Custom Design</h3>
            <p className="step-desc">Our engineers create a precision 3D model of your installation, optimizing panel placement for maximum energy production year-round.</p>
          </div>

          <div className="process-step" data-step="3" data-animate>
            <div className="step-number">03</div>
            <div className="step-icon-wrap"><Wrench></Wrench></div>
            <h3 className="step-title">Expert Installation</h3>
            <p className="step-desc">Our NABCEP-certified crews handle every detail — permits, mounting, wiring, and inspection — with minimal disruption to your day.</p>
          </div>

          <div className="process-step" data-step="4" data-animate>
            <div className="step-number">04</div>
            <div className="step-icon-wrap"><Zap></Zap></div>
            <h3 className="step-title">Power On</h3>
            <p className="step-desc">Flip the switch and watch your meter spin backward. Monitor real-time savings from day one through our smart energy dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

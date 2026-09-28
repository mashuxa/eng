export const metadata = { title: 'Topics · Eng' };

export default function TopicsPage() {
  return (
    <section>
      <h2>Topics</h2>
      <p className="sub">All business domains and speaking situations covered</p>

      <div className="group">
        <h3>A · Real domains (from CV)</h3>
        <div className="chips">
          <span className="chip">B2C e-commerce / storefronts</span>
          <span className="chip">B2B / bulk orders</span>
          <span className="chip">Dealer & partner portals</span>
          <span className="chip">Referral / influencer / affiliate</span>
          <span className="chip">Marketplace</span>
          <span className="chip">Retail & fashion</span>
          <span className="chip">POS & restaurant business</span>
          <span className="chip">Events & ticketing</span>
          <span className="chip">Logistics & delivery</span>
          <span className="chip">Fintech</span>
          <span className="chip">Payments</span>
          <span className="chip">Compliance & document verification</span>
          <span className="chip">SaaS / multi-portal</span>
          <span className="chip">Subscriptions & billing</span>
          <span className="chip">EdTech / e-learning</span>
          <span className="chip">Games & entertainment</span>
          <span className="chip">Admin panels & operations</span>
          <span className="chip">Customer support & operations</span>
          <span className="chip">Analytics & monitoring</span>
          <span className="chip">UI/UX & design systems</span>
        </div>
      </div>

      <div className="group">
        <h3>B · Named, not in CV</h3>
        <div className="chips">
          <span className="chip">Banking</span>
          <span className="chip">Loans & credit</span>
          <span className="chip">Mortgages</span>
          <span className="chip">Gambling / iGaming</span>
        </div>
      </div>

      <div className="group">
        <h3>C · Training domains</h3>
        <div className="chips">
          <span className="chip">Insurance</span>
          <span className="chip">Healthcare</span>
          <span className="chip">Telemedicine</span>
          <span className="chip">Real estate / PropTech</span>
          <span className="chip">Travel & hospitality</span>
          <span className="chip">Booking / reservations</span>
          <span className="chip">Food delivery</span>
          <span className="chip">HR / recruitment</span>
          <span className="chip">LegalTech</span>
          <span className="chip">Media / content platforms</span>
          <span className="chip">Social networks</span>
          <span className="chip">Marketing & advertising</span>
        </div>
      </div>

      <div className="group">
        <h3>D · Technical topics</h3>
        <div className="chips">
          <span className="chip">Architecture decisions</span>
          <span className="chip">Scalability</span>
          <span className="chip">Performance (SSR, cache, SEO)</span>
          <span className="chip">Security</span>
          <span className="chip">Auth & authorization</span>
          <span className="chip">Third-party integrations</span>
          <span className="chip">Data & privacy (GDPR)</span>
          <span className="chip">Compliance & regulations</span>
          <span className="chip">Real-time & notifications</span>
          <span className="chip">CMS & headless commerce</span>
          <span className="chip">Backend & infrastructure</span>
          <span className="chip">Technical limitations</span>
          <span className="chip">Migration & legacy</span>
          <span className="chip">Launch & release</span>
          <span className="chip">Maintenance & support</span>
          <span className="chip">Incidents & outages</span>
          <span className="chip">Testing, quality & tech debt</span>
        </div>
      </div>

      <div className="group">
        <h3>E · Business situations & client communication</h3>
        <div className="chips">
          <span className="chip">Requirements discovery</span>
          <span className="chip">Product requirements / user needs</span>
          <span className="chip">Scope & scope creep</span>
          <span className="chip">Changing requirements</span>
          <span className="chip">MVP / roadmap / strategy</span>
          <span className="chip">Prioritization</span>
          <span className="chip">Estimation</span>
          <span className="chip">Timeline & deadlines</span>
          <span className="chip">Budget, costs, ROI</span>
          <span className="chip">Resources & team</span>
          <span className="chip">Dependencies</span>
          <span className="chip">Risks & mitigation</span>
          <span className="chip">Business priorities & goals</span>
          <span className="chip">Market / competition / business model</span>
          <span className="chip">Trade-offs</span>
          <span className="chip">Comparing alternatives</span>
          <span className="chip">Making recommendations</span>
          <span className="chip">Presenting solutions</span>
          <span className="chip">Explaining tech to non-tech people</span>
          <span className="chip">Stakeholder management</span>
          <span className="chip">Managing client expectations</span>
          <span className="chip">Negotiation</span>
          <span className="chip">Handling objections</span>
          <span className="chip">Polite disagreement / pushback</span>
          <span className="chip">Saying no professionally</span>
        </div>
      </div>

      <div className="group">
        <h3>F · Team, process & about yourself</h3>
        <div className="chips">
          <span className="chip">Standup / status update</span>
          <span className="chip">Code review & feedback</span>
          <span className="chip">Demo / retro / Jira</span>
          <span className="chip">Discovery call</span>
          <span className="chip">Tell me about yourself / career gap</span>
          <span className="chip">Interview & expectations</span>
          <span className="chip">Handling unexpected questions</span>
          <span className="chip">Clarification & paraphrasing</span>
        </div>
      </div>

      <div className="group">
        <h3>G · Everyday life</h3>
        <div className="chips">
          <span className="chip">Small talk</span>
          <span className="chip">Travel</span>
          <span className="chip">Restaurants & shopping</span>
          <span className="chip">Neighbors</span>
          <span className="chip">Doctors & services</span>
          <span className="chip">Plans</span>
          <span className="chip">Storytelling</span>
          <span className="chip">Emotions & opinions</span>
        </div>
      </div>

      <div className="group">
        <h3>H · Random topics</h3>
        <div className="chips">
          <span className="chip">Movies</span>
          <span className="chip">Books</span>
          <span className="chip">Technology</span>
          <span className="chip">Society</span>
          <span className="chip">Hobbies</span>
          <span className="chip">Parenting</span>
          <span className="chip">Money</span>
          <span className="chip">News</span>
          <span className="chip">Hypotheticals</span>
        </div>
      </div>
    </section>
  );
}

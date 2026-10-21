import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = 'October 21, 2026';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service | AximoIX';
  }, []);

  return (
    <div className="legal-page">
      <main className="legal-content">
        <a href="/" className="legal-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </a>

        <h1>Terms of Service</h1>
        <p className="legal-subtitle">Last updated: {LAST_UPDATED}</p>

        <p>
          Thanks for visiting AximoIX. These terms explain the rules for using our website and working with us. We’ve tried to keep them as plain as we can. When we say “we”, “us” or “AximoIX”, we mean AximoIX. When we say “you”, we mean you, or the business you’re acting for.
        </p>
        <p>
          By using our website or our services, you’re agreeing to these terms. If you don’t agree with them, please don’t use the site or our services. These terms apply in the United States and in Zimbabwe.
        </p>

        <h2>1. Who can use our services</h2>
        <p>
          You need to be at least 18 (or the age of adulthood where you live) and able to enter into a contract. If you’re using our services for a company or organisation, you’re confirming that you’re allowed to agree to these terms on its behalf.
        </p>

        <h2>2. What we do</h2>
        <p>AximoIX is a technology company. Our work includes:</p>
        <ul>
          <li>ICT solutions, such as networks, cloud setup and managed IT</li>
          <li>AI and machine learning work</li>
          <li>Advertising and digital marketing</li>
          <li>Custom software, web and mobile development</li>
          <li>Financial technology (FinTech), such as payments and digital banking</li>
        </ul>
        <p>
          For paid work, we agree the details with you separately, usually in a proposal, statement of work or service agreement. That document sets out what we’ll deliver, when, and what it costs. If it says something different from these terms, the signed document wins.
        </p>

        <h2>3. Accounts</h2>
        <p>
          If we give you a login to any of our systems, keep your password private and let us know straight away if you think someone else has used your account. You’re responsible for what happens under your account. We can suspend an account that’s being used to break these terms.
        </p>

        <h2>4. Using our website and services fairly</h2>
        <p>Please don’t use our website or services to:</p>
        <ul>
          <li>Break the law in the United States, Zimbabwe or anywhere else</li>
          <li>Infringe anyone else’s copyright, trademarks or other rights</li>
          <li>Send viruses, malware or any other harmful code</li>
          <li>Slow down, overload, damage or interfere with our website, servers or networks</li>
          <li>Commit fraud, mislead people or pretend to be someone you’re not</li>
          <li>Collect other people’s personal information without their permission</li>
        </ul>

        <h2>5. Who owns what</h2>
        <h3>5.1 Our work</h3>
        <p>
          Everything on this website and everything we build, including our software, source code, designs, text, graphics, logos and the AximoIX name, belongs to AximoIX or the people who licensed it to us. It’s protected by copyright, trademark and other intellectual property laws in the United States (including the U.S. Copyright Act and the Lanham Act) and in Zimbabwe (including the Copyright and Neighbouring Rights Act [Chapter 26:05] and the Trade Marks Act [Chapter 26:04]).
        </p>

        <h3>5.2 Work we build for clients</h3>
        <p>
          Unless your agreement with us says otherwise, once you’ve paid in full you own the work we created specifically for you. We keep ownership of our own tools, code libraries, frameworks and know-how that we bring to a project or improve along the way. Where those are part of what we deliver, you get a licence to use them as part of that project.
        </p>

        <h3>5.3 Ideas and feedback</h3>
        <p>
          If you send us suggestions or feedback, we’re free to use them to improve what we do. We won’t owe you anything for that.
        </p>

        <h2>6. Copying our software and security testing</h2>
        <p>
          We put a lot of work into what we build, and we take its protection seriously. This section applies to our website, our APIs and backend systems, and any software, app or platform we make, whether it’s ours or one we built and run for a client.
        </p>

        <h3>6.1 Please don’t copy our software</h3>
        <p>Unless we’ve given you permission in writing first, you may not:</p>
        <ul>
          <li>Copy, clone, mirror or reproduce our software, source code, designs or website, in whole or in part</li>
          <li>Reverse engineer, decompile, disassemble or try to work out the source code of anything we’ve built, except where the law specifically allows it</li>
          <li>Build a product or service that copies ours, or use our work to compete with us</li>
          <li>Sell, rent, sublicense, share or redistribute our software or code</li>
          <li>Remove or change any copyright, trademark or ownership notices</li>
          <li>Scrape or bulk-download content from our website or APIs with bots, crawlers or other automated tools (normal search engine indexing is fine)</li>
        </ul>

        <h3>6.2 Ask us before you test our security</h3>
        <p>
          You must not try to hack, break into or test the security of our systems unless you’ve told us first and we’ve agreed in writing. That includes:
        </p>
        <ul>
          <li>Penetration testing, vulnerability scanning or probing our website, APIs, servers or networks</li>
          <li>Trying to get around logins, access controls, rate limits or any other security measure</li>
          <li>Trying to view, change or delete data that isn’t yours</li>
          <li>Load testing, stress testing or anything else that could slow down or take down our services</li>
          <li>Social engineering or phishing our staff, partners or clients</li>
        </ul>
        <p>
          If you want to test our security, email <a href="mailto:hello@aximoix.com">hello@aximoix.com</a> with “Security testing request” in the subject line. Tell us who you are, what you want to test and how. We’ll reply, and if we agree, we’ll set the scope and timing with you in writing. As long as you stay within what we agreed, we’ll treat your testing as authorised and won’t take legal action against you for it.
        </p>

        <h3>6.3 Found a problem? Tell us first</h3>
        <p>
          If you come across a security weakness by accident, please don’t use it, share it or make it public. Email us at <a href="mailto:hello@aximoix.com">hello@aximoix.com</a> with “Security report” in the subject, tell us what you found and how to reproduce it, and give us a reasonable amount of time to fix it (we ask for 90 days) before telling anyone else. Don’t look at, keep or change anyone’s data while you’re checking. We’re grateful to people who report problems responsibly, and we’ll keep you updated as we fix them.
        </p>

        <h3>6.4 What happens if these rules are broken</h3>
        <p>
          Copying our software or testing our security without permission isn’t allowed and counts as unauthorised access. If it happens, we may block your access, keep records of what happened, report it to the police or other authorities, and take legal action. That includes claims under the U.S. Computer Fraud and Abuse Act, the Digital Millennium Copyright Act, Zimbabwe’s Cyber and Data Protection Act [Chapter 12:07] and the copyright laws listed above. We may also ask for compensation for any harm caused.
        </p>

        <h2>7. Payment</h2>
        <ul>
          <li>Our fees are whatever’s in your proposal, statement of work or invoice</li>
          <li>Invoices are due within the time shown on them, usually 30 days unless we’ve agreed otherwise</li>
          <li>Prices don’t include taxes, which you’re responsible for</li>
          <li>Late payments may be charged interest of 1.5% per month, or the highest rate the law allows if that’s lower</li>
          <li>If payments are overdue, we may pause work until the account is up to date</li>
        </ul>

        <h2>8. Keeping things confidential</h2>
        <p>
          When we work together, we’ll both keep each other’s confidential information private. This doesn’t cover information that’s already public (through no fault of the person receiving it), that the receiver already had, that they came up with on their own, or that the law requires them to share. This promise lasts for three years after our work together ends.
        </p>

        <h2>9. Our promises and their limits</h2>
        <p>
          We’ll do our work carefully and professionally, to the standard you’d expect from a good technology company. If something we deliver doesn’t meet that standard, tell us in writing within 30 days of delivery and we’ll fix it at no extra cost. That is your main remedy.
        </p>
        <p>
          <strong>Apart from that promise, our website and services are provided “as is” and “as available”. We don’t make any other promises, whether express, implied or required by statute, including that they’ll be fit for a particular purpose, free of errors, always available or completely secure.</strong>
        </p>

        <h2>10. Limits on our liability</h2>
        <p>
          <strong>As far as the law allows, AximoIX and its directors, staff, agents and affiliates won’t be liable for indirect, incidental, special, consequential or punitive losses, or for lost profits, revenue, data, business opportunities or goodwill.</strong>
        </p>
        <p>
          <strong>Our total liability to you under these terms won’t be more than the greater of: what you paid us in the 12 months before the problem happened, or US$1,000.</strong>
        </p>
        <p>
          None of this limits liability that the law doesn’t allow us to limit, such as liability for fraud, gross negligence, deliberate wrongdoing, or death or personal injury caused by negligence.
        </p>

        <h2>11. If you cause us a loss</h2>
        <p>
          If someone makes a claim against us because of how you used our services, because you broke these terms or the law, or because you infringed someone else’s rights, you agree to cover our reasonable costs and losses, including reasonable legal fees.
        </p>

        <h2>12. Ending things</h2>
        <ul>
          <li>You can stop using our services at any time by letting us know in writing</li>
          <li>We can suspend or end your access with reasonable notice, or straight away if you break section 4 or section 6</li>
          <li>Ending a project is covered by the agreement for that project</li>
          <li>Sections 5, 6, 8, 9, 10, 11 and 14 still apply after things end</li>
        </ul>

        <h2>13. Things outside our control</h2>
        <p>
          Neither of us is responsible for delays or failures caused by things outside our reasonable control, such as natural disasters, war, pandemics, government action, power cuts or internet outages.
        </p>

        <h2>14. Which laws apply and how we sort out disagreements</h2>
        <p>
          If something goes wrong, we’d much rather talk it through. Before going to court or arbitration, we both agree to try to settle any disagreement in good faith for at least 30 days.
        </p>
        <h3>14.1 If you’re in the United States (or anywhere other than Zimbabwe)</h3>
        <p>
          These terms are governed by the laws of the State of Georgia, USA, regardless of conflict-of-law rules. Disputes will be handled by the state and federal courts in DeKalb County, Georgia.
        </p>
        <h3>14.2 If you’re in Zimbabwe</h3>
        <p>
          These terms are governed by the laws of Zimbabwe. Disputes will go to arbitration under the rules of the Commercial Arbitration Centre in Harare, or to the courts of Zimbabwe. Nothing in these terms takes away your rights under the Consumer Protection Act [Chapter 14:44] or the Cyber and Data Protection Act [Chapter 12:07].
        </p>

        <h2>15. Links to other websites</h2>
        <p>
          Our website may link to other sites. We don’t control them and aren’t responsible for what’s on them. A link doesn’t mean we endorse a site, and their own terms and privacy policies apply when you use them.
        </p>

        <h2>16. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. When we do, we’ll post the new version here and change the date at the top. If you keep using our website or services after that, you’re accepting the updated terms.
        </p>

        <h2>17. The legal bits</h2>
        <p>
          If a court decides that part of these terms can’t be enforced, we’ll change that part as little as possible to make it enforceable (or remove it if we can’t), and the rest stays in place. These terms, together with any signed agreement with us and our <a href="/privacy/">Privacy Policy</a>, are the full agreement between us about these topics.
        </p>

        <h2>18. Get in touch</h2>
        <p>Questions about these terms? We’re happy to help.</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:hello@aximoix.com">hello@aximoix.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+14705064390">+1 470 506 4390</a></li>
          <li><strong>Address:</strong> 3rd Floor, 120 West Trinity Place, Decatur, GA 30030, United States</li>
        </ul>
      </main>
    </div>
  );
}

export default TermsOfService;

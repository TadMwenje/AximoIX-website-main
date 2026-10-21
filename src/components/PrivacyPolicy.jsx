import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = 'October 21, 2026';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy | AximoIX';
  }, []);

  return (
    <div className="legal-page">
      <main className="legal-content">
        <a href="/" className="legal-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </a>

        <h1>Privacy Policy</h1>
        <p className="legal-subtitle">Last updated: {LAST_UPDATED}</p>

        <p>
          Your privacy matters to us. This policy explains what information AximoIX collects when you visit our website or work with us, what we do with it, who we share it with, and the choices you have. We’ve written it in plain language so it’s easy to follow. If anything is unclear, just ask us.
        </p>
        <p>
          We operate in the United States and Zimbabwe, so this policy is written to meet the privacy laws of both, including U.S. state privacy laws such as the California Consumer Privacy Act (CCPA) and Zimbabwe’s Cyber and Data Protection Act [Chapter 12:07].
        </p>

        <h2>1. What we collect</h2>

        <h3>1.1 Information you give us</h3>
        <p>Most of what we know about you comes from you directly, for example when you fill in our contact form, email us or hire us. This can include:</p>
        <ul>
          <li><strong>Contact details:</strong> your name, email address, phone number and address</li>
          <li><strong>Work details:</strong> your job title, company and industry</li>
          <li><strong>Your messages:</strong> what you write to us through the contact form, email or other channels, including which service you’re interested in</li>
          <li><strong>Project and billing details:</strong> if we work together, the information we need to deliver the project and invoice you. Card payments are handled by our payment providers, and we don’t store your card number.</li>
        </ul>

        <h3>1.2 Information collected automatically</h3>
        <p>Like most websites, when you visit ours some technical information is collected automatically:</p>
        <ul>
          <li><strong>Device and connection details:</strong> your IP address, browser, operating system and device type</li>
          <li><strong>How you use the site:</strong> pages you visit, the site that sent you to us, and when you visited. This mostly appears in the standard logs kept by our hosting providers.</li>
          <li><strong>Rough location:</strong> the general area you’re in, worked out from your IP address. We never collect your precise location.</li>
        </ul>

        <h3>1.3 Information from others</h3>
        <p>
          Sometimes we receive information about you from someone else, for example a colleague who introduces us or a partner we’re working with on a project, or from public business sources such as company websites.
        </p>

        <h2>2. How we use your information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Reply to your messages and questions</li>
          <li>Prepare proposals and deliver the work you’ve asked for</li>
          <li>Send invoices, project updates and other important messages</li>
          <li>Keep our website and systems working, secure and free of abuse</li>
          <li>Understand how our website is used so we can improve it</li>
          <li>Send you news about our services, but only if you’ve agreed to it where the law requires that. You can unsubscribe at any time.</li>
          <li>Meet our legal, tax and accounting obligations</li>
        </ul>
        <p>We don’t sell your personal information, and we never will.</p>

        <h2>3. Our legal reasons for using your information</h2>
        <p>We only use your information when we have a valid reason to. Those reasons are:</p>
        <ul>
          <li><strong>You agreed:</strong> for example, when you ask us to contact you or sign up for updates. You can withdraw your consent at any time.</li>
          <li><strong>We need it for a contract:</strong> to give you a quote or deliver work you’ve hired us for</li>
          <li><strong>The law requires it:</strong> for example, keeping financial records</li>
          <li><strong>Legitimate business reasons:</strong> such as keeping our systems secure and improving our services, as long as this doesn’t override your rights</li>
          <li><strong>To protect someone:</strong> in the rare case where it’s needed to protect someone’s life or safety</li>
        </ul>

        <h2>4. Who we share it with</h2>
        <p>We only share your information when we need to, and only with:</p>
        <ul>
          <li><strong>Service providers who help us run things.</strong> These include website hosting (GitHub Pages and Vercel), our database provider (MongoDB Atlas), our email delivery service (Resend), and our payment and accounting tools. They can only use your information to provide their service to us.</li>
          <li><strong>Partners on a project</strong> you’ve hired us for, when they need it to do the work and have agreed to keep it confidential</li>
          <li><strong>Authorities</strong> when the law requires it, or when we need to protect our rights, our clients or the public</li>
          <li><strong>A new owner,</strong> if AximoIX is ever merged, sold or reorganised. Your information would stay protected under this policy.</li>
          <li><strong>Anyone else you ask us to share it with</strong></li>
        </ul>
        <p>
          Our website also loads a few things from other companies. Fonts come from Google Fonts, images from Unsplash, and the 3D animation on our homepage from Spline. When your browser loads these, those companies receive your IP address and basic browser details, in the same way any website you visit would.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Right now our website doesn’t use advertising or tracking cookies. If we ever add analytics or other cookies, we’ll update this page first and ask for your permission where the law requires it. You can always block or delete cookies in your browser settings.
        </p>

        <h2>6. How long we keep it</h2>
        <p>
          We keep your information only as long as we need it for the reasons above. For example, we keep enquiries for as long as we’re talking with you, and we keep project and billing records for as long as tax and accounting laws require. When we no longer need something, we delete it or remove anything that identifies you.
        </p>

        <h2>7. Keeping it safe</h2>
        <p>
          We protect your information with encryption, access controls, secure hosting and regular reviews of our security. Only people who need your information to do their job can see it. No system is completely secure, though, so we can’t promise that a breach will never happen. If one happens and it affects you, we’ll tell you and the relevant authorities as the law requires.
        </p>

        <h2>8. Your rights</h2>
        <p>Depending on where you live, you can ask us to:</p>
        <ul>
          <li><strong>Show you</strong> what personal information we hold about you and give you a copy</li>
          <li><strong>Correct</strong> anything that’s wrong or out of date</li>
          <li><strong>Delete</strong> your information when we no longer have a good reason to keep it</li>
          <li><strong>Limit</strong> how we use it in certain situations</li>
          <li><strong>Send it</strong> to you or to another company in a common, easy-to-use format</li>
          <li><strong>Stop</strong> using it for marketing, or for a business purpose you object to</li>
          <li><strong>Withdraw your consent</strong> wherever we rely on it</li>
        </ul>
        <p>
          <strong>In the United States:</strong> if you live in California or another state with a privacy law, you can also ask what categories of information we’ve collected and why. We won’t treat you any differently for using your privacy rights. We don’t sell or share personal information for targeted advertising.
        </p>
        <p>
          <strong>In Zimbabwe:</strong> you have the rights given to you by the Cyber and Data Protection Act [Chapter 12:07]. If you’re not happy with how we’ve handled your information, you can complain to the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ), the data protection authority, at <a href="https://www.potraz.gov.zw" target="_blank" rel="noopener noreferrer">www.potraz.gov.zw</a>.
        </p>
        <p>
          To use any of these rights, email us at <a href="mailto:hello@aximoix.com">hello@aximoix.com</a>. We may need to confirm who you are before we act on your request, and we’ll reply within the time the law gives us (usually 30 to 45 days).
        </p>

        <h2>9. Information sent to other countries</h2>
        <p>
          Because we work in the United States and Zimbabwe, and some of our service providers store data in other countries, your information may be handled outside the country you live in. When that happens, we take steps to make sure it stays protected to the standard required by the laws that apply, including section 29 of Zimbabwe’s Cyber and Data Protection Act.
        </p>

        <h2>10. Children</h2>
        <p>
          Our website and services are meant for businesses and adults, not for anyone under 18. We don’t knowingly collect information from children. If you think a child has sent us their information, please let us know and we’ll delete it.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. When we do, we’ll post the new version here and change the date at the top. If the changes are significant, we’ll make that clear on our website or let you know directly.
        </p>

        <h2>12. Contact us</h2>
        <p>Questions, concerns or requests about your privacy? Get in touch:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:hello@aximoix.com">hello@aximoix.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+14705064390">+1 470 506 4390</a></li>
          <li><strong>Address:</strong> 3rd Floor, 120 West Trinity Place, Decatur, GA 30030, United States</li>
        </ul>
        <p>
          This policy is governed by the laws of the State of Georgia, USA, and, for people in Zimbabwe, the laws of Zimbabwe. See our <a href="/terms/">Terms of Service</a> for more.
        </p>
      </main>
    </div>
  );
}

export default PrivacyPolicy;

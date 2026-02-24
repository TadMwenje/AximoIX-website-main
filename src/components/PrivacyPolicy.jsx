import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-content">
        <a href="/" className="legal-back-link">
          <ArrowLeft size={18} />
          Back to Home
        </a>

        <h1>Privacy Policy</h1>
        <p className="legal-subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>
          AximoIX ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or otherwise interact with us. This policy applies to users in the United States of America and the Republic of Zimbabwe, and complies with applicable laws in both jurisdictions, including but not limited to the California Consumer Privacy Act (CCPA), applicable U.S. state privacy laws, and the Zimbabwe Data Protection Act, 2021.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Personal Information You Provide</h3>
        <p>We may collect the following categories of personal information when you voluntarily provide it to us:</p>
        <ul>
          <li><strong>Identifiers:</strong> Name, email address, phone number, mailing address</li>
          <li><strong>Professional Information:</strong> Job title, company name, industry</li>
          <li><strong>Communication Data:</strong> Messages, inquiries, and correspondence you send us through our contact form or other channels</li>
          <li><strong>Account Information:</strong> If you create an account, your login credentials and preferences</li>
          <li><strong>Payment Information:</strong> Billing details processed through secure third-party payment processors (we do not store credit card numbers)</li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <p>When you access our website, we may automatically collect:</p>
        <ul>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on pages, referring URL, click patterns</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience. See Section 7 for details.</li>
          <li><strong>Location Data:</strong> Approximate geographic location inferred from your IP address</li>
        </ul>

        <h3>1.3 Information from Third Parties</h3>
        <p>We may receive information about you from third-party sources, including business partners, analytics providers, and publicly available databases, to supplement the information we collect directly.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To provide, operate, and maintain our services</li>
          <li>To respond to your inquiries and fulfill your requests</li>
          <li>To send administrative information, updates, and service-related communications</li>
          <li>To personalize your experience and deliver relevant content</li>
          <li>To process transactions and send related information</li>
          <li>To send marketing and promotional communications (with your consent where required)</li>
          <li>To detect, prevent, and address technical issues, fraud, and security threats</li>
          <li>To comply with legal obligations and enforce our terms</li>
          <li>To conduct analytics and improve our website and services</li>
          <li>For any other purpose with your consent</li>
        </ul>

        <h2>3. Legal Basis for Processing</h2>

        <h3>3.1 Under U.S. Law</h3>
        <p>We process your personal information based on:</p>
        <ul>
          <li><strong>Consent:</strong> Where you have given us explicit permission</li>
          <li><strong>Contractual Necessity:</strong> To perform our obligations under a contract with you</li>
          <li><strong>Legitimate Interests:</strong> For our business purposes that do not override your rights</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
        </ul>

        <h3>3.2 Under Zimbabwe Data Protection Act, 2021</h3>
        <p>In accordance with the Zimbabwe Data Protection Act, 2021, we process your personal information based on one or more of the following lawful grounds:</p>
        <ul>
          <li>Your express, informed, and voluntary consent</li>
          <li>Performance of a contract to which you are a party</li>
          <li>Compliance with a legal obligation to which we are subject</li>
          <li>Protection of your vital interests or those of another person</li>
          <li>Performance of a task carried out in the public interest</li>
          <li>Our legitimate interests, provided these are not overridden by your fundamental rights and freedoms</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing, email delivery)</li>
          <li><strong>Business Partners:</strong> Trusted partners with whom we collaborate to deliver services, subject to confidentiality agreements</li>
          <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets</li>
          <li><strong>With Your Consent:</strong> For any other purpose disclosed to you at the time of collection</li>
        </ul>

        <h2>5. Your Rights</h2>

        <h3>5.1 Rights Under U.S. Law (Including CCPA)</h3>
        <p>If you are a resident of California or another U.S. state with applicable privacy legislation, you may have the following rights:</p>
        <ul>
          <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected about you</li>
          <li><strong>Right to Delete:</strong> Request deletion of your personal information, subject to certain exceptions</li>
          <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
          <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of personal information (we do not sell personal information)</li>
          <li><strong>Right to Non-Discrimination:</strong> You will not be discriminated against for exercising your privacy rights</li>
        </ul>

        <h3>5.2 Rights Under Zimbabwe Data Protection Act, 2021</h3>
        <p>If you are a data subject in Zimbabwe, you have the following rights under the Data Protection Act, 2021:</p>
        <ul>
          <li><strong>Right of Access:</strong> Request access to and a copy of your personal information held by us</li>
          <li><strong>Right to Rectification:</strong> Request correction or updating of inaccurate or incomplete personal information</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal information where there is no compelling reason to continue processing</li>
          <li><strong>Right to Restrict Processing:</strong> Request limitation of processing of your personal information in certain circumstances</li>
          <li><strong>Right to Data Portability:</strong> Receive your personal information in a structured, commonly used, and machine-readable format</li>
          <li><strong>Right to Object:</strong> Object to the processing of your personal information based on legitimate interests or direct marketing</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time where processing is based on consent</li>
          <li><strong>Right to Lodge a Complaint:</strong> Lodge a complaint with the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ) as the supervising authority</li>
        </ul>

        <p>To exercise any of these rights, please contact us using the information in Section 11.</p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. When personal information is no longer needed, we will securely delete or anonymize it. Specific retention periods depend on the nature of the information and the purposes for which it is processed.
        </p>

        <h2>7. Cookies and Tracking Technologies</h2>
        <p>Our website uses cookies and similar tracking technologies to:</p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Improve website performance and user experience</li>
          <li>Deliver relevant content and marketing</li>
        </ul>
        <p>
          You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may affect the functionality of our website. For more information, consult your browser's help documentation.
        </p>

        <h2>8. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, secure hosting environments, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          As AximoIX operates in both the United States and Zimbabwe, your personal information may be transferred to and processed in countries other than your country of residence. When we transfer personal information across borders, we ensure appropriate safeguards are in place in accordance with applicable data protection laws, including the Zimbabwe Data Protection Act, 2021

 (Section 29) and relevant U.S. frameworks. By using our services, you consent to the transfer of your information to the United States, Zimbabwe, and other jurisdictions where we operate.
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 18 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected information from a child, we will take steps to delete such information promptly. If you believe we have collected information from a child, please contact us immediately.
        </p>

        <h2>11. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, wish to exercise your rights, or have concerns about how we handle your personal information, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> hello@aximoix.com</li>
          <li><strong>Phone:</strong> +1 470 506 4390</li>
          <li><strong>Address:</strong> 3rd Floor, 120 West Trinity Place, Decatur, GA 30030, United States</li>
        </ul>

        <h3>Zimbabwe-Specific Inquiries</h3>
        <p>
          If you are located in Zimbabwe and wish to exercise your rights under the Data Protection Act, 2021, or lodge a complaint, you may also contact the Postal and Telecommunications Regulatory Authority of Zimbabwe (POTRAZ) at <a href="https://www.potraz.gov.zw" target="_blank" rel="noopener noreferrer">www.potraz.gov.zw</a>.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on our website with a revised "Last updated" date. Your continued use of our services after the posting of changes constitutes your acceptance of such changes.
        </p>

        <div style={{ marginTop: '64px', padding: '24px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: 0 }}>
            This Privacy Policy is governed by and construed in accordance with the laws of the State of Georgia, United States of America, and the laws of the Republic of Zimbabwe, as applicable. Any disputes arising under this policy shall be subject to the exclusive jurisdiction of the competent courts in the relevant jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

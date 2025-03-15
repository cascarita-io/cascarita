import styles from "./Privacy.module.css";

const Privacy = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>On this page</h2>
          <ul className={styles.navLinks}>
            <li>
              <a href="#introduction">1. Introduction</a>
            </li>
            <li>
              <a href="#collection">2. Collection of Personal Information</a>
            </li>
            <li>
              <a href="#how-we-use-info">3. How We Use Your Information</a>
            </li>
            <li>
              <a href="#how-we-share-info">4. How We Share Your Information</a>
            </li>
            <li>
              <a href="#data-security">5. Data Security</a>
            </li>
            <li>
              <a href="#third-party">
                6. Third-Party Authentication and Payment Processing
              </a>
            </li>
            <li>
              <a href="#privacy-rights">7. Your Privacy Rights</a>
            </li>
            <li>
              <a href="#right-to-delete">8. Right to Deletion</a>
            </li>
            <li>
              <a href="#emails">9. Email Communications</a>
            </li>
            <li>
              <a href="#children">10. Children&apos;s Privacy</a>
            </li>
            <li>
              <a href="#privacy-ca">11. California Privacy Rights</a>
            </li>
            <li>
              <a href="#transfers">12. International Data Transfers</a>
            </li>
            <li>
              <a href="#data-rentention">13. Data Retention</a>
            </li>
            <li>
              <a href="#cookies">14. Cookies Policy</a>
            </li>
            <li>
              <a href="#changes">15. Changes to This Statement</a>
            </li>
            <li>
              <a href="#contact-info">16. Contact Information</a>
            </li>
          </ul>
        </div>

        <div className={styles.content}>
          {/* <div className={styles.updateBanner}>
            <p>
              Read more about the changes made March 13, 2025{" "}
              <a href="#" className={styles.link}>
                here
              </a>
              .
            </p>
          </div> */}

          <section id="general-terms" className={styles.section}>
            <h2 className={styles.sectionTitle}>Privacy Policy</h2>
            <p className={styles.lastModified}>Last modified: March 13, 2025</p>

            <div id="introduction" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>1. Introduction</h3>
              <p>
                This Privacy Policy (&quot;Policy&quot;) applies to Cascarita
                Software LLC and governs data collection and usage. For the
                purposes of this Privacy Policy, unless otherwise noted, all
                references to the Company include &quot;we,&quot;
                &quot;us,&quot; &quot;our&quot;. Our website is a
                Software-As-A-Service (SaaS) website. By using the our website,
                you consent to the data practices described in this statement.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using
                our Services, you acknowledge that you have read, understood,
                and agree to be bound by this Privacy Policy.
              </p>
            </div>

            <div id="collection" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                2. Collection of Personal Information
              </h3>
              <p>
                We do not collect any personal information about you unless you
                voluntarily provide it to us. However, you may be required to
                provide certain personal information to us when you elect to use
                our services. These may include: (a) registering for an account;
                (b) filling out forms; (c) signing up for third parties services
                we depend on; (d) sending email messages. To wit, we will use
                your information for, but not limited to, communicating with you
                in relation to our services. We also may gather additional
                personal or non-personal information in the future.
              </p>
              <h4 className={styles.subheading}>
                2.1 Information You Provide to Us
              </h4>
              <p>
                <strong>Email Addresses</strong>
              </p>
              <p>
                We collect your email address for account identification and
                email communication purposes.
              </p>
              <p>
                <strong>Personal Information</strong>
              </p>
              <p>
                When filling out registration forms, we collect date of birth,
                full legal name, images you chose to upload to associate to your
                profile and league identification cards, physical home address,
                and phone numbers.
              </p>
              <p>
                <strong>Organization/League Information</strong>
              </p>
              <p>
                If you register as a league administrator, we collect
                information about your organization.
              </p>
              <h4 className={styles.subheading}>
                2.2 Information We Collect Automatically
              </h4>
              <p>
                <strong>Cookies</strong>
              </p>
              <p>
                We use cookies to remember your email address and group ID for
                authentication purposes
              </p>
              <p>
                <strong>Usage and Log Data</strong>
              </p>
              <p>
                We may collect information about how you interact with our
                Services, such as the pages you visit and features you use. This
                usage data will be used to monitor the health of our services.
                Cascarita may automatically collect information about your
                computer hardware and software. This information can include
                your IP address, browser type, domain names, access times, and
                referring website addresses. This information is used for the
                operation of the service, to maintain quality of the service,
                and to provide general statistics regarding the use of our
                software platform.
              </p>
              <h4 className={styles.subheading}>
                2.3 Information We Do NOT Collect
              </h4>
              <p>
                To minimize privacy concerns, we deliberately{" "}
                <strong>do not</strong> collect the following information:
              </p>
              <ul>
                <li>Passwords (we use Auth0 for authentication)</li>
                <li>Gender, age, or other demographic information</li>
                <li>
                  Payment method details (i.e. credit card) (handled by Stripe)
                </li>
                <li>Medical information</li>
                <li>Schedule information</li>
              </ul>
            </div>

            <div id="how-we-use-info" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                3. How We Use Your Information
              </h3>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul>
                <li>To provide and maintain our Services</li>
                <li>
                  To authenticate users and provide access to authorized
                  features
                </li>
                <li>To process payments (via Stripe Connect)</li>
                <li>
                  To communicate with you about your account and/or our Services
                </li>
                <li>To improve our Services and develop new features</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </div>
            <div id="how-we-share-info" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                4. How We Share Your Information
              </h3>
              <h4 className={styles.subheading}>
                4.1 Third Party Service Providers
              </h4>
              <p>
                We may share your information with third-party service providers
                that help us operate our Services, including:
              </p>
              <p>
                <strong>Auth0: </strong>For user authentication (governed by{" "}
                <a href="https://auth0.com/privacy">Auth0 Privacy Policy</a>)
              </p>
              <p>
                <strong>Stripe: </strong>For payment processing (governed by{" "}
                <a href="https://stripe.com/privacy">Stripe Privacy Policy</a>)
              </p>
              <p>
                <strong>MongoDB Atlas: </strong>For secure database storage
                (external data storage)
              </p>
              <p>
                <strong>AWS/Cloud Services: </strong>For hosting our platform
                (external data storage)
              </p>
              <h4 className={styles.subheading}>
                4.2 Note on External Data Storage Sites
              </h4>
              <p>
                We may store your data on servers provided by third-party
                hosting vendors with whom we have contracted.
              </p>
              <h4 className={styles.subheading}>4.3 Business Transfers</h4>
              <p>
                If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as
                part of that transaction.
              </p>
              <h4 className={styles.subheading}>
                4.4 Sharing Information with Third Parties
              </h4>
              <p>
                We do not sell, rent, or lease its customer lists to third
                parties. All such third parties are prohibited from using your
                personal information except to provide these services to
                Cascarita Software LLC, and they are required to maintain the
                confidentiality of your information.
              </p>
              <p>
                We may disclose your personal information, without notice, if
                required to do so by law or in the good faith belief that such
                action is necessary to: (a) conform to the edicts of the law or
                comply with legal process served on Cascarita Software LLC or
                the site; (b) protect and defend the rights or property of
                Cascarita Software LLC; and/or (c) act under exigent
                circumstances to protect the personal safety of users of
                Cascarita Software LLC, or the public.
              </p>
              <h4 className={styles.subheading}>
                4.5 Opt-Out of Disclosure of Personal Information to Third
                Parties
              </h4>
              <p>
                In connection with any personal information we may disclose to a
                third party for a business purpose, you have the right to know:
              </p>
              <ul>
                <li>
                  The categories of personal information that we disclosed about
                  you for a business purpose.
                </li>
              </ul>
              <p>
                You have the right under the California Consumer Privacy Act of
                2018 (CCPA) and certain other privacy and data protection laws,
                as applicable, to opt out of the disclosure of your personal
                information. If you exercise your right to opt out of the
                disclosure of your personal information, we will refrain from
                disclosing your personal information, unless you subsequently
                provide express authorization for the disclosure of your
                personal information. To opt out of the disclosure of your
                personal information, please contact us at{" "}
                <a href="mailto:support@cascarita.io" className={styles.link}>
                  support@cascarita.io
                </a>
              </p>
            </div>
            <div id="data-security" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>5. Data Security</h3>
              <p>
                We implement reasonable security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>Authentication through Auth0</li>
                <li>Limited access to production databases</li>
                <li>
                  Industry-standard encryption and security practices through
                  MongoDB Atlas
                </li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p>
                However, please be aware that no method of transmission over the
                internet or method of electronic storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </div>
            <div id="third-party" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                6. Third Party Authentication and Payment Processing
              </h3>
              <h4 className={styles.subheading}>6.1 Auth0</h4>
              <p>
                We use Auth0 to manage user authentication. When you log in to
                our Services, you are also subject to{" "}
                <a href="https://auth0.com/privacy">
                  Auth0&apos;s Privacy Policy
                </a>
              </p>
              <h4 className={styles.subheading}>6.2 Stripe</h4>
              <p>
                We use Stripe to process payments. When you make payments
                through our Services, you are also subject to{" "}
                <a href="https://stripe.com/privacy">
                  Stripe&apos;s Privacy Policy
                </a>
              </p>
            </div>
            <div id="privacy-rights" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>7. Privacy Rights</h3>
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul>
                <li>
                  <strong>Access: </strong>The right to request access to your
                  personal information
                </li>
                <li>
                  <strong>Correction: </strong>The right to request correction
                  of inaccurate personal information
                </li>
                <li>
                  <strong>Deletion: </strong>The right to request restriction of
                  processing of your personal information
                </li>
                <li>
                  <strong>Data Portability: </strong>The right to receive your
                  personal information in a structured, commonly used format
                </li>
                <li>
                  <strong>Objection: </strong>The right to object to processing
                  of your personal information
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information provided in the &quot;Contact Information&quot;
                section below.
              </p>
            </div>
            <div id="right-to-delete" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>8. Right to Deletion</h3>
              <p>
                Subject to certain exceptions set out below, on receipt of a
                verifiable request from you, we will:
              </p>
              <ul>
                <li>Delete your personal information from our records; and</li>
                <li>
                  Direct any service providers to delete your personal
                  information from their records.
                </li>
              </ul>
              <p>
                Please note that we may not be able to comply with requests to
                delete your personal information if it is necessary to:
              </p>
              <ul>
                <li>
                  Complete the transaction for which the personal information
                  was collected, fulfill the terms of a written warranty or
                  product recall conducted in accordance with federal law, and
                  provide a good or service requested by you, or reasonably
                  anticipated within the context of our ongoing business
                  relationship with you, or otherwise perform a contract between
                  you and us;
                </li>
                <li>
                  Detect security incidents, protect against malicious,
                  deceptive, fraudulent, or illegal activity; or prosecute those
                  responsible for that activity;
                </li>
                <li>
                  Debug to identify and repair errors that impair existing
                  intended functionality;
                </li>
                <li>
                  Exercise free speech, ensure the right of another consumer to
                  exercise his or her right of free speech, or exercise another
                  right provided for by law;
                </li>
                <li>
                  Comply with the California Electronic Communications Privacy
                  Act;
                </li>
                <li>
                  Engage in public or peer-reviewed scientific, historical, or
                  statistical research in the public Interest that adheres to
                  all other applicable ethics and privacy laws, when our
                  deletion of the information is likely to render impossible or
                  seriously impair the achievement of such research, provided we
                  have obtained your informed consent;
                </li>
                <li>
                  Enable solely internal uses that are reasonably aligned with
                  your expectations based on your relationship with us;
                </li>
                <li>Comply with an existing legal obligation; or</li>
                <li>
                  Otherwise use your personal information, internally, in a
                  lawful manner that is compatible with the context in which you
                  provided the information.
                </li>
              </ul>
            </div>
            <div id="emails" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                9. Email Communications
              </h3>
              <p>
                From time to time, Cascarita may contact you via email for the
                purpose of providing announcements, promotional offers, alerts,
                confirmations, surveys, and/or other general communication.
              </p>
              <p>
                If you would like to stop receiving marketing or promotional
                communications via email from us, you may opt out of such
                communications by contacting{" "}
                <a href="mailto:support@cascarita.io" className={styles.link}>
                  support@cascarita.io
                </a>
              </p>
            </div>
            <div id="children" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                10. Children&apos;s Privacy
              </h3>
              <p>
                Our Services are not directed to children under 16 years of age.
                We do not knowingly collect personal information from children
                under 16. We operate under the assumption that users are over
                the age of 16. If we learn we have collected or received
                personal information from a child under 16 without verification
                of parental consent, we will delete that information. If you
                believe we might have any information from or about a child
                under 13, please contact us.
              </p>
            </div>
            <div id="privacy-ca" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                11. California Privacy Rights
              </h3>
              <p>
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA) and the
                California Privacy Rights Act (CPRA). Please contact us for more
                information about your California privacy rights.
              </p>
            </div>
            <div id="transfers" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                12. International Data Transfers
              </h3>
              <p>
                If you access our Services from outside the United States,
                please be aware that your information may be transferred to,
                stored, and processed in the United States where our servers are
                located. By using our Services, you consent to the transfer of
                your information to the United States, which may have different
                data protection rules than those of your country.
              </p>
            </div>
            <div id="data-rentention" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>13. Data Retention</h3>
              <p>
                We will retain your personal information only for as long as is
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>
            </div>
            <div id="cookies" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>14. Cookies</h3>
              <h4 className={styles.subheading}>14.1 What Are Cookies</h4>
              <p>
                Cookies are small pieces of text sent to your web browser by a
                website you visit. A cookie file is stored in your web browser
                and allows the Service or a third-party to recognize you and
                make your next visit easier and the Service more useful to you.
              </p>
              <h4 className={styles.subheading}>14.2 How We Use Cookies</h4>
              <p>
                We use cookies for the following purposes: - Authentication (to
                remember your email address and group ID) - Security (to help
                protect user data from unauthorized access) - To remember user
                preferences
              </p>
              <h4 className={styles.subheading}>
                14.3 Your Choices Regarding Cookies
              </h4>
              <p>
                If you prefer not to allow cookies, you may set your browser to
                refuse cookies or to alert you when cookies are being sent.
                However, some parts of the Services may not function properly
                without cookies.
              </p>
            </div>
            <div id="changes" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                15. Changes to This Statement
              </h3>
              <p>
                We reserve the right to change this Policy from time to time.
                For example, when there are changes in our services, changes in
                our data protection practices, or changes in the law. When
                changes to this Policy are significant, we will inform you. You
                may receive a notice by sending an email to the primary email
                address specified in your account, by placing a prominent notice
                on our Cascarita Software LLC, and/or by updating any privacy
                information. Your continued use of the website and/or services
                available after such modifications will constitute your: (a)
                acknowledgment of the modified Policy; and (b) agreement to
                abide and be bound by that Policy.
              </p>
            </div>
            <div id="contact-info" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                16. Contact Information
              </h3>
              <p>
                We welcome your questions or comments regarding this Policy. If
                you believe that the Cascarita Software LLC has not adhered to
                this Policy, please contact us at:
                <a href="mailto:support@cascarita.io" className={styles.link}>
                  support@cascarita.io
                </a>
              </p>
            </div>

            {/* Additional sections would continue here */}
          </section>

          <div className={styles.acceptanceSection}>
            <p>
              By using our services, you acknowledge that you have read and
              agree to this Privacy Policy. If you have any questions, please
              contact{" "}
              <a href="mailto:support@cascarita.io" className={styles.link}>
                support@cascarita.io
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;

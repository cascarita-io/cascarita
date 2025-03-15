import styles from "./Terms.module.css";

const Terms = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>On this page</h2>
          <ul className={styles.navLinks}>
            <li>
              <a href="#registration">1. Registration</a>
            </li>
            <li>
              <a href="#cascarita-services">2. Cascarita Services</a>
            </li>
            <li>
              <a href="#payment-fees">3. Payment and Fees</a>
            </li>
            <li>
              <a href="#content-access">4. Accessing Content</a>
            </li>
            <li>
              <a href="#user-conduct">5. User Conduct</a>
            </li>
            <li>
              <a href="#user-content">6. User Content</a>
            </li>
            <li>
              <a href="#fees-payment">7. Fees and Payment</a>
            </li>
            <li>
              <a href="#ownership">8. Ownership</a>
            </li>
            <li>
              <a href="#warranties">9. No Warranties</a>
            </li>
            <li>
              <a href="#liability">10. Limited Liability</a>
            </li>
            <li>
              <a href="#risks">11. Risk Acknowledgement and Waiver</a>
            </li>
            <li>
              <a href="#thirdparty">12. Third Party Services</a>
            </li>
            <li>
              <a href="#mods">13. Modifications of Service</a>
            </li>
            <li>
              <a href="#termination">14. Termination</a>
            </li>
            <li>
              <a href="#generalprovisions">15. General Provisions</a>
            </li>
            <li>
              <a href="#changetoterms">16. Change To Terms</a>
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
            <h2 className={styles.sectionTitle}>Terms of Service</h2>
            <p className={styles.lastModified}>Last modified: March 13, 2025</p>

            <div id="registration" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>1. Registration</h3>
              <p>
                In order to access certain features of the Services, you may be
                required to register for an account ("Account"). In registering
                for the Services, you agree to (1) provide true, accurate,
                current, and complete information about yourself as prompted by
                the Services’ registration form (the "Registration Data"); and
                (2) maintain and promptly update the Registration Data to keep
                it true, accurate, current, and complete. You represent that you
                are (i) of legal age to form a binding contract; and (ii) not a
                person barred from using the Services under the laws of the
                United States, your place of residence, or any other applicable
                jurisdiction.
              </p>
              <p>
                You are responsible for all activities that occur under your
                Account. You may not share your Account or password with anyone,
                and you agree to notify Cascarita Software LLC immediately of
                any unauthorized use of your password or any other breach of
                security. If you provide any information that is untrue,
                inaccurate, not current, or incomplete, or Cascarita Software
                LLC has reasonable grounds to suspect that such information is
                untrue, inaccurate, not current, or incomplete, Cascarita
                Software LLC has the right to suspend or terminate your Account
                and refuse any and all current or future use of the Services (or
                any portion thereof).
              </p>
            </div>

            <div id="cascarita-services" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>2. Cascarita Services</h3>
              <p>
                Cascarita Software LLC is a software-as-a-service (SAAS)
                platform designed to facilitate recreational sports league
                management, primarily focused on soccer leagues. The Services
                may be used by sports organizations (each an "Organization"),
                team coaches and managers (each a "Team"), sports participants
                themselves (each a "Player"), or other members of a Player's
                household (each a "Household Member"). Players refers to sports
                participants that are participants over the age of 16.
              </p>
            </div>

            <div id="payment-fees" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>3. Payment and Fees</h3>
              <h4 className={styles.subheading}>3.1 Service Fees</h4>
              <p>
                Some elements of the Services may be offered by Cascarita for a
                fee. The fees for such Services are posted on the Website and/or
                the App. Unless otherwise agreed in writing, fees are subject to
                change without notice. You agree to pay Cascarita in advance the
                applicable fees for the Services provided by Cascarita under
                these Terms.
              </p>
              <p>
                If you elect to pay applicable fees with a credit card,
                Cascarita will bill your credit card for all fees and you hereby
                authorize Cascarita to charge your credit card or to charge any
                form of payment you have obtained to replace your credit card.
                You will provide Cascarita with accurate and complete billing
                information including legal name, address, telephone number, and
                credit card or debit card billing information. If such
                information is false or fraudulent, Cascarita reserves the right
                to terminate your use of the Services in addition to seeking any
                other legal remedies.
              </p>
              <h4 className={styles.subheading}>3.2 Payment Processing</h4>
              <p>
                Cascarita uses Stripe, Inc. ("Stripe") as a payment processing
                service for payments made through the Services. When you make
                payments through the Services, you also agree to be bound by
                Stripe's Terms of Service (
                <a
                  href="https://stripe.com/legal/connect-account"
                  className={styles.link}
                >
                  https://stripe.com/legal/connect-account
                </a>
                ) and Privacy Policy (
                <a href="https://stripe.com/privacy" className={styles.link}>
                  https://stripe.com/privacy
                </a>
                ).
              </p>
              <h4 className={styles.subheadingSmall}>
                3.2.1 Stripe Connect Direct Charge Model
              </h4>
              <p>
                Cascarita utilizes Stripe Connect’s direct charge model for
                processing payments. Under this model:
              </p>
              <ul>
                <li>
                  Payments are processed directly between you and the applicable
                  Organization or Team (the "Merchant") through Stripe
                </li>
                <li>
                  The Merchant is responsible for the transaction and will
                  appear on your credit card statement
                </li>
                <li>
                  Cascarita collects a platform fee for use of the Services
                </li>
                <li>
                  You (if you are a Merchant) are responsible for all Stripe
                  payment processing fees associated with transactions
                </li>
                <li>
                  Cascarita is not a party to the transaction between you and
                  the Merchant
                </li>
              </ul>
              <h4 className={styles.subheadingSmall}>
                3.2.2 Merchant Responsibilities
              </h4>
              <p>
                If you are an Organization or Team receiving payments through
                the Services:
              </p>
              <ul>
                <li>
                  You are responsible for all Stripe payment processing fees
                </li>
                <li>
                  You must maintain your own Stripe Connected Account in good
                  standing
                </li>
                <li>
                  You are responsible for refunds, disputes, and chargebacks
                  related to your transactions
                </li>
                <li>
                  You must comply with all applicable laws regarding the
                  collection and processing of payments
                </li>
                <li>
                  You must provide clear refund and cancellation policies to
                  your customers
                </li>
              </ul>
              <h4 className={styles.subheadingSmall}>
                3.2.2 Tax Responsibilities
              </h4>
              If you are an Organization or Team receiving payments through the
              Services:
              <ul>
                <li>
                  You are solely responsible for determining and collecting all
                  applicable taxes (including sales tax, value-added tax, and
                  other similar taxes) related to payments you receive through
                  the Services
                </li>
                <li>
                  You are responsible for reporting and remitting all such taxes
                  to the appropriate tax authorities
                </li>
                <li>
                  You must maintain appropriate tax records and documentation as
                  required by applicable laws
                </li>
                <li>
                  Cascarita is not responsible for determining whether taxes
                  apply to your transactions, calculating, collecting,
                  reporting, or remitting taxes to any tax authority
                </li>
                <li>
                  You acknowledge that while Stripe may offer tax calculation
                  features through Stripe Tax, you are solely responsible for
                  configuring these features correctly, verifying tax
                  calculations, and ensuring tax compliance for your
                  transactions
                </li>
                <li>
                  You agree to indemnify and hold Cascarita harmless from any
                  claims related to taxes associated with your transactions
                </li>
              </ul>
              <p>
                Even if you utilize Stripe Tax or similar automated tax
                calculation services, you remain solely responsible for your tax
                obligations. Cascarita does not warrant or guarantee that Stripe
                Tax or any other tax calculation service will correctly
                calculate applicable taxes in all circumstances.
              </p>
              <p>
                The following terms and conditions ("Terms of Service" or these
                "Terms") are a legal agreement between you and Cascarita
                ("Cascarita", "we", "us", "our"), an unincorporated project
                operated by its founders, and govern your access to and use of
                the Cascarita.com website (the "Website"), using the Cascarita
                web application (the "App"), and your use of any of the services
                offered by Cascarita (collectively with the Website and the App,
                the "Services").
              </p>
              <p>
                By clicking on the "I Agree" checkbox, using the App, or by
                accessing, browsing, or otherwise using the Website, you agree
                to be bound by these Terms and any related policies or
                guidelines, including any subsequent changes or modifications to
                them, and that you have the authority to enter into these Terms
                personally or on behalf of the organization you have named as
                the user. The term "you" refers to the individual, team, club,
                league, or legal entity identified as the user when you
                registered for the Services. If you do not agree to these Terms
                or any changes, do not access or otherwise continue to use the
                Services.
              </p>
              <p>
                <strong>
                  These Terms of Service include a class action waiver and a
                  waiver of jury trials and require binding arbitration on an
                  individual basis to resolve disputes. These Terms of Service
                  limit the remedies that may be available to you in the event
                  of a dispute.
                </strong>
              </p>
            </div>
            <div id="content-access" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                4. Accessing Content Through the Service
              </h3>
              <p>
                You agree that you will only use the Services and any content
                you access through the Services for your own internal, personal,
                non-commercial use and not on behalf of or for the benefit of
                any third party, and only in a manner that complies with all
                laws that apply to you.
              </p>
              <p>
                The materials displayed or performed or available on or through
                the Services, including, but not limited to, text, graphics,
                data, articles, photos, images, illustrations, and so forth (all
                of the foregoing, the "Content") are protected by copyright
                and/or other intellectual property laws.
              </p>
              <p>
                Subject to these Terms, we grant each user of the Services a
                worldwide, non-exclusive, non-sublicensable and non-transferable
                license to use (i.e., to download and display locally) Content
                solely for purposes of using the Services. Use, reproduction,
                modification, distribution or storage of any Content for any
                purpose other than using the Services is expressly prohibited
                without prior written permission from us.
              </p>
            </div>
            <div id="user-conduct" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>5. User Conduct</h3>
              <h4 className={styles.subheading}>5.1 General Conduct</h4>
              <p>
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul>
                <li>
                  Use the Service in any way that violates any applicable law or
                  regulation
                </li>
                <li>
                  Impersonate any person or entity or falsely state or
                  misrepresent your affiliation with a person or entity
                </li>
                <li>
                  Interfere with or disrupt the Service or servers or networks
                  connected to the Service
                </li>
                <li>
                  Attempt to gain unauthorized access to parts of the Service
                  not intended for your use
                </li>
                <li>
                  Use the Service to transmit any viruses, malware, or other
                  harmful code
                </li>
                <li>
                  Collect or harvest any information about other users without
                  their consent
                </li>
                <li>Use the Service to send unsolicited communications</li>
              </ul>
              <h4 className={styles.subheading}>5.2 League Administration</h4>
              <p>
                If you register as a league administrator, you are responsible
                for:
              </p>
              <ul>
                <li>
                  Ensuring all league information is accurate and up-to-date
                </li>
                <li>
                  Managing league participants in compliance with applicable
                  laws
                </li>
                <li>
                  Proper management of league finances and payment distributions
                </li>
                <li>Ensuring participant safety during league activities</li>
              </ul>
            </div>
            <div id="user-content" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>6. User Content</h3>
              <h4 className={styles.subheading}>6.1 Ownership</h4>
              <p>
                You are legally responsible for all data, content or other
                information ("User Content") uploaded, posted or stored through
                your Account or otherwise through your use of the Services. You
                are responsible for any User Content that may be lost or
                unrecoverable through your use of the Services.
              </p>
              <h4 className={styles.subheading}>6.2 License to User Content</h4>
              <p>
                You retain all rights to any content you submit, post, or
                display on or through the Service ("User Content"). By
                submitting User Content to the Service, you grant Cascarita and
                its related companies, affiliates and partners an irrevocable,
                worldwide, royalty-free license to:
              </p>
              <ul>
                <li>
                  Host, use, copy, store, distribute, publicly perform and
                  display, modify, and create derivative works of such User
                  Content as necessary to provide, improve and make the Services
                  available to you and other users
                </li>
                <li>
                  Use and disclose metrics and analytics regarding the User
                  Content in an aggregate or other non-personally identifiable
                  manner
                </li>
                <li>
                  Use any User Content that has been de-identified for any
                  product development, research or other purpose
                </li>
              </ul>
              <h4 className={styles.subheading}>Responsibility for Content</h4>
              <p>
                You are solely responsible for your User Content and the
                consequences of submitting and publishing it. You represent and
                warrant that:
              </p>
              <ul>
                <li>
                  You own or have the necessary rights to use and authorize
                  Cascarita to use your User Content
                </li>
                <li>
                  Your User Content does not violate any third party’s
                  intellectual property rights, privacy rights, publicity
                  rights, or other personal or proprietary rights
                </li>
                <li>
                  Your User Content does not contain any defamatory, obscene,
                  offensive, or otherwise illegal material
                </li>
              </ul>
            </div>
            <div id="fees-payment" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>7. Fees and Payment</h3>
              <h4 className={styles.subheading}>7.1 Service Fees</h4>
              <p>
                Fees for using the Service will be displayed to you before you
                complete your purchase. Cascarita reserves the right to change
                its pricing terms for the Service at any time.
              </p>
              <h4 className={styles.subheading}>7.2 Payment Processing</h4>
              <p>
                Payment processing services for users of the Service are
                provided by Stripe (or other payment processors as indicated)
                and are subject to their applicable terms and conditions.
              </p>
              <h4 className={styles.subheading}>7.3 League Payments</h4>
              <p>
                For league administrators, Cascarita facilitates the collection
                of league fees from participants. League administrators are
                responsible for setting appropriate fee levels and properly
                accounting for all funds collected.
              </p>
            </div>
            <div id="ownership" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>8. Ownership</h3>
              <p>
                Cascarita’s founders and operators own all rights, title, and
                interest in the Services and Content. You will not remove, alter
                or obscure any copyright, trademark, service mark or other
                proprietary rights notices incorporated in or accompanying the
                Services or Content.
              </p>
              <p>
                You are not conveyed any other right or license, by implication,
                estoppel or otherwise, in or under any patent, trademark, or
                proprietary right of Cascarita or any third party. Any
                unauthorized use of the Services will terminate the permission
                or license granted by Cascarita to you under this Terms of
                Service and may violate applicable law.
              </p>
            </div>
            <div id="warranties" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>9. Warranties</h3>
              <p>
                The services and content are provided on an "as is" and "as
                available" basis without warranties of any kind, express or
                implied. You expressly agree that use of the services, including
                all content or data distributed by or downloaded or accessed
                from or through the services, is at your sole risk. Cascarita
                disclaims all warranties, express or implied, including, but not
                limited to, implied warranties of merchantability, fitness for a
                particular purpose, title, and non-infringement as to the
                information, services, and all content available therein the
                site.
              </p>
              <p>Cascarita makes no warranty that:</p>
              <ul>
                <li>The service will meet your requirements.</li>
                <li>
                  The service will be uninterrupted, timely, secure, or
                  error-free.
                </li>
                <li>
                  The results obtained from the use of the service will be
                  accurate or reliable.
                </li>
                <li>
                  The quality of any products, services, information, or other
                  material purchased or obtained by you through the service will
                  meet your expectations.
                </li>
              </ul>
            </div>
            <div id="liability" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>10. Liability</h3>
              <h4 className={styles.subheading}>10.1 Limited Liability</h4>
              <p>
                In no event shall Cascarita be liable for any indirect, special,
                incidental, consequential, or punitive damages (including but
                not limited to loss of use, loss of profits, or loss of data),
                whether in an action in contract, tort (including but not
                limited to negligence), equity, or otherwise, arising out of or
                in any way connected with the use of or inability to use the
                services therein.
              </p>
              <p>
                Cascarita’s aggregate liability for any actual and direct
                damages hereunder shall not exceed the amounts you paid to
                Cascarita during the prior 12-month period or $100.
              </p>
              <p>
                You acknowledge that the above limitation of liability is a
                reasonable allocation of risk for your use of the Services and
                is a fundamental element of the basis of the agreement between
                you and Cascarita.
              </p>
              <h4 className={styles.subheading}>10.2 Your Liability</h4>
              <p>
                You are solely responsible for your activities on the Services,
                including all content that you submit or a third party submits
                on your behalf using your account. You agree to indemnify
                Cascarita and its founders, operators, employees, agents,
                successors and assigns against any and all third-party claims,
                actions, demands, suits and all related losses, liabilities,
                damages, penalties, costs and expenses (including, but not
                limited to, reasonable attorneys’ fees) incurred by an
                indemnified party arising out of or related to:
              </p>
              <ul>
                <li>
                  any violation of law or regulation from your use of the
                  Service;
                </li>
                <li>
                  any actual or alleged breach by you of any obligations,
                  representations, warranties under this Terms of Service;
                </li>
                <li>
                  any actual or alleged infringement or misappropriation of the
                  intellectual property rights of any third party by any User
                  Content that you submit or a third party submits on your
                  behalf or using your account.
                </li>
              </ul>
            </div>
            <div id="risks" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                11. Risk Acknowledgement and Waiver
              </h3>
              <h4 className={styles.subheading}>
                11.1 League Administrator Responsibilities
              </h4>
              <p>If you are a league administrator, you agree to:</p>
              <ul>
                <li>
                  Obtain appropriate waivers and releases from all league
                  participants
                </li>
                <li>
                  Secure appropriate insurance coverage for your league
                  activities
                </li>
                <li>
                  Comply with all local regulations regarding sporting events
                </li>
                <li>
                  Take reasonable precautions to ensure participant safety
                </li>
              </ul>
            </div>
            <div id="thirdparty" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                12. Third Party Services
              </h3>
              <p>
                The Service may contain links to third-party websites or
                services that are not owned or controlled by Cascarita.
                Cascarita has no control over, and assumes no responsibility
                for, the content, privacy policies, or practices of any
                third-party websites or services. You acknowledge and agree that
                Cascarita shall not be responsible or liable for any damage or
                loss caused by or in connection with the use of any such
                content, goods, or services available on or through any such
                websites or services. For more information about our privacy
                policy, please visit our{" "}
                <a href="/privacy" className={styles.link}>
                  Privacy Policy
                </a>
              </p>
            </div>
            <div id="mods" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>
                13. Modifications to Service
              </h3>
              <p>
                Cascarita reserves the right at any time to modify or
                discontinue, temporarily or permanently, the Service (or any
                part thereof) with notice. You agree that Cascarita shall not be
                liable to you or to any third party for any modification,
                suspension, or discontinuance of the Service.
              </p>
            </div>
            <div id="termination" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>14. Termination</h3>
              <h4 className={styles.subheading}>14.1 Termination by You</h4>
              <p>
                You may terminate your account at any time by following the
                instructions on the Service or by contacting us.
              </p>
              <h4 className={styles.subheading}>
                14.2 Termination by Cascarita
              </h4>
              <p>
                Cascarita may terminate or suspend your account and access to
                the Service immediately, without prior notice or liability, for
                any reason, including but not limited to a breach of these
                Terms.
              </p>
              <h4 className={styles.subheading}>14.3 Effect of Termination</h4>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. All provisions of these Terms which by their nature
                should survive termination shall survive termination, including,
                without limitation, ownership provisions, warranty disclaimers,
                indemnity, and limitations of liability.
              </p>
            </div>
            <div id="generalprovisions" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>15. General Provisions</h3>
              <h4 className={styles.subheading}>15.1 Governing Law</h4>
              <p>
                These Terms shall be governed by the laws of the State of
                California, without respect to its conflict of laws principles.
              </p>
              <h4 className={styles.subheading}>15.2 Severability</h4>
              <p>
                If any provision of these Terms is found to be unenforceable or
                invalid, that provision will be limited or eliminated to the
                minimum extent necessary so that these Terms will otherwise
                remain in full force and effect and enforceable.
              </p>
              <h4 className={styles.subheading}>15.3 Entire Agreement</h4>
              <p>
                These Terms constitute the entire agreement between you and
                Cascarita regarding the Service and supersede all prior and
                contemporaneous agreements, proposals, or representations,
                written or oral, concerning its subject matter.
              </p>
              <h4 className={styles.subheading}>15.4 No Waiver</h4>
              <p>
                The failure of Cascarita to enforce any right or provision of
                these Terms will not be deemed a waiver of such right or
                provision.
              </p>
              <h4 className={styles.subheading}>15.5 Assignment</h4>
              <p>
                You may not assign or transfer these Terms, by operation of law
                or otherwise, without Cascarita’s prior written consent. Any
                attempt to assign or transfer these Terms without such consent
                will be null and void.
              </p>
              <h4 className={styles.subheading}>15.6 Contact Information</h4>
              <p>
                Questions about these Terms should be sent to{" "}
                <a href="mailto:support@cascarita.io" className={styles.link}>
                  support@cascarita.io
                </a>
              </p>
            </div>
            <div id="changetoterms" className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>16. Change To Terms</h3>
              <p>
                Cascarita reserves the right, at its sole discretion, to modify
                or replace these Terms at any time.
              </p>
              <p>
                By continuing to access or use our Service after any revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, you are no longer authorized
                to use the Service.
              </p>
            </div>

            {/* Additional sections would continue here */}
          </section>

          <div className={styles.acceptanceSection}>
            <p>
              By using our services, you acknowledge that you have read and
              agree to these Terms of Service. If you have any questions, please
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

export default Terms;

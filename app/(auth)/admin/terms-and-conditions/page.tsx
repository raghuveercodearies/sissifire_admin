import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
    title: "Terms & Conditions · Sissifier GPT",
    description:
        "Read the Terms of Service governing your access to and use of Sissifier GPT, including eligibility, acceptable use, user responsibilities, and service limitations.",
};

const sections: LegalSection[] = [
    {
        title: "Acceptance of These Terms",
        content: (
            <>
                <p>
                    These Terms of Service (&quot;Terms,&quot; &quot;Agreement&quot;)
                    constitute a legally binding agreement between you
                    (&quot;you,&quot; &quot;your,&quot; &quot;User&quot;) and Sissifier
                    GPT (&quot;the Platform,&quot; &quot;we,&quot; &quot;us,&quot;
                    &quot;our&quot;), governing your access to and use of the Sissifier
                    GPT website, application, AI training system, and all related
                    services (collectively, the &quot;Services&quot;).
                </p>
                <p>
                    By accessing, registering for, or using the Services in any manner,
                    you affirm that you have read, understood, and agree to be bound by
                    these Terms and our{" "}
                    <a href="/privacy-policy">Privacy Policy</a>. If you do not agree to
                    all of these Terms, you must immediately cease all use of the
                    Services.
                </p>
                <p>
                    <strong>
                        This Agreement contains a mandatory individual arbitration clause
                        and class action waiver in Section 17 that affects your legal
                        rights. Please read it carefully.
                    </strong>
                </p>
            </>
        ),
    },
    {
        title: "Eligibility Requirements",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    2.1. Age Requirement — Strictly 18+
                </h3>
                <p>
                    You must be at least eighteen (18) years of age, or the age of
                    majority in your jurisdiction, whichever is higher, to access or use
                    the Services. The Services contain mature themes, sexually explicit
                    language, and content relating to adult fetish and submission
                    practices.
                </p>
                <p>By using the Services, you represent and warrant that:</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>You are at least 18 years old.</li>
                    <li>You have the legal right and capacity to enter into this Agreement.</li>
                    <li>You are not barred from using the Services under the laws of your jurisdiction.</li>
                    <li>You are accessing the Services voluntarily and of your own free will.</li>
                </ul>
                <p>
                    We reserve the right to request age verification at any time and to
                    terminate access immediately if we have reason to believe a User is
                    under 18. Providing false information regarding your age is a
                    material breach of these Terms and may constitute a criminal offense.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    2.2. Legal Compliance in Your Jurisdiction
                </h3>
                <p>
                    You are solely responsible for ensuring that your use of the Services
                    complies with all applicable laws in your country, state, province,
                    or territory. The Services may not be legal or appropriate for use in
                    certain jurisdictions. You must not access the Services from any
                    jurisdiction where the content or Services would be illegal. We make
                    no representation that the Services are appropriate or available for
                    use in any particular location.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    2.3. Emotional and Psychological Capacity
                </h3>
                <p>
                    The Services involve themes of submission, humiliation, feminization,
                    and control. You affirm that you are emotionally and psychologically
                    capable of engaging with such content responsibly. You acknowledge
                    that you are solely responsible for assessing your own mental fitness
                    to use the Services.
                </p>
                <p>
                    If you are currently experiencing a mental health crisis, are in
                    psychological distress, or are using the Services as a substitute
                    for professional mental health care, you should not use the Services.
                    See Section 9 for important disclaimers.
                </p>
            </>
        ),
    },
    {
        title: "Description of the Services",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    3.1. What Sissifier GPT Is
                </h3>
                <p>
                    Sissifier GPT is an AI-powered, text-based training platform that
                    provides personalized sissification training content, including but
                    not limited to guided tasks, feminization exercises, behavioral
                    conditioning prompts, role-play scenarios, educational content, and
                    progress tracking. The Services are delivered through a large
                    language model (&quot;LLM&quot;) and related software systems.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    3.2. What Sissifier GPT Is NOT
                </h3>
                <p>You expressly acknowledge and agree that:</p>
                <ul className="list-disc space-y-3 pl-5">
                    <li>
                        <strong>AI is not a human being.</strong> The
                        &quot;trainer,&quot; &quot;Mistress,&quot; &quot;Master,&quot; or
                        any other persona presented through the Services is a fictional
                        AI-generated character, not a real person. No human is monitoring
                        or directing your individual training sessions in real time.
                    </li>
                    <li>
                        <strong>The Services are not a D/s relationship.</strong> Use of
                        the Services does not create any real-world Dominant/submissive
                        relationship, mentorship, ownership, or personal relationship of
                        any kind between you and Sissifier GPT, its operators, or any AI
                        persona.
                    </li>
                    <li>
                        <strong>The Services are not professional services.</strong> The
                        Services do not constitute medical, psychological, psychiatric,
                        therapeutic, legal, financial, or any other form of professional
                        advice or treatment.
                    </li>
                    <li>
                        <strong>The Services are not a substitute for human connection.</strong>{" "}
                        The Services are an entertainment and personal-exploration tool,
                        not a replacement for human relationships, community, or
                        professional support.
                    </li>
                    <li>
                        <strong>AI output may be inaccurate.</strong> AI-generated content
                        may be factually incorrect, inconsistent, repetitive, or
                        nonsensical. You should not rely on any AI output as factual
                        information.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    3.3. Service Modifications
                </h3>
                <p>
                    We reserve the right to modify, suspend, discontinue, or restrict any
                    aspect of the Services at any time, including features, training
                    modules, AI model versions, and availability, without prior notice or
                    liability. We do not guarantee any specific feature, model version,
                    or content will remain available.
                </p>
            </>
        ),
    },
    {
        title: "Accounts, Anonymity, and Account Security",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    4.1. Anonymous Participation
                </h3>
                <p>
                    You are not required to provide your real name, email address, or
                    phone number to use the core Services. You will select a chosen name
                    or pseudonym for personalization purposes.
                </p>
                <p>
                    You agree that any name you select will not impersonate a real
                    person, infringe on another&apos;s rights, or violate Section 6.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    4.2. One Account Per Person
                </h3>
                <p>
                    You may maintain only one account. Creating multiple accounts to
                    circumvent restrictions, suspensions, or limits is prohibited.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    4.3. Account Security
                </h3>
                <p>
                    You are responsible for maintaining the confidentiality of any
                    credentials associated with your account and for all activity that
                    occurs under your account. You must notify us immediately of any
                    unauthorized use. We cannot and will not be liable for any loss or
                    damage arising from your failure to protect your account.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    4.4. No Guarantee of Data Persistence
                </h3>
                <p>
                    We do not guarantee that your profile, questionnaire responses, chat
                    history, or progress will be preserved indefinitely. You should not
                    rely on the Services as a permanent record or archive. See the{" "}
                    <a href="/privacy-policy">Privacy Policy</a> for retention details.
                </p>
            </>
        ),
    },
    {
        title: "Adult Content, Consent, and Personal Responsibility",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">5.1. Nature of Content</h3>
                <p>
                    The Services contain sexually explicit language, mature themes, and
                    content relating to adult fetish practices, including feminization,
                    submission, humiliation, chastity, and role-play. By using the
                    Services, you consent to being exposed to such content.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    5.2. Fictional Frameworks Only
                </h3>
                <p>
                    All interactions, tasks, and scenarios generated by the AI are
                    entirely fictional. Any instruction, command,
                    &quot;punishment,&quot; &quot;rule,&quot; or directive issued through
                    the Services is a role-play device. You are never obligated to
                    perform any task, and the AI has no actual authority over you. You
                    retain complete autonomy over your own body, behavior, and choices at
                    all times.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    5.3. Your Safety and Well-Being Are Your Responsibility
                </h3>
                <p>You acknowledge and agree that:</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        You must set your own limits. You are responsible for identifying
                        and communicating your hard limits through the intake questionnaire
                        and at any time thereafter.
                    </li>
                    <li>
                        You must use safe words. You are responsible for using the safety
                        word or stop mechanism when you wish to pause, redirect, or end a
                        session.
                    </li>
                    <li>
                        You must not perform any task that is unsafe, illegal, harmful to
                        yourself or others, or that you do not fully consent to. The AI
                        cannot assess your physical or psychological safety.
                    </li>
                    <li>
                        You must stop using the Services if you experience distress,
                        dysphoria, or harm, discontinue use immediately, and seek
                        appropriate support.
                    </li>
                    <li>
                        You must never involve non-consenting third parties in any task or
                        scenario.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    5.4. Physical and Medical Caution
                </h3>
                <p>
                    Some content themes may relate to physical practices. You are solely
                    responsible for researching and ensuring the safety of any real-world
                    activity. Certain practices carry inherent physical risks. We do not
                    provide and expressly disclaim any safety instruction, medical
                    guidance, or supervision. Always use appropriate safety precautions
                    and, where relevant, consult a qualified medical professional.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    5.5. No Exploitation of the Dynamic
                </h3>
                <p>
                    You agree that you will not use the Services to establish, facilitate,
                    or attempt actual coercion, blackmail, extortion, non-consensual
                    control, or abuse of any person. Depictions or role-play frameworks
                    of power exchange within the Services do not authorize, condone, or
                    license real-world abuse. Any attempt to use the Services for such
                    purposes is a material breach of these Terms and may be unlawful.
                </p>
            </>
        ),
    },
    {
        title: "Prohibited Conduct and Content",
        content: (
            <>
                <p>
                    You agree that you will not, and will not permit any third party to
                    engage in, the following activities:
                </p>

                <h3 className="font-semibold text-fg-strong">
                    6.1. Illegal and Harmful Content
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        Use the Services for any unlawful purpose or in violation of any
                        applicable law.
                    </li>
                    <li>
                        Generate, request, upload, or transmit content involving minors
                        (including any sexualized or age-regression content involving
                        minors), or attempt to circumvent age restrictions.
                    </li>
                    <li>
                        Generate, request, or distribute content depicting non-consensual
                        sexual content, sexual violence, bestiality, incest, or
                        exploitation.
                    </li>
                    <li>
                        Generate, request, or distribute content that promotes or provides
                        instruction on self-harm, suicide, or eating disorders.
                    </li>
                    <li>
                        Generate or distribute content that constitutes harassment,
                        threats, defamation, hate speech, or discrimination based on
                        protected characteristics.
                    </li>
                    <li>
                        Generate, request, or distribute actual blackmail material,
                        extortion demands, or content intended to coerce a real person.
                    </li>
                    <li>
                        Create, distribute, or facilitate child sexual abuse material
                        (CSAM) in any form. We will report such activity to the relevant
                        authorities.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    6.2. Third-Party Rights and Privacy
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        Upload or share images, recordings, or personal information of any
                        real person without their explicit, documented consent.
                    </li>
                    <li>
                        Use the Services to secretly record or document another person,
                        including a partner.
                    </li>
                    <li>
                        Impersonate any person, entity, or AI persona in a manner intended
                        to deceive.
                    </li>
                    <li>
                        Violate any third party&apos;s intellectual property, privacy, or
                        publicity rights.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    6.3. Technical and System Abuse
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        Attempt to reverse-engineer, decompile, scrape, crawl, or extract
                        the underlying models, prompts, code, or system architecture.
                    </li>
                    <li>
                        Use automated scripts, bots, or bulk querying to access the
                        Services.
                    </li>
                    <li>
                        Attempt to bypass safety filters, content moderation, rate limits,
                        or age gates, including through prompt injection, jailbreaking, or
                        adversarial inputs.
                    </li>
                    <li>
                        Introduce malware, viruses, or any code designed to disrupt or
                        damage the Services.
                    </li>
                    <li>
                        Interfere with or disrupt the integrity or performance of the
                        Services or the data contained therein.
                    </li>
                    <li>
                        Access the Services through unauthorized means or attempt to gain
                        access to accounts, systems, or networks you are not authorized to
                        access.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    6.4. Commercial Abuse
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        Resell, sublicense, or commercially exploit the Services or AI
                        outputs without our express written permission.
                    </li>
                    <li>
                        Use the Services to build a competing product or train a competing
                        model.
                    </li>
                    <li>
                        Use the Services for any commercial solicitation, including
                        advertising sexual services, unless expressly authorized in
                        writing.
                    </li>
                </ul>

                <p>
                    We reserve the right to investigate and take appropriate action
                    against any violation, including content removal, account
                    suspension, termination, and reporting to law enforcement where
                    required or appropriate.
                </p>
            </>
        ),
    },
    {
        title: "Content Moderation and AI Safety Systems",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    7.1. Automated Safety Measures
                </h3>
                <p>
                    The Services employ automated content filters and safety systems
                    designed to prevent the generation of prohibited content, including
                    content involving minors, extreme violence, or illegal activity.
                    These systems are not perfect. You agree not to attempt to defeat
                    them, and you agree that their operation is a material part of the
                    Services.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    7.2. No Guarantee of Filter Accuracy
                </h3>
                <p>
                    We do not warrant that filters will block all prohibited content or
                    that legitimate content will never be incorrectly blocked. If you
                    encounter content you believe violates these Terms, report it using
                    the contact details in Section 19.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    7.3. Our Right to Refuse or Remove
                </h3>
                <p>
                    We may refuse to generate, or may remove, any content for any reason,
                    including content we determine in our sole discretion to be harmful,
                    illegal, or in violation of these Terms, without notice or liability.
                </p>
            </>
        ),
    },
    {
        title: "User Content and License",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    8.1. Your Responsibility for Your Inputs
                </h3>
                <p>
                    You are solely responsible for all text, prompts, responses, and
                    other material you submit to the Services (&quot;User Inputs&quot;).
                    You represent and warrant that you have all necessary rights to
                    submit your User Inputs and that they do not violate these Terms or
                    any law.
                </p>

                <h3 className="font-semibold text-fg-strong">8.2. License Grant</h3>
                <p>
                    By submitting User Inputs, you grant us a limited, non-exclusive,
                    worldwide, royalty-free license to store, process, and use your User
                    Inputs solely for the purpose of providing the Services to you,
                    including generating AI responses, personalizing your training,
                    maintaining your history, and ensuring safety and moderation.
                </p>
                <p>
                    This license terminates when you delete the relevant content or your
                    account, subject to backup retention periods described in the{" "}
                    <a href="/privacy-policy">Privacy Policy</a>.
                </p>
                <p>
                    We do not use your private chat content to train our underlying
                    models or third-party models by default, and we do not sell or license
                    your User Inputs to third parties for their own purposes.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    8.3. AI-Generated Outputs
                </h3>
                <p>
                    Subject to your compliance with these Terms, you may use AI-generated
                    outputs for your own personal, non-commercial purposes. You
                    acknowledge that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>AI outputs may be similar or identical to outputs generated for other users.</li>
                    <li>We make no claim of exclusivity or ownership over generic AI outputs.</li>
                    <li>
                        You are responsible for how you use AI outputs, including any
                        real-world consequences.
                    </li>
                </ul>

                <h3 className="font-semibold text-fg-strong">8.4. Feedback</h3>
                <p>
                    If you provide suggestions or feedback, you grant us a perpetual,
                    royalty-free license to use it without obligation or compensation to
                    you.
                </p>
            </>
        ),
    },
    {
        title: "Important Disclaimers Regarding Health and Well-Being",
        content: (
            <>
                <p>
                    <strong>This section is critical. Please read it carefully.</strong>
                </p>
                <ul className="list-disc space-y-3 pl-5">
                    <li>
                        <strong>Not Therapy.</strong> The Services are not a substitute for
                        professional mental health care, therapy, counseling, or medical
                        treatment. If you are experiencing depression, anxiety, gender
                        dysphoria requiring clinical support, trauma, or any mental health
                        condition, please consult a qualified professional.
                    </li>
                    <li>
                        <strong>Not a Diagnostic Tool.</strong> The Services cannot
                        diagnose any condition, including gender dysphoria, paraphilias, or
                        any physical or mental health condition.
                    </li>
                    <li>
                        <strong>Emotional Attachment Risk.</strong> You acknowledge that AI
                        systems can evoke strong emotional responses, and that forming an
                        emotional attachment to an AI persona is possible but does not
                        constitute a real relationship.
                    </li>
                    <li>
                        <strong>Breaks Are Encouraged.</strong> We encourage regular breaks
                        from the Services and engagement with real-world community,
                        relationships, and support networks.
                    </li>
                    <li>
                        <strong>Gender Identity.</strong> Exploration of gender expression
                        through the Services is personal and does not constitute a clinical
                        assessment of your gender identity. If you are considering medical
                        transition or permanent physical changes, consult qualified
                        medical and mental health professionals. See Section 5.4.
                    </li>
                </ul>
                <p>
                    If you are in crisis or experiencing thoughts of self-harm, contact
                    your local emergency services or a crisis helpline immediately.
                </p>
            </>
        ),
    },
    {
        title: "Intellectual Property and Ownership",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">10.1. Our Property</h3>
                <p>
                    The Services, including all software, models, prompts, system
                    instructions, training modules, text, graphics, logos, interfaces,
                    and the selection and arrangement thereof, are owned by or licensed
                    to Sissifier GPT and are protected by copyright, trademark, trade
                    secret, and other intellectual property laws. Except for the limited
                    rights expressly granted in these Terms, no rights are granted to
                    you.
                </p>

                <h3 className="font-semibold text-fg-strong">10.2. Restrictions</h3>
                <p>
                    You may not copy, reproduce, distribute, modify, create derivative
                    works from, publicly display, or exploit any part of the Services,
                    except as expressly permitted in writing by us.
                </p>

                <h3 className="font-semibold text-fg-strong">10.3. Trademarks</h3>
                <p>
                    &quot;Sissifier GPT&quot; and associated logos and marks are our
                    trademarks. You may not use them without prior written permission.
                </p>
            </>
        ),
    },
    {
        title: "Third-Party Services and Dependencies",
        content: (
            <p>
                The Services may rely on or link to third-party services (such as cloud
                hosting and AI inference providers). We are not responsible for the
                content, privacy practices, or availability of third-party services.
                Your use of third-party services may be subject to their own terms. We
                are not liable for any third-party outage, data practice, or act.
            </p>
        ),
    },
    {
        title: "Payments and Subscriptions",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">12.1. Fees</h3>
                <p>
                    Certain features may require payment. All fees are displayed before
                    purchase. Prices are subject to change with notice.
                </p>

                <h3 className="font-semibold text-fg-strong">12.2. Billing</h3>
                <p>
                    Payments are processed by a third-party payment processor. By
                    providing payment information, you authorize charges for the
                    applicable fees. We do not store full payment card details.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    12.3. Discreet Billing
                </h3>
                <p>
                    We endeavor to use billing descriptors that are discreet. However,
                    we cannot guarantee the appearance of charges on your statement, and
                    you are responsible for any consequences of a charge appearing on a
                    shared or monitored account.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    12.4. Cancellation and Refunds
                </h3>
                <p>
                    Subscriptions renew automatically unless cancelled before the renewal
                    date. Except where required by law, all fees are non-refundable.
                    Cancellation stops future charges but does not refund past charges.
                </p>

                <h3 className="font-semibold text-fg-strong">12.5. Chargebacks</h3>
                <p>
                    Initiating a chargeback for a charge you authorized constitutes a
                    breach of these Terms and may result in account termination.
                </p>
            </>
        ),
    },
    {
        title: "Term, Suspension, and Termination",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">
                    13.1. Termination by You
                </h3>
                <p>
                    You may stop using the Services and delete your account at any time
                    via your account settings.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    13.2. Termination or Suspension by Us
                </h3>
                <p>We may suspend, restrict, or terminate your access to the Services immediately, with or without notice, if:</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>You breach these Terms.</li>
                    <li>
                        We reasonably believe your use poses a risk to yourself, other
                        users, or third parties.
                    </li>
                    <li>
                        We reasonably believe you are under 18 or have misrepresented your
                        eligibility.
                    </li>
                    <li>We are required to do so by law.</li>
                    <li>We discontinued the Services.</li>
                </ul>

                <h3 className="font-semibold text-fg-strong">
                    13.3. Effect of Termination
                </h3>
                <p>
                    Upon termination, your right to use the Services ceases immediately.
                    Sections 6, 8, 9, 10, 14, 15, 16, 17, and 18 survive termination.
                    Deletion of data will be handled per the Privacy Policy.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    13.4. No Liability for Termination
                </h3>
                <p>
                    We will not be liable to you or any third party for any termination
                    or suspension of access.
                </p>
            </>
        ),
    },
    {
        title: "Disclaimers of Warranties",
        content: (
            <>
                <p className="uppercase">
                    <strong>
                        The Services are provided &quot;as is&quot; and &quot;as
                        available,&quot; without warranty of any kind, express or implied.
                        To the maximum extent permitted by applicable law, we disclaim all
                        warranties, including implied warranties of merchantability,
                        fitness for a particular purpose, title, and non-infringement.
                    </strong>
                </p>
                <p>We do not warrant that:</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>The Services will be uninterrupted, timely, secure, or error-free.</li>
                    <li>AI outputs will be accurate, appropriate, consistent, or safe.</li>
                    <li>Defects will be corrected.</li>
                    <li>The Services or servers are free of harmful components.</li>
                </ul>
                <p>
                    No advice or information obtained through the Services creates any
                    warranty not expressly stated herein. Some jurisdictions do not allow
                    exclusion of certain warranties, so some of the above may not apply
                    to you.
                </p>
            </>
        ),
    },
    {
        title: "Limitation of Liability",
        content: (
            <>
                <p className="uppercase">
                    <strong>
                        To the maximum extent permitted by applicable law, in no event
                        shall Sissifier GPT, its operators, directors, employees, agents,
                        affiliates, or licensors be liable for any indirect, incidental,
                        special, consequential, punitive, or exemplary damages, including
                        damages for loss of profits, goodwill, data, use, or other
                        intangible losses, arising out of or relating to:
                    </strong>
                </p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>Your use of or inability to use the Services.</li>
                    <li>Any AI-generated content or your reliance on it.</li>
                    <li>Any real-world action you take in response to content.</li>
                    <li>Unauthorized access to or alteration of your data.</li>
                    <li>Any third-party conduct.</li>
                    <li>
                        Any disclosure of your identity or information resulting from your
                        own actions or circumstances beyond our reasonable control.
                    </li>
                </ul>
                <p className="uppercase">
                    <strong>
                        Our total aggregate liability arising out of or relating to these
                        Terms or the Services shall not exceed the greater of (a) the
                        amount you paid us in the twelve (12) months preceding the claim,
                        or (b) one hundred US dollars (US$100).
                    </strong>
                </p>
                <p>
                    Nothing in these Terms limits liability that cannot be limited by
                    law, including liability for fraud, willful misconduct, or death or
                    personal injury caused by negligence, where such limitation is
                    prohibited.
                </p>
            </>
        ),
    },
    {
        title: "Indemnification",
        content: (
            <>
                <p>
                    You agree to defend, indemnify, and hold harmless Sissifier GPT, its
                    operators, officers, employees, agents, affiliates, and licensors
                    from and against any and all claims, damages, obligations, losses,
                    liabilities, costs, and expenses (including reasonable attorneys&apos;
                    fees) arising from:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>Your use of the Services.</li>
                    <li>Your violation of these Terms.</li>
                    <li>Your violation of any law or third-party right.</li>
                    <li>Any User Input you submit.</li>
                    <li>
                        Any real-world act or omission you take in connection with the
                        Services.
                    </li>
                    <li>Any claim by a third party relating to your conduct.</li>
                </ul>
            </>
        ),
    },
    {
        title: "Governing Law, Dispute Resolution, and Arbitration",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">17.1. Governing Law</h3>
                <p>
                    These Terms shall be governed by the laws of [Government of the
                    United Kingdom], without regard to its conflict of law principles.
                    Nothing in this section deprives you of the protection of mandatory
                    consumer protection laws in your country of residence.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    17.2. Informal Resolution First
                </h3>
                <p>
                    Before initiating any formal proceeding, you agree to contact us at
                    the address in Section 19 and attempt to resolve the dispute
                    informally for at least thirty (30) days.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    17.3. Binding Individual Arbitration
                </h3>
                <p>
                    Subject to applicable law, any dispute not resolved informally shall
                    be resolved through final and binding individual arbitration, rather
                    than in court, except that either party may bring a claim in small
                    claims court if eligible, and either party may seek injunctive relief
                    in court for intellectual property or unauthorized access claims.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    17.4. Class Action Waiver
                </h3>
                <p className="uppercase">
                    <strong>
                        You and Sissifier GPT agree that each may bring claims only in an
                        individual capacity, and not as a plaintiff or class member in any
                        purported class, collective, or representative proceeding.
                    </strong>
                </p>

                <h3 className="font-semibold text-fg-strong">17.5. Opt-Out</h3>
                <p>
                    You may opt out of arbitration by providing written notice to us
                    within thirty (30) days of first accepting these Terms, per Section
                    19.
                </p>

                <h3 className="font-semibold text-fg-strong">17.6. EU/UK Consumers</h3>
                <p>
                    If you are a consumer resident in the EU, UK, or a jurisdiction with
                    mandatory dispute provisions, the above arbitration and class action
                    provisions may not apply to you, and you may have the right to bring
                    proceedings in your local courts.
                </p>
            </>
        ),
    },
    {
        title: "General Provisions",
        content: (
            <>
                <h3 className="font-semibold text-fg-strong">18.1. Modifications</h3>
                <p>
                    We may revise these Terms at any time. Material changes will be
                    posted with an updated &quot;Last Updated&quot; date and, where
                    appropriate, prominent notice. Your continued use after changes take
                    effect constitutes acceptance. If you do not agree, you must stop
                    using the Services.
                </p>

                <h3 className="font-semibold text-fg-strong">
                    18.2. Entire Agreement
                </h3>
                <p>
                    These Terms, together with the Privacy Policy and any other policies
                    expressly incorporated, constitute the entire agreement between you
                    and us regarding the Services.
                </p>

                <h3 className="font-semibold text-fg-strong">18.3. Severability</h3>
                <p>
                    If any provision is found unenforceable, that provision will be
                    limited or severed to the minimum extent necessary, and the remaining
                    provisions remain in full force.
                </p>

                <h3 className="font-semibold text-fg-strong">18.4. Waiver</h3>
                <p>
                    Our failure to enforce any provision is not a waiver of our right to
                    do so later.
                </p>

                <h3 className="font-semibold text-fg-strong">18.5. Assignment</h3>
                <p>
                    You may not assign these Terms without our written consent. We may
                    assign these Terms freely, including in connection with a merger or
                    sale of assets.
                </p>

                <h3 className="font-semibold text-fg-strong">18.6. Force Majeure</h3>
                <p>
                    We are not liable for delays or failures due to causes beyond our
                    reasonable control, including outages, cyberattacks, or regulatory
                    action.
                </p>

                <h3 className="font-semibold text-fg-strong">18.7. No Agency</h3>
                <p>
                    No agency, partnership, joint venture, or employment relationship is
                    created by these Terms.
                </p>

                <h3 className="font-semibold text-fg-strong">18.8. Language</h3>
                <p>
                    These Terms are provided in English. Translations, if any, are for
                    convenience only, and the English version controls.
                </p>
            </>
        ),
    },
    {
        title: "Reporting, Notices, and Contact",
        content: (
            <>
                <p>
                    You may contact us using the following email address for the
                    respective matters:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        <strong>Privacy and data requests:</strong>{" "}
                        <a href="mailto:contact@sissifiergpt.com">
                            contact@sissifiergpt.com
                        </a>
                    </li>
                    <li>
                        <strong>Abuse, safety, and content reports:</strong>{" "}
                        <a href="mailto:contact@sissifiergpt.com">
                            contact@sissifiergpt.com
                        </a>
                    </li>
                    <li>
                        <strong>General support:</strong>{" "}
                        <a href="mailto:contact@sissifiergpt.com">
                            contact@sissifiergpt.com
                        </a>
                    </li>
                </ul>
                <p>
                    For CSAM or imminent threats of harm, report to your local law
                    enforcement or a relevant national reporting body immediately.
                </p>
            </>
        ),
    },
    {
        title: "Acknowledgment",
        content: (
            <>
                <p>
                    By clicking &quot;I Agree,&quot; creating an account, or using the
                    Services, you acknowledge that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>You are at least 18 years of age.</li>
                    <li>
                        You have read and understood these Terms and the Privacy Policy.
                    </li>
                    <li>
                        You understand the Services are AI-generated fiction and not a real
                        relationship.
                    </li>
                    <li>
                        You accept full responsibility for your own safety, limits, and
                        real-world actions.
                    </li>
                    <li>
                        You agree to the arbitration and class action waiver in Section 17,
                        unless you opt out.
                    </li>
                </ul>
            </>
        ),
    },
];

export default function TermsAndConditionsPage() {
    return (
        <LegalPage
            title="Terms & Conditions"
            subtitle="Please read these Terms of Service carefully. They explain the rules, responsibilities, and conditions that apply when you access or use Sissifier GPT."
            lastUpdated="November 3, 2026"
            effectiveDate="November 3, 2026"
            sections={sections}
        />
    );
}
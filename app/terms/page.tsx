import { Navigation, Footer } from '@/components/layout'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Terms of Service (AGB)
            </h1>
            <p className="text-gray-600">
              <strong>Effective Date:</strong> December 1, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
            <p className="text-lg leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between vayada UG (haftungsbeschränkt) (&quot;vayada,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and any user (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) accessing or using the vayada marketplace platform and Services.
            </p>
            <p className="text-lg leading-relaxed">
              By registering for an account, accessing, or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">1. Definitions</h2>
              <div className="space-y-3">
                <p>
                  <strong>Platform:</strong> The website, mobile applications, and technology operated by vayada.
                </p>
                <p>
                  <strong>Services:</strong> All features, tools, and functionalities offered by vayada, including the connection service, profile management, and performance tracking.
                </p>
                <p>
                  <strong>Hotel User:</strong> Any registered User representing a hotel, resort, or travel property seeking collaboration with Creators.
                </p>
                <p>
                  <strong>Creator User:</strong> Any registered User who is a travel creator, influencer, or professional content provider seeking collaboration with Hotel Users.
                </p>
                <p>
                  <strong>Collaboration:</strong> A mutual agreement facilitated by the Platform, resulting in a direct partnership between a Hotel User and a Creator User.
                </p>
                <p>
                  <strong>Content:</strong> Any text, images, videos, data, or information uploaded, shared, or displayed by Users on the Platform.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">2. Eligibility and Account Registration</h2>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Eligibility</h3>
                <p>
                  The Services are available only to individuals who are at least 18 years old and capable of forming legally binding contracts under applicable law. If you are registering on behalf of a company or entity (e.g., a Hotel User), you represent and warrant that you have the authority to bind that entity to these Terms.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Account Registration and Verification</h3>
                <div className="space-y-3">
                  <p>
                    <strong>Accurate Information:</strong> Users must provide accurate, complete, and current information during registration, including all required verification data.
                  </p>
                  <p>
                    <strong>Verification:</strong> All Users are subject to a mandatory verification process (&quot;Verified Community&quot;). vayada reserves the right to deny registration or suspend an account if the verification process is incomplete or if information is found to be false or misleading.
                  </p>
                  <p>
                    <strong>Security:</strong> You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">3. Platform Services and Roles</h2>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 vayada&apos;s Role</h3>
                <p>
                  vayada operates solely as a transparent marketplace and connection tool. We facilitate the direct meeting and communication between Hotel Users and Creator Users. vayada is not an agency, employer, or contract party to the Collaboration agreement between the Hotel and the Creator.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Hotel User Obligations</h3>
                <p>Hotel Users agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>Clearly and accurately describe their property, collaboration needs, and expectations.</li>
                  <li>Manage communication and coordination directly with the Creator User after a Collaboration is accepted.</li>
                  <li>Adhere to all agreed-upon terms, compensation, and deadlines set with the Creator User.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Creator User Obligations</h3>
                <p>Creator Users agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                  <li>Maintain accurate and current profile data, including audience metrics and portfolio.</li>
                  <li>Execute Collaboration work professionally and in compliance with all applicable laws and ethical guidelines.</li>
                  <li>Ensure that all content produced as part of a Collaboration complies with transparency and disclosure laws (e.g., clearly marking sponsored or gifted content).</li>
                </ul>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">4. Collaboration Process and Communication</h2>
              <div className="space-y-3">
                <p>
                  <strong>Collaboration Request:</strong> Hotels may send requests to Creators, and Creators may apply for available opportunities.
                </p>
                <p>
                  <strong>Acceptance:</strong> A Collaboration is formally established only when both the Hotel User and the Creator User mutually accept the terms of the engagement.
                </p>
                <p>
                  <strong>Direct Communication:</strong> Upon mutual acceptance, vayada facilitates the sharing of necessary contact information to enable direct, off-Platform communication and coordination between the two parties. vayada is not responsible for the substance or outcome of this direct communication.
                </p>
                <p>
                  <strong>Performance Tracking:</strong> Users agree to allow vayada to track mutually agreed-upon performance metrics (e.g., clicks, bookings) necessary to provide the Services and report real impact.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">5. Intellectual Property and Content</h2>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 User Content</h3>
                <p>
                  You retain all intellectual property rights in the Content you upload to the Platform. However, by uploading Content, you grant vayada a non-exclusive, worldwide, royalty-free, transferable license to use, display, reproduce, and distribute your Content solely for the purpose of operating, promoting, and improving the Services (e.g., showcasing your profile).
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Collaboration Content</h3>
                <p>
                  The ownership and rights to any content created as part of a Collaboration must be defined exclusively in the separate agreement negotiated directly between the Hotel User and the Creator User. vayada holds no rights to such Collaboration Content.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">6. Financial Terms and Compensation</h2>
              <p>
                While vayada facilitates the connection, all negotiation and execution of compensation, payment terms, and related financial arrangements for a Collaboration occur directly between the Hotel User and the Creator User.
              </p>
              <p className="mt-3">
                vayada is not responsible for the payment, transfer, or collection of any funds related to the underlying Collaboration.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">7. Disclaimers and Limitation of Liability</h2>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 No Warranty</h3>
                <p>
                  The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. vayada makes no warranties, expressed or implied, regarding the success, quality, or legality of any Collaboration facilitated through the Platform.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Limitation of Liability (Haftungsbeschränkung)</h3>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>vayada shall only be liable for damages caused by intent or gross negligence.</li>
                  <li>vayada shall only be liable for typical, foreseeable damages arising from the negligent breach of essential contractual obligations (cardinal obligations).</li>
                  <li>Any other liability on the part of vayada is excluded.</li>
                  <li>The limitations of liability above do not apply to damages resulting from injury to life, body, or health.</li>
                  <li>vayada is not liable for the actions, omissions, or content of any User, nor for any breach of contract by a Hotel User or a Creator User.</li>
                </ul>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">8. Term, Termination, and Suspension</h2>
              <div className="space-y-3">
                <p>
                  <strong>Term:</strong> These Terms commence upon your registration and remain in effect until terminated.
                </p>
                <p>
                  <strong>Termination by User:</strong> Users may terminate their account at any time.
                </p>
                <p>
                  <strong>Termination by vayada:</strong> vayada may terminate or suspend your access to the Services immediately, without prior notice, if you breach these Terms, provide false information, or engage in fraudulent or illegal activity.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">9. Governing Law and Jurisdiction</h2>
              <div className="space-y-3">
                <p>
                  <strong>Governing Law:</strong> These Terms and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of Germany, excluding its conflicts of law principles and the UN Convention on Contracts for the International Sale of Goods (CISG).
                </p>
                <p>
                  <strong>Jurisdiction:</strong> The exclusive place of jurisdiction for all disputes arising from or in connection with these Terms shall be Düsseldorf, Germany, provided the User is a merchant, a legal entity under public law, or a special fund under public law.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed text-2xl">Terms of Service</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>
                  Welcome to Kakehashi. Please read these Terms of Service ("Terms") carefully as they govern your access to and use of our services.
                </p>

                <h3 className="font-bold mt-4">1. Direct Messaging</h3>
                <p>
                  Users can send and receive messages through our direct messaging feature. You are solely responsible and liable for the content of messages you send or receive. Any inappropriate or illegal content can result in immediate account suspension or termination.
                </p>

                <h3 className="font-bold mt-4">2. Data Collection from ORCID</h3>
                <p>
                  To enhance collaboration and match users with open-source projects, we collect data from ORCID when you register an account with Kakehashi. This data is solely used for the purpose of enhancing user experience and ensuring efficient project collaborations.
                </p>

                <h3 className="font-bold mt-4">3. Liability Limitation</h3>
                <p>
                  To the fullest extent permitted by applicable law, Kakehashi shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>

                <h3 className="font-bold mt-4">4. Changes to the Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It's your responsibility to review the Terms regularly. Your continued use of our service after any changes indicates acceptance of those changes.
                </p>

                <h3 className="font-bold mt-4">5. Termination</h3>
                <p>
                  We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.
                </p>

                <h3 className="font-bold mt-4">6. Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the United States, without regard to its conflict of laws rules. You agree to submit to the exclusive jurisdiction of the courts located within [Your Country/State] for the resolution of any dispute arising out of these Terms or the services.
                </p>

                <h3 className="font-bold mt-4">7. Contact</h3>
                <p>
                  If you have any questions about these Terms, please contact us at <a className="underline" href="mailto:kakehashispaceapp@gmail.com">kakehashispaceapp@gmail.com</a>.
                </p>

                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <p>
                    To learn more about how we handle and protect your privacy, please visit our <Link href='/privacy-policy' className="text-blue-600 hover:underline">Privacy Policy</Link> page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
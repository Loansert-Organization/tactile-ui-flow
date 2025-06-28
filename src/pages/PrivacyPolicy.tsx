
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Privacy Policy</h1>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IKANISA Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold mb-2">1. Information We Collect</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Personal Information:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Phone number (for account verification)</li>
                    <li>Display name and profile information</li>
                    <li>Email address (optional)</li>
                    <li>Financial transaction history within the platform</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Usage Data:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>App usage patterns and preferences</li>
                    <li>Device information and technical data</li>
                    <li>Location data (if permitted)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To provide and maintain our savings platform services</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To process financial transactions and contributions</li>
                <li>To send important notifications about your account and groups</li>
                <li>To improve our services and user experience</li>
                <li>To comply with legal obligations and regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Information Sharing</h3>
              <p className="mb-2">We do not sell, trade, or share your personal information with third parties, except:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>With payment processors to facilitate transactions</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, safety, and security</li>
                <li>With your explicit consent</li>
                <li>Within your savings groups (limited to necessary information)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption of 
                sensitive data, secure communication protocols, and regular security assessments.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Data Retention</h3>
              <p>
                We retain your personal information only as long as necessary to fulfill the purposes outlined in 
                this privacy policy, comply with legal obligations, resolve disputes, and enforce our agreements. 
                Financial transaction records may be retained for longer periods as required by law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Withdraw consent for optional data processing</li>
                <li>Receive a copy of your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. International Data Transfers</h3>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">8. Children's Privacy</h3>
              <p>
                IKANISA is not intended for use by children under the age of 18. We do not knowingly collect 
                personal information from children under 18. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">9. Changes to Privacy Policy</h3>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new privacy policy in the app and updating the "Last updated" date. Your continued use of 
                IKANISA after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">10. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us 
                through the Help & Support section in the app or via WhatsApp at +250 795 467 385.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

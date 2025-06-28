
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Terms & Conditions</h1>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IKANISA Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using IKANISA, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Service Description</h3>
              <p>
                IKANISA is a community-based savings and contribution platform that allows users to create and participate 
                in savings groups (baskets). Users can contribute funds, track savings goals, and manage group finances 
                through our mobile application.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate and truthful information during registration</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform in accordance with applicable laws and regulations</li>
                <li>Respect other users and maintain appropriate conduct</li>
                <li>Report any suspicious activities or security breaches</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Financial Transactions</h3>
              <p>
                All financial transactions are processed through secure third-party payment providers. IKANISA acts as 
                a facilitator and does not store sensitive financial information. Users are responsible for ensuring 
                the accuracy of their contribution amounts and payment methods.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Privacy and Data Protection</h3>
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information. By using IKANISA, you consent to our data practices 
                as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
              <p>
                IKANISA provides the platform "as is" without warranties of any kind. We are not liable for any 
                direct, indirect, incidental, or consequential damages arising from your use of the platform or 
                participation in savings groups.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. Termination</h3>
              <p>
                We reserve the right to terminate or suspend your account at our discretion, without notice, 
                for conduct that we believe violates these terms or is harmful to other users or the platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">8. Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant 
                changes through the application. Continued use of the platform after changes constitutes acceptance 
                of the new terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">9. Contact Information</h3>
              <p>
                If you have any questions about these Terms & Conditions, please contact us through the Help & Support 
                section in the app or via WhatsApp at +250 795 467 385.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

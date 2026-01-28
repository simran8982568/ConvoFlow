import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            
            <h4 className="font-semibold mt-4 mb-2">Personal Information:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Name, email address, and contact information</li>
              <li>Company name and business details</li>
              <li>Account credentials and authentication data</li>
              <li>Payment and billing information</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">Usage Information:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Messages sent and received through our platform</li>
              <li>Contact lists and customer data</li>
              <li>Campaign performance and analytics data</li>
              <li>Log files and technical information</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Information Sharing and Disclosure</h3>
            <p>We may share your information in the following circumstances:</p>
            
            <h4 className="font-semibold mt-4 mb-2">With Your Consent:</h4>
            <p>We may share your information with third parties when you give us explicit consent.</p>

            <h4 className="font-semibold mt-4 mb-2">Service Providers:</h4>
            <p>We may share your information with third-party service providers who perform services on our behalf.</p>

            <h4 className="font-semibold mt-4 mb-2">Legal Requirements:</h4>
            <p>We may disclose your information if required by law or in response to valid legal requests.</p>

            <h4 className="font-semibold mt-4 mb-2">Business Transfers:</h4>
            <p>Information may be transferred in connection with mergers, acquisitions, or asset sales.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4. WhatsApp Integration</h3>
            <p>
              Our service integrates with WhatsApp Business API. When you use our platform:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Messages are processed through WhatsApp's infrastructure</li>
              <li>WhatsApp's privacy policy also applies to message handling</li>
              <li>We comply with WhatsApp's data protection requirements</li>
              <li>Customer phone numbers are handled according to WhatsApp's guidelines</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Data Retention</h3>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              Specifically:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Account information: Until account deletion plus 30 days</li>
              <li>Message data: Up to 1 year for analytics purposes</li>
              <li>Billing records: As required by applicable tax laws</li>
              <li>Support communications: Up to 3 years</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Your Rights and Choices</h3>
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">8. International Data Transfers</h3>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Children's Privacy</h3>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected such 
              information, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date. 
              Significant changes will be communicated via email.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-2">
              <p>Email: privacy@convoflow.com</p>
              <p>Address: ConvoFlow Privacy Team</p>
              <p>Data Protection Officer: dpo@convoflow.com</p>
            </div>
          </section>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyModal;

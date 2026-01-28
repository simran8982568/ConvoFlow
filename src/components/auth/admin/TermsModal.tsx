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

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Terms of Service
          </DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
            <p>
              By accessing and using ConvoFlow ("the Service"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h3>
            <p>
              ConvoFlow is a WhatsApp Business API platform that enables businesses to send automated messages,
              manage customer communications, and create marketing campaigns through WhatsApp. The service includes 
              but is not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>WhatsApp Business API integration</li>
              <li>Message automation and scheduling</li>
              <li>Contact management and segmentation</li>
              <li>Campaign creation and analytics</li>
              <li>Template management and approval</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. User Accounts and Registration</h3>
            <p>
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Acceptable Use Policy</h3>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Send spam, unsolicited, or bulk messages</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5. WhatsApp Business API Compliance</h3>
            <p>
              Users must comply with WhatsApp's Business API policies and terms. This includes but is not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Obtaining proper consent before messaging users</li>
              <li>Following WhatsApp's messaging guidelines and limits</li>
              <li>Using approved message templates only</li>
              <li>Respecting user opt-out requests</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Payment and Billing</h3>
            <p>
              Paid services are billed in advance on a monthly or annual basis. You agree to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Pay all fees associated with your chosen plan</li>
              <li>Provide accurate billing information</li>
              <li>Update payment methods as needed</li>
              <li>Accept that fees are non-refundable except as required by law</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Data and Privacy</h3>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your information. By using the Service, you consent to our data practices as 
              described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Service Availability</h3>
            <p>
              While we strive to provide reliable service, we do not guarantee 100% uptime. The Service may be 
              temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ConvoFlow shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of profits, data, 
              or business interruption.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Termination</h3>
            <p>
              We may terminate or suspend your account and access to the Service at our sole discretion, 
              without prior notice, for conduct that we believe violates these Terms or is harmful to other 
              users, us, or third parties.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes via email or through the Service. Continued use of the Service after changes constitutes 
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">12. Contact Information</h3>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-2">
              <p>Email: legal@convoflow.com</p>
              <p>Address: ConvoFlow Legal Department</p>
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

export default TermsModal;

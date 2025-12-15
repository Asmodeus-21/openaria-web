import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Button from './Button';
import { pushLeadToGoHighLevel } from '../services/ghlService';
import { GHLPayload } from '../types';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLiveDemo: () => void;
}

const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose, openLiveDemo }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessType: '',
    consentEmail: false,
    consentSMS: false,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: GHLPayload = {
      ...formData,
      sourcePage: window.location.pathname,
      timestamp: new Date().toISOString(),
      tags: ['ARIA - Website Lead'],
    };

    try {
      await pushLeadToGoHighLevel(payload);
      setStep('success');
    } catch (error) {
      console.error('Submission error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
        >
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Start your 7-Day Trial</h2>
            <p className="text-slate-600 mb-6">Experience the power of ARIA for just $97.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input 
                    required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input 
                    required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Work Address</label>
                <input 
                  required type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                <select 
                  required name="businessType" value={formData.businessType} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="">Select your industry...</option>
                  <option value="Medical / Dental">Medical / Dental</option>
                  <option value="Legal">Legal</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" required name="consentEmail" checked={formData.consentEmail} onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500">
                    I agree to receive emails from ARIA about product updates and offers.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" required name="consentSMS" checked={formData.consentSMS} onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500">
                    I agree to receive SMS/calls for demo purposes and account security. Std rates apply.
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isSubmitting}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Start with ARIA'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">You're All Set!</h2>
            <p className="text-slate-600 mb-8 max-w-xs mx-auto">
              Your account has been created. A welcome email and SMS have been sent to your device.
            </p>
            <div className="space-y-3 w-full">
              <Button 
                onClick={() => { onClose(); openLiveDemo(); }}
                variant="secondary"
                fullWidth
                className="flex items-center gap-2"
              >
                Speak with ARIA Now <ArrowRight size={16} />
              </Button>
              <Button 
                onClick={onClose}
                variant="ghost"
                fullWidth
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStartedModal;
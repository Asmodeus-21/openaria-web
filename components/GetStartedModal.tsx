import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import Button from './Button';
import { pushLeadToGoHighLevel } from '../services/ghlService';
import { GHLPayload, PricingPlan } from '../types';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLiveDemo: () => void;
  selectedPlan?: PricingPlan | null;
}

const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose, openLiveDemo, selectedPlan }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: GHLPayload = {
      ...formData,
      sourcePage: window.location.pathname,
      timestamp: new Date().toISOString(),
      tags: ['ARIA - Voice AI Lead'],
    };

    try {
      await pushLeadToGoHighLevel(payload);
      setStep('success');
      // Auto-open voice AI after 2 seconds
      setTimeout(() => {
        openLiveDemo();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submission error', error);
      setStep('success');
      setTimeout(() => {
        openLiveDemo();
        onClose();
      }, 2000);
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ready to Talk with ARIA?
            </h2>
            <p className="text-slate-600 mb-6">
              Just share your contact info and start your conversation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input 
                    required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    placeholder="John"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input 
                    required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  required type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <Button 
                type="submit" 
                fullWidth 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </span>
                ) : (
                  'Start Conversation'
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Set!</h2>
            <p className="text-slate-600 mb-6">
              Starting your conversation with ARIA now...
            </p>
            <div className="animate-pulse flex gap-2 justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStartedModal;
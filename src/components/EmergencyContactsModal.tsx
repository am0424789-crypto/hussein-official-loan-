import React from 'react';
import { 
  Phone, MessageSquare, ShieldAlert, X, User, 
  ExternalLink, PhoneCall, CheckCircle2 
} from 'lucide-react';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EMERGENCY_CONTACTS = [
  {
    name: 'Hussein Admin',
    role: 'Group Administrator & Senior Officer',
    phones: [
      { label: 'Primary Line', number: '0767944000', international: '+256767944000', waNumber: '256767944000' },
      { label: 'Secondary Line', number: '0705913007', international: '+256705913007', waNumber: '256705913007' },
    ],
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    name: 'Secretary Anyango Mary',
    role: 'Group Secretary & Client Desk',
    phones: [
      { label: 'Direct Line', number: '+256701616963', international: '+256701616963', waNumber: '256701616963' },
    ],
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
];

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const openWhatsApp = (waNumber: string, contactName: string) => {
    const text = encodeURIComponent(
      `Hello ${contactName}, I am contacting you from the Hussein Loans and Saving Group app regarding loan assistance.`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Emergency &amp; Support Contacts
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Hussein Loans and Saving Group Desk
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact List */}
        <div className="py-4 space-y-4 overflow-y-auto custom-scrollbar pr-1">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{contact.role}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${contact.badgeColor}`}>
                  Official Desk
                </span>
              </div>

              {/* Numbers with Call & WhatsApp buttons */}
              <div className="space-y-2 pt-1 border-t border-slate-200/60">
                {contact.phones.map((p, pIdx) => (
                  <div 
                    key={pIdx}
                    className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {p.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {p.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Direct Call Link */}
                      <a
                        href={`tel:${p.number}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors min-h-[34px]"
                        title={`Call ${p.number}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      {/* WhatsApp Connect Button */}
                      <button
                        onClick={() => openWhatsApp(p.waNumber, contact.name)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-lg text-xs font-bold transition-all min-h-[34px] shadow-xs"
                        title={`Connect with ${contact.name} on WhatsApp`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-400 shrink-0">
          Available 24/7 for urgent field assistance &amp; administrative inquiries.
        </div>
      </div>
    </div>
  );
};

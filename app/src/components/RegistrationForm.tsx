import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

const INDUSTRY_OPTIONS = [
  'Manufacturing',
  'Services',
  'Retail/Wholesale',
  'Technology/Digital',
  'Food',
  'Hospitality',
  'Agriculture',
  'Clothing',
  'Others',
] as const;

const BUSINESS_STAGE_OPTIONS = [
  'Ideation (Concept only)',
  'Startup (0-1 year)',
  'Established (1+ years)',
  'Looking to Scale/Expand',
] as const;

const BUSINESS_SCALE_OPTIONS = ['Home based', 'Small scale', 'Large scale'] as const;

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name').max(120),
  age: z
    .number({ message: 'Please enter a valid age' })
    .int('Age must be a whole number')
    .min(10, 'Age must be at least 10')
    .max(120, 'Age must be 120 or less'),
  whatsappNumber: z
    .string()
    .min(7, 'Please enter a valid WhatsApp number')
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Only digits and +, -, (), spaces are allowed'),
  email: z.string().email('Please enter a valid email').max(200),
  district: z.string().min(2, 'Please enter your district').max(100),
  gpay: z.string().min(2, 'Please enter your GPay').max(100),
  ventureName: z.string().max(200).optional().or(z.literal('')),
  industry: z.enum(INDUSTRY_OPTIONS, { message: 'Select an industry' }),
  businessStage: z.enum(BUSINESS_STAGE_OPTIONS, { message: 'Select a stage' }),
  businessScale: z.enum(BUSINESS_SCALE_OPTIONS, { message: 'Select a scale' }),
});

type FormValues = z.infer<typeof schema>;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type Props = {
  trigger: React.ReactNode;
};

const inputClass =
  'w-full rounded-xl bg-black/[0.02] border border-black/10 text-foreground placeholder-foreground/40 px-4 py-3 outline-none transition focus:border-primary/50 focus:bg-black/[0.04]';

const labelClass = 'block text-xs font-medium uppercase tracking-[0.12em] text-foreground/70 mb-2';

const errorClass = 'mt-1.5 text-xs text-red-500';

export default function RegistrationForm({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ventureName: 'N/A',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch(`${API_URL}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          ventureName: values.ventureName?.trim() || 'N/A',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Could not submit registration');
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // reset after close transition
      setTimeout(() => {
        setSubmitted(false);
        setServerError(null);
        reset({ ventureName: 'N/A' });
      }, 250);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="!bg-transparent border-0 p-0 sm:max-w-2xl max-w-[calc(100%-1.5rem)] max-h-[92vh] overflow-hidden"
      >
        <div
          className="relative rounded-2xl overflow-hidden border border-black/5 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.15)]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-black/5 transition"
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div className="px-8 py-14 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <CheckCircle2 size={36} className="text-emerald-600" />
              </div>
              <h3 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Registration received
              </h3>
              <p className="text-foreground/70 max-w-md mx-auto">
                Thank you for registering for WES 2026. We've recorded your details and our team
                will reach out shortly with next steps.
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="pill-button bg-primary text-white hover:opacity-90 inline-flex items-center gap-2 mt-8 shadow-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[92vh] scrollbar-hide" data-lenis-prevent>
              <div className="px-7 sm:px-9 pt-8 pb-6 border-b border-black/10">
                <span className="section-label text-primary">Reserve your seat</span>
                <h3 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-foreground mt-2 leading-tight">
                  Register for WES 2026
                </h3>
                <p className="text-foreground/60 text-sm mt-2">
                  Fill in your details below. Fields marked with an asterisk are required.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-7 sm:px-9 py-7 space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      autoComplete="name"
                      className={inputClass}
                      placeholder="e.g. Aysha Rahman"
                      {...register('fullName')}
                    />
                    {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Age *</label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      className={inputClass}
                      placeholder="28"
                      {...register('age', { valueAsNumber: true })}
                    />
                    {errors.age && <p className={errorClass}>{errors.age.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>WhatsApp Number *</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="+91 98xxxxxxxx"
                      {...register('whatsappNumber')}
                    />
                    {errors.whatsappNumber && (
                      <p className={errorClass}>{errors.whatsappNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>District *</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Kozhikode"
                      {...register('district')}
                    />
                    {errors.district && <p className={errorClass}>{errors.district.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>GPay *</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="GPay number or UPI ID"
                      {...register('gpay')}
                    />
                    {errors.gpay && <p className={errorClass}>{errors.gpay.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Name of Venture / Business</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Write 'N/A' if not started"
                      {...register('ventureName')}
                    />
                    <p className="mt-1.5 text-xs text-foreground/50">
                      Leave blank or write 'N/A' if you haven't started yet.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Industry / Sector *</label>
                    <select
                      className={inputClass + ' appearance-none pr-10 cursor-pointer'}
                      defaultValue=""
                      {...register('industry')}
                    >
                      <option value="" disabled className="bg-white">
                        Select industry
                      </option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.industry && <p className={errorClass}>{errors.industry.message}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Business Stage *</label>
                    <select
                      className={inputClass + ' appearance-none pr-10 cursor-pointer'}
                      defaultValue=""
                      {...register('businessStage')}
                    >
                      <option value="" disabled className="bg-white">
                        Select stage
                      </option>
                      {BUSINESS_STAGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.businessStage && (
                      <p className={errorClass}>{errors.businessStage.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Business Scale *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {BUSINESS_SCALE_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="cursor-pointer rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 flex items-center gap-3 hover:bg-black/[0.04] transition has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:border-primary"
                        >
                          <input
                            type="radio"
                            value={opt}
                            className="accent-primary"
                            {...register('businessScale')}
                          />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.businessScale && (
                      <p className={errorClass}>{errors.businessScale.message}</p>
                    )}
                  </div>
                </div>

                {serverError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {serverError}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    className="pill-button text-foreground/70 hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="pill-button bg-primary text-white hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Registration
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

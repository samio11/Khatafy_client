import { UserPlus, ShoppingCart, CheckCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Mess",
    description:
      "Sign up and create your mess in seconds. Invite your roommates to join.",
    step: "01",
  },
  {
    icon: ShoppingCart,
    title: "Record Bazar",
    description:
      "Members add their bazar expenses with items and upload receipts.",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Verify & Approve",
    description:
      "Managers verify expenses to ensure transparency and accuracy.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Track & Settle",
    description:
      "View analytics, check monthly costs, and settle payments easily.",
    step: "04",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm">
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start managing your mess professionally in just a few minutes
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-emerald-600" />
                  </div>

                  <h3 className="text-xl text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Receipt,
  Users,
  BarChart3,
  Shield,
  Bell,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "Bazar Tracking",
    description:
      "Record every bazar expense with items and amounts. Upload receipts and get manager verification for transparency.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Users,
    title: "Member Management",
    description:
      "Easily invite members, assign roles (admin, manager, member), and manage your mess group efficiently.",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Get detailed insights on spending patterns, per-member costs, and monthly trends to optimize your budget.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Secure role management with admin, manager, and member privileges. Only authorized members can perform specific actions.",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Stay updated with instant notifications for new expenses, member activities, and important mess updates.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access your mess data anytime, anywhere. Fully responsive design works perfectly on all devices.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
];

export default function Features() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm">
            Features
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900">
            Everything You Need to Run Your Mess
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for bachelor mess management
            in Bangladesh
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50"
            >
              <div
                className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Calendar, ClipboardList, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Personalized Plans",
    description:
      "Weekly training schedules tailored to your fitness level, goals, and race calendar.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Visualize your improvement over time with detailed workout logs and performance metrics.",
  },
  {
    icon: Calendar,
    title: "Schedule Management",
    description:
      "View your full training block at a glance and plan around life's demands.",
  },
  {
    icon: MessageSquare,
    title: "Direct Feedback",
    description:
      "Get notes and updates from your coach after every key workout, keeping you on track.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to excel
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete platform for athletes and coaches to collaborate, communicate,
            and crush their goals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

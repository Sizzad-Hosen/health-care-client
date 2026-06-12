import {
  Brain,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image: string;
  author: string;
  content: string[];
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const publicNavItems = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/specialties", label: "Specialties" },
  { href: "/appointment", label: "Book" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const specialties = [
  {
    title: "Cardiology",
    summary: "Heart screening, hypertension, ECG review, and cardiac follow-up.",
    icon: HeartPulse,
  },
  {
    title: "Neurology",
    summary: "Migraine, seizure care, stroke recovery, and nervous system support.",
    icon: Brain,
  },
  {
    title: "Family Medicine",
    summary: "Continuous primary care for adults, children, and older patients.",
    icon: Stethoscope,
  },
  {
    title: "Telemedicine",
    summary: "Secure video visits, prescriptions, and lab follow-ups from home.",
    icon: Video,
  },
  {
    title: "Preventive Care",
    summary: "Risk assessments, screenings, vaccines, and long-term health planning.",
    icon: ShieldCheck,
  },
  {
    title: "Diagnostics",
    summary: "Smart routing for tests, imaging, and specialist referrals.",
    icon: CalendarCheck,
  },
];

export const careFeatures = [
  "Doctor search and filtering",
  "Appointment booking",
  "Online payment flow",
  "Doctor reviews",
  "AI symptom checker",
  "AI doctor recommendation",
  "AI health assistant chatbot",
  "Pagination and loading skeletons",
];

export const stats = [
  { label: "Verified doctors", value: "420+" },
  { label: "Specialties", value: "36" },
  { label: "Avg. booking time", value: "3 min" },
  { label: "Patient rating", value: "4.9/5" },
];

export const reviewHighlights = [
  {
    name: "Nusrat Ahmed",
    role: "Cardiology patient",
    rating: 5,
    text: "The filtering helped me compare specialists quickly, and payment was finished before I left the booking page.",
  },
  {
    name: "Rahim Khan",
    role: "Follow-up care",
    rating: 5,
    text: "The assistant turned my symptoms into a sensible next step without making the process feel clinical or cold.",
  },
  {
    name: "Maliha Sultana",
    role: "Parent",
    rating: 5,
    text: "Clean profiles, visible fees, and reviews made choosing a pediatric doctor much easier.",
  },
  {
    name: "Imran Chowdhury",
    role: "Telemedicine patient",
    rating: 4,
    text: "The appointment flow is calm and direct. I knew exactly what was confirmed and what I still needed to do.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-prepare-for-a-telehealth-visit",
    title: "How to prepare for a telehealth visit",
    excerpt:
      "A practical checklist for documents, symptoms, devices, and follow-up questions before an online consultation.",
    category: "Telemedicine",
    readTime: "5 min read",
    publishedAt: "2026-05-28",
    author: "CareFlow Clinical Team",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    content: [
      "A useful telehealth visit starts before the call. Keep your prescriptions, recent reports, allergy history, and a short timeline of symptoms nearby so the doctor can move quickly from context to care.",
      "Check your camera, microphone, and internet connection at least ten minutes early. A quiet room and good lighting make the appointment more accurate and more human.",
      "End the visit with a clear plan. Confirm medicines, tests, warning signs, and the exact follow-up window before you leave the session.",
    ],
  },
  {
    slug: "choosing-the-right-specialist",
    title: "Choosing the right specialist without guesswork",
    excerpt:
      "Learn how symptoms, medical history, reviews, and care urgency can guide the right doctor match.",
    category: "Care Navigation",
    readTime: "7 min read",
    publishedAt: "2026-05-18",
    author: "Dr. Farhana Rahman",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80",
    content: [
      "The best specialist choice usually combines clinical fit with access. Start with the main symptom, then check whether the doctor regularly treats that condition.",
      "Reviews are most useful when they describe communication, follow-up, and clarity rather than only a star rating. Combine that signal with qualifications and available schedules.",
      "When symptoms are severe, sudden, or rapidly changing, do not wait for a routine appointment. Seek urgent or emergency care.",
    ],
  },
  {
    slug: "preventive-care-calendar",
    title: "A simple preventive care calendar for busy adults",
    excerpt:
      "Screenings, vaccinations, dental care, heart checks, and habit reviews that belong on your annual plan.",
    category: "Preventive Health",
    readTime: "6 min read",
    publishedAt: "2026-04-30",
    author: "CareFlow Wellness Desk",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    content: [
      "Preventive care works best when it is scheduled before something feels wrong. Annual blood pressure, glucose, dental, eye, and vaccination reviews catch small risks early.",
      "Your calendar should adapt to age, family history, pregnancy status, occupation, and chronic conditions. A primary care doctor can personalize that baseline.",
      "The goal is not to over-test. It is to keep a steady rhythm of checks that match your actual risk.",
    ],
  },
];

export const aiPrompts = [
  {
    title: "Symptom checker",
    icon: Sparkles,
    prompt: "Fever, sore throat, and fatigue for two days",
    response:
      "Possible common causes include viral infection, seasonal flu, or throat infection. Hydrate, monitor temperature, and book primary care if symptoms persist or worsen.",
  },
  {
    title: "Doctor recommendation",
    icon: Stethoscope,
    prompt: "Chest discomfort during exercise",
    response:
      "A cardiology consultation is the safer match. If pain is severe, radiates to the arm or jaw, or includes breathlessness, seek emergency care now.",
  },
  {
    title: "Health assistant",
    icon: ShieldCheck,
    prompt: "How should I prepare for a diabetes follow-up?",
    response:
      "Bring glucose logs, medication list, recent lab reports, diet notes, and questions about targets, side effects, and next monitoring dates.",
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

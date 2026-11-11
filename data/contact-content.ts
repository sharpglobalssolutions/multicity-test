import { unsplash } from "@/lib/images";

export const CONTACT_INTRO_BODY =
  "At MultiCity Experts, we're committed to providing personalised travel assistance and attentive support at every step of your journey. Whether you need help planning a complex itinerary, exploring business class options, or navigating flight changes, our travel specialists are here to help.<br/><br/>Reach out to us through our online enquiry form, phone, or email. We look forward to helping you plan your next journey with confidence.";

/** Reuses `SUPPORT_SPECIALIST_IMAGE`'s exact photo id (see
 * `data/content.ts`) — already verified and in use elsewhere on the site
 * (`SupportSection`), rather than introducing an unverified photo id. */
export const SPEAK_WITH_SPECIALIST_IMAGE = {
  src: unsplash("1714079761488-e0c9b9ac4138"),
  alt: "A friendly travel support specialist wearing a headset",
};

export const SPEAK_WITH_SPECIALIST_BODY =
  "Need help with an urgent trip, same-day departure or complex itinerary? Speak directly with a travel specialist about your plans.";

/** Reuses an already-verified photo id from `SERVICES`'s "group-travel"
 * card (`data/content.ts`). */
export const UNDERSTAND_JOURNEY_IMAGE = {
  src: unsplash("1600880292203-757bb62b4baf"),
  alt: "Two travel specialists reviewing a journey together",
};

export const UNDERSTAND_JOURNEY_BODY =
  "The more we know, the better we can tailor your international travel options. When submitting an enquiry, include:";

export const UNDERSTAND_JOURNEY_ITEMS: string[][] = [
  ["Departure city & destination", "Preferred travel dates", "Cabin preference", "One-way, return or multi-city"],
  ["Number of travelers", "Existing booking, if applicable", "Preferred airline, if any", "Any additional travel requirements"],
];

export const ENQUIRY_STEPS = [
  {
    id: "receive-enquiry",
    titleLines: "We Receive Your\nEnquiry",
    descriptionLines: "Route, dates & preferences.",
  },
  {
    id: "specialist-reviews",
    titleLines: "A Specialist Reviews\nYour Plans",
    descriptionLines: "Our specialists evaluate available\nBusiness Class possibilities.",
  },
  {
    id: "explore-options",
    titleLines: "We Explore Suitable\nOptions",
    descriptionLines: "We present the options.\nYou decide.",
  },
];

/** Reuses an already-verified photo id from the Flight Change page's hero
 * sub-image. */
export const TRAVEL_SUPPORT_IMAGE = {
  src: unsplash("1530521954074-e64f6810b32d"),
  alt: "A business traveller on a call while reviewing his travel plans",
};

export const TRAVEL_SUPPORT_BODY = "We provide personalised travel guidance for:";

export const TRAVEL_SUPPORT_ITEMS: string[][] = [
  ["Business Travelers", "Families & Leisure Travelers", "Premium & Business Class Travelers", "Students & First-Time Travelers"],
  ["Senior Travelers", "Corporate Travel", "Travelers Facing Flight Disruptions"],
];

export interface ContactSupportItem {
  id: string;
  title: string;
  description: string;
}

export const CONTACT_SUPPORT_ITEMS: ContactSupportItem[] = [
  {
    id: "call-us",
    title: "Call Us",
    description: "Immediate assistance available for urgent travel plan changes.",
  },
  {
    id: "business-hours",
    title: "Business Hours",
    description: "Availability windows for both local and international enquiries.",
  },
  {
    id: "submit-enquiry",
    title: "Submit an Enquiry",
    description: "Fill out our contact form for a tailored response.",
  },
  {
    id: "service-regions",
    title: "Service Regions",
    description: "Overview of the global markets we actively support.",
  },
];

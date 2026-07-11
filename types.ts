export type RSVPStatus = "pending" | "going" | "maybe" | "declined";

export interface EventData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  hostName: string;
  startsAt: string;
  endsAt: string;
  locationName: string;
  locationAddress: string;
  navigationUrl: string;
  dressCode: string;
  rsvpDeadline: string;
  attendeeDirectoryEnabled: boolean;
}

export interface InviteeProfile {
  isPublic: boolean;
  displayName: string;
  occupation: string;
  interests: string[];
  city: string;
  instagramUsername: string;
  bio: string;
  showOccupation: boolean;
  showInterests: boolean;
  showInstagram: boolean;
  avatarSeed: string;
}

export interface Invitee {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  token: string;
  group: string;
  maxGuests: number;
  status: RSVPStatus;
  guestCount: number;
  guestNames: string;
  dietaryNotes: string;
  noteToHost: string;
  openedAt: string | null;
  respondedAt: string | null;
  profile: InviteeProfile;
}

export interface MessageRecord {
  id: string;
  eventId: string;
  audience: "all" | "pending" | "going" | "maybe";
  content: string;
  recipients: number;
  status: "simulated";
  createdAt: string;
}

export interface Database {
  event: EventData;
  invitees: Invitee[];
  messages: MessageRecord[];
}

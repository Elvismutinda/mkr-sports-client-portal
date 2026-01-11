import {
  Instagram,
  Twitter,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  instagram: Instagram,
  twitter: Twitter,
  message: MessageSquare,
  mail: Mail,
  phone: Phone,
  map: MapPin,
};
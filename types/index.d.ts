export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type LandingConfig = {
  mainNav: MainNavItem[];
};

export type FooterConfig = {
  quickLinks: NavItem[];
  socials: {
    title: string;
    href: string;
    icon: string;
  }[];
  contact: {
    title: string;
    href: string;
    icon: string;
  }[];
};

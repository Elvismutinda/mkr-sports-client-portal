interface OtherLayoutProps {
  children: React.ReactNode;
}

export default function OtherLayout({ children }: OtherLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}

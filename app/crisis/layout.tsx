export default function CrisisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="crisis-layout min-h-screen bg-[#1a0000] text-white">
      {children}
    </div>
  );
}

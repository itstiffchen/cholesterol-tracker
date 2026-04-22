export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-serif text-2xl font-normal tracking-tight">
      <span className="bg-gradient-to-r from-[#243b6b] via-[#3d5a9e] to-[#5c4d7a] bg-clip-text text-transparent">
        {children}
      </span>
      <span
        className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#60a5fa]"
        aria-hidden
      />
    </h2>
  );
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 15% 10%, rgba(30,27,75,0.55), transparent 55%), radial-gradient(100% 90% at 85% 90%, rgba(15,23,42,0.7), transparent 50%), var(--bg-base)',
        }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture opacity-60" />

      {/* Ambient orbs */}
      <div
        className="orb-1 absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-[120px] opacity-30"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />
      <div
        className="orb-2 absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full blur-[130px] opacity-25"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
      />
      <div
        className="orb-3 absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 120% at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%)' }}
      />
    </div>
  );
}

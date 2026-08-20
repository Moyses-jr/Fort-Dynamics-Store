export default function CatalogoHeader() {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-[2px] bg-[#F5C542]" />
        <span className="text-[#F5C542] text-[10px] uppercase tracking-[0.3em]">
          Fort Dynamic
        </span>
      </div>

      <h2
        className="text-white leading-none mb-4"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 8vw, 6rem)",
        }}
      >
        CATÁLOGO{" "}
        <span
          style={{
            WebkitTextStroke: "2px #F5C542",
            color: "transparent",
          }}
        >
          FD STORE
        </span>
      </h2>

      <p className="text-white/50 max-w-xl text-sm leading-relaxed">
        Personalize seu produto do seu jeito. Escolha o modelo, o tecido, a cor,
        o tamanho e a posição da impressão.
      </p>
    </>
  );
}

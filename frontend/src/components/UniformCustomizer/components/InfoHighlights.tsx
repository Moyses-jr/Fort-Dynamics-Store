import { infoHighlights } from "../data";

export function InfoHighlights() {
  return (
    <div className="mt-12 grid md:grid-cols-3 gap-6">
      {infoHighlights.map(({ title, description }) => (
        <div
          key={title}
          className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6 text-center"
        >
          <h4 className="text-fd-gold font-bold mb-2">{title}</h4>
          <p className="text-fd-white/70 text-sm">{description}</p>
        </div>
      ))}
    </div>
  );
}

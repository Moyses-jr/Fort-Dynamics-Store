import { Sparkles, ArrowRight } from 'lucide-react';
import type { Collection } from '../types';

type CollectionsProps = {
  collections: Collection[];
  onViewCollection: (collection: Collection) => void;
};

export function Collections({ collections, onViewCollection }: CollectionsProps) {
  return (
    <section className="py-20 bg-fd-gray/30">
      <div className="container-fd">
        <div className="text-center mb-12">
          <h2 className="text-fd-white mb-4">Coleções Exclusivas</h2>
          <p className="text-fd-white/60 max-w-2xl mx-auto">
            Coleções criadas com inteligência artificial combinando personagens, estampas e estilo único.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="card-premium rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => onViewCollection(collection)}
            >
              {/* Cover Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={collection.coverImage}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fd-black via-fd-black/50 to-transparent" />
                
                {/* AI Badge */}
                {collection.aiGenerated && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-fd-gold/90 text-fd-black text-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    IA
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-block px-3 py-1 bg-fd-gold/20 border border-fd-gold/40 rounded text-fd-gold text-xs uppercase tracking-wider mb-3">
                    {collection.theme}
                  </div>
                  <h3 className="text-fd-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-fd-white/80 text-sm mb-4">
                    {collection.description}
                  </p>
                  
                  {/* Character Preview */}
                  {collection.character && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-fd-gold">
                        <img
                          src={collection.character.imageUrl}
                          alt={collection.character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-fd-gold">Personagem</div>
                        <div className="text-sm text-fd-white">{collection.character.name}</div>
                      </div>
                    </div>
                  )}

                  <button className="group/btn flex items-center gap-2 text-fd-gold hover:gap-3 transition-all">
                    Ver Coleção
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products Preview */}
              <div className="p-4 border-t border-fd-gray-lighter">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-fd-white/60">
                    {collection.products.length} {collection.products.length === 1 ? 'produto' : 'produtos'}
                  </span>
                  <span className="text-fd-gold">
                    A partir de R$ {Math.min(...collection.products.map(p => p.basePrice)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

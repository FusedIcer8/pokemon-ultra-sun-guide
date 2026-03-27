import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItemBySlug, getAllItems } from '@/lib/content/loader';

const PHASE_COLORS: Record<string, string> = {
  early: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  late: 'bg-purple-100 text-purple-700',
  postgame: 'bg-orange-100 text-orange-700',
};

const CATEGORY_COLORS: Record<string, string> = {
  tm: 'bg-indigo-100 text-indigo-700',
  'z-crystal': 'bg-yellow-100 text-yellow-800',
  'key-item': 'bg-red-100 text-red-700',
  'evolution-item': 'bg-pink-100 text-pink-700',
  'held-item': 'bg-cyan-100 text-cyan-700',
  medicine: 'bg-green-100 text-green-700',
  berry: 'bg-lime-100 text-lime-700',
  'battle-item': 'bg-orange-100 text-orange-700',
  valuable: 'bg-amber-100 text-amber-700',
};

export function generateStaticParams() {
  return getAllItems().map((i) => ({ slug: i.slug }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);

  if (!item) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/items" className="hover:text-red-600 transition-colors">
          Items
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-900 font-medium truncate">{item.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{item.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.category.replace('-', ' ')}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  PHASE_COLORS[item.gamePhase] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.gamePhase}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
      </section>

      {/* Where to Find */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Where to Find</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-600 mb-2">{item.location}</p>
          {item.locationSlug && (
            <Link
              href={`/routes/${item.locationSlug}`}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              View route details &rarr;
            </Link>
          )}
        </div>
      </section>

      {/* How to Get */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">How to Get</h2>
        <p className="text-gray-600 leading-relaxed">{item.howToGet}</p>
      </section>

      {/* Missable Warning */}
      {item.missable && (
        <section className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl shrink-0 mt-0.5">⚠️</span>
              <div>
                <h3 className="font-bold text-red-700 mb-1">Missable Item</h3>
                <p className="text-sm text-red-700">
                  This item can be permanently missed if you progress past a certain
                  point in the story. Make sure to pick it up before moving on.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Pokemon */}
      {item.relatedPokemon && item.relatedPokemon.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Related Pokemon</h2>
          <div className="flex flex-wrap gap-2">
            {item.relatedPokemon.map((pokemon) => (
              <span
                key={pokemon}
                className="text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1"
              >
                {pokemon}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Separator + Back link */}
      <div className="border-t border-gray-200 pt-6">
        <Link
          href="/items"
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          &larr; Back to Items
        </Link>
      </div>
    </div>
  );
}

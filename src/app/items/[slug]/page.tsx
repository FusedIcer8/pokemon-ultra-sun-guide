import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItemBySlug, getAllItems } from '@/lib/content/loader';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronRight,
  MapPin,
  AlertTriangle,
  Sparkles,
  Info,
} from 'lucide-react';

const PHASE_COLORS: Record<string, string> = {
  early: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  mid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  late: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  postgame:
    'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

const CATEGORY_COLORS: Record<string, string> = {
  tm: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'z-crystal':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'key-item': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'evolution-item':
    'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'held-item': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  medicine: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  berry: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
  'battle-item':
    'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  valuable: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
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
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/items" className="hover:text-red-600 transition-colors">
          Items
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
          {item.name}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{item.icon}</span>
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={CATEGORY_COLORS[item.category] || ''}>
                {item.category.replace('-', ' ')}
              </Badge>
              <Badge className={PHASE_COLORS[item.gamePhase]}>
                {item.gamePhase}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Info size={18} className="text-blue-500" />
          Description
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {item.description}
        </p>
      </section>

      {/* Location */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <MapPin size={18} className="text-green-500" />
          Location
        </h2>
        <Card>
          <CardContent className="pt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {item.location}
            </p>
            {item.locationSlug && (
              <Link
                href={`/routes/${item.locationSlug}`}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                View route details →
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      {/* How to Get */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-500" />
          How to Get
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {item.howToGet}
        </p>
      </section>

      {/* Missable Warning */}
      {item.missable && (
        <section className="mb-8">
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <AlertTriangle
              size={20}
              className="text-red-500 shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">
                Missable Item
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400/80">
                This item can be permanently missed if you progress past a
                certain point in the story. Make sure to pick it up before
                moving on.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Related Pokemon */}
      {item.relatedPokemon && item.relatedPokemon.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Related Pokemon</h2>
          <div className="flex flex-wrap gap-2">
            {item.relatedPokemon.map((pokemon) => (
              <Badge key={pokemon} variant="outline" className="text-sm px-3 py-1">
                {pokemon}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <Separator className="mb-6" />

      {/* Back link */}
      <Link
        href="/items"
        className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
      >
        ← Back to Items
      </Link>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStoryBySlug, getAllStorySteps } from '@/lib/content/loader';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { SpoilerBlock } from '@/components/shared/SpoilerBlock';
import { StoryObjectivesChecklist } from './objectives-checklist';

export function generateStaticParams() {
  return getAllStorySteps().map((s) => ({ slug: s.slug }));
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const step = getStoryBySlug(slug);

  if (!step) notFound();

  const allSteps = getAllStorySteps();
  const currentIndex = allSteps.findIndex((s) => s.slug === slug);
  const prevStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/story" className="hover:text-red-600 transition-colors">
          Story
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">
          {step.title}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
            Chapter {step.chapter}
          </span>
          <IslandBadge island={step.island as 'melemele' | 'akala' | 'ula-ula' | 'poni' | 'aether'} size="md" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{step.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          {step.summary}
        </p>
      </div>

      <div className="h-px bg-gray-200 mb-8" />

      {/* Objectives */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Objectives</h2>
        <StoryObjectivesChecklist stepId={step.id} objectives={step.objectives} />
      </section>

      {/* Common Blockers */}
      {step.blockers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Common Blockers</h2>
          <div className="flex flex-col gap-3">
            {step.blockers.map((blocker, i) => (
              <div
                key={i}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <h3 className="font-semibold text-amber-800 text-sm mb-1">{blocker.problem}</h3>
                <p className="text-sm text-amber-700">{blocker.solution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Items */}
      {step.keyItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Items</h2>
          <div className="flex flex-wrap gap-2">
            {step.keyItems.map((item, i) => (
              <span
                key={i}
                className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Rewards */}
      {step.rewards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rewards</h2>
          <div className="flex flex-wrap gap-2">
            {step.rewards.map((reward) => (
              <span
                key={reward}
                className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200"
              >
                {reward}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gray-200 mb-8" />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {prevStep ? (
          <Link
            href={`/story/${prevStep.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate max-w-[200px]">{prevStep.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextStep ? (
          <Link
            href={`/story/${nextStep.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium bg-red-600 text-white px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
          >
            <span className="truncate max-w-[200px]">Next: {nextStep.title}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href="/story"
            className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            Back to Story
          </Link>
        )}
      </div>
    </div>
  );
}

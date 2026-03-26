import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStoryBySlug, getAllStorySteps } from '@/lib/content/loader';
import { IslandBadge } from '@/components/shared/IslandBadge';
import { SpoilerBlock } from '@/components/shared/SpoilerBlock';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, ChevronLeft, AlertTriangle, Gift, Key } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/story" className="hover:text-red-600 transition-colors">
          Story
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
          {step.title}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs">
            Chapter {step.chapter}
          </Badge>
          <IslandBadge island={step.island as any} size="md" />
        </div>
        <h1 className="text-3xl font-bold mb-3">{step.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          {step.summary}
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Objectives */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Objectives</h2>
        <StoryObjectivesChecklist stepId={step.id} objectives={step.objectives} />
      </section>

      {/* Common Blockers */}
      {step.blockers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Common Blockers
          </h2>
          <Accordion type="multiple" className="rounded-lg border">
            {step.blockers.map((blocker, i) => (
              <AccordionItem key={i} value={`blocker-${i}`}>
                <AccordionTrigger className="px-4 text-left">
                  <span className="font-medium">{blocker.problem}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {blocker.solution}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Key Items */}
      {step.keyItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key size={20} className="text-blue-500" />
            Key Items
          </h2>
          <div className="flex flex-wrap gap-2">
            {step.keyItems.map((item, i) => (
              <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                {typeof item === 'string' ? item : (item as any).name || JSON.stringify(item)}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Rewards */}
      {step.rewards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift size={20} className="text-green-500" />
            Rewards
          </h2>
          <div className="flex flex-wrap gap-2">
            {step.rewards.map((reward) => (
              <Badge
                key={reward}
                variant="outline"
                className="text-sm px-3 py-1 border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
              >
                {reward}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <Separator className="mb-8" />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {prevStep ? (
          <Link
            href={`/story/${prevStep.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="truncate max-w-[200px]">{prevStep.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextStep ? (
          <Link
            href={`/story/${nextStep.slug}`}
            className="flex items-center gap-2 text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <span className="truncate max-w-[200px]">Next: {nextStep.title}</span>
            <ChevronRight size={16} />
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

import { fetchCompletionStatus, fetchLessonById } from "@/app/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { canViewCourse } from "@/lib/isauthorised";
import { getServerSession } from "next-auth";
import CompletionButton from "./components/CompletionButton";
import BackButton from "@/components/BackButton";

export default async function LessonPage({
  params,
}: {
  params: { chapter: string; lesson: string };
}) {
  await canViewCourse();
  const lesson = await fetchLessonById(params.lesson);
  const session = await getServerSession(authOptions);
  const isCompleted = await fetchCompletionStatus(
    lesson?.id!,
    session?.user?.id!,
  );
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 flex justify-center items-center">
      <BackButton />
      <div className="lg:w-4/6 w-11/12 aspect-video rounded-md overflow-hidden">
        <CompletionButton
          isCompleted={isCompleted ?? false}
          lessonId={lesson?.id!}
          userId={session?.user?.id!}
          chapter={params.chapter}
        />
        {lesson?.link ? (
          <iframe
            src={lesson?.link.replace("watch?v=", "embed/")}
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        ) : (
          <div className="w-full h-full bg-[#13171D] flex flex-col justify-center items-center">
            <h4 className="text-3xl font-medium text-neutral-300">
              No trailer available...
            </h4>
          </div>
        )}
      </div>
    </main>
  );
}

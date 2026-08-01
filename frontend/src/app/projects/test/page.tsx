import { Canvas } from "@/app/projects/test/_components/canvas/canvas";
import Toolbox from "@/app/projects/test/_components/toolbox";
import { EditorProvider } from "@/app/projects/test/_providers/editor-providers";

import { Section } from "@/components/layout/section";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectId({ params }: PageProps) {
  const { id } = await params;

  return (
    <Section className="p-0">
      <EditorProvider>
        <Toolbox />

        <Canvas />
      </EditorProvider>
    </Section>
  );
}

import { Canvas } from "@/app/projects/test/_components/canvas/canvas";
import Toolbar from "@/app/projects/test/_components/toolbar";
import Toolbox from "@/app/projects/test/_components/toolbox";
import { EditorProvider } from "@/app/projects/test/_providers/editor-provider";

import { Section } from "@/components/layout/section";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectId({ params }: PageProps) {
  const { id } = await params;

  return (
    <EditorProvider>
      <Section className="flex items-center justify-center p-0">
        <Toolbar />

        <Toolbox />

        <Canvas />
      </Section>
    </EditorProvider>
  );
}

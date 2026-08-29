import { ReactFlowProvider } from "@xyflow/react";

import { Toolbox } from "@/app/projects/test/_components/layout/toolbox";
import { Canvas } from "@/app/projects/test/_components/canvas/canvas";
import { Properties } from "@/app/projects/test/_components/layout/properties";
import { EditorProvider } from "@/app/projects/test/_providers/editor/provider";
import { ExecutorProvider } from "@/app/projects/test/_providers/executor/provider";
import { EngineProvider } from "@/app/projects/test/_providers/engine/provider";

import { Section } from "@/components/layout/section";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectId({ params }: PageProps) {
  const { id } = await params;

  return (
    <ReactFlowProvider>
      <EditorProvider>
        <ExecutorProvider>
          <EngineProvider>
            <Section className="grid grid-cols-[auto_1fr_auto] p-0">
              <Toolbox />

              <Canvas />

              <Properties />
            </Section>
          </EngineProvider>
        </ExecutorProvider>
      </EditorProvider>
    </ReactFlowProvider>
  );
}

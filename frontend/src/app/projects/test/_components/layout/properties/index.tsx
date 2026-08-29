"use client";

import { useEffect, useState } from "react";

import { useEditorAction, useEditorState } from "@/app/projects/test/_hooks/use-editor";
import { useEngine } from "@/app/projects/test/_hooks/use-engine";
import { PropertiesBanner } from "@/app/projects/test/_components/layout/properties/banner/main";
import { PropertiesInfo } from "@/app/projects/test/_components/layout/properties/info/main";
import { PropertiesInputs } from "@/app/projects/test/_components/layout/properties/inputs/main";
import { PropertiesOutputs } from "@/app/projects/test/_components/layout/properties/outputs/main";
import { PropertiesMeta } from "@/app/projects/test/_components/layout/properties/meta/main";

import { Frame } from "@/components/ui/decorations/frame";

import { cn } from "@/lib/utils/cn";

export function Properties() {
  const { query: editorQuery } = useEditorState();
  const { action: editorAction } = useEditorAction();

  const { execution, node: currentNode } = useEngine();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editorQuery.activeNode && editorQuery.selectionCount === 1) setIsOpen(true);
  }, [editorQuery.activeNode, editorQuery.selectionCount]);

  const node = editorQuery.activeNode;

  return (
    <aside
      className={cn(
        "grid grid-cols-[0fr] overflow-y-hidden transition-[grid-template-columns] duration-200",
        isOpen && "grid-cols-[1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="relative mt-4 mr-4 h-[calc(100%-30px)] w-100">
          <Frame label="PROPERTIES">
            {node ? (
              <div className="flex size-full min-h-0 flex-col overflow-hidden">
                <PropertiesBanner
                  nodeId={node.id}
                  type={node.type}
                  icon={node.data.icon}
                  label={node.data.label}
                  onExecute={execution.execute}
                  onNodeSkip={currentNode.skip}
                />

                <div className="custom-scroll min-h-0 space-y-6 overflow-x-hidden overflow-y-auto p-4 text-xs">
                  <PropertiesInfo />

                  <PropertiesInputs node={node} config={node.data.config} action={editorAction} />

                  <PropertiesOutputs output={node.data.output} />

                  <PropertiesMeta
                    nodeId={node.id}
                    runtime={node.data.runtime}
                    onDelete={(nodeId) => editorAction.deleteNode(nodeId)}
                  />
                </div>
              </div>
            ) : (
              <div>Please select a node</div>
            )}
          </Frame>
        </div>
      </div>
    </aside>
  );
}

import { useState } from "react";

import { Play, Square, Pause, Trash, FastForward, Copy } from "lucide-react";

import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import { ExecutionRequest } from "@/lib/api/executor";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

const ICONS = {
  RUN: Play,
  PAUSE: Pause,
  CANCEL: Square,
  SKIP: FastForward,

  DELETE: Trash,
  COPY: Copy,
};

export function QuickActions(props: BaseNode) {
  const { state, dispatch } = useEditor();

  const { run } = useExecutor();
  
  return (
    <div className="bg-white-ink relative border-2 p-4 font-sans shadow-sm">
      {}
    </div>
  );
}

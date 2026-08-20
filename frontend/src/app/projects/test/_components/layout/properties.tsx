import { useState } from "react";

import {
  Globe,
  List,
  Code2,
  FileText,
  Link2,
  Clock,
  Plus,
  Trash2,
  Focus,
} from "lucide-react";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";

type Properties = {
  id: string;
  data: Base;
  x: number;
  y: number;
};

export function Properties(props: Properties) {
  const { state, dispatch } = useEditor();
  const [label, setLabel] = useState(props.data.label);

  return (
    <div className="relative w-80 rounded-lg border-2 border-slate-900 bg-white p-4 font-sans shadow-sm">
      {/* Top Right Decorative Ribbon */}
      <div className="absolute top-0 right-0 h-0 w-0 border-t-[20px] border-l-[20px] border-t-rose-500 border-l-transparent" />

      {/* Header Section */}
      <div className="flex items-start gap-3 pb-3">
        {/* Diamond Icon Container */}
        <div className="flex h-10 w-10 shrink-0 rotate-45 items-center justify-center border-2 border-slate-900 bg-white">
          <Globe className="h-5 w-5 -rotate-45 text-slate-800" />
        </div>

        <div className="flex-1 space-y-1">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            className="w-full rounded px-1 text-lg font-bold text-slate-900 focus:ring-1 focus:ring-slate-300 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="rounded border border-rose-400 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500 uppercase">
              HTTP REQUEST
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "MODIFY_BADGE",
                  payload: {
                    method: "CREATE",
                    nodeId: props.id,
                    badge: "HTTP REQUEST",
                  },
                })
              }
              className="flex h-5 w-5 items-center justify-center rounded border border-slate-400 text-slate-600 hover:bg-slate-100"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => console.log("delete")}
              className="ml-auto text-slate-400 hover:text-rose-500"
              title="Delete node"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-2.5 border-t border-dashed border-slate-300 py-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-700 uppercase">
            <List className="h-4 w-4 text-slate-500" />
            <span>Headers</span>
          </div>
          <span className="max-w-[140px] truncate font-mono text-slate-600">
            {'{"Content-type":"applicatio...'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-700 uppercase">
            <Code2 className="h-4 w-4 text-slate-500" />
            <span>Method</span>
          </div>
          <span className="font-mono font-semibold text-slate-700">GET</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-700 uppercase">
            <FileText className="h-4 w-4 text-slate-500" />
            <span>Body</span>
          </div>
          <span className="max-w-[140px] truncate font-mono text-slate-600">
            Hello world from hee hee ha...
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-700 uppercase">
            <Link2 className="h-4 w-4 text-slate-500" />
            <span>URL</span>
          </div>
          <span className="max-w-[140px] truncate font-mono text-slate-600">
            https://httpbingo.org/get
          </span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            X: {Math.round(props.x)} Y: {Math.round(props.y)}
          </span>
        </div>
        <Focus className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useResponseStore } from "@/store/response";

function tryPrettyPrint(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export default function ResponseBody() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const response = useResponseStore((s) => s.response);

  useEffect(() => {
    if (!editorRef.current) return;

    const doc = response ? tryPrettyPrint(response.body) : "";

    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: doc,
        },
      });
      return;
    }

    viewRef.current = new EditorView({
      state: EditorState.create({
        doc,
        extensions: [
          lineNumbers(),
          json(),
          oneDark,
          EditorView.editable.of(false),
          EditorView.theme({
            "&": { height: "100%", backgroundColor: "transparent" },
            ".cm-scroller": {
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: "13px",
            },
          }),
        ],
      }),
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [response]);

  return <div ref={editorRef} className="h-full w-full" />;
}

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useActiveRequestStore } from "@/store/activeRequest";

export default function BodyEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { request, updateField } = useActiveRequestStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: request?.body ?? "",
        extensions: [
          keymap.of(defaultKeymap),
          lineNumbers(),
          json(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              updateField("body", update.state.doc.toString());
            }
          }),
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

    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  if (!request) return null;

  return <div ref={editorRef} className="h-full w-full overflow-auto" />;
}

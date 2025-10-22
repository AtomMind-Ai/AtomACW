import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ text, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    onUpdate: ({ editor }) => onChange(editor.getText()),
  });

  useEffect(() => {
    if (editor && text !== editor.getText()) editor.commands.setContent(text);
  }, [text]);

  return (
    <div className="border rounded-2xl shadow-sm p-4 bg-white h-full overflow-y-auto">
      <EditorContent editor={editor} />
    </div>
  );
}

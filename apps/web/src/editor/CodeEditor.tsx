import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/editor';
import 'monaco-editor/features/register.all';
import 'monaco-editor/languages/definitions/typescript/register';
import 'monaco-editor/languages/features/typescript/register';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import TypeScriptWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker';

// Bundle workers locally rather than fetching editor code from a CDN.
self.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    return label === 'typescript' || label === 'javascript'
      ? new TypeScriptWorker()
      : new EditorWorker();
  },
};

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ initialValue, onChange }: CodeEditorProps) {
  const container = useRef<HTMLDivElement>(null);
  const changeHandler = useRef(onChange);
  changeHandler.current = onChange;

  useEffect(() => {
    if (!container.current) return;

    const model = monaco.editor.createModel(initialValue, 'typescript');
    const editor = monaco.editor.create(container.current, {
      model,
      theme: 'vs-dark',
      automaticLayout: true,
      editContext: false,
      fontSize: 15,
      fontFamily: 'Consolas, "SFMono-Regular", monospace',
      lineHeight: 25,
      minimap: { enabled: false },
      padding: { top: 24, bottom: 24 },
      scrollBeyondLastLine: false,
      tabSize: 2,
      ariaLabel: 'Code editor for main.ts',
    });
    const subscription = model.onDidChangeContent(() => {
      changeHandler.current(model.getValue());
    });

    return () => {
      subscription.dispose();
      editor.dispose();
      model.dispose();
    };
  }, [initialValue]);

  return <div className="monaco-container" ref={container} />;
}

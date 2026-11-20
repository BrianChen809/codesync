import { useEffect, useState } from 'react';
import { CodeEditor } from './editor/CodeEditor';
import { fileName, initialCode } from './editor/sample';

export function App() {
  const [code, setCode] = useState(initialCode);
  const [editorVersion, setEditorVersion] = useState(0);
  const edited = code !== initialCode;

  useEffect(() => {
    if (!edited) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [edited]);

  function resetSample() {
    if (!window.confirm('Discard your changes and restore the sample?')) return;
    setCode(initialCode);
    setEditorVersion((version) => version + 1);
  }

  function downloadFile() {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="workspace">
      <a className="skip-link" href="#editor">Skip to editor</a>
      <header className="topbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true">{'{ }'}</span>CodeSync</div>
        <span className="workspace-title">My first workspace</span>
        <span className="local-badge">Local session</span>
      </header>

      <aside className="sidebar" aria-label="Workspace files">
        <div className="sidebar-label">EXPLORER</div>
        <div className="folder-name"><span aria-hidden="true">⌄</span> Getting started</div>
        <div className="file-item" aria-current="page">
          <span className="ts-icon" aria-hidden="true">TS</span>{fileName}
        </div>
        <div className="sidebar-note">
          <span className="eyebrow">YOUR WORKSPACE STARTS HERE</span>
          <p>One file. A place to build.</p>
          <span>Shared editing is the next milestone.</span>
        </div>
      </aside>

      <main className="main-panel" id="editor" tabIndex={-1}>
        <div className="editor-toolbar">
          <h1><span className="ts-icon" aria-hidden="true">TS</span>{fileName}</h1>
          <div className="editor-actions">
            <button className="button-secondary" onClick={resetSample} disabled={!edited}>Reset sample</button>
            <button className="button-primary" onClick={downloadFile}>Download file</button>
          </div>
        </div>
        <div className="breadcrumbs">Getting started <span aria-hidden="true">/</span> <span>{fileName}</span></div>
        <section className="editor-surface" aria-label="TypeScript editor">
          <CodeEditor key={editorVersion} initialValue={initialCode} onChange={setCode} />
        </section>
        <section className="session-panel" aria-labelledby="session-heading">
          <div className="panel-heading"><h2 id="session-heading">Workspace notes</h2><span>MILESTONE 01</span></div>
          <p>Edit TypeScript with syntax highlighting and suggestions. Press <kbd>Ctrl</kbd> + <kbd>Space</kbd> to open suggestions.</p>
          <p className="muted">Changes stay in this tab until you close or reload it. Download a copy to keep your work. Code execution is not available yet.</p>
        </section>
      </main>

      <footer className="statusbar">
        <span className="session-status"><span className="status-dot" aria-hidden="true" />Browser only</span>
        <span role="status">{edited ? 'Edited in this tab · not saved' : 'Sample loaded · not saved'}</span>
        <span className="language-status">TypeScript <span>UTF-8</span></span>
      </footer>
    </div>
  );
}

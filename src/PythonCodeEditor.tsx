import { useMemo } from 'react'
import CodeMirror, { type ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'

export type PythonCodeEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  minHeight?: string
  maxHeight?: string
  readOnly?: boolean
  onPasteBlock?: () => void
  className?: string
  ariaLabel?: string
}

export default function PythonCodeEditor({
  value,
  onChange,
  placeholder = '# Tulis kode program Python Anda di sini...',
  height = '100%',
  minHeight = '360px',
  maxHeight,
  readOnly = false,
  onPasteBlock,
  className = '',
  ariaLabel = 'Python Code Editor',
}: PythonCodeEditorProps) {
  // Custom theme adjustments to match SinauPy IDE design
  const extensions = useMemo(() => {
    const list = [
      python(),
      oneDark,
      EditorView.theme({
        '&': {
          fontSize: '14px',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          backgroundColor: '#091222',
        },
        '.cm-scroller': {
          fontFamily: 'inherit',
          lineHeight: '1.6',
          overflow: 'auto',
        },
        '.cm-gutters': {
          backgroundColor: '#060c17',
          color: '#475569',
          borderRight: '1px solid #1e293b',
          userSelect: 'none',
          paddingRight: '6px',
        },
        '.cm-activeLineGutter': {
          backgroundColor: '#0f1c30',
          color: '#38bdf8',
          fontWeight: '700',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
        },
        '.cm-cursor': {
          borderLeftColor: '#38bdf8',
          borderLeftWidth: '2px',
        },
        '.cm-selectionBackground, ::selection': {
          backgroundColor: 'rgba(49, 93, 155, 0.45) !important',
        },
      }),
    ]

    // If paste blocking is requested, intercept paste in CodeMirror
    if (onPasteBlock) {
      list.push(
        EditorView.domEventHandlers({
          paste(event) {
            event.preventDefault()
            onPasteBlock()
            return true
          },
          drop(event) {
            event.preventDefault()
            onPasteBlock()
            return true
          },
        })
      )
    }

    return list
  }, [onPasteBlock])

  const basicSetupConfig: ReactCodeMirrorProps['basicSetup'] = useMemo(
    () => ({
      lineNumbers: true,
      highlightActiveLineGutter: true,
      highlightSpecialChars: true,
      history: true,
      foldGutter: false,
      drawSelection: true,
      dropCursor: false,
      allowMultipleSelections: false,
      indentOnInput: true,
      bracketMatching: true,
      closeBrackets: true,
      autocompletion: true,
      rectangularSelection: true,
      crosshairCursor: false,
      highlightActiveLine: true,
      highlightSelectionMatches: true,
      closeBracketsKeymap: true,
      defaultKeymap: true,
      searchKeymap: true,
      historyKeymap: true,
      foldKeymap: true,
      completionKeymap: true,
      lintKeymap: true,
      tabSize: 4,
    }),
    []
  )

  return (
    <div
      className={`python-code-editor-container ${className}`}
      style={{ height, minHeight, maxHeight, display: 'flex', flexDirection: 'column' }}
      aria-label={ariaLabel}
    >
      <CodeMirror
        value={value}
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        theme={oneDark}
        extensions={extensions}
        basicSetup={basicSetupConfig}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{ height: '100%', flex: 1 }}
      />
    </div>
  )
}

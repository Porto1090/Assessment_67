import { useEffect, useRef, useState } from 'react'

export default function Output({ editorRef, setAst }) {
  const terminalRef = useRef(null)
  const actualLineRef = useRef(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4321'

  const [lines, setLines] = useState([
    {
      type: 'system',
      text: 'Ready. Press Run to execute code.',
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    actualLineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [lines])

  const executeCode = async (sourceCode) => {
    const response = await fetch(`${BACKEND_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: sourceCode,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.detail || 'Compilation failed')
    }

    // console.log(result.ast)

    return result
  }

  const appendLine = (text, type = 'output') => {
    setLines((prev) => [...prev, { text, type }])
  }

  const compileCode = async () => {
    const sourceCode = editorRef.current?.getValue()

    if (!sourceCode || isLoading) return

    try {
      setIsLoading(true)

      appendLine('$ run', 'command')

      const result = await executeCode(sourceCode)
      const {
        run,
        ast: compiledAst,
        lexical_errors = [],
        syntax_errors = [],
      } = result

      setAst(compiledAst)

      if (run.output) {
        run.output
          .split('\n')
          .filter(Boolean)
          .forEach((line) => appendLine(line, 'output'))
      }

      const allErrors = [...lexical_errors, ...syntax_errors]

      allErrors.forEach((error) => {
        const prefix =
          error.type === 'lexer'
            ? `>>> Línea ${error.line} - Error léxico: ${error.message}`
            : `>>> Línea ${error.line} - Error de sintaxis: ${error.message}`

        appendLine(prefix, 'error')

        if (error.source) {
          appendLine(error.source, 'error')
        }

        if (typeof error.pointer === 'number') {
          appendLine(`${' '.repeat(error.pointer)}^`, 'error')
        }
      })

      if (run.stderr) {
        run.stderr
          .split('\n')
          .filter(Boolean)
          .forEach((line) => appendLine(line, 'error'))
      }
    } catch (error) {
      appendLine(error.message || 'Unable to run code', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearTerminal = () => {
    setLines([
      {
        text: 'Ready. Press Run to execute code.',
        type: 'system',
      },
    ])

    setAst(null)
  }

  return (
    <div className="flex h-72 min-h-0 flex-col border-t border-white/10 bg-primary">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Terminal
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearTerminal}
            className="rounded px-2 py-1 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={compileCode}
            disabled={isLoading}
            className="rounded border border-green-500 px-3 py-1 text-xs text-green-400 transition hover:bg-green-500/10 disabled:opacity-50"
          >
            {isLoading ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <div ref={terminalRef} className="min-h-0 flex flex-1 flex-col overflow-y-auto px-4 py-3 font-mono text-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            ref={i === lines.length - 1 ? actualLineRef : null}
            className={
              line.type === 'error'
                ? 'text-red-400'
                : line.type === 'command'
                ? 'text-green-400'
                : line.type === 'system'
                ? 'text-gray-500'
                : 'text-gray-300'
            }
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}
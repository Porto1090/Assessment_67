import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Output from "./Output";

export default function CodeEditor() {
  const editorRef = useRef(null)
  const [code, setCode] = useState(`// Escribe tu código a compilar acá
// Recuerda utilizar la documentación a tu derecha para guiarte en el proceso

int suma(int a, int b) {
  int c;
  c = a + b;
  return c;
}

int main() {
  int x;
  int y;
  int z;

  x = 4;
  y = 4;

  z = suma(x, y);

  if (z > 5) {
    z = z * 2;
  } else {
    z = z - 1;
  }

  while (z < 20) {
    z = z + 1;
  }

  return z;
}
`)
  const [language, setLanguage] = useState('python')
  const [ast, setAst] = useState(null)

  return (
    <div className="relative flex h-full w-full flex-col bg-secondary p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-white">
          Editor de código para el Assignment
        </h1>
        <h2 className="mt-1 text-sm text-gray-400">
          El baifo si el chiquillo el caprichoso... LA GRACIOSA
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10">
        <Editor
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onMount={(editor) => {
            editorRef.current = editor
          }}
          onChange={(value) => setCode(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            wordWrap: 'on',
            formatOnPaste: true,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
        <Output 
          editorRef={editorRef}
          setAst={setAst}
        />
      </div>

      {/* <AstDrawer ast={ast} /> */}
    </div>
  )
}
import CodeEditor from '@/sections/home/CodeEditor.jsx'
import Documentation from '@/sections/home/Documentation.jsx'

function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-primary text-gray-300">
      <div className="flex h-full w-full">
        <section className="flex-[2] min-w-0">
          <CodeEditor/>
        </section>
        <aside className="flex-1 min-w-0 border-l border-white/10">
          <Documentation/>
        </aside>
      </div>
    </main>
  )
}

export default Home
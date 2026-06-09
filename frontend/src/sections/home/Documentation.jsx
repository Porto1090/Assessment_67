import { useState, usEffect, useEffect } from 'react'
const sections = [
  {
    title: 'Documentation sections:',
    items: [
      {
        name: "What's new in Portronko 3.14?",
        description: 'Recent language changes and updates.',
      },
      {
        name: 'Tutorial',
        description: "Start here: a tour of Portronko's syntax and features.",
      },
    ],
  },
  {
    title: 'Indices, glossary, and search:',
    items: [
      {
        name: 'Global index',
        description: 'All functions, classes, and terms.',
      },
      {
        name: 'Glossary',
        description: 'Terms explained.',
      },
    ],
  },
  {
    title: 'Project information:',
    items: [
      {
        name: 'Reporting issues',
        description: 'How to report issues and contribute to the project.',
      },
      {
        name: 'Project public repository',
        description: "Access the project's public repository.",
      },
    ],
  },
]

const docs = sections.reduce((acc, section) => {
  section.items.forEach((item) => {
    acc[item.name] = item
  })

  return acc
}, {})

export default function Documentation() {
  const [active, setActive] = useState('home')

  const current = docs[active]
  const canGoBack = active !== 'home'

  useEffect(() => {
    console.log('Current documentation page:', active)
  }, [active])

  // https://docs.python.org/3/

  return (
    <div className="flex h-full w-full flex-col bg-primary p-6">
      <header className="mb-5">
        <h2 className="text-2xl font-semibold text-white">
          Portronko 3.14.5rc1 documentation
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Welcome. This panel contains the official documentation reference and learning resources.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/10 p-5">
        {active == "home" && 
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActive(item.name)}
                      className="block w-full rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-white/10 hover:bg-white/5"
                    >
                      <div className="text-base font-medium text-blue-400">
                        {item.name}
                      </div>

                      <div className="mt-1 text-sm leading-6 text-gray-400">
                        {item.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        }
        
        {active !== "home" && (
          <div>
            <button
              type="button"
              onClick={() => setActive('home')}
              className="mb-4 text-sm text-gray-400 transition hover:text-white"
            >
              &larr; Back to home
            </button>

            <h3 className="text-lg font-medium text-white">{current.name}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {current.description || 'No description available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
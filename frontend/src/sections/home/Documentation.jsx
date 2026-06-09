import { useEffect, useState } from "react";

const sections = [
  {
    title: "Documentation sections:",
    items: [
      {
        name: "What's new in CipherVision?",
        description: "Recent language changes and updates.",
        content: `
CipherVision introduces improvements for source code analysis, syntax validation, and compiler feedback.

Key updates:
• Better syntax error detection
• Improved lexical analysis
• Cleaner compiler output
• More detailed terminal messages
        `,
      },
      {
        name: "Tutorial",
        description: "Start here: a tour of Portronko's syntax and features.",
        content: `
Basic CipherVisionexample:

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

  return z;
}

Use the code editor to write your program and press Run Analysis to evaluate it.
        `,
      },
    ],
  },
  {
    title: "Indices, glossary, and search:",
    items: [
      {
        name: "Global index",
        description: "All functions, classes, and terms.",
        content: `
Global Index:

• int
• return
• if
• while
• function declaration
• variable declaration
• arithmetic operators
• comparison operators
• lexical analysis
• syntax analysis
• AST generation
        `,
      },
      {
        name: "Glossary",
        description: "Terms explained.",
        content: `
Glossary:

Lexer:
Reads the source code and converts it into tokens.

Parser:
Checks if the code follows the grammar rules.

AST:
Abstract Syntax Tree. It represents the structure of the program.

Compiler:
Transforms source code into an intermediate or executable representation.

CNN:
Machine learning model used for visual pattern detection.

SVM:
Machine learning model used for classification tasks.
        `,
      },
    ],
  },
  {
    title: "Project information:",
    items: [
      {
        name: "Reporting issues",
        description: "How to report issues and contribute to the project.",
        content: `
Reporting Issues:

When reporting an issue, include:

• What you were trying to analyze
• The input image or source code
• The error message
• Steps to reproduce the issue
• Expected result
• Actual result

This helps the team debug faster.
        `,
      },
      {
        name: "Project public repository",
        description: "Access the project's public repository.",
        content: `
Repository Information:

This project includes:

• React frontend
• Code editor interface
• Documentation panel
• Image analysis workflow
• Source code analysis workflow
• Backend compiler endpoint

Use Git branches to work safely without affecting main or develop.
        `,
      },
    ],
  },
];

const docs = sections.reduce((acc, section) => {
  section.items.forEach((item) => {
    acc[item.name] = item;
  });

  return acc;
}, {});

export default function Documentation() {
  const [active, setActive] = useState("home");

  const current = docs[active];

  useEffect(() => {
    console.log("Current documentation page:", active);
  }, [active]);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Need Help?
        </h2>

        <p className="mt-4 text-base leading-7 text-slate-500">
          Welcome. This panel contains the official documentation reference and
          learning resources.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {active === "home" && (
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <section
                key={section.title}
                className={
                  sectionIndex !== 0
                    ? "border-t border-slate-200 pt-8"
                    : ""
                }
              >
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-500">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActive(item.name)}
                      className="block w-full rounded-xl px-4 py-4 text-left transition hover:bg-blue-50"
                    >
                      <div className="text-lg font-bold text-blue-600">
                        {item.name}
                      </div>

                      <div className="mt-2 text-base leading-6 text-slate-500">
                        {item.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {active !== "home" && current && (
          <div>
            <button
              type="button"
              onClick={() => setActive("home")}
              className="mb-6 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              ← Back to documentation
            </button>

            <h3 className="text-2xl font-bold text-slate-800">
              {current.name}
            </h3>

            <p className="mt-3 text-base leading-7 text-slate-500">
              {current.description}
            </p>

            <div className="mt-8 rounded-xl bg-slate-50 p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-600">
                {current.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
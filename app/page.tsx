"use client";

import Header from "./components/header";
import ShadesViewer from "./components/shades-viewer/shades-viewer";
import Sidebar from "./components/sidebar/sidebar";
import {useAtomValue} from "jotai";
import {shadesAtom} from "./atom";
import {generateShades} from "./generate-shades";
import {generateShadesProps} from "./generate-shades/generate-shades";

export default function Home() {
  const shadesState = useAtomValue(shadesAtom);

  const shadesObject = generateShades({
    swatches: shadesState.map((swatch) => swatch),
  } as generateShadesProps);

  return (
    <main className="w-screen min-h-screen flex flex-col">
      <Header />
      <div className="px-8 py-16 flex-1 flex flex-col">
        <div className="container mx-auto flex-1 flex flex-col">
          <div className="flex min-w-0 gap-8">
            <div className="min-w-0 md:mr-96 md:pr-8">
              <h1 className="text-4xl font-bold mb-4">Tailwind CSS Config Generator</h1>
              <p className="text-lg">
                Creation and customization of the Tailwind config file (tailwind.config.js), which
                allows the fine-tuning of your project's design system including colors, typography,
                spacing, and more, based on your specific requirements.
              </p>
              <ShadesViewer shadesObject={shadesObject} />
            </div>

            <Sidebar />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Header from "./components/header";
import {ShadesViewer} from "./components/shades-viewer";
import Sidebar from "./components/sidebar/sidebar";

export default function Home() {
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
              <ShadesViewer />
            </div>

            <Sidebar />
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import {useCallback, useLayoutEffect} from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar/sidebar";
import {ShadesViewer} from "./components/viewer";
import {useService} from "./store/provider";

export default function Home() {
  const service = useService();
  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (event.key === "z" && event.metaKey) {
      if (event.shiftKey) {
        service.redo();
      } else {
        service.undo();
      }
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("keydown", handleKeydown, false);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <main className="flex min-h-screen w-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col px-8 py-16">
        <div className="container mx-auto flex flex-1 flex-col">
          <div className="flex min-w-0 gap-8">
            <div className="min-w-0 md:mr-96 md:pr-8">
              <h1 className="mb-4 text-4xl font-bold">Tailwind CSS Config Generator</h1>
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

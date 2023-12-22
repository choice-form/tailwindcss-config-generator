"use client";

import Header from "./components/header";
import ShadesViewer from "./components/shades-viewer";
import Sidebar from "./components/sidebar/sidebar";
import { generateShades, generateShadesProps } from "./swatch/generateShades";
import { useAtomValue } from "jotai";
import { shadesAtom } from "./atom";

export default function Home() {
  const shadesState = useAtomValue(shadesAtom);

  const shadesObject = generateShades({
    swatches: shadesState.map((swatch) => swatch),
  } as generateShadesProps);

  return (
    <div className="w-screen h-screen flex flex-col overflow-auto">
      <Header />

      <ShadesViewer shadesObject={shadesObject} />

      <Sidebar shadesObject={shadesObject} />
    </div>
  );
}

import {useAtom} from "jotai";
import {UiSwitch} from "../ui";
import {darkenWarningAtom, luminanceWarningAtom} from "../../atom";

interface ContrastProps {}

const Contrast = ({}: ContrastProps) => {
  const [luminanceWarning, setLuminanceWarning] = useAtom(luminanceWarningAtom);
  const [darkenWarning, setDarkenWarning] = useAtom(darkenWarningAtom);
  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg backdrop-blur flex flex-col gap-4">
      <h3 className="text-sm">Contrast checker</h3>
      <UiSwitch
        enabled={luminanceWarning}
        setEnabled={setLuminanceWarning}
        label="Luminance warning"
      />
      <UiSwitch enabled={darkenWarning} setEnabled={setDarkenWarning} label="Darken warning" />
    </div>
  );
};

export default Contrast;

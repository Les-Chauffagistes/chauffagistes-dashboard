import { useEffect, useRef, useState } from "react";
import { Weights } from "../../../../../../models/API Payloads/Weights";
import RepartitionPie from "./RepartitionPie";

export default function ResponsivePieContainer({ weights }: { weights: Weights[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(w, 400)); // 400 = limite haute desktop
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <RepartitionPie weights={weights} size={size} />
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false }, 
    particles: {
      number: { value: 50 }, 
      color: { value: "#c9a55a" }, 
      shape: { type: "star" },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: { enable: true, speed: 0.5}
      },
      size: { value: { min: 2, max: 4 } },
      move: {
        enable: true,
        speed: 1,
        direction: "top", 
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" }//to interacte when we put mousse
      },
    },
    modes:{
        repulse:{
distance:150,
duration:0.4,

        },
    },
  }), []);

  if (init) {
    return <Particles id="tsparticles" options={options} className="absolute width 100% height 100% left 0 top 0  inset-0 z-[-1]" />;
  }

  return null;
};

export default ParticlesComponent;
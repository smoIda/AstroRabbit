import { gsap, SplitText, useGSAP } from "@/lib/anims/plugins";

export function Headline({ children }: { children: React.ReactNode }) {
  const isFirstTime =
    typeof window !== "undefined"
      ? sessionStorage.getItem("IS_FIRST_TIME") === null
      : true;

  useGSAP(() => {
    const split = SplitText.create(".section-heading", {
      type: "chars",
    });

    gsap.from(split.chars, {
      yPercent: 105,
      opacity: 0,
      duration: 0.4,
      stagger: {
        each: 0.06,
        from: "random",
      },
      ease: "power3.out",
      delay: isFirstTime ? 1.2 : 0.1,
    });

    return () => split.revert();
  }, [isFirstTime]);

  return (
    <h1 className="section-heading overflow-hidden text-6xl leading-none text-nowrap">
      {children}
    </h1>
  );
}

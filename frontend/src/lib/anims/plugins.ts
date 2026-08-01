import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText, Observer } from "gsap/all";

gsap.registerPlugin(SplitText, Observer);

export { gsap, useGSAP, SplitText, Observer };

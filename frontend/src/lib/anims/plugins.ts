import gsap from "gsap";
import { Observer } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer);

export { gsap, useGSAP, Observer };

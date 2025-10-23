"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const scrollItems = [
  {
    id: 1,
    title: "Smooth Scrolling",
    description: "Experience buttery-smooth scrolling with GSAP ScrollSmoother",
    image: "https://etedge-insights.com/wp-content/uploads/2023/12/shutterstock_2284126663-1.jpg",
  },
  {
    id: 2,
    title: "Parallax Motion",
    description: "Layered depth with data-speed parallax effects",
    image: "https://etedge-insights.com/wp-content/uploads/2023/12/shutterstock_2284126663-1.jpg",
  },
  {
    id: 3,
    title: "Skew Effects",
    description: "Subtle skew animations on scroll for dynamic feel",
    image: "https://etedge-insights.com/wp-content/uploads/2023/12/shutterstock_2284126663-1.jpg",
  },
];

export default function GSAPScrollSmoother() {
  const containerRef = useRef<HTMLDivElement>(null);
  const smoother = useRef<any>(null);

  useEffect(() => {
    // Create ScrollSmoother instance
    smoother.current = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });

    // Parallax effect setup
    const parallaxElements = document.querySelectorAll("[data-speed]");
    parallaxElements.forEach((element) => {
      const speed = Number.parseFloat(
        (element as HTMLElement).dataset.speed || "1"
      );
      gsap.to(element, {
        y: () => window.innerHeight * (1 - speed) * 0.5,
        scrollTrigger: {
          trigger: element,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          markers: false,
        },
      });
    });

    // Skew effect on scroll
    const proxy = {
        skew: 0,
        skewSetter: (x: number) => {
          gsap.set(document.documentElement, { "--skew": x });
        },
        skewGetter: () =>
          Number.parseFloat(
            gsap.getProperty(document.documentElement, "--skew") as string
          ) || 0,
      },
      skewSetter = (x: number) => {
        proxy.skew = x;
        proxy.skewSetter(x);
      },
      skewGetter = () => proxy.skewGetter(),
      clamp = (min: number, max: number, value: number) =>
        Math.min(Math.max(value, min), max);

    gsap.set(document.documentElement, { "--skew": 0 });

    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(-20, 20, self.getVelocity() / 300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          skewSetter(skew);
        }
      },
    });

    gsap.set("[data-skew]", {
      transformOrigin: "center center",
      force3D: true,
    });
    gsap.to("[data-skew]", {
      skewY: () => skewGetter(),
      duration: 0.8,
      ease: "power3",
      overwrite: "auto",
    });

    return () => {
      smoother.current?.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0 0) 0%, oklch(0.2 0 0) 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-pretty">
            Smooth Scrolling Interactions
          </h2>
          <p className="text-lg text-gray-300">
            Experience smooth, dynamic scrolling interactions powered by GSAP.
            Parallax movement, subtle skew effects, and buttery-smooth
            scrolling.
          </p>
        </div>

        {/* Scroll Items */}
        <div className="space-y-24 md:space-y-32">
          {scrollItems.map((item, index) => (
            <div
              key={item.id}
              className={`grid gap-8 md:gap-12 md:grid-cols-2 md:items-center ${
                index % 2 === 1 ? "md:grid-flow-dense" : ""
              }`}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden rounded-lg"
                data-speed={0.5 + index * 0.1}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-auto rounded-lg object-cover aspect-video"
                  data-skew
                />
                <div className="absolute inset-0 rounded-lg border border-white/10" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  <span className="text-sm font-medium text-white">
                    Feature {item.id}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white text-pretty">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-4">
                  <button className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-colors">
                    Learn More
                    <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 md:mt-32 text-center">
          <p className="text-gray-400 mb-6">
            Ready to see smooth scrolling in action?
          </p>
          <button className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
            Explore More Demos
            <span className="ml-2">✨</span>
          </button>
        </div>
      </div>

      {/* CSS for skew effect */}
      <style jsx>{`
        :root {
          --skew: 0deg;
        }
        [data-skew] {
          transform: skewY(var(--skew));
        }
      `}</style>
    </section>
  );
}

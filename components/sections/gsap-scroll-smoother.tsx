"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPScrollShowcase() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const pinContainerRef = useRef(null);
  const horizontalRef = useRef(null);
  const progressBarRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Header animation with 3D rotation
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        opacity: 0,
        rotationX: -15,
        y: 100,
        scale: 0.9,
      });

      // Staggered card animations with depth
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 0,
          y: 100,
          x: i % 2 === 0 ? -50 : 50,
          rotation: i % 2 === 0 ? -5 : 5,
          scale: 0.8,
        });

        // Parallax effect on cards
        const depth = (i % 3) * 0.3 + 0.5;
        gsap.to(card, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -50 * depth,
        });
      });

      // Horizontal scroll section
      const cards = gsap.utils.toArray(".horizontal-card");
      if (cards.length > 0 && horizontalRef.current) {
        const totalWidth = cards.length * 320;

        gsap.to(horizontalRef.current, {
          x: () => -(totalWidth - window.innerWidth + 100),
          ease: "none",
          scrollTrigger: {
            trigger: pinContainerRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Progress bar
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          gsap.to(progressBarRef.current, {
            scaleX: self.progress,
            duration: 0.1,
          });
        },
      });

      // Text reveal animation
      gsap.utils.toArray(".reveal-text").forEach((text) => {
        gsap.from(text, {
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 0,
          y: 50,
          clipPath: "inset(0 0 100% 0)",
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const skills = [
    {
      icon: "⚡",
      title: "ScrollTrigger",
      desc: "Advanced scroll-based animations with precise control",
      color: "from-yellow-500/20 to-amber-500/20",
    },
    {
      icon: "🎭",
      title: "Timeline Sequencing",
      desc: "Complex animation sequences synchronized perfectly",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: "🎯",
      title: "Pin & Scrub",
      desc: "Element pinning with scrubbed timeline animations",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: "🌊",
      title: "Smooth Scrolling",
      desc: "Buttery 60fps animations with optimized performance",
      color: "from-teal-500/20 to-emerald-500/20",
    },
    {
      icon: "📐",
      title: "3D Transforms",
      desc: "Perspective transforms and 3D rotations in scroll",
      color: "from-rose-500/20 to-red-500/20",
    },
    {
      icon: "🎨",
      title: "Parallax Depth",
      desc: "Multi-layer parallax creating depth perception",
      color: "from-indigo-500/20 to-purple-500/20",
    },
  ];

  const techniques = [
    { emoji: "🔄", name: "Horizontal Scroll", tech: "ScrollTrigger Pin" },
    { emoji: "📊", name: "Progress Tracking", tech: "onUpdate Callbacks" },
    { emoji: "⚙️", name: "Performance", tech: "GPU Acceleration" },
    { emoji: "🎬", name: "Stagger Effects", tech: "Timeline Control" },
    { emoji: "🎪", name: "Reveal Animations", tech: "Clip-path Morphing" },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 blur-3xl"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  Math.random() * 10 + 10
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div
          ref={headerRef}
          className="relative z-10 text-center max-w-5xl"
          style={{ perspective: "1000px" }}
        >
          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider">
              SCROLL ANIMATION MASTERY
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            GSAP
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              ScrollTrigger
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-light">
            Creating immersive scroll experiences with advanced animation
            techniques,
            <span className="text-white font-normal"> parallax effects</span>,
            and
            <span className="text-white font-normal">
              {" "}
              performant timelines
            </span>
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">60 FPS</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm">GPU Optimized</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm">Production Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="reveal-text text-5xl md:text-6xl font-bold text-white mb-20 text-center">
            Core Techniques
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`relative group bg-gradient-to-br ${skill.color} backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {skill.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">
                    {skill.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">{skill.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <section
        ref={pinContainerRef}
        className="relative h-screen overflow-hidden"
      >
        <div className="sticky top-0 h-screen flex items-center">
          <div ref={horizontalRef} className="flex gap-8 px-6">
            <div className="flex-shrink-0 w-80 h-96 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-white mb-4">
                  Advanced Techniques
                </h3>
                <p className="text-slate-400">Scroll horizontally →</p>
              </div>
            </div>
            {techniques.map((tech, i) => (
              <div
                key={i}
                className="horizontal-card flex-shrink-0 w-80 h-96 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-7xl mb-6">{tech.emoji}</div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  {tech.name}
                </h4>
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                  <span className="text-cyan-400 text-sm font-mono">
                    {tech.tech}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-80 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-slate-400 text-lg">End of showcase</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { value: "60", suffix: "FPS", label: "Smooth Animations" },
              { value: "5+", suffix: "Yrs", label: "GSAP Experience" },
              { value: "100%", suffix: "", label: "GPU Accelerated" },
            ].map((stat, i) => (
              <div key={i} className="reveal-text text-center">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                  <span className="text-4xl">{stat.suffix}</span>
                </div>
                <p className="text-slate-400 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center reveal-text">
          <p className="text-slate-500 text-lg mb-6">
            Ready to create stunning scroll experiences?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "ScrollTrigger",
              "Timeline",
              "Parallax",
              "3D Transforms",
              "Performance",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-400 text-sm hover:border-cyan-500/50 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }
      `}</style>
    </div>
  );
}

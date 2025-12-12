"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";

// Helper to generate an A4-like texture with optional text printed on it.
function makeA4Texture(text: string) {
  // Use a relatively high DPI to give the texture enough resolution.
  const dpi = 200;
  const w = Math.round(8.27 * dpi); // A4 width in inches (210 mm)
  const h = Math.round(11.69 * dpi); // A4 height in inches (297 mm)

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  // Paint a paper‑like off‑white background.
  ctx.fillStyle = "#f7f7f4";
  ctx.fillRect(0, 0, w, h);

  // Add a bit of noise to mimic paper grain.
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i + 0] = Math.min(255, Math.max(0, img.data[i + 0] + n));
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n));
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  // Draw the supplied text.
  ctx.fillStyle = "#111";
  ctx.font = `${Math.round(dpi * 0.26)}px system-ui, -apple-system, Segoe UI, Arial`;
  ctx.textBaseline = "top";
  const margin = Math.round(dpi * 0.6);
  const lines = text.split("\\n");
  let y = margin;
  for (const line of lines) {
    ctx.fillText(line, margin, y);
    y += Math.round(dpi * 0.38);
  }

  // Optional guide marks.
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function MobiusPaper() {
  const meshRef = useRef<THREE.Mesh>(null!);

    const content = `Online Experience:

- Online digital escape room 3D Render of Serpentine North Galleries.
- Users are able to log on and have to find ways to navigate the gallery.
- If they work alone, they go slowly, if they talk to each other, simple (Runescape) / (Club Penguin) style, they can pool resources, talk and get through quicker.
- Sessions are mixed into lobbies which automatically pool about 10 players at a time.
- They have 45 minutes to escape.
- If they log out, they have the optionality to leave clues behind for the remaining players to keep sessions rolling, this forms a community archive until.
- Danielle would set a number of tasks, hidden quests and so on to complete.

Explanation of the format

-
I have presented my project on a continuous 3D loop of A4 because the brief said it could only be a one page document. This is also only fitting, given Danielle's exploration of spaces as playful and boundless. It also presents a suspended archive of my scope and production presentation.
-
Danielle doesn't like passivity and I didn't think you would either. As the viewer, I wanted you to be a true participant in my walkthrough.

Objective
Extend a game from The Delusion into a persistent online environment that maintains Danielle's core concerns: participation, community-driven worldbuilding and user accountability.

Concept
Build a multiplayer digital escape room structurally modelled on a stripped 3D scan of Serpentine North. Ten players per session, forty-five minutes, navigation tasks, hidden quests, and branching obstacles authored by Danielle. Individual progress is slower; collective conversation accelerates progression. Player interaction mirrors the social survival mechanics present in their practice.

Mechanics
Real-time chat with minimal affordances (Runescape-era syntax). Lightweight inventory system for sharing clues or resources. The logout mechanic leaves behind non-editable artefacts: text fragments, symbols, directions. These accumulate into a long-form, player-generated archive. The archive is deliberately unstable, echoing Danielle's refusal of passive spectatorship and insistence on users shaping the work's trajectory.

Approach to Scoping and Production

1. Establish Artistic and Technical Parameters

Resources: Kanban Board

Objective: Immediate discovery period and session with Danielle and Serpentine Art + Tech team. Identify:
- Why are we doing this and How do we think we are going to approach this?
- When does this need to get done?
- What is our budget to get this done?
- What tools are we using to project manage and communicate?
- How does it fit into Danielle's practice and Serpentine's overall programming?
- Which section of The Delusion being adapted, and will this have implications or complications as it pertains to IP law other stakeholders like co-creators/collaborators.
- What is the core mechanic, narrative or emotional arc?
- What are the non-negotiables such as mandatory elements that must survive translation?
- Boundaries around representation, user agency, data, and accessibility (limitations)
- Marketing? BTS?

Outcome: a non-negotiable creative skeleton and a constraints document.

2. Define the Experience Model (Artistic / Conceptual)

Objective: Translate the exhibition into a scalable online structure:
- What do we have to have in terms of resources (team and financial)?
- How can we make that digital experience sustainable and preserve it in the long term?
-
Who will manage upkeep, pushing updates, bugs, user enquiries?
- Which environment does Danielle want to use?
- Are there any non-negotiable user flow, interaction rules or fail-states that are non-negotiable conceptually?

Outcome: A technical blueprint that is aligned with Danielle's conceptual and artistic vision. A plan of action to create a budget and find quotes which fulfill it. Can begin outreach and building teams to begin development. Establish a criteria whereby we can work with collaborators that align with both the Serpentine's objectives and Danielle's.

3. Technical Feasibility + Stack Decision

Objective: Audit platforms, hosting needs, browser performance, multiplayer load, and data-routing. Select engines and frameworks based on stability, accessibility, and artist-customisation. Define:
- Front-end engine
- Back-end session orchestration
- Database architecture for persistent user-generated elements

Outcome: a feasibility report with constraints, risks and the required optimisation pathways.

4. Prototyping Phase

Build timelines and prototype

Build a minimal working slice:
- Interviewing with coders, devs, researchers
- Placeholder UI / UX - Accessibility, safeguarding against hate speech, blind/deaf, language translation.

Work through this with Danielle to validate whether the system expresses their intended agency structures.

Outcome: Greenlight against budget or redirection and amend before full development.

5. Co-Development and Iteration Artistically

Objective: Establish a recurring review cadence with Danielle, collaborators and internal Serpentine teams, allowing the work to evolve through structured deployment cycles:
- Update spatial logic
- Tune mechanics to avoid passivity
- Integrate narrative triggers
- Adjust difficulty and cooperation dependencies

Outcome: a version-controlled build shaped through creative feedback that protects the artist's iterative process without derailing its budget or timeline.

6. Testing, User Validation & Marketing

Objective: Final testing and approval from Danielle and the Serpentine team and ensure marketing is aligned with final delivery.
- Playtesting: Conduct closed tests with 8 - 12 players to stress multiplayer logic, communication tools, and pacing.
- Capture metrics: drop-off points, collaboration rates, accessibility issues.

Outcome: revisions based on real behavioural patterns, rather than internal assumptions.

8. Launch, Monitoring, and Maintenance

-
Marketing? Talks?
-
Set up analytics, moderation protocols, bug triage and a post-launch iteration plan.
-
Provide Danielle with an authoring interface for future updates or seasonal expansions.

Outcome: a living system that continues audience engagement after the exhibition closes.`;

  // Memoize the texture so it's only created once on the client.
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
  return makeA4Texture(content);
  }, []);

  // Build a Möbius strip geometry using Three.js's ParametricGeometry helper.
  const geometry = useMemo(() => {
    const W = 0.28; // half the paper width (in world units)
    const R = 0.9; // radius of the loop
    const slices = 240;
    const stacks = 40;
    const func = (u: number, v: number, target: THREE.Vector3) => {
      const U = u * Math.PI * 2;
      const V = (v - 0.5) * 2 * W;
      const x = (R + V * Math.cos(U / 2)) * Math.cos(U);
      const y = (R + V * Math.cos(U / 2)) * Math.sin(U);
      const z = V * Math.sin(U / 2);
      // Swap axes for a nicer initial orientation.
      target.set(x, z, y);
    };
    // Dynamically require ParametricGeometry from examples to avoid SSR issues.
    const { ParametricGeometry } = require("three/examples/jsm/geometries/ParametricGeometry.js");
    const g = new ParametricGeometry(func, slices, stacks);
    g.computeVertexNormals();
    return g as unknown as THREE.BufferGeometry;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture ?? undefined,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      }),
    [texture]
  );

  // Animate the rotation; the OrbitControls allow manual override.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.25;
    meshRef.current.rotation.y = t * 0.35;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function Page() {
  return (
    <main style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 1.2, 3.2], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <MobiusPaper />
        <OrbitControls enablePan={false} minDistance={2.0} maxDistance={6.0} />
      </Canvas>
    </main>
  );
}

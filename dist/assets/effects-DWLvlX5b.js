import{r as u,c as J,d as B,U as T,e as D,E as H,f as G,B as L,M as Q,L as ee,g as E,h as A,i as M,j as re,N as te,T as ae,k as se,l as oe}from"./vendor-ui-CBvPNmAj.js";import{j as e,c as le,u as F,a as I,B as C}from"./helix-core-DySbo_Am.js";import{a as ie}from"./vendor-react-DJG_os-6.js";function ne(r,a,{checkForDefaultPrevented:o=!0}={}){return function(c){if(r==null||r(c),o===!1||!c.defaultPrevented)return a==null?void 0:a(c)}}function ce(r,a=[]){let o=[];function h(p,i){const d=u.createContext(i),b=o.length;o=[...o,i];const s=m=>{var j;const{scope:t,children:g,...f}=m,w=((j=t==null?void 0:t[r])==null?void 0:j[b])||d,k=u.useMemo(()=>f,Object.values(f));return e.jsx(w.Provider,{value:k,children:g})};s.displayName=p+"Provider";function l(m,t){var w;const g=((w=t==null?void 0:t[r])==null?void 0:w[b])||d,f=u.useContext(g);if(f)return f;if(i!==void 0)return i;throw new Error(`\`${m}\` must be used within \`${p}\``)}return[s,l]}const c=()=>{const p=o.map(i=>u.createContext(i));return function(d){const b=(d==null?void 0:d[r])||p;return u.useMemo(()=>({[`__scope${r}`]:{...d,[r]:b}}),[d,b])}};return c.scopeName=r,[h,de(c,...a)]}function de(...r){const a=r[0];if(r.length===1)return a;const o=()=>{const h=r.map(c=>({useScope:c(),scopeName:c.scopeName}));return function(p){const i=h.reduce((d,{useScope:b,scopeName:s})=>{const m=b(p)[`__scope${s}`];return{...d,...m}},{});return u.useMemo(()=>({[`__scope${a.scopeName}`]:i}),[i])}};return o.scopeName=a.scopeName,o}var Y=globalThis!=null&&globalThis.document?u.useLayoutEffect:()=>{},pe=J[" useInsertionEffect ".trim().toString()]||Y;function he({prop:r,defaultProp:a,onChange:o=()=>{},caller:h}){const[c,p,i]=ue({defaultProp:a,onChange:o}),d=r!==void 0,b=d?r:c;{const l=u.useRef(r!==void 0);u.useEffect(()=>{const m=l.current;m!==d&&console.warn(`${h} is changing from ${m?"controlled":"uncontrolled"} to ${d?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),l.current=d},[d,h])}const s=u.useCallback(l=>{var m;if(d){const t=be(l)?l(r):l;t!==r&&((m=i.current)==null||m.call(i,t))}else p(l)},[d,r,p,i]);return[b,s]}function ue({defaultProp:r,onChange:a}){const[o,h]=u.useState(r),c=u.useRef(o),p=u.useRef(a);return pe(()=>{p.current=a},[a]),u.useEffect(()=>{var i;c.current!==o&&((i=p.current)==null||i.call(p,o),c.current=o)},[o,c]),[o,h,p]}function be(r){return typeof r=="function"}function me(r){const a=u.useRef({value:r,previous:r});return u.useMemo(()=>(a.current.value!==r&&(a.current.previous=a.current.value,a.current.value=r),a.current.previous),[r])}function xe(r){const[a,o]=u.useState(void 0);return Y(()=>{if(r){o({width:r.offsetWidth,height:r.offsetHeight});const h=new ResizeObserver(c=>{if(!Array.isArray(c)||!c.length)return;const p=c[0];let i,d;if("borderBoxSize"in p){const b=p.borderBoxSize,s=Array.isArray(b)?b[0]:b;i=s.inlineSize,d=s.blockSize}else i=r.offsetWidth,d=r.offsetHeight;o({width:i,height:d})});return h.observe(r,{box:"border-box"}),()=>h.unobserve(r)}else o(void 0)},[r]),a}ie();var ge=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],X=ge.reduce((r,a)=>{const o=le(`Primitive.${a}`),h=u.forwardRef((c,p)=>{const{asChild:i,...d}=c,b=i?o:a;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),e.jsx(b,{...d,ref:p})});return h.displayName=`Primitive.${a}`,{...r,[a]:h}},{}),O="Switch",[fe,ze]=ce(O),[ye,we]=fe(O),W=u.forwardRef((r,a)=>{const{__scopeSwitch:o,name:h,checked:c,defaultChecked:p,required:i,disabled:d,value:b="on",onCheckedChange:s,form:l,...m}=r,[t,g]=u.useState(null),f=F(a,N=>g(N)),w=u.useRef(!1),k=t?l||!!t.closest("form"):!0,[j,z]=he({prop:c,defaultProp:p??!1,onChange:s,caller:O});return e.jsxs(ye,{scope:o,checked:j,disabled:d,children:[e.jsx(X.button,{type:"button",role:"switch","aria-checked":j,"aria-required":i,"data-state":Z(j),"data-disabled":d?"":void 0,disabled:d,value:b,...m,ref:f,onClick:ne(r.onClick,N=>{z(n=>!n),k&&(w.current=N.isPropagationStopped(),w.current||N.stopPropagation())})}),k&&e.jsx(V,{control:t,bubbles:!w.current,name:h,value:b,checked:j,required:i,disabled:d,form:l,style:{transform:"translateX(-100%)"}})]})});W.displayName=O;var U="SwitchThumb",_=u.forwardRef((r,a)=>{const{__scopeSwitch:o,...h}=r,c=we(U,o);return e.jsx(X.span,{"data-state":Z(c.checked),"data-disabled":c.disabled?"":void 0,...h,ref:a})});_.displayName=U;var ve="SwitchBubbleInput",V=u.forwardRef(({__scopeSwitch:r,control:a,checked:o,bubbles:h=!0,...c},p)=>{const i=u.useRef(null),d=F(i,p),b=me(o),s=xe(a);return u.useEffect(()=>{const l=i.current;if(!l)return;const m=window.HTMLInputElement.prototype,g=Object.getOwnPropertyDescriptor(m,"checked").set;if(b!==o&&g){const f=new Event("click",{bubbles:h});g.call(l,o),l.dispatchEvent(f)}},[b,o,h]),e.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:o,...c,tabIndex:-1,ref:d,style:{...c.style,...s,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});V.displayName=ve;function Z(r){return r?"checked":"unchecked"}var je=W,Ne=_;function Ce({className:r,...a}){return e.jsx(je,{"data-slot":"switch",className:I("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",r),...a,children:e.jsx(Ne,{"data-slot":"switch-thumb",className:I("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")})})}const Ae=({effects:r,children:a})=>{const o=()=>r.ashfallColors?{background:"linear-gradient(135deg, #eee9e2 0%, #e8e3dc 100%)",color:"#929292"}:{background:"linear-gradient(135deg, #111111 0%, #000000 100%)",color:"#ffffff"};return e.jsxs("div",{className:"color-scheme-wrapper",style:o(),"data-ashfall-colors":r.ashfallColors,"data-monochrome":r.monochrome,children:[e.jsx("style",{jsx:"true",children:`
        .color-scheme-wrapper {
          transition: all 0.5s ease;
        }
        
        .helix-scene {
          ${r.ashfallColors?`
            background: linear-gradient(135deg, #eee9e2 0%, #e8e3dc 100%) !important;
          `:`
            background: linear-gradient(135deg, #111111 0%, #000000 100%) !important;
          `}
        }
        
        .project-info-overlay {
          ${r.ashfallColors?`
            color: #929292 !important;
          `:`
            color: #ffffff !important;
          `}
        }
        
        .project-info-overlay h2 {
          ${r.ashfallColors?`
            color: #333333 !important;
          `:`
            color: #ffffff !important;
          `}
        }
        
        .navigation-instructions {
          ${r.ashfallColors?`
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333333 !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
          `:`
            background: rgba(0, 0, 0, 0.8) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          `}
        }
      `}),a]})},Me=({effects:r,children:a})=>{const o=r.placementStrength??6,h=1.06,c=1,p=.94,i=4+o*.8,d=-(7+o*1.1),b=-(.18+o*.022),s=(o-5)*.001,l=h+s,m=c,t=p-s,g={"--pp-near-z":`${Math.round(i)}px`,"--pp-mid-z":"0px","--pp-far-z":`${Math.round(d)}px`,"--pp-near-scale":l,"--pp-mid-scale":m,"--pp-far-scale":t,"--pp-near-tilt":"0deg","--pp-mid-tilt":"-0.10deg","--pp-far-tilt":`${b.toFixed(2)}deg`};return e.jsxs("div",{className:`visual-effects-wrapper fx-depth-placement ${r.depthBlur?"fx-depth-blur":""} ${r.outwardTurn?"fx-outward":""} ${r.centerLogo?"fx-center-logo":""} ${r.rgbEdge?"fx-rgb-edge":""}`,style:g,"data-chromatic-aberration":r.chromaticAberration,"data-depth-blur":r.depthBlur,"data-glitch-effects":r.glitchEffects,"data-ambient-lighting":r.ambientLighting,"data-depth-hierarchy":r.depthHierarchy,"data-ashfall-cards":r.ashfallCards,"data-ashfall-colors":r.ashfallColors,"data-typography":r.ashfallTypography,"data-center-logo-mode":r.centerLogoMode,"data-cinematic-colors":r.cinematicColors,"data-screen-glow":r.screenGlow,"data-scan-lines":r.scanLines,"data-film-grain":r.filmGrain,"data-monitor-style":r.monitorStyle,"data-color-grade":r.colorGrade,children:[e.jsx("style",{jsx:"true",children:`
        /* Chromatic Aberration Effect */
        .visual-effects-wrapper[data-chromatic-aberration="true"] .helix-node::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            rgba(255, 0, 0, 0.1) 0%, 
            transparent 25%, 
            transparent 75%, 
            rgba(0, 0, 255, 0.1) 100%
          );
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
        }

        .visual-effects-wrapper[data-chromatic-aberration="true"] .helix-node::after {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          bottom: 1px;
          background: linear-gradient(-45deg, 
            rgba(0, 255, 0, 0.05) 0%, 
            transparent 50%, 
            rgba(255, 0, 255, 0.05) 100%
          );
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
        }

        /* Depth Blur Effect */
        .visual-effects-wrapper[data-depth-blur="true"] .helix-node {
          transition: filter 0.3s ease, opacity 0.3s ease;
        }

        .visual-effects-wrapper[data-depth-blur="true"] .helix-node:not(.active) {
          filter: blur(1px);
          opacity: 0.7;
        }

        .visual-effects-wrapper[data-depth-blur="true"] .helix-node.active {
          filter: blur(0px);
          opacity: 1;
        }

        /* Glitch Effects */
        .visual-effects-wrapper[data-glitch-effects="true"] .helix-node:hover {
          animation: glitch-shake 0.3s ease-in-out;
        }

        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-1px) translateY(1px); }
          20% { transform: translateX(1px) translateY(-1px); }
          30% { transform: translateX(-1px) translateY(1px); }
          40% { transform: translateX(1px) translateY(-1px); }
          50% { transform: translateX(-1px) translateY(1px); }
          60% { transform: translateX(1px) translateY(-1px); }
          70% { transform: translateX(-1px) translateY(1px); }
          80% { transform: translateX(1px) translateY(-1px); }
          90% { transform: translateX(-1px) translateY(1px); }
        }

        .visual-effects-wrapper[data-glitch-effects="true"] .helix-node:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 0, 0, 0.1) 25%, 
            rgba(0, 255, 0, 0.1) 50%, 
            rgba(0, 0, 255, 0.1) 75%, 
            transparent 100%
          );
          animation: glitch-sweep 0.3s ease-out;
          pointer-events: none;
          z-index: 10;
        }

        @keyframes glitch-sweep {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        /* Ambient Lighting */
        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-scene {
          position: relative;
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-scene::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-node {
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .visual-effects-wrapper[data-ambient-lighting="true"] .helix-node.active {
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Smooth transitions for all effects */
        .visual-effects-wrapper .helix-node {
          transition: all 0.3s ease;
        }
      `}),a]})},Oe=({effects:r,children:a})=>e.jsxs("div",{className:"card-design-wrapper","data-ashfall-cards":r.ashfallCards,"data-card-shadows":r.cardShadows,"data-card-borders":r.cardBorders,children:[e.jsx("style",{jsx:"true",children:`
        /* Ashfall Card Style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node > div {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(10px);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node img {
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node h3 {
          color: #333333 !important;
          font-weight: 500;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node .tech-tag {
          background: rgba(0, 0, 0, 0.08) !important;
          color: #666666 !important;
          border: none !important;
        }

        /* Card Shadows */
        .card-design-wrapper[data-card-shadows="true"] .helix-node > div {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease;
        }

        .card-design-wrapper[data-card-shadows="true"] .helix-node:hover > div,
        .card-design-wrapper[data-card-shadows="true"] .helix-node.active > div {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Card Borders */
        .card-design-wrapper[data-card-borders="true"] .helix-node > div {
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease;
        }

        .card-design-wrapper[data-card-borders="true"][data-ashfall-cards="true"] .helix-node > div {
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-design-wrapper[data-card-borders="true"] .helix-node:hover > div,
        .card-design-wrapper[data-card-borders="true"] .helix-node.active > div {
          border-color: rgba(59, 130, 246, 0.5);
        }

        /* Enhanced hover states for Ashfall style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node:hover > div {
          background: rgba(255, 255, 255, 1) !important;
          transform: translateY(-2px);
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node:hover img {
          filter: none !important;
        }

        /* Monochrome effect integration */
        .card-design-wrapper .helix-node img {
          transition: filter 0.3s ease;
        }

        .card-design-wrapper .helix-node:not(:hover):not(.active) img {
          filter: grayscale(100%) contrast(1.1);
        }

        .card-design-wrapper .helix-node:hover img,
        .card-design-wrapper .helix-node.active img {
          filter: grayscale(0%) contrast(1);
        }

        /* Refined typography for Ashfall style */
        .card-design-wrapper[data-ashfall-cards="true"] .helix-node {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .helix-node h3 {
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.25;
        }

        .card-design-wrapper[data-ashfall-cards="true"] .tech-tag {
          font-size: 0.75rem;
          font-weight: 400;
          padding: 2px 6px;
          border-radius: 3px;
        }
      `}),a]}),Pe=({effects:r,children:a})=>e.jsxs("div",{className:"structure-effects-wrapper","data-central-wireframe":r.centralWireframe,"data-wireframe-lines":r.centralWireframe&&!r.centerLogo,"data-smooth-rotation":r.smoothRotation,"data-depth-hierarchy":r.depthHierarchy,children:[e.jsx("style",{jsx:"true",children:`
        /* Central Wireframe Structure */
        .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 138px;  /* 15% bigger than 120px */
          height: 138px;  /* 15% bigger than 120px */
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          z-index: 5;
        }

        .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateX(90deg);
          width: 138px;  /* 15% bigger than 120px */
          height: 138px;  /* 15% bigger than 120px */
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          z-index: 5;
        }

        /* Ashfall-style wireframe for light theme */
        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::before {
          border-color: rgba(0, 0, 0, 0.15);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-central-wireframe="true"] .helix-assembly::after {
          border-color: rgba(0, 0, 0, 0.08);
        }

        /* Tripod structure lines - only show when data-wireframe-lines is true */
        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-tripod {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateY(var(--scroll-offset-y, 0px));
          width: 200px;
          height: 200px;
          pointer-events: none;
          z-index: 4;
          transition: transform 0.1s ease-out;
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          transform-origin: center;
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(1) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(0deg);
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(2) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(120deg);
        }

        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line:nth-child(3) {
          top: 50%;
          left: 50%;
          width: 100px;
          height: 1px;
          transform: translate(-50%, -50%) rotate(240deg);
        }

        /* Ashfall-style wireframe lines */
        .color-scheme-wrapper[data-ashfall-colors="true"] .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-line {
          background: rgba(0, 0, 0, 0.1);
        }

        /* Smooth Rotation */
        .structure-effects-wrapper[data-smooth-rotation="true"] .helix-assembly {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .structure-effects-wrapper[data-smooth-rotation="false"] .helix-assembly {
          transition: transform 0.3s ease !important;
        }

        /* Depth Hierarchy */
        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node {
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-far {
          transform: scale(0.85);
          opacity: 0.6;
          filter: blur(0.5px);
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-medium {
          transform: scale(0.95);
          opacity: 0.8;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.depth-near {
          transform: scale(1.05);
          opacity: 1;
          z-index: 10;
        }

        .structure-effects-wrapper[data-depth-hierarchy="true"] .helix-node.active {
          transform: scale(1.1) !important;
          opacity: 1 !important;
          filter: blur(0px) !important;
          z-index: 20 !important;
        }

        /* Enhanced 3D perspective for smooth rotation */
        .structure-effects-wrapper[data-smooth-rotation="true"] .helix-scene {
          perspective: 1500px;
          perspective-origin: center center;
        }

        /* Subtle floating animation for wireframe lines */
        .structure-effects-wrapper[data-wireframe-lines="true"] .wireframe-tripod {
          animation: wireframe-float 8s ease-in-out infinite alternate;
        }

        @keyframes wireframe-float {
          0% { transform: translate(-50%, -50%) rotateZ(0deg); }
          100% { transform: translate(-50%, -50%) rotateZ(5deg); }
        }
      `}),r.centralWireframe&&!r.centerLogo&&e.jsxs("div",{className:"wireframe-tripod",children:[e.jsx("div",{className:"wireframe-line"}),e.jsx("div",{className:"wireframe-line"}),e.jsx("div",{className:"wireframe-line"})]}),a]}),$e=({effects:r,currentProject:a,totalProjects:o,onProjectSelect:h,children:c})=>e.jsxs("div",{className:"navigation-effects-wrapper","data-project-counter":r.projectCounter,"data-navigation-dots":r.navigationDots,"data-minimalist-controls":r.minimalistControls,children:[e.jsx("style",{jsx:"true",children:`
        /* Project Counter */
        .project-counter {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          z-index: 30;
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .project-counter {
          color: rgba(0, 0, 0, 0.7);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .project-counter:hover {
          background: rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, 0.9);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .project-counter:hover {
          background: rgba(255, 255, 255, 0.95);
          color: rgba(0, 0, 0, 0.9);
        }

        /* Navigation Dots */
        .navigation-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 30;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scale(1.2);
        }

        .nav-dot.active {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.9);
          transform: scale(1.3);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot {
          background: rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot:hover {
          background: rgba(0, 0, 0, 0.4);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .nav-dot.active {
          background: rgba(0, 0, 0, 0.8);
          border-color: rgba(0, 0, 0, 0.8);
        }

        /* Minimalist Controls */
        .minimalist-controls {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          gap: 0.5rem;
          z-index: 30;
        }

        .minimalist-control {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .minimalist-control:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control {
          background: rgba(255, 255, 255, 0.6);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(0, 0, 0, 0.2);
        }

        .minimalist-control svg {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .minimalist-control svg {
          color: rgba(0, 0, 0, 0.7);
        }

        /* Hide default controls when minimalist is enabled */
        .navigation-effects-wrapper[data-minimalist-controls="true"] .motion-controls {
          display: none;
        }

        /* Smooth animations */
        .navigation-effects-wrapper * {
          transition: all 0.3s ease;
        }
      `}),r.projectCounter&&e.jsxs("div",{className:"project-counter",children:[String(a+1).padStart(2,"0")," / ",String(o).padStart(2,"0")]}),r.navigationDots&&e.jsx("div",{className:"navigation-dots",children:Array.from({length:o},(p,i)=>e.jsx("button",{className:`nav-dot ${i===a?"active":""}`,onClick:()=>h(i),"aria-label":`Go to project ${i+1}`},i))}),r.minimalistControls&&e.jsxs("div",{className:"minimalist-controls",children:[e.jsx("button",{className:"minimalist-control","aria-label":"Previous project",children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"m15 18-6-6 6-6"})})}),e.jsx("button",{className:"minimalist-control","aria-label":"Next project",children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"m9 18 6-6-6-6"})})}),e.jsx("button",{className:"minimalist-control","aria-label":"Pause animation",children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]})})]}),c]}),Ee=({effects:r,children:a})=>e.jsxs("div",{className:"typography-effects-wrapper","data-ashfall-typography":r.ashfallTypography,"data-subtle-text":r.subtleText,children:[e.jsx("style",{jsx:"true",children:`
        /* Ashfall Typography */
        .typography-effects-wrapper[data-ashfall-typography="true"] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h1 {
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: -0.05em;
          line-height: 1.2;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h2 {
          font-size: 1.875rem;
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] h3 {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] p {
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.01em;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .tech-tag {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        /* Subtle Text Colors */
        .typography-effects-wrapper[data-subtle-text="true"] h1,
        .typography-effects-wrapper[data-subtle-text="true"] h2 {
          color: rgba(255, 255, 255, 0.9);
        }

        .typography-effects-wrapper[data-subtle-text="true"] h3 {
          color: rgba(255, 255, 255, 0.85);
        }

        .typography-effects-wrapper[data-subtle-text="true"] p {
          color: rgba(255, 255, 255, 0.7);
        }

        .typography-effects-wrapper[data-subtle-text="true"] .tech-tag {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Ashfall color scheme text colors */
        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h1,
        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h2 {
          color: rgba(0, 0, 0, 0.9);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] h3 {
          color: rgba(0, 0, 0, 0.8);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] p {
          color: rgba(0, 0, 0, 0.6);
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-subtle-text="true"] .tech-tag {
          color: rgba(0, 0, 0, 0.5);
        }

        /* Navigation instructions styling */
        .typography-effects-wrapper[data-ashfall-typography="true"] .navigation-instructions h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .navigation-instructions li {
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.4;
        }

        /* Project info overlay typography */
        .typography-effects-wrapper[data-ashfall-typography="true"] .project-info-overlay h2 {
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: -0.03em;
          margin-bottom: 0.75rem;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .project-info-overlay p {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .typography-effects-wrapper[data-ashfall-typography="true"] .project-counter {
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        /* Smooth text transitions */
        .typography-effects-wrapper h1,
        .typography-effects-wrapper h2,
        .typography-effects-wrapper h3,
        .typography-effects-wrapper p {
          transition: color 0.3s ease, font-size 0.3s ease;
        }

        /* Text selection styling */
        .typography-effects-wrapper[data-ashfall-typography="true"] ::selection {
          background: rgba(59, 130, 246, 0.2);
          color: inherit;
        }

        .color-scheme-wrapper[data-ashfall-colors="true"] .typography-effects-wrapper[data-ashfall-typography="true"] ::selection {
          background: rgba(59, 130, 246, 0.15);
        }
      `}),a]}),Be=({helixConfig:r,onConfigChange:a,onReset:o,onUndo:h,onRedo:c,canUndo:p,canRedo:i})=>{const[d,b]=u.useState(!1),s=(t,g)=>{a==null||a(t,g)},l=({label:t,value:g,min:f,max:w,step:k=1,suffix:j="",onChange:z,color:N="#3b82f6"})=>e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-medium text-gray-300",children:t}),e.jsxs("span",{className:"text-xs font-mono text-blue-400",children:[g,j]})]}),e.jsx("input",{type:"range",min:f,max:w,step:k,value:g,onChange:n=>z(Number(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider",style:{background:`linear-gradient(to right, ${N} 0%, ${N} ${(g-f)/(w-f)*100}%, #374151 ${(g-f)/(w-f)*100}%, #374151 100%)`}}),e.jsxs("div",{className:"flex justify-between mt-1",children:[e.jsxs("span",{className:"text-xs text-gray-500",children:[f,j]}),e.jsxs("span",{className:"text-xs text-gray-500",children:[w,j]})]})]}),m=({icon:t,title:g,percentage:f})=>e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[t,e.jsx("h3",{className:"font-semibold text-blue-400 text-sm uppercase tracking-wide",children:g})]}),f!==void 0&&e.jsxs("span",{className:"text-xs text-blue-300 font-mono",children:["(",f,"%)"]})]});return e.jsxs("div",{className:`fixed top-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 shadow-2xl transition-transform duration-300 ${d?"translate-x-full":"translate-x-0"}`,style:{width:"350px",height:"100vh"},children:[e.jsx("button",{onClick:()=>b(!d),className:"absolute -left-10 top-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-l-lg p-2 shadow-sm hover:bg-gray-800 transition-colors",children:e.jsx(B,{className:"w-4 h-4 text-blue-400"})}),e.jsxs("div",{className:"p-4 h-full overflow-y-auto custom-scrollbar",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(B,{className:"w-5 h-5 text-blue-400"}),e.jsx("h2",{className:"text-lg font-bold text-white",children:"HELIX CONTROLS"})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(C,{variant:"outline",size:"sm",onClick:h,disabled:!p,className:"text-xs px-2 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",title:"Undo last change (Ctrl+Z)",children:e.jsx(T,{className:"w-3 h-3"})}),e.jsx(C,{variant:"outline",size:"sm",onClick:c,disabled:!i,className:"text-xs px-2 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",title:"Redo last undone change (Ctrl+Y)",children:e.jsx(D,{className:"w-3 h-3"})}),e.jsx(C,{variant:"outline",size:"sm",onClick:o,className:"text-xs px-3 py-1 h-7 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",children:"Reset"})]})]}),e.jsxs("div",{className:"mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx(m,{icon:e.jsx(H,{className:"w-4 h-4 text-blue-400"}),title:"Global Perspective"}),e.jsx(l,{label:"PERSPECTIVE",value:r.perspective||1200,min:500,max:3e3,step:50,suffix:"px",onChange:t=>s("perspective",t),color:"#3b82f6"}),e.jsx(l,{label:"ORIGIN X",value:r.perspectiveOriginX||50,min:0,max:100,suffix:"%",onChange:t=>s("perspectiveOriginX",t),color:"#10b981"}),e.jsx(l,{label:"ORIGIN Y",value:r.perspectiveOriginY||50,min:0,max:100,suffix:"%",onChange:t=>s("perspectiveOriginY",t),color:"#10b981"})]}),e.jsxs("div",{className:"mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx(m,{icon:e.jsx(G,{className:"w-4 h-4 text-purple-400"}),title:"Helix Structure"}),e.jsx(l,{label:"RADIUS",value:r.radius||250,min:100,max:500,step:10,suffix:"px",onChange:t=>s("radius",t),color:"#8b5cf6"}),e.jsx(l,{label:"VERTICAL SPAN",value:r.verticalSpan||800,min:400,max:1600,step:50,suffix:"px",onChange:t=>s("verticalSpan",t),color:"#8b5cf6"}),e.jsx(l,{label:"REPEAT TURNS",value:r.repeatTurns||2,min:1,max:5,step:.5,onChange:t=>s("repeatTurns",t),color:"#8b5cf6"}),e.jsx(l,{label:"GLOBAL ROTATE X",value:r.rotateX||-10,min:-45,max:45,suffix:"°",onChange:t=>s("rotateX",t),color:"#f59e0b"}),e.jsx(l,{label:"GLOBAL ROTATE Y",value:r.rotateY||0,min:-180,max:180,suffix:"°",onChange:t=>s("rotateY",t),color:"#f59e0b"}),e.jsx(l,{label:"GLOBAL ROTATE Z",value:r.rotateZ||0,min:-45,max:45,suffix:"°",onChange:t=>s("rotateZ",t),color:"#f59e0b"})]}),e.jsxs("div",{className:"mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx(m,{icon:e.jsx(L,{className:"w-4 h-4 text-emerald-400"}),title:"Card Properties"}),e.jsx(l,{label:"CARD WIDTH",value:r.cardWidth||180,min:90,max:270,step:10,suffix:"px",onChange:t=>{s("cardWidth",t),s("cardHeight",Math.round(t*16/9))},color:"#10b981"}),e.jsx("div",{className:"opacity-60 pointer-events-none",children:e.jsx(l,{label:"CARD HEIGHT (Auto 9:16)",value:r.cardHeight||320,min:160,max:480,step:10,suffix:"px",onChange:()=>{},color:"#10b981"})}),e.jsx(l,{label:"CARD SCALE",value:r.cardScale||1,min:.5,max:2,step:.1,onChange:t=>s("cardScale",t),color:"#10b981"}),e.jsx(l,{label:"OPACITY FRONT",value:r.opacityFront||1,min:.3,max:1,step:.1,onChange:t=>s("opacityFront",t),color:"#06b6d4"}),e.jsx(l,{label:"OPACITY SIDE",value:r.opacitySide||.7,min:.2,max:1,step:.1,onChange:t=>s("opacitySide",t),color:"#06b6d4"}),e.jsx(l,{label:"OPACITY BACK",value:r.opacityBack||.3,min:.1,max:1,step:.1,onChange:t=>s("opacityBack",t),color:"#06b6d4"})]}),e.jsxs("div",{className:"mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx(m,{icon:e.jsx(Q,{className:"w-4 h-4 text-yellow-400"}),title:"Container"}),e.jsx(l,{label:"CONTAINER WIDTH",value:r.containerWidth||600,min:400,max:1e3,step:50,suffix:"px",onChange:t=>s("containerWidth",t),color:"#f59e0b"}),e.jsx(l,{label:"CONTAINER HEIGHT",value:r.containerHeight||600,min:400,max:1e3,step:50,suffix:"px",onChange:t=>s("containerHeight",t),color:"#f59e0b"}),e.jsx(l,{label:"SCROLL SENSITIVITY",value:r.scrollSensitivity||1,min:.1,max:3,step:.1,onChange:t=>s("scrollSensitivity",t),color:"#f59e0b"})]}),e.jsxs("div",{className:"mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsx(m,{icon:e.jsx(ee,{className:"w-4 h-4 text-pink-400"}),title:"Performance"}),e.jsxs("div",{className:"text-xs text-gray-400 mb-3",children:["Active Cards: ",r.activeCards||"Auto"]}),e.jsxs("div",{className:"text-xs text-gray-400 mb-3",children:["Render Distance: ",r.renderDistance||"Full"]}),e.jsxs("div",{className:"flex gap-2 mb-4",children:[e.jsx(C,{variant:"outline",size:"sm",className:"text-xs px-3 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",onClick:()=>s("enableCulling",!r.enableCulling),children:r.enableCulling?"Culling ON":"Culling OFF"}),e.jsx(C,{variant:"outline",size:"sm",className:"text-xs px-3 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",onClick:()=>s("enableLOD",!r.enableLOD),children:r.enableLOD?"LOD ON":"LOD OFF"})]}),e.jsx(l,{label:"SHOW EVERY Nth CARD",value:r.showEveryNth||1,min:1,max:10,step:1,suffix:"",onChange:t=>s("showEveryNth",t),color:"#ec4899"})]}),e.jsxs("div",{className:"mt-6 p-3 bg-blue-900/30 rounded border border-blue-700",children:[e.jsx("h4",{className:"text-xs font-semibold text-blue-300 mb-2",children:"Aspect Ratio Test"}),e.jsx("div",{className:"flex gap-2 mb-2",children:[1,2,3,4,5].map(t=>e.jsxs("button",{onClick:()=>s("showEveryNth",t),className:`px-2 py-1 text-xs rounded ${r.showEveryNth===t?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`,children:["Every ",t,"th"]},t))}),e.jsx("div",{className:"text-xs text-gray-400",children:"Click buttons to test different card display patterns"})]}),e.jsx("div",{className:"mt-6 p-3 bg-gray-800/30 rounded border border-gray-700",children:e.jsxs("div",{className:"text-xs text-gray-500 space-y-1",children:[e.jsxs("div",{children:["Total Projects: ",r.totalProjects||16]}),e.jsxs("div",{children:["Total Cards: ",r.visibleCards||"All"]}),e.jsxs("div",{children:["Showing Every: ",r.showEveryNth,"th card"]}),e.jsxs("div",{children:["Rendered Cards: ",Math.ceil((r.visibleCards||32)/(r.showEveryNth||1))]}),e.jsxs("div",{children:["Current Offset: ",(r.scrollOffset||0).toFixed(2)]})]})})]}),e.jsx("style",{children:`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `})]})},Ie=({effects:r,onEffectToggle:a,onReset:o,onUndo:h,onRedo:c,canUndo:p,canRedo:i,setPlacementStrength:d,setRepeatTurns:b,lockedEffects:s={},onToggleLock:l})=>{const[m,t]=u.useState(!1),[g,f]=u.useState({}),w=n=>{f(x=>({...x,[n]:!x[n]}))},k=[{title:"Color Schemes",icon:e.jsx(re,{className:"w-4 h-4"}),color:"text-pink-400",borderColor:"border-pink-500/30",bgColor:"bg-pink-900/20",effects:[{key:"ashfallColors",label:"Ashfall Theme",description:"Light cream background"},{key:"monochrome",label:"Monochrome",description:"Grayscale cards"}]},{title:"Visual Effects",icon:e.jsx(E,{className:"w-4 h-4"}),color:"text-purple-400",borderColor:"border-purple-500/30",bgColor:"bg-purple-900/20",effects:[{key:"cinematicColors",label:"Cinematic",description:"Color intensification"},{key:"screenGlow",label:"Screen Glow",description:"Cyan glow effects"},{key:"scanLines",label:"Scan Lines",description:"Moving scan lines"},{key:"chromaticAberration",label:"Chromatic",description:"RGB separation"},{key:"filmGrain",label:"Film Grain",description:"Film noise overlay"},{key:"monitorStyle",label:"Monitor Style",description:"Retro CRT look"},{key:"colorGrade",label:"Color Grade",description:"Film color grading"},{key:"depthBlur",label:"Depth Blur",description:"Distance blur"},{key:"glitchEffects",label:"Glitch",description:"Hover glitch"},{key:"ambientLighting",label:"Lighting",description:"Soft shadows"},{key:"rgbEdge",label:"RGB Edge",description:"Chromatic card edges"}]},{title:"Card Design",icon:e.jsx(L,{className:"w-4 h-4"}),color:"text-green-400",borderColor:"border-green-500/30",bgColor:"bg-green-900/20",effects:[{key:"ashfallCards",label:"Ashfall Style",description:"Clean white cards"},{key:"cardShadows",label:"Shadows",description:"Drop shadows"},{key:"cardBorders",label:"Borders",description:"Card borders"},{key:"richCardContent",label:"Rich Content",description:"Show videos/images on cards"},{key:"cardHoverEffects",label:"Hover Effects",description:"Interactive card animations"},{key:"videoPlayOnHover",label:"Video Hover",description:"Play videos on hover"}]},{title:"Structure & Motion",icon:e.jsx(G,{className:"w-4 h-4"}),color:"text-blue-400",borderColor:"border-blue-500/30",bgColor:"bg-blue-900/20",effects:[{key:"centralWireframe",label:"Wireframe",description:"Center structure"},{key:"centerLogo",label:"Center Logo",description:"Ravie logo in center"},{key:"smoothRotation",label:"Smooth",description:"Better easing"},{key:"depthHierarchy",label:"Depth",description:"Scale by distance"},{key:"organicFlow",label:"Organic Flow",description:"Natural variations"},{key:"outwardTurn",label:"Outward Turn",description:"Scroll-based opening + ghost"}],hasLogoMode:!0,hasRepeatTurns:!0},{title:"Navigation",icon:e.jsx(te,{className:"w-4 h-4"}),color:"text-yellow-400",borderColor:"border-yellow-500/30",bgColor:"bg-yellow-900/20",effects:[{key:"projectCounter",label:"Counter",description:"Project number"},{key:"navigationDots",label:"Dots",description:"Nav indicators"},{key:"minimalistControls",label:"Controls",description:"Clean controls"}]},{title:"Typography",icon:e.jsx(ae,{className:"w-4 h-4"}),color:"text-indigo-400",borderColor:"border-indigo-500/30",bgColor:"bg-indigo-900/20",effects:[{key:"ashfallTypography",label:"Typography",description:"Ashfall fonts"},{key:"subtleText",label:"Subtle",description:"Muted colors"}]},{title:"Placement System",icon:e.jsx(B,{className:"w-4 h-4"}),color:"text-cyan-400",borderColor:"border-cyan-500/30",bgColor:"bg-cyan-900/20",effects:[],hasSlider:!0},{title:"Input Controls",icon:e.jsx(se,{className:"w-4 h-4"}),color:"text-orange-400",borderColor:"border-orange-500/30",bgColor:"bg-orange-900/20",effects:[{key:"invertScroll",label:"Invert Scroll",description:"Flip wheel direction"}],hasMode:!0}],j=({effect:n,isLocked:x,onToggle:v,onToggleLock:y})=>e.jsxs("div",{className:`flex items-start gap-3 p-2 rounded-lg transition-all ${x?"bg-gray-800/60 border border-gray-600":"hover:bg-gray-800/30"}`,children:[e.jsxs("div",{className:"flex items-center gap-2 flex-1 min-w-0",children:[e.jsx(Ce,{id:n.key,checked:r[n.key]||!1,onCheckedChange:R=>!x&&v(n.key,R),className:`scale-75 ${x?"opacity-50 cursor-not-allowed":""}`,disabled:x}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("label",{htmlFor:n.key,className:`text-xs font-medium cursor-pointer block ${x?"text-gray-400":"text-gray-200 hover:text-white"}`,children:n.label}),e.jsx("p",{className:"text-xs text-gray-500 mt-0.5 leading-tight",children:n.description})]})]}),e.jsx("button",{onClick:()=>y==null?void 0:y(n.key),className:`p-1 rounded transition-colors ${x?"text-red-400 hover:text-red-300 bg-red-900/20":"text-gray-500 hover:text-gray-300 hover:bg-gray-700"}`,title:x?"Unlock effect":"Lock effect",children:x?e.jsx(A,{className:"w-3 h-3"}):e.jsx(M,{className:"w-3 h-3"})})]}),z=({group:n,isHidden:x,onToggleVisibility:v})=>{var y,R;return e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:n.color,children:n.icon}),e.jsx("h3",{className:`font-semibold text-sm uppercase tracking-wide ${n.color}`,children:n.title})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-xs text-gray-500",children:[((y=n.effects)==null?void 0:y.filter(P=>r[P.key]).length)||0,"/",((R=n.effects)==null?void 0:R.length)||0]}),e.jsx("button",{onClick:v,className:"p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors",title:x?"Show group":"Hide group",children:x?e.jsx(oe,{className:"w-3 h-3"}):e.jsx(H,{className:"w-3 h-3"})})]})]})},N=({label:n,value:x,min:v,max:y,step:R=1,suffix:P="",onChange:q,isLocked:S,onToggleLock:$})=>e.jsxs("div",{className:`p-2 rounded-lg transition-all ${S?"bg-gray-800/60 border border-gray-600":"hover:bg-gray-800/30"}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:`text-xs font-medium ${S?"text-gray-400":"text-gray-300"}`,children:n}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-xs font-mono text-blue-400",children:[x,P]}),e.jsx("button",{onClick:()=>$==null?void 0:$(`slider-${n.toLowerCase().replace(/\s+/g,"-")}`),className:`p-1 rounded transition-colors ${S?"text-red-400 hover:text-red-300 bg-red-900/20":"text-gray-500 hover:text-gray-300 hover:bg-gray-700"}`,title:S?"Unlock slider":"Lock slider",children:S?e.jsx(A,{className:"w-3 h-3"}):e.jsx(M,{className:"w-3 h-3"})})]})]}),e.jsx("input",{type:"range",min:v,max:y,step:R,value:x,onChange:K=>!S&&q(Number(K.target.value)),disabled:S,className:`w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${S?"opacity-50 cursor-not-allowed":""}`,style:{background:`linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(x-v)/(y-v)*100}%, #374151 ${(x-v)/(y-v)*100}%, #374151 100%)`}})]});return e.jsxs("div",{className:`fixed top-0 left-0 z-50 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 shadow-2xl transition-transform duration-300 ${m?"-translate-x-full":"translate-x-0"}`,style:{width:"380px",height:"100vh"},children:[e.jsx("button",{onClick:()=>t(!m),className:"absolute -right-12 top-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-r-lg p-2 shadow-sm hover:bg-gray-800 transition-colors z-10",children:e.jsx(E,{className:"w-4 h-4 text-purple-400"})}),e.jsxs("div",{className:"p-4 h-full overflow-y-auto custom-scrollbar",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(E,{className:"w-5 h-5 text-purple-400"}),e.jsx("h2",{className:"text-lg font-bold text-white",children:"EFFECTS CONTROL"})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(C,{variant:"outline",size:"sm",onClick:h,disabled:!p,className:"text-xs px-1.5 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",title:"Undo last change (Ctrl+Z)",children:e.jsx(T,{className:"w-3 h-3"})}),e.jsx(C,{variant:"outline",size:"sm",onClick:c,disabled:!i,className:"text-xs px-1.5 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",title:"Redo last undone change (Ctrl+Y)",children:e.jsx(D,{className:"w-3 h-3"})}),e.jsx(C,{variant:"outline",size:"sm",onClick:()=>o==null?void 0:o(),className:"text-xs px-2 py-1 h-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700",children:"Reset"}),e.jsx(C,{variant:"outline",size:"sm",onClick:()=>{Object.entries({ashfallColors:!0,monochrome:!0,chromaticAberration:!0,depthBlur:!0,ashfallCards:!0,cardShadows:!0,centralWireframe:!0,smoothRotation:!0,depthHierarchy:!0,projectCounter:!0,ashfallTypography:!0,subtleText:!0,outwardTurn:!0}).forEach(([x,v])=>{s[x]||a==null||a(x,v)})},className:"text-xs px-2 py-1 h-6 bg-blue-50/10 text-blue-400 border-blue-500/30 hover:bg-blue-50/20",children:"Ashfall"})]})]}),e.jsxs("div",{className:"mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-gray-400",children:"Locked Effects:"}),e.jsx("span",{className:"text-red-400 font-mono",children:Object.values(s).filter(Boolean).length})]}),e.jsxs("div",{className:"flex items-center justify-between text-xs mt-1",children:[e.jsx("span",{className:"text-gray-400",children:"Active Effects:"}),e.jsx("span",{className:"text-green-400 font-mono",children:Object.values(r).filter(Boolean).length})]})]}),e.jsx("div",{className:"space-y-4",children:k.map(n=>{var v;const x=g[n.title];return e.jsxs("div",{className:`p-4 rounded-lg border transition-all ${n.bgColor} ${n.borderColor}`,children:[e.jsx(z,{group:n,isHidden:x,onToggleVisibility:()=>w(n.title)}),!x&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"space-y-2",children:(v=n.effects)==null?void 0:v.map(y=>e.jsx(j,{effect:y,isLocked:s[y.key],onToggle:a,onToggleLock:l},y.key))}),n.hasMode&&n.title==="Input Controls"&&e.jsxs("div",{className:"mt-3",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-medium text-gray-300",children:"Scroll Mode"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-gray-400",children:r.scrollMode||"wheel"}),e.jsx("button",{onClick:()=>l==null?void 0:l("scrollMode"),className:`p-1 rounded transition-colors ${s.scrollMode?"text-red-400 hover:text-red-300 bg-red-900/20":"text-gray-500 hover:text-gray-300 hover:bg-gray-700"}`,children:s.scrollMode?e.jsx(A,{className:"w-3 h-3"}):e.jsx(M,{className:"w-3 h-3"})})]})]}),e.jsxs("select",{value:r.scrollMode||"wheel",onChange:y=>!s.scrollMode&&(a==null?void 0:a("scrollMode",y.target.value)),disabled:s.scrollMode,className:`w-full text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 ${s.scrollMode?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("option",{value:"wheel",children:"Wheel (manual)"}),e.jsx("option",{value:"sticky",children:"Sticky (scroll timeline)"})]})]}),n.hasSlider&&n.title==="Placement System"&&e.jsx("div",{className:"mt-3",children:e.jsx(N,{label:"STRENGTH",value:r.placementStrength||6,min:0,max:10,step:1,onChange:d,isLocked:s["slider-strength"],onToggleLock:l})}),n.hasLogoMode&&n.title==="Structure & Motion"&&r.centerLogo&&e.jsxs("div",{className:"mt-3",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-medium text-gray-300",children:"Logo Mode"}),e.jsx("button",{onClick:()=>l==null?void 0:l("centerLogoMode"),className:`p-1 rounded transition-colors ${s.centerLogoMode?"text-red-400 hover:text-red-300 bg-red-900/20":"text-gray-500 hover:text-gray-300 hover:bg-gray-700"}`,children:s.centerLogoMode?e.jsx(A,{className:"w-3 h-3"}):e.jsx(M,{className:"w-3 h-3"})})]}),e.jsxs("select",{value:r.centerLogoMode||"billboard",onChange:y=>!s.centerLogoMode&&(a==null?void 0:a("centerLogoMode",y.target.value)),disabled:s.centerLogoMode,className:`w-full text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 ${s.centerLogoMode?"opacity-50 cursor-not-allowed":""}`,children:[e.jsx("option",{value:"billboard",children:"Billboard (always forward)"}),e.jsx("option",{value:"rotate",children:"Rotate with scene"})]})]}),n.hasRepeatTurns&&n.title==="Structure & Motion"&&e.jsx("div",{className:"mt-3",children:e.jsx(N,{label:"REPEAT TURNS",value:r.repeatTurns||2,min:0,max:5,step:.5,onChange:b,isLocked:s["slider-repeat-turns"],onToggleLock:l})})]})]},n.title)})})]}),e.jsx("style",{children:`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        .slider:disabled::-webkit-slider-thumb {
          background: #6b7280;
          cursor: not-allowed;
        }
      `})]})};export{Be as A,Ae as C,Ie as E,$e as N,Pe as S,Ee as T,Me as V,Oe as a,Ce as b};

# Building Parakh screens in Figma (Plugin API via `use_figma`)

Build everything as editable auto-layout frames (no screenshots). One `use_figma` call can build a whole
screen (or EN + UR together). Starter-plan accounts have a small monthly MCP call budget — batch screens, and
take screenshots inline with `await node.screenshot({scale:.4})` instead of separate calls.

## Images
Upload photos once with `upload_assets` (count N, no nodeIds → frames on the page), POST each file
(`curl -F file=@img.jpg <submitUrl>`), read back `imageHash`, then reuse the hash as fills:
`rect.fills=[{type:'IMAGE',imageHash:HASH,scaleMode:'FILL'}]`. Hashes are content hashes — the same file gives
the same hash in every file.

## Helper library (paste at the top of each call)
```js
const LF='Plus Jakarta Sans',UF='Noto Nastaliq Urdu';
await Promise.all(['Regular','Medium','SemiBold','Bold','ExtraBold'].map(s=>figma.loadFontAsync({family:LF,style:s}))
  .concat(['Regular','Medium','SemiBold','Bold'].map(s=>figma.loadFontAsync({family:UF,style:s}))));
const hx=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const S=(h,o)=>[{type:'SOLID',color:hx(h),opacity:o==null?1:o}];
let UR=false; // set true while building Urdu frames
function T(p,s,o={}){const t=figma.createText();const ur=UR&&!o.lat;let w=o.w||'Regular';if(ur&&w==='ExtraBold')w='Bold';
  t.fontName={family:ur?UF:LF,style:w};t.characters=s;t.fontSize=(o.size||16)*(ur?0.92:1);t.fills=S(o.c||'#1A1D24',o.op);
  t.lineHeight={unit:'PERCENT',value:ur?Math.max(o.lh||150,185):(o.lh||150)};if(o.ls!=null&&!ur)t.letterSpacing={unit:'PERCENT',value:o.ls};
  p.appendChild(t);if(o.fill){t.textAutoResize='HEIGHT';t.layoutSizingHorizontal='FILL';}else if(o.width){t.resize(o.width,t.height);t.textAutoResize='HEIGHT';}return t;}
function A(p,dir,o={}){const f=figma.createAutoLayout(dir);f.fills=o.bg?S(o.bg):[];
  for(const k of ['itemSpacing','counterAxisAlignItems','primaryAxisAlignItems','name','cornerRadius'])if(o[k]!=null)f[k]=o[k];
  if(o.pad){f.paddingTop=o.pad[0];f.paddingBottom=o.pad[2]!=null?o.pad[2]:o.pad[0];f.paddingLeft=f.paddingRight=o.pad[1];}
  if(o.stroke){f.strokes=S(o.stroke);f.strokeWeight=o.sw||1;f.strokeAlign='INSIDE';}
  if(p){p.appendChild(f);if(o.fill)f.layoutSizingHorizontal='FILL';if(o.fillV)f.layoutSizingVertical='FILL';}return f;}
function line(f,c){f.strokes=S(c||'#EFE8DA');f.strokeAlign='INSIDE';f.strokeWeight=0;f.strokeTopWeight=1;}
function svg(p,s,n){const v=figma.createNodeFromSvg(s);v.resize(n,n);v.fills=[];p.appendChild(v);return v;}
// RTL: build the Urdu frame exactly like the English one, then mirror it.
function mirror(fr){fr.findAll(n=>n.type==='FRAME').forEach(f=>{
  if(f.layoutMode==='HORIZONTAL'&&f.children.length>1){[...f.children].reverse().forEach((c,i)=>f.insertChild(i,c));}
  if(f.layoutMode==='VERTICAL'&&f.counterAxisAlignItems==='MIN')f.counterAxisAlignItems='MAX';});
  fr.findAll(n=>n.type==='TEXT').forEach(t=>t.textAlignHorizontal='RIGHT');}
```

## Patterns
- **Page**: `figma.createAutoLayout('VERTICAL')`, `resize(1280|390,100)`, `counterAxisSizingMode='FIXED'`, `primaryAxisSizingMode='AUTO'`, fill ivory. Place frames on a grid (e.g. x += 1400 desktop / 470 mobile).
- **Photo band**: a plain frame (no auto-layout) with photo rect + overlay rect (gradient, constraints STRETCH) + an auto-layout content frame at 0,0 holding the header and band text.
- **Overlapping card**: wrap band + card row in a vertical auto-layout with **negative `itemSpacing`** (−64 mobile, −88/−120 desktop). Later children render on top.
- **Colour bar on cards**: horizontal frame whose first child is a 6–10px rectangle with `layoutSizingVertical='FILL'`.
- **Empty spacer frames** default to 100×100 — always `resize()` them or avoid them.
- **Headers/footers**: for files that will be copy-pasted into another file, draw them inline (not as components) so pasted frames don't keep links to the source file.
- Wrapping text: `textAutoResize='HEIGHT'` then `layoutSizingHorizontal='FILL'` after appending.
- Mobile status-chip rows that wrap: `layoutWrap='WRAP'`, `counterAxisSpacing`.

## Known file layout (Parakh files)
Main file has: Home EN/UR (desktop), shared Header/Footer components, Report ×3, Checking, Error, No internet,
How (EN), report template (partial). Second file has mobile EN/UR for all pages, desktop Urdu for Report,
Checking, Error, No internet, How, and Contact + My checks (desktop + mobile, EN + UR).

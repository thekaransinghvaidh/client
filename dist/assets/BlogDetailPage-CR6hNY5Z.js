import{j as e}from"./vendor-animation-CO_6hlwc.js";import{r as n,l as R,aF as I,aA as L,O as E,N as H,a1 as M,ad as P,aG as _,j as O,aH as W,a5 as G,aI as K,b as V}from"./vendor-icons-C15T-yh5.js";import{i as U,b as Q,L as u,S as Y}from"./index-eBMB17Bl.js";const J=(m="")=>String(m).toLowerCase().replace(/<[^>]+>/g,"").trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");function X(m=""){if(!m)return{html:"",toc:[],disclaimer:""};let t=m.replace(/<\/p>\s*(?:<br\s*\/?>\s*)+/gi,`</p>
`).replace(/<\/h([1-6])>\s*(?:<br\s*\/?>\s*)+/gi,`</h$1>
`).replace(/(?:<br\s*\/?>\s*)+<h([1-6])/gi,"<h$1"),b="";t=t.replace(/<p>\s*<strong>\s*Medical disclaimer:\s*<\/strong>([\s\S]*?)<\/p>/i,(i,o)=>(b=o.trim(),"")),t=t.replace(/(^|[^"'>])(https:\/\/thekaransinghvaidh\.com\/[^\s<"]+)/g,'$1<a href="$2">$2</a>');const v=/<h[23][^>]*>\s*Frequently Asked Questions\s*<\/h[23]>/i;if(v.test(t)){const i=t.split(v),o=i[0],x=i.slice(1).join(""),c=/<p>\s*<strong>\s*(?:\d+\.\s*)?([\s\S]*?)<\/strong>\s*<\/p>\s*<p>([\s\S]*?)<\/p>/gi,h=[];let g;for(;(g=c.exec(x))!==null;)h.push({q:g[1].replace(/<[^>]+>/g,"").trim(),a:g[2].trim()});if(h.length>0){const k=h.map((j,N)=>`
<details ${N===0?"open":""} class="ksv-faq-item">
  <summary class="ksv-faq-summary">
    <span>${j.q}</span>
    <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div class="ksv-faq-body">
    <p>${j.a}</p>
  </div>
</details>`).join(`
`);t=`${o}
<h2>Frequently Asked Questions</h2>
<div class="faq-accordions">${k}</div>`}}t=t.replace(/(?:<p>\s*[•·]\s*[\s\S]*?<\/p>\s*)+/gi,i=>{const o=[],x=/<p>\s*[•·]\s*([\s\S]*?)<\/p>/gi;let c;for(;(c=x.exec(i))!==null;)o.push(`<li>${c[1].trim()}</li>`);return o.length>0?`<ul>
${o.join(`
`)}
</ul>
`:i}),t=t.replace(/(?:<p>\s*\d+\.\s+[\s\S]*?<\/p>\s*){2,}/gi,i=>{const o=[],x=/<p>\s*\d+\.\s+([\s\S]*?)<\/p>/gi;let c;for(;(c=x.exec(i))!==null;)o.push(`<li>${c[1].trim()}</li>`);return o.length>0?`<ol>
${o.join(`
`)}
</ol>
`:i}),t=t.replace(/<table(?![^>]*class=)/gi,'<table class="tbl"');const y=[];let w=0;return t=t.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi,(i,o,x)=>{const c=x.replace(/<[^>]+>/g,"").trim();if(!c)return i;w++;const h=o.match(/id=["']([^"']+)["']/i),g=h?h[1]:`${J(c)||"section"}-${w}`;return y.push({id:g,title:c}),h?i:`<h2 id="${g}"${o}>${x}</h2>`}),{html:t,toc:y,disclaimer:b}}const se=()=>{const{slug:m}=U(),[t,b]=n.useState(null),[v,y]=n.useState([]),[w,i]=n.useState(!0),[o,x]=n.useState(!1),[c,h]=n.useState(""),g=n.useRef(null),k=n.useRef(null),j=n.useRef(null),[N,F]=n.useState({});n.useEffect(()=>{m&&B()},[m]);const B=async()=>{try{i(!0);const{data:s}=await Q.get(`/blogs/${m}?inc=1`);if(b(s.blog),y(s.relatedBlogs||[]),s.blog){document.title=`${s.blog.metaTitle||s.blog.title} | Dr. Karan Singh Vaidh`;const r=document.querySelector('meta[name="description"]');r&&r.setAttribute("content",s.blog.metaDescription||s.blog.excerpt)}i(!1),window.scrollTo({top:0,behavior:"smooth"})}catch{try{const r=await fetch("/blogs-fallback.json");if(r.ok){const a=await r.json(),d=(a.blogs||[]).find(l=>l.slug===m||String(l._id)===m)||(a.blogs||[])[0];d&&(b(d),y((a.blogs||[]).filter(l=>l.slug!==d.slug)))}}catch{}i(!1)}},{html:$,toc:p,disclaimer:A}=n.useMemo(()=>X((t==null?void 0:t.content)||""),[t==null?void 0:t.content]);n.useEffect(()=>{const s=()=>{document.head.querySelectorAll('[data-ksv-blog-schema="true"]').forEach(a=>a.remove())};s();const r=t!=null&&t.customSchema?String(t.customSchema).trim():"";if(!r)return s;if(r.startsWith("<")){const a=document.createElement("div");a.innerHTML=r,Array.from(a.children).forEach(d=>{const l=document.createElement(d.tagName.toLowerCase());Array.from(d.attributes).forEach(f=>{l.setAttribute(f.name,f.value)}),l.setAttribute("data-ksv-blog-schema","true"),l.textContent=d.textContent,document.head.appendChild(l)})}else{const a=document.createElement("script");a.type="application/ld+json",a.setAttribute("data-ksv-blog-schema","true"),a.textContent=r,document.head.appendChild(a)}return s},[t==null?void 0:t.customSchema,m]),n.useEffect(()=>{if(!p||p.length===0)return;h(p[0].id);const s=()=>{const r=window.scrollY+140;let a=p[0].id;for(const d of p){const l=document.getElementById(d.id);l&&l.offsetTop<=r&&(a=d.id)}h(a)};return window.addEventListener("scroll",s,{passive:!0}),()=>window.removeEventListener("scroll",s)},[p]),n.useEffect(()=>{const s=()=>{if(window.innerWidth<=900){F({});return}const r=k.current,a=j.current,d=g.current;if(!r||!a||!d)return;const l=96,f=r.getBoundingClientRect(),z=d.getBoundingClientRect(),T=a.offsetHeight;if(f.top<=l){const D=z.bottom-T,q=Math.min(l,D);F({position:"fixed",top:`${q}px`,left:`${f.left}px`,width:`${f.width}px`,maxHeight:`calc(100vh - ${l+20}px)`,overflowY:"auto",zIndex:20})}else F({position:"static",width:"100%"})};return s(),window.addEventListener("scroll",s,{passive:!0}),window.addEventListener("resize",s),()=>{window.removeEventListener("scroll",s),window.removeEventListener("resize",s)}},[t,p.length,w]);const C=()=>{navigator.clipboard.writeText(window.location.href),x(!0),setTimeout(()=>x(!1),2500)};if(w)return e.jsxs("div",{className:"min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]",children:[e.jsx(R,{size:40,className:"text-ayur-green animate-spin mb-4"}),e.jsx("p",{className:"text-gray-400 font-medium",children:"Loading clinical article..."})]});if(!t)return e.jsxs("div",{className:"min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center px-4",children:[e.jsx(I,{size:48,className:"text-gray-300 mb-4"}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Blog Article Not Found"}),e.jsx("p",{className:"text-gray-500 text-sm mt-1 max-w-md",children:"The health article you are looking for may have been updated or moved."}),e.jsx(u,{to:"/blogs",className:"mt-6 px-6 py-3 bg-ayur-green text-white font-bold text-xs rounded-xl shadow-md hover:bg-ayur-olive transition-colors",children:"Back to All Articles"})]});const S=t.excerpt&&t.excerpt.trim().split(/\s+/).length>4?t.excerpt:t.metaDescription||"";return e.jsxs("div",{className:"min-h-screen bg-[#FDFBF7] font-sans selection:bg-ayur-green/10 selection:text-ayur-green pt-6 pb-20",children:[e.jsx(Y,{title:`${t.metaTitle||t.title} | Dr. Karan Singh Vaidh`,description:t.metaDescription||t.excerpt,url:`/blog/${t.slug||m}`,exact:!0}),e.jsx("style",{children:`
                .ksv-article-prose h2 {
                    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                    font-size: 1.75rem;
                    line-height: 1.3;
                    color: #1E4D2B;
                    margin: 2.5rem 0 0.9rem;
                    font-weight: 700;
                    scroll-margin-top: 100px;
                }
                .ksv-article-prose h3 {
                    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                    font-size: 1.35rem;
                    line-height: 1.35;
                    color: #1E4D2B;
                    margin: 1.8rem 0 0.6rem;
                    font-weight: 700;
                }
                .ksv-article-prose p {
                    font-size: 1.0625rem;
                    line-height: 1.8;
                    margin: 0 0 1.15rem;
                    color: #374151;
                }
                .ksv-article-prose ul, .ksv-article-prose ol {
                    font-size: 1.0625rem;
                    line-height: 1.75;
                    margin: 0 0 1.35rem;
                    padding-left: 1.5rem;
                    color: #374151;
                }
                .ksv-article-prose ul { list-style-type: disc; }
                .ksv-article-prose ol { list-style-type: decimal; }
                .ksv-article-prose li { margin-bottom: 0.5rem; }
                .ksv-article-prose strong { color: #111827; font-weight: 700; }
                .ksv-article-prose a { color: #1E4D2B; text-decoration: underline; font-weight: 600; }
                .ksv-article-prose a:hover { color: #143d25; }
                .ksv-article-prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 1rem;
                    margin: 1.5rem 0;
                    display: block;
                }
                .ksv-article-prose .ksv-blog-figure {
                    margin: 1.75rem 0;
                }
                .ksv-article-prose .ksv-blog-figure img {
                    margin: 0;
                    width: 100%;
                    max-height: 480px;
                    object-fit: cover;
                    border-radius: 1rem;
                    border: 1px solid #E5E7EB;
                }
                .ksv-article-prose .ksv-blog-figure figcaption {
                    font-size: 0.85rem;
                    color: #6B7280;
                    text-align: center;
                    margin-top: 0.5rem;
                    font-style: italic;
                }
                .ksv-article-prose .tbl {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin: 1.5rem 0 2rem;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    border: 1px solid #E5E7EB;
                }
                .ksv-article-prose .tbl th {
                    background: #1E4D2B;
                    color: #FFFFFF;
                    text-align: left;
                    padding: 12px 16px;
                    font-weight: 600;
                }
                .ksv-article-prose .tbl td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #E5E7EB;
                    vertical-align: top;
                    background: #FFFFFF;
                }
                .ksv-article-prose .tbl tr:nth-child(even) td {
                    background: #F9FAFB;
                }
                .ksv-faq-item {
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 1rem;
                    padding: 1rem 1.25rem;
                    margin-bottom: 0.75rem;
                }
                .ksv-faq-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    font-weight: 700;
                    font-size: 1.05rem;
                    color: #111827;
                    cursor: pointer;
                    list-style: none;
                }
                .ksv-faq-summary::-webkit-details-marker { display: none; }
                details[open] .chev { transform: rotate(180deg); }
                .ksv-faq-body {
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #F3F4F6;
                    font-size: 1rem;
                    line-height: 1.7;
                    color: #4B5563;
                }
                .ksv-faq-body p { margin: 0 !important; }
                .ksv-toc-link {
                    display: block;
                    padding: 8px 12px;
                    border-radius: 10px;
                    text-decoration: none !important;
                    color: #4B5563;
                    font-size: 14px;
                    line-height: 1.45;
                    transition: background 0.15s, color 0.15s;
                    margin-bottom: 4px;
                }
                .ksv-toc-link:hover {
                    background: #F3F4F6;
                    color: #1E4D2B;
                }
                .ksv-toc-link.active {
                    background: #E3EED5;
                    color: #1E4D2B;
                    font-weight: 700;
                }
                .ksv-side-track {
                    width: 300px;
                    flex-shrink: 0;
                    align-self: stretch;
                }
                .ksv-mtoc { display: none; }
                @media (max-width: 900px) {
                    .ksv-side-track { display: none; }
                    .ksv-mtoc { display: block; }
                }
            `}),e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6",children:e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsxs(u,{to:"/blogs",className:"inline-flex items-center gap-1.5 text-xs font-bold text-ayur-green hover:underline bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs",children:[e.jsx(L,{size:13}),e.jsx("span",{children:"All Articles"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs font-semibold text-gray-400",children:[e.jsx(u,{to:"/",className:"hover:text-ayur-green",children:"Home"}),e.jsx(E,{size:12}),e.jsx(u,{to:"/blogs",className:"hover:text-ayur-green",children:"Blogs"}),e.jsx(E,{size:12}),e.jsx("span",{className:"text-ayur-green truncate max-w-[220px] sm:max-w-[340px]",children:t.title})]})]})}),e.jsxs("div",{ref:g,className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-8 lg:gap-12",children:[e.jsxs("article",{className:"flex-1 min-w-0 space-y-8",children:[e.jsxs("header",{className:"space-y-5",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx("span",{className:"px-4 py-1.5 bg-ayur-green/10 text-ayur-green text-xs font-bold rounded-full uppercase tracking-wider",children:t.category||"Ayurveda"}),t.isFeatured&&e.jsx("span",{className:"px-4 py-1.5 bg-ayur-gold text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm",children:"Featured Insights"})]}),e.jsx("h1",{className:"text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight",children:t.title}),S&&e.jsx("p",{className:"text-base sm:text-lg text-gray-600 leading-relaxed",children:S}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 text-xs text-gray-600 font-medium",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-ayur-green text-white font-bold flex items-center justify-center shadow-md",children:"KS"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-bold text-gray-900",children:t.author||"Karan Singh Vaidh"}),e.jsx("span",{className:"text-[11px] text-gray-400",children:"Ayurveda Acharya · Ayurvedic Practitioner, Solan"})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4 text-gray-500",children:[e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(H,{size:14,className:"text-ayur-green"}),new Date(t.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})]}),e.jsx("span",{children:"•"}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(M,{size:14,className:"text-ayur-green"}),t.readTime||"5 min read"]}),e.jsx("span",{children:"•"}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(P,{size:14,className:"text-ayur-gold"}),t.views||1," reads"]})]})]})]}),t.coverImage&&t.coverImage!=="/logo.png"&&e.jsx("div",{className:"rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-100 max-h-[440px]",children:e.jsx("img",{src:t.coverImage.startsWith("/uploads/")?`https://server-pevq.onrender.com${t.coverImage}`:t.coverImage,alt:t.coverImageAlt||t.title,className:"w-full h-full object-cover",onError:s=>{s.target.style.display="none"}})}),p.length>0&&e.jsx("div",{className:"ksv-mtoc",children:e.jsxs("details",{className:"bg-white border border-gray-200 rounded-2xl p-4 shadow-xs",children:[e.jsxs("summary",{className:"flex items-center justify-between font-bold text-sm text-gray-900 cursor-pointer list-none",children:[e.jsx("span",{children:"ON THIS PAGE"}),e.jsx("svg",{className:"chev",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6 9l6 6 6-6"})})]}),e.jsx("nav",{"aria-label":"Mobile Table of Contents",className:"mt-3 pt-3 border-t border-gray-100",children:p.map(s=>e.jsx("a",{href:`#${s.id}`,className:"ksv-toc-link",children:s.title},s.id))})]})}),(t.metaDescription||t.excerpt)&&e.jsxs("div",{className:"p-6 md:p-7 bg-white rounded-3xl border border-ayur-green/20 shadow-md shadow-ayur-green/5 text-gray-700 italic text-base leading-relaxed border-l-8 border-l-ayur-green",children:['"',t.metaDescription||t.excerpt,'"']}),e.jsx("div",{className:"ksv-article-prose bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm",dangerouslySetInnerHTML:{__html:$}}),Array.isArray(t.images)&&t.images.filter(s=>s&&s.url&&!(t.content||"").includes(s.url)).length>0&&e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-6",children:t.images.filter(s=>s&&s.url&&!(t.content||"").includes(s.url)).map((s,r)=>e.jsxs("figure",{className:"bg-white p-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden",children:[e.jsx("img",{src:s.url.startsWith("/uploads/")?`https://server-pevq.onrender.com${s.url}`:s.url,alt:s.alt||t.title,className:"w-full h-64 object-cover rounded-2xl"}),s.caption&&e.jsx("figcaption",{className:"text-xs text-gray-500 text-center mt-2 italic",children:s.caption})]},r))}),e.jsxs("div",{className:"bg-white border border-gray-200 rounded-2xl p-5 text-xs sm:text-sm text-gray-600 leading-relaxed",children:[e.jsx("strong",{className:"text-gray-900",children:"Medical Disclaimer: "}),A||"This article gives general Ayurvedic educational information only. It does not replace personalised medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting any herbal product."]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm",children:[e.jsxs("span",{className:"text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2",children:[e.jsx(_,{size:16,className:"text-ayur-green"}),"Share this article:"]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("a",{href:`https://api.whatsapp.com/send?text=${encodeURIComponent(t.title+" "+window.location.href)}`,target:"_blank",rel:"noreferrer",className:"w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors",title:"Share on WhatsApp",children:e.jsx(O,{size:18})}),e.jsx("a",{href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,target:"_blank",rel:"noreferrer",className:"w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors",title:"Share on Facebook",children:e.jsx(W,{size:18})}),e.jsx("button",{type:"button",onClick:C,className:"w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-ayur-green hover:text-white transition-colors",title:"Copy Link",children:o?e.jsx(G,{size:18,className:"text-emerald-500"}):e.jsx(K,{size:18})})]})]}),e.jsxs("div",{className:"bg-gradient-to-r from-ayur-green via-[#143d25] to-ayur-green p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6",children:[e.jsxs("div",{className:"space-y-2 text-center sm:text-left",children:[e.jsx("h3",{className:"text-2xl font-serif font-bold italic !text-white",style:{color:"#FFFFFF"},children:"Need Personalized Health Guidance?"}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-200 font-light",children:"Book a direct video/telephonic consultation with Dr. Karan Singh Vaidh."})]}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-3 flex-shrink-0",children:[e.jsx(u,{to:"/book-appointment",className:"px-6 py-3.5 bg-ayur-gold text-ayur-green font-bold text-xs rounded-xl hover:bg-yellow-400 transition-colors shadow-md",children:"Book Appointment"}),e.jsxs(u,{to:"/ayurvedic-products",className:"px-6 py-3.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5",children:[e.jsx(V,{size:14}),"Shop Medicine"]})]})]}),v.length>0&&e.jsxs("div",{className:"pt-8 space-y-6",children:[e.jsxs("h3",{className:"text-2xl font-serif font-bold text-gray-900 italic border-b border-gray-200 pb-4",children:["Related Articles in ",t.category]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:v.map(s=>e.jsxs(u,{to:`/blog/${s.slug}`,className:"bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group space-y-3",children:[e.jsx("div",{className:"aspect-video rounded-xl bg-gray-100 overflow-hidden",children:e.jsx("img",{src:s.coverImage||"/logo.png",alt:s.title,className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",onError:r=>r.target.src="/logo.png"})}),e.jsx("span",{className:"text-[10px] font-bold text-ayur-green uppercase tracking-wider block",children:s.category}),e.jsx("h4",{className:"text-sm font-bold text-gray-900 group-hover:text-ayur-green transition-colors line-clamp-2",children:s.title})]},s._id))})]})]}),p.length>0&&e.jsx("aside",{ref:k,className:"ksv-side-track",children:e.jsxs("div",{ref:j,style:N,className:"bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm",children:[e.jsx("div",{className:"text-xs font-bold uppercase tracking-wider text-gray-500 px-3 pb-3 mb-3 border-b border-gray-200",children:"ON THIS PAGE"}),e.jsx("nav",{"aria-label":"Table of Contents",children:p.map(s=>e.jsx("a",{href:`#${s.id}`,className:`ksv-toc-link ${c===s.id?"active":""}`,onClick:()=>h(s.id),children:s.title},s.id))})]})})]})]})};export{se as default};

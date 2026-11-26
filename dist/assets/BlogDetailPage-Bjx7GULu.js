import{j as e}from"./vendor-animation-CO_6hlwc.js";import{r as l,l as q,aF as L,aA as I,O as E,N as H,a1 as M,ad as P,aG as O,j as _,aH as G,a5 as K,aI as V,b as W}from"./vendor-icons-C15T-yh5.js";import{i as U,b as Q,L as p,S as Y}from"./index-Dq-RHZM1.js";const J=(d="")=>String(d).toLowerCase().replace(/<[^>]+>/g,"").trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");function X(d=""){if(!d)return{html:"",toc:[],disclaimer:""};let t=d.replace(/<\/p>\s*(?:<br\s*\/?>\s*)+/gi,`</p>
`).replace(/<\/h([1-6])>\s*(?:<br\s*\/?>\s*)+/gi,`</h$1>
`).replace(/(?:<br\s*\/?>\s*)+<h([1-6])/gi,"<h$1"),v="";t=t.replace(/<p>\s*<strong>\s*Medical disclaimer:\s*<\/strong>([\s\S]*?)<\/p>/i,(r,a)=>(v=a.trim(),"")),t=t.replace(/(^|[^"'>])(https:\/\/thekaransinghvaidh\.com\/[^\s<"]+)/g,'$1<a href="$2">$2</a>');const h=/<h[23][^>]*>\s*Frequently Asked Questions\s*<\/h[23]>/i;if(h.test(t)){const r=t.split(h),a=r[0],o=r.slice(1).join(""),i=/<p>\s*<strong>\s*(?:\d+\.\s*)?([\s\S]*?)<\/strong>\s*<\/p>\s*<p>([\s\S]*?)<\/p>/gi,n=[];let x;for(;(x=i.exec(o))!==null;)n.push({q:x[1].replace(/<[^>]+>/g,"").trim(),a:x[2].trim()});if(n.length>0){const j=n.map((f,k)=>`
<details ${k===0?"open":""} class="ksv-faq-item">
  <summary class="ksv-faq-summary">
    <span>${f.q}</span>
    <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div class="ksv-faq-body">
    <p>${f.a}</p>
  </div>
</details>`).join(`
`);t=`${a}
<h2>Frequently Asked Questions</h2>
<div class="faq-accordions">${j}</div>`}}t=t.replace(/(?:<p>\s*[•·]\s*[\s\S]*?<\/p>\s*)+/gi,r=>{const a=[],o=/<p>\s*[•·]\s*([\s\S]*?)<\/p>/gi;let i;for(;(i=o.exec(r))!==null;)a.push(`<li>${i[1].trim()}</li>`);return a.length>0?`<ul>
${a.join(`
`)}
</ul>
`:r}),t=t.replace(/(?:<p>\s*\d+\.\s+[\s\S]*?<\/p>\s*){2,}/gi,r=>{const a=[],o=/<p>\s*\d+\.\s+([\s\S]*?)<\/p>/gi;let i;for(;(i=o.exec(r))!==null;)a.push(`<li>${i[1].trim()}</li>`);return a.length>0?`<ol>
${a.join(`
`)}
</ol>
`:r}),t=t.replace(/<table(?![^>]*class=)/gi,'<table class="tbl"');const w=[];let u=0;return t=t.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi,(r,a,o)=>{const i=o.replace(/<[^>]+>/g,"").trim();if(!i)return r;u++;const n=a.match(/id=["']([^"']+)["']/i),x=n?n[1]:`${J(i)||"section"}-${u}`;return w.push({id:x,title:i}),n?r:`<h2 id="${x}"${a}>${o}</h2>`}),{html:t,toc:w,disclaimer:v}}const se=()=>{const{slug:d}=U(),[t,v]=l.useState(null),[h,w]=l.useState([]),[u,r]=l.useState(!0),[a,o]=l.useState(!1),[i,n]=l.useState(""),x=l.useRef(null),j=l.useRef(null),f=l.useRef(null),[k,N]=l.useState({});l.useEffect(()=>{d&&B()},[d]);const B=async()=>{try{r(!0);const{data:s}=await Q.get(`/blogs/${d}?inc=1`);if(v(s.blog),w(s.relatedBlogs||[]),s.blog){document.title=`${s.blog.metaTitle||s.blog.title} | Dr. Karan Singh Vaidh`;const m=document.querySelector('meta[name="description"]');m&&m.setAttribute("content",s.blog.metaDescription||s.blog.excerpt)}r(!1),window.scrollTo({top:0,behavior:"smooth"})}catch(s){console.error("Failed to fetch blog post:",s),r(!1)}},{html:$,toc:c,disclaimer:z}=l.useMemo(()=>X((t==null?void 0:t.content)||""),[t==null?void 0:t.content]);l.useEffect(()=>{if(!c||c.length===0)return;n(c[0].id);const s=()=>{const m=window.scrollY+140;let b=c[0].id;for(const y of c){const g=document.getElementById(y.id);g&&g.offsetTop<=m&&(b=y.id)}n(b)};return window.addEventListener("scroll",s,{passive:!0}),()=>window.removeEventListener("scroll",s)},[c]),l.useEffect(()=>{const s=()=>{if(window.innerWidth<=900){N({});return}const m=j.current,b=f.current,y=x.current;if(!m||!b||!y)return;const g=96,F=m.getBoundingClientRect(),D=y.getBoundingClientRect(),T=b.offsetHeight;if(F.top<=g){const A=D.bottom-T,R=Math.min(g,A);N({position:"fixed",top:`${R}px`,left:`${F.left}px`,width:`${F.width}px`,maxHeight:`calc(100vh - ${g+20}px)`,overflowY:"auto",zIndex:20})}else N({position:"static",width:"100%"})};return s(),window.addEventListener("scroll",s,{passive:!0}),window.addEventListener("resize",s),()=>{window.removeEventListener("scroll",s),window.removeEventListener("resize",s)}},[t,c.length,u]);const C=()=>{navigator.clipboard.writeText(window.location.href),o(!0),setTimeout(()=>o(!1),2500)};if(u)return e.jsxs("div",{className:"min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]",children:[e.jsx(q,{size:40,className:"text-ayur-green animate-spin mb-4"}),e.jsx("p",{className:"text-gray-400 font-medium",children:"Loading clinical article..."})]});if(!t)return e.jsxs("div",{className:"min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center px-4",children:[e.jsx(L,{size:48,className:"text-gray-300 mb-4"}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:"Blog Article Not Found"}),e.jsx("p",{className:"text-gray-500 text-sm mt-1 max-w-md",children:"The health article you are looking for may have been updated or moved."}),e.jsx(p,{to:"/blogs",className:"mt-6 px-6 py-3 bg-ayur-green text-white font-bold text-xs rounded-xl shadow-md hover:bg-ayur-olive transition-colors",children:"Back to All Articles"})]});const S=t.excerpt&&t.excerpt.trim().split(/\s+/).length>4?t.excerpt:t.metaDescription||"";return e.jsxs("div",{className:"min-h-screen bg-[#FDFBF7] font-sans selection:bg-ayur-green/10 selection:text-ayur-green pt-6 pb-20",children:[e.jsx(Y,{title:`${t.metaTitle||t.title} | Dr. Karan Singh Vaidh`,description:t.metaDescription||t.excerpt,url:`/blog/${t.slug||d}`,exact:!0}),e.jsx("style",{children:`
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
            `}),e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6",children:e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsxs(p,{to:"/blogs",className:"inline-flex items-center gap-1.5 text-xs font-bold text-ayur-green hover:underline bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs",children:[e.jsx(I,{size:13}),e.jsx("span",{children:"All Articles"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs font-semibold text-gray-400",children:[e.jsx(p,{to:"/",className:"hover:text-ayur-green",children:"Home"}),e.jsx(E,{size:12}),e.jsx(p,{to:"/blogs",className:"hover:text-ayur-green",children:"Blogs"}),e.jsx(E,{size:12}),e.jsx("span",{className:"text-ayur-green truncate max-w-[220px] sm:max-w-[340px]",children:t.title})]})]})}),e.jsxs("div",{ref:x,className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-8 lg:gap-12",children:[e.jsxs("article",{className:"flex-1 min-w-0 space-y-8",children:[e.jsxs("header",{className:"space-y-5",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx("span",{className:"px-4 py-1.5 bg-ayur-green/10 text-ayur-green text-xs font-bold rounded-full uppercase tracking-wider",children:t.category||"Ayurveda"}),t.isFeatured&&e.jsx("span",{className:"px-4 py-1.5 bg-ayur-gold text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm",children:"Featured Insights"})]}),e.jsx("h1",{className:"text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight",children:t.title}),S&&e.jsx("p",{className:"text-base sm:text-lg text-gray-600 leading-relaxed",children:S}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 text-xs text-gray-600 font-medium",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-ayur-green text-white font-bold flex items-center justify-center shadow-md",children:"KS"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-bold text-gray-900",children:t.author||"Karan Singh Vaidh"}),e.jsx("span",{className:"text-[11px] text-gray-400",children:"Ayurveda Acharya · Ayurvedic Practitioner, Solan"})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4 text-gray-500",children:[e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(H,{size:14,className:"text-ayur-green"}),new Date(t.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})]}),e.jsx("span",{children:"•"}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(M,{size:14,className:"text-ayur-green"}),t.readTime||"5 min read"]}),e.jsx("span",{children:"•"}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(P,{size:14,className:"text-ayur-gold"}),t.views||1," reads"]})]})]})]}),t.coverImage&&t.coverImage!=="/logo.png"&&e.jsx("div",{className:"rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-100 max-h-[440px]",children:e.jsx("img",{src:t.coverImage,alt:t.title,className:"w-full h-full object-cover",onError:s=>{s.target.style.display="none"}})}),c.length>0&&e.jsx("div",{className:"ksv-mtoc",children:e.jsxs("details",{className:"bg-white border border-gray-200 rounded-2xl p-4 shadow-xs",children:[e.jsxs("summary",{className:"flex items-center justify-between font-bold text-sm text-gray-900 cursor-pointer list-none",children:[e.jsx("span",{children:"ON THIS PAGE"}),e.jsx("svg",{className:"chev",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M6 9l6 6 6-6"})})]}),e.jsx("nav",{"aria-label":"Mobile Table of Contents",className:"mt-3 pt-3 border-t border-gray-100",children:c.map(s=>e.jsx("a",{href:`#${s.id}`,className:"ksv-toc-link",children:s.title},s.id))})]})}),(t.metaDescription||t.excerpt)&&e.jsxs("div",{className:"p-6 md:p-7 bg-white rounded-3xl border border-ayur-green/20 shadow-md shadow-ayur-green/5 text-gray-700 italic text-base leading-relaxed border-l-8 border-l-ayur-green",children:['"',t.metaDescription||t.excerpt,'"']}),e.jsx("div",{className:"ksv-article-prose bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm",dangerouslySetInnerHTML:{__html:$}}),e.jsxs("div",{className:"bg-white border border-gray-200 rounded-2xl p-5 text-xs sm:text-sm text-gray-600 leading-relaxed",children:[e.jsx("strong",{className:"text-gray-900",children:"Medical Disclaimer: "}),z||"This article gives general Ayurvedic educational information only. It does not replace personalised medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting any herbal product."]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm",children:[e.jsxs("span",{className:"text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2",children:[e.jsx(O,{size:16,className:"text-ayur-green"}),"Share this article:"]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("a",{href:`https://api.whatsapp.com/send?text=${encodeURIComponent(t.title+" "+window.location.href)}`,target:"_blank",rel:"noreferrer",className:"w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors",title:"Share on WhatsApp",children:e.jsx(_,{size:18})}),e.jsx("a",{href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,target:"_blank",rel:"noreferrer",className:"w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors",title:"Share on Facebook",children:e.jsx(G,{size:18})}),e.jsx("button",{type:"button",onClick:C,className:"w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-ayur-green hover:text-white transition-colors",title:"Copy Link",children:a?e.jsx(K,{size:18,className:"text-emerald-500"}):e.jsx(V,{size:18})})]})]}),e.jsxs("div",{className:"bg-gradient-to-r from-ayur-green via-[#143d25] to-ayur-green p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6",children:[e.jsxs("div",{className:"space-y-2 text-center sm:text-left",children:[e.jsx("h3",{className:"text-2xl font-serif font-bold italic",children:"Need Personalized Health Guidance?"}),e.jsx("p",{className:"text-xs sm:text-sm text-gray-200 font-light",children:"Book a direct video/telephonic consultation with Dr. Karan Singh Vaidh."})]}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-3 flex-shrink-0",children:[e.jsx(p,{to:"/book-appointment",className:"px-6 py-3.5 bg-ayur-gold text-ayur-green font-bold text-xs rounded-xl hover:bg-yellow-400 transition-colors shadow-md",children:"Book Appointment"}),e.jsxs(p,{to:"/ayurvedic-products",className:"px-6 py-3.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5",children:[e.jsx(W,{size:14}),"Shop Medicine"]})]})]}),h.length>0&&e.jsxs("div",{className:"pt-8 space-y-6",children:[e.jsxs("h3",{className:"text-2xl font-serif font-bold text-gray-900 italic border-b border-gray-200 pb-4",children:["Related Articles in ",t.category]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:h.map(s=>e.jsxs(p,{to:`/blog/${s.slug}`,className:"bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group space-y-3",children:[e.jsx("div",{className:"aspect-video rounded-xl bg-gray-100 overflow-hidden",children:e.jsx("img",{src:s.coverImage||"/logo.png",alt:s.title,className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",onError:m=>m.target.src="/logo.png"})}),e.jsx("span",{className:"text-[10px] font-bold text-ayur-green uppercase tracking-wider block",children:s.category}),e.jsx("h4",{className:"text-sm font-bold text-gray-900 group-hover:text-ayur-green transition-colors line-clamp-2",children:s.title})]},s._id))})]})]}),c.length>0&&e.jsx("aside",{ref:j,className:"ksv-side-track",children:e.jsxs("div",{ref:f,style:k,className:"bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm",children:[e.jsx("div",{className:"text-xs font-bold uppercase tracking-wider text-gray-500 px-3 pb-3 mb-3 border-b border-gray-200",children:"ON THIS PAGE"}),e.jsx("nav",{"aria-label":"Table of Contents",children:c.map(s=>e.jsx("a",{href:`#${s.id}`,className:`ksv-toc-link ${i===s.id?"active":""}`,onClick:()=>n(s.id),children:s.title},s.id))})]})})]})]})};export{se as default};

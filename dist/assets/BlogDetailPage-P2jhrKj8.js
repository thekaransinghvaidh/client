import{j as e}from"./vendor-animation-Dc4xcr6c.js";import{r as h,l as C,aF as z,b as W,j as I,aG as R,a5 as T,aH as $}from"./vendor-icons-DSeBxscR.js";import{i as H,b as P,L as g,S as M}from"./index-B2dMvuvu.js";const q=(c="")=>String(c).toLowerCase().replace(/<[^>]+>/g,"").trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");function N(c=""){if(!c)return{html:"",toc:[],disclaimer:"",quickSummary:""};let t=c.replace(/<\/p>\s*(?:<br\s*\/?>\s*)+/gi,`</p>
`).replace(/<\/h([1-6])>\s*(?:<br\s*\/?>\s*)+/gi,`</h$1>
`).replace(/(?:<br\s*\/?>\s*)+<h([1-6])/gi,"<h$1"),m="";t=t.replace(/<p>\s*<strong>\s*Medical disclaimer:\s*<\/strong>([\s\S]*?)<\/p>/i,(o,r)=>(m=r.trim(),"")),t=t.replace(/(^|[^"'>])(https:\/\/thekaransinghvaidh\.com\/[^\s<"]+)/g,'$1<a href="$2">$2</a>');const f=/<h[23][^>]*>\s*Frequently Asked Questions\s*<\/h[23]>/i;if(f.test(t)){const o=t.split(f),r=o[0],a=o.slice(1).join(""),n=/<p>\s*<strong>\s*(?:\d+\.\s*)?([\s\S]*?)<\/strong>\s*<\/p>\s*<p>([\s\S]*?)<\/p>/gi,l=[];let s;for(;(s=n.exec(a))!==null;)l.push({q:s[1].replace(/<[^>]+>/g,"").trim(),a:s[2].trim()});if(l.length>0){const v=l.map((b,k)=>`
<details ${k===0?"open":""} style="background:#FFFFFF;border:1px solid #E6DECB;border-radius:14px;padding:18px 22px;margin-bottom:14px;">
  <summary style="display:flex;align-items:center;justify-content:space-between;gap:16px;font-weight:700;font-size:18px;color:#173A1D;line-height:1.4;">
    <span>${b.q}</span>
    <svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" stroke-width="2.2" style="flex-shrink:0;transition:transform 0.2s ease;"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div style="margin-top:12px;padding-top:12px;border-top:1px solid #F0E9D8;font-size:17px;line-height:1.75;color:#3B3B33;">
    <p style="margin:0;">${b.a}</p>
  </div>
</details>`).join(`
`);t=`${r}
<h2>Frequently Asked Questions</h2>
<div class="faq-accordions">${v}</div>`}}t=t.replace(/(?:<p>\s*[•·]\s*[\s\S]*?<\/p>\s*)+/gi,o=>{const r=[],a=/<p>\s*[•·]\s*([\s\S]*?)<\/p>/gi;let n;for(;(n=a.exec(o))!==null;)r.push(`<li>${n[1].trim()}</li>`);return r.length>0?`<ul>
${r.join(`
`)}
</ul>
`:o}),t=t.replace(/(?:<p>\s*\d+\.\s+[\s\S]*?<\/p>\s*){2,}/gi,o=>{const r=[],a=/<p>\s*\d+\.\s+([\s\S]*?)<\/p>/gi;let n;for(;(n=a.exec(o))!==null;)r.push(`<li>${n[1].trim()}</li>`);return r.length>0?`<ol>
${r.join(`
`)}
</ol>
`:o}),t=t.replace(/<table(?![^>]*class=)/gi,'<table class="tbl"');const y=[];let u=0;return t=t.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi,(o,r,a)=>{const n=a.replace(/<[^>]+>/g,"").trim();if(!n)return o;u++;const l=r.match(/id=["']([^"']+)["']/i),s=l?l[1]:`${q(n)||"section"}-${u}`;return y.push({id:s,title:n}),l?o:`<h2 id="${s}"${r}>${a}</h2>`}),{html:t,toc:y,disclaimer:m}}const V=()=>{const{slug:c}=H(),[t,m]=h.useState(null),[f,y]=h.useState([]),[u,o]=h.useState(!0),[r,a]=h.useState(!1),[n,l]=h.useState(""),[s,v]=h.useState(!1);h.useEffect(()=>{c&&b()},[c]);const b=async()=>{try{o(!0);const{data:i}=await P.get(`/blogs/${c}?inc=1`);if(m(i.blog),y(i.relatedBlogs||[]),i.blog){document.title=`${i.blog.metaTitle||i.blog.title} | Dr. Karan Singh Vaidh`;const p=document.querySelector('meta[name="description"]');p&&p.setAttribute("content",i.blog.metaDescription||i.blog.excerpt)}o(!1),window.scrollTo({top:0,behavior:"smooth"})}catch(i){console.error("Failed to fetch blog post:",i),o(!1)}},{html:k,toc:d,disclaimer:D}=h.useMemo(()=>N((t==null?void 0:t.content)||""),[t==null?void 0:t.content]);h.useEffect(()=>{if(!d||d.length===0)return;l(d[0].id);const i=()=>{const p=window.scrollY+140;let x=d[0].id;for(const F of d){const E=document.getElementById(F.id);E&&E.offsetTop<=p&&(x=F.id)}l(x)};return window.addEventListener("scroll",i,{passive:!0}),()=>window.removeEventListener("scroll",i)},[d]);const w=i=>{i.preventDefault();const p=!s;if(v(p),p){const x=window.location.href;!x.includes("localhost")&&!x.includes("127.0.0.1")&&window.open(`https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(x)}`,"_blank","noopener,noreferrer")}},A=()=>{navigator.clipboard.writeText(window.location.href),a(!0),setTimeout(()=>a(!1),2500)};if(u)return e.jsxs("div",{style:{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#FBF7EE"},children:[e.jsx(C,{size:40,className:"animate-spin mb-4",style:{color:"#1E4D26"}}),e.jsx("p",{style:{color:"#5A5A50",fontWeight:500},children:"Loading Ayurvedic clinical guide..."})]});if(!t)return e.jsxs("div",{style:{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#FBF7EE",textAlign:"center",padding:"0 16px"},children:[e.jsx(z,{size:48,style:{color:"#C5BBA3",marginBottom:16}}),e.jsx("h2",{style:{fontFamily:"'Playfair Display', Georgia, serif",fontSize:28,fontWeight:700,color:"#173A1D",margin:"0 0 8px"},children:"Blog Article Not Found"}),e.jsx("p",{style:{color:"#5A5A50",fontSize:16,maxWidth:440,margin:"0 0 24px"},children:"The health article you are looking for may have been updated or moved."}),e.jsx(g,{to:"/blogs",style:{background:"#1E4D26",color:"#FFFFFF",textDecoration:"none",padding:"12px 24px",borderRadius:999,fontWeight:600,fontSize:15},children:"Back to All Articles"})]});const j=t.createdAt?new Date(t.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"Oct 2026",S=t.updatedAt?new Date(t.updatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):j,B=t.excerpt&&t.excerpt.trim().split(/\s+/).length>4?t.excerpt:t.metaDescription||"A practising vaidh explains authentic Ayurvedic principles, safe herbal selection, and holistic care for lasting wellness.";return e.jsxs("div",{style:{width:"100%",background:"#FBF7EE",color:"#2A2A24",fontFamily:"Inter, system-ui, sans-serif",paddingBottom:80},children:[e.jsx(M,{title:`${t.metaTitle||t.title} | Dr. Karan Singh Vaidh`,description:t.metaDescription||t.excerpt,url:`/blog/${t.slug||c}`,exact:!0}),e.jsx("style",{children:`
                .ksv-blog-wrap a { color: #1E5A2B; }
                .ksv-blog-wrap a:hover { color: #123B1B; }
                .ksv-prose h2 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 32px;
                    line-height: 1.25;
                    color: #173A1D;
                    margin: 56px 0 16px;
                    font-weight: 700;
                    scroll-margin-top: 100px;
                }
                .ksv-prose h3 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 23px;
                    line-height: 1.3;
                    color: #173A1D;
                    margin: 36px 0 10px;
                    font-weight: 600;
                }
                .ksv-prose p {
                    font-size: 18px;
                    line-height: 1.75;
                    margin: 0 0 18px;
                    color: #2A2A24;
                }
                .ksv-prose ul, .ksv-prose ol {
                    font-size: 18px;
                    line-height: 1.7;
                    margin: 0 0 22px;
                    padding-left: 24px;
                    color: #2A2A24;
                }
                .ksv-prose ul { list-style-type: disc; }
                .ksv-prose ol { list-style-type: decimal; }
                .ksv-prose li { margin-bottom: 10px; }
                .ksv-prose strong { color: #173A1D; font-weight: 700; }
                .ksv-prose a { color: #1E5A2B; text-decoration: underline; font-weight: 600; }
                .ksv-prose a:hover { color: #123B1B; }
                .ksv-prose .tbl {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 24px 0 32px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #E6DECB;
                }
                .ksv-prose .tbl th {
                    background: #1E4D26;
                    color: #FFFFFF;
                    text-align: left;
                    padding: 12px 16px;
                    font-weight: 600;
                }
                .ksv-prose .tbl td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #E6DECB;
                    vertical-align: top;
                    background: #FFFFFF;
                }
                .ksv-prose .tbl tr:nth-child(even) td {
                    background: #F5EFE1;
                }
                .ksv-toc a {
                    display: block;
                    padding: 8px 12px;
                    border-radius: 8px;
                    text-decoration: none !important;
                    color: #3B3B33;
                    font-size: 15px;
                    line-height: 1.4;
                    transition: background 0.15s, color 0.15s;
                    margin-bottom: 4px;
                }
                .ksv-toc a:hover {
                    background: #EDE5D2;
                    color: #173A1D;
                }
                .ksv-toc a.active {
                    background: #E3EED5;
                    color: #173A1D;
                    font-weight: 700;
                }
                .ksv-blog-wrap details summary {
                    cursor: pointer;
                    list-style: none;
                }
                .ksv-blog-wrap details summary::-webkit-details-marker {
                    display: none;
                }
                .ksv-blog-wrap details[open] .chev {
                    transform: rotate(180deg);
                }
                .ksv-side {
                    flex: 1 1 260px;
                    max-width: 300px;
                    position: sticky;
                    top: 96px;
                    align-self: flex-start;
                }
                .ksv-mtoc {
                    display: none;
                }
                @media (max-width: 900px) {
                    .ksv-side { display: none; }
                    .ksv-mtoc { display: block; }
                }
                @media (max-width: 720px) {
                    .ksv-prose h2 { font-size: 26px; margin-top: 40px; }
                    .ksv-prose h3 { font-size: 20px; }
                    .ksv-prose p, .ksv-prose ul, .ksv-prose ol { font-size: 17px; }
                    .ksv-h1 { font-size: 34px !important; }
                }
                @media (max-width: 640px) {
                    .ksv-prose .g4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                    .ksv-prose .g3, .ksv-prose .g2 { grid-template-columns: minmax(0, 1fr) !important; }
                    .ksv-prose .tbl thead { display: none; }
                    .ksv-prose .tbl, .ksv-prose .tbl tbody, .ksv-prose .tbl tr, .ksv-prose .tbl td { display: block; width: 100%; }
                    .ksv-prose .tbl tr { padding: 14px 16px; border-bottom: 1px solid #E6DECB; }
                    .ksv-prose .tbl tr:nth-child(even) td { background: transparent; }
                    .ksv-prose .tbl td { border: 0; padding: 3px 0; background: transparent; }
                    .ksv-prose .tbl td[data-label]:not([data-label=""])::before {
                        content: attr(data-label) ": ";
                        font-weight: 600;
                        color: #5A5A50;
                    }
                    .ksv-prose .tbl td:first-child {
                        font-weight: 700;
                        color: #173A1D;
                        font-size: 17px;
                        padding-bottom: 6px;
                    }
                    .ksv-prose .tbl td:first-child::before { content: none !important; }
                    .ksv-qa { padding: 20px !important; }
                    .ksv-qa p { font-size: 17px !important; }
                }
                @media (max-width: 420px) {
                    .ksv-g2b { grid-template-columns: minmax(0, 1fr) !important; }
                }
            `}),e.jsx("div",{id:"top"}),e.jsxs("div",{className:"ksv-blog-wrap",style:{maxWidth:1200,margin:"0 auto",padding:"32px 24px 0",display:"flex",flexWrap:"wrap",gap:"24px 48px",alignItems:"flex-start"},children:[e.jsx("div",{style:{flex:"0 0 100%"},children:e.jsxs("nav",{"aria-label":"Breadcrumb",style:{fontSize:14,color:"#5A5A50",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"},children:[e.jsx(g,{to:"/",style:{color:"#5A5A50",textDecoration:"none"},children:"Home"}),e.jsx("span",{"aria-hidden":"true",children:"/"}),e.jsx(g,{to:"/blogs",style:{color:"#5A5A50",textDecoration:"none"},children:"Blogs"}),e.jsx("span",{"aria-hidden":"true",children:"/"}),e.jsx("span",{style:{color:"#2A2A24",fontWeight:500},children:t.title})]})}),e.jsxs("article",{className:"ksv-prose",style:{flex:"999 1 560px",minWidth:0,maxWidth:760},children:[e.jsxs("header",{style:{margin:"0 0 32px"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",justifyContent:"space-between",marginTop:0},children:[e.jsx("span",{style:{background:"#E3EED5",color:"#1E4D26",fontSize:13,fontWeight:600,letterSpacing:1,textTransform:"uppercase",padding:"6px 14px",borderRadius:999},children:t.category||"Ayurveda Basics"}),e.jsxs("button",{type:"button",onClick:w,lang:"hi",style:{display:"inline-flex",alignItems:"center",gap:8,border:"1.5px solid #1E4D26",background:s?"#1E4D26":"transparent",color:s?"#FFFFFF":"#1E4D26",cursor:"pointer",padding:"8px 16px",borderRadius:999,fontWeight:600,fontSize:15,minHeight:42,transition:"all 0.2s"},children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2","aria-hidden":"true",children:e.jsx("path",{d:"M3 5h12M9 3v2m1.5 0C9.5 11 6 15 3 17m4-6c1.5 3 4 5 6 6m3-8l5 12m-8 0l3-7 3 7m-5-2h4"})}),s?"Read in English":"हिंदी में पढ़ें"]})]}),e.jsx("h1",{className:"ksv-h1",style:{fontFamily:"'Playfair Display', Georgia, serif",fontSize:48,lineHeight:1.14,color:"#173A1D",margin:"20px 0 16px",fontWeight:700},children:t.title}),e.jsx("p",{style:{fontSize:20,lineHeight:1.6,color:"#4A4A40",margin:"0 0 28px",maxWidth:760},children:B}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"16px 28px",padding:"18px 0",borderTop:"1px solid #E1D8C3",borderBottom:"1px solid #E1D8C3"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("div",{style:{width:52,height:52,borderRadius:"50%",background:"#1E4D26",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display', serif",fontSize:22,fontWeight:700,flexShrink:0},children:"KS"}),e.jsxs("div",{style:{lineHeight:1.35},children:[e.jsx("div",{style:{fontSize:13,color:"#5A5A50"},children:"Written by"}),e.jsx("a",{href:"#author",style:{fontWeight:700,color:"#173A1D",textDecoration:"none",fontSize:16},children:t.author||"Karan Singh Vaidh"}),e.jsx("div",{style:{fontSize:13,color:"#5A5A50"},children:"Ayurveda Acharya · Ayurvedic practitioner, Solan"})]})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:20,fontSize:14,color:"#4A4A40"},children:[e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#1E4D26",strokeWidth:"2","aria-hidden":"true",children:[e.jsx("path",{d:"M9 12l2 2 4-4"}),e.jsx("circle",{cx:"12",cy:"12",r:"9"})]}),"Medically reviewed: ",S]}),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#1E4D26",strokeWidth:"2","aria-hidden":"true",children:[e.jsx("rect",{x:"3",y:"5",width:"18",height:"16",rx:"2"}),e.jsx("path",{d:"M3 10h18M8 3v4M16 3v4"})]}),"Published: ",j]}),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"#1E4D26",strokeWidth:"2","aria-hidden":"true",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M12 7v5l3 2"})]}),t.readTime||"5 min read"]})]})]})]}),t.coverImage&&t.coverImage!=="/logo.png"&&e.jsx("figure",{style:{margin:"0 0 32px"},children:e.jsx("img",{width:"1200",height:"628",src:t.coverImage,alt:t.title,style:{width:"100%",height:"auto",maxHeight:460,objectFit:"cover",borderRadius:16,border:"1px solid #E6DECB",display:"block"},onError:i=>{i.target.style.display="none"}})}),d.length>0&&e.jsx("div",{className:"ksv-mtoc",style:{margin:"0 0 28px"},children:e.jsxs("details",{style:{background:"#F5EFE1",border:"1px solid #E6DECB",borderRadius:14,padding:"14px 18px"},children:[e.jsxs("summary",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:700,fontSize:16,color:"#173A1D"},children:[e.jsx("span",{children:"In This Article (Table of Contents)"}),e.jsx("svg",{className:"chev",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#1E4D26",strokeWidth:"2",children:e.jsx("path",{d:"M6 9l6 6 6-6"})})]}),e.jsx("nav",{className:"ksv-toc","aria-label":"Mobile Table of Contents",style:{marginTop:12,paddingTop:10,borderTop:"1px solid #E6DECB"},children:d.map(i=>e.jsx("a",{href:`#${i.id}`,children:i.title},i.id))})]})}),e.jsxs("div",{className:"ksv-qa qa",style:{background:"#F5EFE1",border:"1px solid #E6DECB",borderLeft:"5px solid #1E4D26",borderRadius:16,padding:"24px 28px",margin:"0 0 36px"},children:[e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:8,fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#1E4D26",marginBottom:10},children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"#1E4D26",strokeWidth:"2.2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M12 8v4l2.5 2.5"})]}),s?"मुख्य आयुर्वेदिक सारांश (Quick Takeaway)":"Quick Clinical Takeaway"]}),e.jsx("p",{style:{margin:0,fontSize:18,lineHeight:1.7,color:"#2A2A24",fontWeight:500},children:s?"किसी भी आयुर्वेदिक औषधि का चयन करने से पहले उसकी संपूर्ण जड़ी-बूटी सूची (Ingredients), निर्माता की प्रामाणिकता, सही मात्रा (Dosage) और अपनी शारीरिक प्रकृति की जांच अवश्य करें। पुरानी या गंभीर समस्या होने पर पहले वैद्य से परामर्श लें।":t.metaDescription||"Choose an authentic Ayurvedic formulation with a transparent herbal ingredient list, clear dosage directions, and an identifiable practitioner. Always match the remedy to your constitution (Prakriti) and health condition."})]}),e.jsx("div",{dangerouslySetInnerHTML:{__html:k}}),e.jsxs("div",{style:{background:"#F5EFE1",border:"1px solid #E6DECB",borderRadius:14,padding:"18px 22px",marginTop:44,fontSize:15,lineHeight:1.65,color:"#4A4A40"},children:[e.jsx("strong",{style:{color:"#173A1D"},children:"Medical Disclaimer: "}),D||"This article gives general Ayurvedic educational information only. It does not replace personalised medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting any herbal product, especially if you have a medical condition, are pregnant or breastfeeding, or take prescribed medication."]}),e.jsxs("section",{id:"author","aria-label":"About the Author",style:{background:"#FFFFFF",border:"1px solid #E6DECB",borderRadius:18,padding:28,marginTop:48,display:"flex",flexWrap:"wrap",gap:20,alignItems:"flex-start"},children:[e.jsx("div",{style:{width:68,height:68,borderRadius:"50%",background:"#1E4D26",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display', serif",fontSize:28,fontWeight:700,flexShrink:0},children:"KS"}),e.jsxs("div",{style:{flex:"1 1 260px"},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#1E4D26",marginBottom:4},children:"Written & Clinically Reviewed By"}),e.jsx("h3",{style:{margin:"0 0 6px",fontSize:22,fontFamily:"'Playfair Display', Georgia, serif",color:"#173A1D"},children:t.author||"Karan Singh Vaidh"}),e.jsx("div",{style:{fontSize:14,color:"#5A5A50",marginBottom:12,fontWeight:500},children:"Traditional Himalayan Ayurvedic Practitioner · 23+ Years Clinical Experience · Solan, Himachal Pradesh"}),e.jsx("p",{style:{fontSize:16,lineHeight:1.65,color:"#3B3B33",margin:"0 0 16px"},children:"Practising classical Ayurveda in Solan, HP, Karan Singh Vaidh specialises in root-cause herbal formulations for digestive disorders, respiratory care, kidney & gallbladder stones, metabolic balance, and chronic lifestyle conditions."}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:12},children:[e.jsx(g,{to:"/about-ayurvedic-doctor-in-solan",style:{fontSize:14,fontWeight:600,color:"#1E4D26",textDecoration:"none",padding:"8px 16px",borderRadius:999,background:"#E3EED5"},children:"View Clinical Profile"}),e.jsx(g,{to:"/book-appointment",style:{fontSize:14,fontWeight:600,color:"#1E4D26",textDecoration:"none",padding:"8px 16px",borderRadius:999,border:"1px solid #1E4D26"},children:"Book Direct Consultation"})]})]})]}),e.jsxs("section",{id:"consult","aria-label":"Book Ayurvedic Consultation",style:{background:"#1E4D26",color:"#FFFFFF",borderRadius:20,padding:"32px 28px",marginTop:36,display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:24},children:[e.jsxs("div",{style:{flex:"1 1 320px"},children:[e.jsx("span",{style:{display:"inline-block",background:"rgba(227, 238, 213, 0.18)",color:"#E3EED5",fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",padding:"5px 12px",borderRadius:999,marginBottom:12},children:"Personalised Ayurvedic Care"}),e.jsx("h2",{style:{fontFamily:"'Playfair Display', Georgia, serif",fontSize:28,lineHeight:1.25,color:"#FFFFFF",margin:"0 0 10px"},children:"Speak With Karan Singh Vaidh Before Starting Treatment"}),e.jsx("p",{style:{fontSize:16,lineHeight:1.6,color:"#E3EED5",margin:0},children:"Get a Prakriti-based assessment and personalised herbal guidance from our Solan clinic via video or phone consultation."})]}),e.jsxs("div",{className:"ksv-g2b",style:{display:"flex",flexWrap:"wrap",gap:12},children:[e.jsx(g,{to:"/book-appointment",style:{background:"#9CCB5B",color:"#173A1D",textDecoration:"none",padding:"13px 22px",borderRadius:999,fontWeight:700,fontSize:15,display:"inline-flex",alignItems:"center",justifyContent:"center"},children:"Book Appointment"}),e.jsxs(g,{to:"/ayurvedic-products",style:{background:"transparent",color:"#FFFFFF",border:"1.5px solid rgba(255,255,255,0.45)",textDecoration:"none",padding:"13px 22px",borderRadius:999,fontWeight:600,fontSize:15,display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center"},children:[e.jsx(W,{size:16}),"Explore Formulations"]})]})]}),f.length>0&&e.jsxs("section",{style:{marginTop:56,paddingTop:36,borderTop:"1px solid #E1D8C3"},children:[e.jsx("h2",{style:{margin:"0 0 24px",fontSize:28},children:"Related Ayurvedic Guides"}),e.jsx("div",{className:"g3",style:{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:20},children:f.map(i=>e.jsxs(g,{to:`/blog/${i.slug}`,style:{background:"#FFFFFF",border:"1px solid #E6DECB",borderRadius:16,padding:16,textDecoration:"none",display:"flex",flexDirection:"column",gap:10},children:[e.jsx("div",{style:{aspectRatio:"16/10",borderRadius:10,overflow:"hidden",background:"#F5EFE1"},children:e.jsx("img",{src:i.coverImage||"/logo.png",alt:i.title,style:{width:"100%",height:"100%",objectFit:"cover"},onError:p=>p.target.src="/logo.png"})}),e.jsx("span",{style:{fontSize:12,fontWeight:700,color:"#1E4D26",textTransform:"uppercase",letterSpacing:.8},children:i.category||"Ayurveda"}),e.jsx("h3",{style:{margin:0,fontSize:18,lineHeight:1.35,color:"#173A1D",fontFamily:"'Playfair Display', Georgia, serif"},children:i.title})]},i._id))})]})]}),e.jsxs("aside",{className:"ksv-side",children:[d.length>0&&e.jsxs("div",{style:{background:"#F5EFE1",border:"1px solid #E6DECB",borderRadius:16,padding:"20px 18px",marginBottom:20},children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#5A5A50",padding:"0 10px 10px",borderBottom:"1px solid #E1D8C3",marginBottom:10},children:"On This Page"}),e.jsx("nav",{className:"ksv-toc","aria-label":"Table of Contents",children:d.map(i=>e.jsx("a",{href:`#${i.id}`,className:n===i.id?"active":"",onClick:()=>l(i.id),children:i.title},i.id))})]}),e.jsxs("div",{style:{background:"#FFFFFF",border:"1px solid #E6DECB",borderRadius:16,padding:22,marginBottom:20},children:[e.jsx("div",{style:{display:"inline-block",background:"#E3EED5",color:"#1E4D26",fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",padding:"4px 10px",borderRadius:999,marginBottom:10},children:"Clinical Guidance"}),e.jsx("h3",{style:{fontFamily:"'Playfair Display', Georgia, serif",fontSize:20,lineHeight:1.3,color:"#173A1D",margin:"0 0 8px"},children:"Need Help Choosing the Right Remedy?"}),e.jsx("p",{style:{fontSize:14,lineHeight:1.6,color:"#4A4A40",margin:"0 0 16px"},children:"Consult directly with Dr. Karan Singh Vaidh in Solan for personalised Ayurvedic treatment."}),e.jsx(g,{to:"/book-appointment",style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",background:"#1E4D26",color:"#FFFFFF",textDecoration:"none",padding:"11px 16px",borderRadius:999,fontWeight:600,fontSize:14,marginBottom:10},children:"Book Consultation"}),e.jsx("a",{href:"tel:+918091498454",style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",border:"1px solid #E1D8C3",color:"#173A1D",textDecoration:"none",padding:"9px 16px",borderRadius:999,fontWeight:600,fontSize:13},children:"Call: +91 80914 98454"})]}),e.jsxs("div",{style:{background:"#FFFFFF",border:"1px solid #E6DECB",borderRadius:16,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontSize:13,fontWeight:700,color:"#5A5A50",textTransform:"uppercase",letterSpacing:.8},children:"Share Guide"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("a",{href:`https://api.whatsapp.com/send?text=${encodeURIComponent(t.title+" "+window.location.href)}`,target:"_blank",rel:"noreferrer",title:"Share on WhatsApp",style:{width:36,height:36,borderRadius:"50%",background:"#E3EED5",color:"#1E4D26",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(I,{size:17})}),e.jsx("a",{href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,target:"_blank",rel:"noreferrer",title:"Share on Facebook",style:{width:36,height:36,borderRadius:"50%",background:"#F5EFE1",color:"#173A1D",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(R,{size:17})}),e.jsx("button",{type:"button",onClick:A,title:"Copy Link",style:{width:36,height:36,borderRadius:"50%",background:"#F5EFE1",color:"#173A1D",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:r?e.jsx(T,{size:17,style:{color:"#1E5A2B"}}):e.jsx($,{size:17})})]})]})]})]})]})};export{V as default};

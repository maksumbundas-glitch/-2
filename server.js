const fs = require("fs");
const path = require("path");
const publicDir = path.join(__dirname, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "index.html"), "<!doctype html>\n<html lang=\"uk\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"theme-color\" content=\"#10131b\"><title>Мій склад</title><link rel=\"stylesheet\" href=\"/style.css\"></head>\n<body><header><div><div class=\"brand\">МІЙ СКЛАД</div><small>Облік товарів</small></div><button id=\"loginBtn\" class=\"secondary\">Вхід адміністратора</button></header>\n<main><section class=\"stats\"><div><small>Товарів</small><b id=\"count\">0</b></div><div><small>Одиниць на складі</small><b id=\"units\">0</b></div><div><small>Орієнтовна сума</small><b id=\"value\">0 ₴</b></div></section>\n<div class=\"toolbar\"><input id=\"search\" placeholder=\"Пошук товару...\"><button id=\"addBtn\" hidden>＋ Додати товар</button><button id=\"historyBtn\" class=\"secondary\" hidden>Історія</button></div>\n<section id=\"products\" class=\"products\"></section><p id=\"empty\" class=\"empty\" hidden>Поки що товарів немає.</p>\n</main>\n<dialog id=\"loginDialog\"><form id=\"loginForm\" class=\"dialog\"><button type=\"button\" class=\"x\" data-close>×</button><h2>Вхід адміністратора</h2><input id=\"password\" type=\"password\" placeholder=\"Пароль\" required><button>Увійти</button><p class=\"error\" id=\"loginError\"></p></form></dialog>\n<dialog id=\"productDialog\"><form id=\"productForm\" class=\"dialog\"><button type=\"button\" class=\"x\" data-close>×</button><h2 id=\"formTitle\">Новий товар</h2><input type=\"hidden\" id=\"pid\"><label>Назва<input id=\"name\" required></label><label>Категорія<input id=\"category\"></label><label>Розмір<input id=\"size\"></label><div class=\"two\"><label>Кількість<input id=\"quantity\" type=\"number\" min=\"0\" value=\"0\"></label><label>Ціна продажу, ₴<input id=\"sell\" type=\"number\" min=\"0\" step=\"0.01\" value=\"0\"></label></div><label>Ціна закупки, ₴<input id=\"buy\" type=\"number\" min=\"0\" step=\"0.01\" value=\"0\"></label><label>Фото товару<input id=\"photoFile\" type=\"file\" accept=\"image/*\"></label><img id=\"preview\" class=\"preview\" hidden><button>Зберегти</button></form></dialog>\n<dialog id=\"historyDialog\"><div class=\"dialog\"><button class=\"x\" data-close>×</button><h2>Історія операцій</h2><div id=\"historyList\"></div></div></dialog>\n<div id=\"toast\"></div><script src=\"/app.js\"></script></body></html>");
fs.writeFileSync(path.join(publicDir, "style.css"), ":root{color-scheme:dark;--bg:#10131b;--panel:#191f2b;--line:#2b3444;--muted:#9aa6b8;--accent:#8b9cff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#f4f6fb;font:15px system-ui,-apple-system,Segoe UI,sans-serif}header{height:76px;padding:0 max(18px,calc((100% - 1100px)/2));display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);background:#141925}.brand{font-weight:900;letter-spacing:2px;font-size:20px}small{color:var(--muted)}main{max-width:1100px;margin:26px auto;padding:0 18px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.stats div,.card,.dialog{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px}.stats b{display:block;font-size:25px;margin-top:6px}.toolbar{display:flex;gap:10px;margin:22px 0}.toolbar input{flex:1}input,button{font:inherit;border-radius:10px;padding:12px;border:1px solid var(--line);background:#111722;color:white}button{background:var(--accent);border:0;color:#10131b;font-weight:700;cursor:pointer}button.secondary{background:#252e3e;color:#edf1ff}.products{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.card{padding:0;overflow:hidden}.card img{width:100%;height:170px;object-fit:cover;background:#252e3e}.cardbody{padding:14px}.card h3{margin:0 0 6px}.muted{color:var(--muted);font-size:13px}.price{font-size:18px;font-weight:800;margin:12px 0}.actions{display:flex;flex-wrap:wrap;gap:7px}.actions button{padding:8px 10px;font-size:13px}.empty{text-align:center;color:var(--muted);padding:40px}.dialog{min-width:min(420px,90vw);max-height:90vh;overflow:auto;position:relative}.dialog h2{margin-top:4px}.dialog label{display:block;margin:12px 0;color:var(--muted);font-size:13px}.dialog label input{display:block;width:100%;margin-top:5px}.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.x{float:right;background:transparent;color:white;font-size:22px;padding:2px 9px}.preview{max-width:100%;max-height:160px;display:block;margin:10px auto}.error{color:#ff8e8e}dialog{border:0;padding:0;background:transparent;color:white}dialog::backdrop{background:#000b}.historyrow{padding:10px 0;border-bottom:1px solid var(--line)}#toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#27344b;padding:10px 16px;border-radius:12px;display:none}.empty[hidden],button[hidden]{display:none}@media(max-width:600px){.stats b{font-size:19px}.toolbar{flex-wrap:wrap}.toolbar input{min-width:100%}.products{grid-template-columns:repeat(2,minmax(0,1fr))}.card img{height:130px}.dialog{min-width:90vw}}");
fs.writeFileSync(path.join(publicDir, "app.js"), "const $=id=>document.getElementById(id);let admin=false,products=[],photo=\"\";\nconst money=n=>Number(n||0).toLocaleString(\"uk-UA\")+\" ₴\";\nfunction toast(s){$(\"toast\").textContent=s;$(\"toast\").style.display=\"block\";setTimeout(()=>$(\"toast\").style.display=\"none\",2300)}\nasync function api(url,opts={}){const r=await fetch(url,{...opts,headers:{\"Content-Type\":\"application/json\",...(opts.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||\"Помилка\");return d}\nfunction controls(p){return admin?`<div class=\"actions\"><button onclick=\"move(${p.id},'sale')\">Продаж −1</button><button onclick=\"move(${p.id},'own')\" class=\"secondary\">Собі −1</button><button onclick=\"edit(${p.id})\" class=\"secondary\">Змінити</button><button onclick=\"del(${p.id})\" class=\"secondary\">Видалити</button></div>`:\"\"}\nfunction render(){const q=$(\"search\").value.toLowerCase();const list=products.filter(p=>(p.name+\" \"+p.category+\" \"+p.size).toLowerCase().includes(q));$(\"products\").innerHTML=list.map(p=>`<article class=\"card\">${p.photo?`<img src=\"${p.photo}\" alt=\"\">`:`<div style=\"height:170px;background:#252e3e\"></div>`}<div class=\"cardbody\"><h3>${esc(p.name)}</h3><div class=\"muted\">${esc(p.category||\"\")} ${p.size?\"· \"+esc(p.size):\"\"}</div><div class=\"price\">${money(p.sell_price)}</div><p class=\"muted\">Залишок: <b>${p.quantity}</b></p>${controls(p)}</div></article>`).join(\"\");$(\"empty\").hidden=list.length>0;$(\"count\").textContent=products.length;$(\"units\").textContent=products.reduce((a,p)=>a+Number(p.quantity),0);$(\"value\").textContent=money(products.reduce((a,p)=>a+Number(p.quantity)*Number(p.sell_price),0));}\nfunction esc(s){return String(s??\"\").replace(/[&<>\"']/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]))}\nasync function load(){try{products=await api(\"/api/products\");render()}catch(e){toast(e.message)}}\nasync function refreshAuth(){admin=(await api(\"/api/me\")).admin;$(\"loginBtn\").textContent=admin?\"Вийти\":\"Вхід адміністратора\";$(\"addBtn\").hidden=!admin;$(\"historyBtn\").hidden=!admin;render()}\n$(\"loginBtn\").onclick=async()=>{if(admin){await api(\"/api/logout\",{method:\"POST\"});await refreshAuth();toast(\"Ви вийшли\");}else{$(\"loginError\").textContent=\"\";$(\"loginDialog\").showModal()}};\n$(\"loginForm\").onsubmit=async e=>{e.preventDefault();try{await api(\"/api/login\",{method:\"POST\",body:JSON.stringify({password:$(\"password\").value})});$(\"loginDialog\").close();$(\"password\").value=\"\";await refreshAuth();toast(\"Вхід успішний\")}catch(e){$(\"loginError\").textContent=e.message}};\n$(\"addBtn\").onclick=()=>openProduct();$(\"search\").oninput=render;\nfunction openProduct(p){$(\"productForm\").reset();$(\"pid\").value=p?.id||\"\";$(\"formTitle\").textContent=p?\"Редагувати товар\":\"Новий товар\";$(\"name\").value=p?.name||\"\";$(\"category\").value=p?.category||\"\";$(\"size\").value=p?.size||\"\";$(\"quantity\").value=p?.quantity??0;$(\"sell\").value=p?.sell_price??0;$(\"buy\").value=p?.buy_price??0;photo=p?.photo||\"\";$(\"preview\").hidden=!photo;if(photo)$(\"preview\").src=photo;$(\"productDialog\").showModal()}\nwindow.edit=id=>openProduct(products.find(p=>p.id==id));\n$(\"photoFile\").onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){toast(\"Фото має бути до 5 МБ\");e.target.value=\"\";return}const reader=new FileReader();reader.onload=()=>{photo=reader.result;$(\"preview\").src=photo;$(\"preview\").hidden=false};reader.readAsDataURL(f)};\n$(\"productForm\").onsubmit=async e=>{e.preventDefault();const data={name:$(\"name\").value,category:$(\"category\").value,size:$(\"size\").value,quantity:$(\"quantity\").value,sell_price:$(\"sell\").value,buy_price:$(\"buy\").value,photo};try{const id=$(\"pid\").value;await api(id?\"/api/products/\"+id:\"/api/products\",{method:id?\"PUT\":\"POST\",body:JSON.stringify(data)});$(\"productDialog\").close();await load();toast(\"Збережено\")}catch(e){toast(e.message)}};\nwindow.move=async(id,action)=>{try{await api(`/api/products/${id}/move`,{method:\"POST\",body:JSON.stringify({action,qty:1})});await load();toast(action===\"sale\"?\"Продаж записано\":action===\"own\"?\"Списано для себе\":\"Додано\")}catch(e){toast(e.message)}};\nwindow.del=async id=>{if(!confirm(\"Видалити товар?\"))return;try{await api(\"/api/products/\"+id,{method:\"DELETE\"});await load();toast(\"Видалено\")}catch(e){toast(e.message)}};\n$(\"historyBtn\").onclick=async()=>{try{const h=await api(\"/api/history\");$(\"historyList\").innerHTML=h.map(x=>`<div class=\"historyrow\"><b>${esc(x.action)}</b> · ${esc(x.product_name)} · ${x.qty}<div class=\"muted\">${new Date(x.created_at).toLocaleString(\"uk-UA\")}</div></div>`).join(\"\")||\"Історії поки немає\";$(\"historyDialog\").showModal()}catch(e){toast(e.message)}};\ndocument.querySelectorAll(\"[data-close]\").forEach(b=>b.onclick=()=>b.closest(\"dialog\").close());\nPromise.all([load(),refreshAuth()]);\n");
const express = require("express");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
app.use(express.json({limit:"12mb"}));
app.use(express.urlencoded({extended:true, limit:"12mb"}));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized:false }
});
const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const adminPassword = process.env.ADMIN_PASSWORD;

function sign(value) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
function isAdmin(req) {
  const token = (req.headers.cookie || "").split(";").map(x=>x.trim()).find(x=>x.startsWith("admin_session="))?.split("=")[1];
  if (!token) return false;
  const [payload, mac] = decodeURIComponent(token).split(".");
  if (!payload || !mac || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sign(payload)))) return false;
  try { const data=JSON.parse(Buffer.from(payload,"base64url").toString()); return data.exp>Date.now(); } catch { return false; }
}
function admin(req,res,next){ if(!isAdmin(req)) return res.status(401).json({error:"Потрібен вхід адміністратора"}); next(); }

async function init(){
  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT DEFAULT '',
    size TEXT DEFAULT '', quantity INTEGER NOT NULL DEFAULT 0,
    buy_price NUMERIC(12,2) DEFAULT 0, sell_price NUMERIC(12,2) DEFAULT 0,
    photo TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS history (
    id BIGSERIAL PRIMARY KEY, product_id BIGINT, product_name TEXT NOT NULL,
    action TEXT NOT NULL, qty INTEGER NOT NULL, note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`);
}
app.get("/api/status",(req,res)=>res.json({ready:!!process.env.DATABASE_URL, adminConfigured:!!adminPassword}));
app.post("/api/login",(req,res)=>{
  if(!adminPassword || req.body.password !== adminPassword) return res.status(401).json({error:"Неправильний пароль"});
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+7*24*60*60*1000})).toString("base64url");
  const token=encodeURIComponent(payload+"."+sign(payload));
  res.setHeader("Set-Cookie",`admin_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`);
  res.json({ok:true});
});
app.post("/api/logout",(req,res)=>{res.setHeader("Set-Cookie","admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");res.json({ok:true});});
app.get("/api/me",(req,res)=>res.json({admin:isAdmin(req)}));
app.get("/api/products",async(req,res)=>{try{const r=await pool.query("SELECT id,name,category,size,quantity,buy_price,sell_price,photo FROM products ORDER BY created_at DESC");res.json(r.rows)}catch(e){res.status(500).json({error:"Помилка бази даних"})}});
app.post("/api/products",admin,async(req,res)=>{
 const {name,category="",size="",quantity=0,buy_price=0,sell_price=0,photo=""}=req.body;
 if(!name?.trim()) return res.status(400).json({error:"Вкажи назву товару"});
 try{const r=await pool.query(`INSERT INTO products(name,category,size,quantity,buy_price,sell_price,photo) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[name.trim(),category,size,Math.max(0,Number(quantity)||0),Number(buy_price)||0,Number(sell_price)||0,photo]);res.json(r.rows[0])}catch(e){res.status(500).json({error:"Не вдалося зберегти товар"})}
});
app.put("/api/products/:id",admin,async(req,res)=>{
 const {name,category="",size="",quantity=0,buy_price=0,sell_price=0,photo=""}=req.body;
 try{const r=await pool.query(`UPDATE products SET name=$1,category=$2,size=$3,quantity=$4,buy_price=$5,sell_price=$6,photo=$7,updated_at=NOW() WHERE id=$8 RETURNING *`,[name,category,size,Math.max(0,Number(quantity)||0),Number(buy_price)||0,Number(sell_price)||0,photo,req.params.id]);if(!r.rowCount)return res.status(404).json({error:"Товар не знайдено"});res.json(r.rows[0])}catch(e){res.status(500).json({error:"Не вдалося оновити товар"})}
});
app.post("/api/products/:id/move",admin,async(req,res)=>{
 const qty=Math.max(1,Math.floor(Number(req.body.qty)||1)), action=req.body.action;
 if(!["sale","own","add"].includes(action))return res.status(400).json({error:"Невідома операція"});
 const client=await pool.connect();
 try{await client.query("BEGIN");const r=await client.query("SELECT * FROM products WHERE id=$1 FOR UPDATE",[req.params.id]);if(!r.rowCount)throw new Error("Товар не знайдено");
 const p=r.rows[0], delta=action==="add"?qty:-qty;if(Number(p.quantity)+delta<0)throw new Error("Недостатньо товару на складі");
 await client.query("UPDATE products SET quantity=quantity+$1,updated_at=NOW() WHERE id=$2",[delta,req.params.id]);
 const labels={sale:"Продаж",own:"Для себе",add:"Поповнення"};
 await client.query("INSERT INTO history(product_id,product_name,action,qty) VALUES($1,$2,$3,$4)",[p.id,p.name,labels[action],qty]);
 await client.query("COMMIT");res.json({ok:true});
 }catch(e){await client.query("ROLLBACK");res.status(400).json({error:e.message||"Помилка"})}finally{client.release()}
});
app.delete("/api/products/:id",admin,async(req,res)=>{try{await pool.query("DELETE FROM products WHERE id=$1",[req.params.id]);res.json({ok:true})}catch(e){res.status(500).json({error:"Не вдалося видалити"})}});
app.get("/api/history",admin,async(req,res)=>{try{const r=await pool.query("SELECT * FROM history ORDER BY created_at DESC LIMIT 300");res.json(r.rows)}catch(e){res.status(500).json({error:"Помилка історії"})}});
app.use(express.static("public"));
const port=process.env.PORT||3000;
init().then(()=>app.listen(port,()=>console.log("Мій склад запущено на порту "+port))).catch(e=>{console.error(e);process.exit(1)});

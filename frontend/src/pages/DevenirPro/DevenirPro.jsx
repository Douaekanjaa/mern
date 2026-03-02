import { useState, useRef, useEffect } from "react";
import Nav from "../../components/navbar/Nav";
import Footer from "../../components/footer/Footer";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000'; // ← change port if needed

const STEPS = ["Account", "Profile", "Skills", "Availability", "Review"];

// Categories are fetched from the DB in the component — this is the fallback
const FALLBACK_CATEGORIES = [
  { _id: null, name: "Car Washing" },
  { _id: null, name: "Furniture Assembly" },
  { _id: null, name: "Gardening" },
  { _id: null, name: "House Cleaning" },
  { _id: null, name: "Electrical Work" },
  { _id: null, name: "Painting" },
  { _id: null, name: "Plumbing" },
  { _id: null, name: "Appliance Repair" },
  { _id: null, name: "Carpentry" },
  { _id: null, name: "Moving Help" },
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00","19:00","20:00",
];

const CITIES = [
  "Casablanca","Rabat","Marrakech","Fes","Tanger",
  "Agadir","Meknes","Oujda","Kenitra","Tetouan",
];

// ─── Tiny shared components ───────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p style={{ fontSize:12,color:"#dc2626",marginTop:5,display:"flex",alignItems:"center",gap:4 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {msg}
    </p>
  );
}

function Label({ children, required }) {
  return (
    <label style={{ display:"block",fontSize:13,fontWeight:600,color:"#222",marginBottom:7,letterSpacing:".01em" }}>
      {children}{required && <span style={{ color:"#dc2626",marginLeft:3 }}>*</span>}
    </label>
  );
}

function Input({ label, required, error, icon, hint, type="text", ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:20 }}>
      {label && <Label required={required}>{label}</Label>}
      {hint && <p style={{ fontSize:12,color:"#999",marginBottom:6,marginTop:-4 }}>{hint}</p>}
      <div style={{ position:"relative" }}>
        {icon && (
          <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#bbb",pointerEvents:"none",display:"flex",alignItems:"center" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{
            width:"100%",
            padding: icon ? "12px 14px 12px 40px" : "12px 16px",
            borderRadius:10,
            border:`1.5px solid ${error?"#dc2626":focused?"#1a6b47":"#e4e4e4"}`,
            fontSize:14,color:"#111",background:"#fff",outline:"none",
            boxShadow: focused&&!error?"0 0 0 3px rgba(26,107,71,.09)":"none",
            transition:"border-color .2s,box-shadow .2s",
            fontFamily:"inherit",
          }}
          {...props}
        />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function Textarea({ label, required, error, hint, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:20 }}>
      {label && <Label required={required}>{label}</Label>}
      {hint && <p style={{ fontSize:12,color:"#999",marginBottom:6,marginTop:-4 }}>{hint}</p>}
      <textarea
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        style={{
          width:"100%",padding:"12px 16px",borderRadius:10,
          border:`1.5px solid ${error?"#dc2626":focused?"#1a6b47":"#e4e4e4"}`,
          fontSize:14,color:"#111",background:"#fff",outline:"none",
          resize:"vertical",minHeight:110,
          boxShadow: focused&&!error?"0 0 0 3px rgba(26,107,71,.09)":"none",
          transition:"border-color .2s,box-shadow .2s",
          fontFamily:"inherit",lineHeight:1.65,
        }}
        {...props}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BecomePro() {
  const [step, setStep]           = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]   = useState("");

  const [form, setForm] = useState({
    // Step 0
    email: "", password: "", confirmPassword: "",
    // Step 1
    firstName: "", lastName: "", phone: "", city: "", bio: "",
    gender: "", dateOfBirth: "", address: "", photo: null,
    // Step 2
    skills: [], experience: "", rate: "",
    // Step 3 – availability: { Monday: { enabled, from, to }, … }
    availability: Object.fromEntries(
      DAYS.map(d => [d, { enabled: false, from: "08:00", to: "18:00" }])
    ),
    // Step 4
    agree: false,
  });

  const [errors, setErrors] = useState({});
  // Keep a ref that always has the latest form values so validate() never sees stale closure state
  const formRef = useRef(form);
  formRef.current = form;

  // ── Fetch categories from DB ──
  const [dbCategories, setDbCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/api/category/all`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('Categories from DB:', data); // debug — check browser console
        if (Array.isArray(data) && data.length > 0) {
          setDbCategories(data);
        } else {
          console.warn('Empty or invalid categories response, using fallback');
          setDbCategories(FALLBACK_CATEGORIES);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err.message);
        setDbCategories(FALLBACK_CATEGORIES);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  // ── Field helpers ──
  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    // Clear the field's own error
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
    // When password changes, re-check confirmPassword match live
    if (k === "password" && errors.confirmPassword) {
      const currentConfirm = formRef.current.confirmPassword;
      if (v === currentConfirm) setErrors(e => ({ ...e, confirmPassword: "" }));
    }
    // When confirmPassword changes, re-check match live
    if (k === "confirmPassword" && errors.confirmPassword) {
      const currentPassword = formRef.current.password;
      if (v === currentPassword) setErrors(e => ({ ...e, confirmPassword: "" }));
    }
  };

  // skills stores category _ids (strings) — matched against dbCategories for display
  const toggleSkill = (id) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(id) ? f.skills.filter(x => x !== id) : [...f.skills, id],
    }));
    if (errors.skills) setErrors(e => ({ ...e, skills: "" }));
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      availability: {
        ...f.availability,
        [day]: { ...f.availability[day], enabled: !f.availability[day].enabled },
      },
    }));
    if (errors.availability) setErrors(e => ({ ...e, availability: "" }));
  };

  const setDayTime = (day, key, val) => {
    setForm(f => ({
      ...f,
      availability: { ...f.availability, [day]: { ...f.availability[day], [key]: val } },
    }));
  };

  // ── Validation — reads formRef.current so it always sees the latest state ──
  const validate = () => {
    const f = formRef.current; // avoids stale closure, always latest values
    const e = {};
    if (step === 0) {
      if (!f.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
      if (!f.password) e.password = "Password is required";
      else if (f.password.length < 8) e.password = "Minimum 8 characters";
      else if (!/(?=.*[A-Z])(?=.*\d)/.test(f.password)) e.password = "Include one uppercase letter & one number";
      if (!f.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (f.password !== f.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    if (step === 1) {
      if (!f.firstName.trim()) e.firstName = "First name is required";
      if (!f.lastName.trim())  e.lastName  = "Last name is required";
      if (!f.phone.trim()) e.phone = "Phone is required";
      else if (!/^[0-9+\s\-()]{8,15}$/.test(f.phone)) e.phone = "Enter a valid phone number";
      if (!f.city) e.city = "City is required";
      if (!f.gender) e.gender = "Gender is required";
      if (!f.dateOfBirth) e.dateOfBirth = "Date of birth is required";
      else {
        const age = (new Date() - new Date(f.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) e.dateOfBirth = "You must be at least 18 years old";
      }
      if (!f.bio.trim()) e.bio = "Please write a short bio";
      else if (f.bio.trim().length < 30) e.bio = "Bio must be at least 30 characters";
    }
    if (step === 2) {
      if (f.skills.length === 0) e.skills = "Select at least one skill";
      if (!f.experience) e.experience = "Experience level is required";
      if (!f.rate.toString().trim()) e.rate = "Hourly rate is required";
      else if (isNaN(f.rate) || Number(f.rate) < 10) e.rate = "Minimum rate is 10 MAD/hr";
    }
    if (step === 3) {
      const hasDay = Object.values(f.availability).some(d => d.enabled);
      if (!hasDay) e.availability = "Please select at least one available day";
    }
    if (step === 4) {
      if (!f.agree) e.agree = "You must accept the terms to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next   = () => { if (validate()) setStep(s => s + 1); };
  const back   = () => setStep(s => s - 1);

  // ── Submit to API ──
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");

    // Build availability array for the API
    const f = formRef.current; // always latest
    const availabilityArray = Object.entries(f.availability)
      .filter(([, v]) => v.enabled)
      .map(([day, v]) => ({ day, from: v.from, to: v.to }));

    // Backend uses multer + specific field names — send as FormData
    const fd = new FormData();
    fd.append("email",           f.email);
    fd.append("password",        f.password);
    fd.append("confirmPassword", f.confirmPassword);
    fd.append("first_name",      f.firstName);
    fd.append("last_name",       f.lastName);
    fd.append("phone_number",    f.phone);
    fd.append("city",            f.city);        // backend can resolve location_id from city name
    fd.append("bio",             f.bio);
    fd.append("experience",      f.experience);
    fd.append("rate",            f.rate);
    fd.append("gender",          f.gender);
    fd.append("date_of_birth",   f.dateOfBirth);
    fd.append("address",         f.address);
    // append photo if provided
    if (f.photo) fd.append("photo", f.photo);
    // Send category ObjectIds directly — backend saves them as-is, no name lookup needed
    f.skills.forEach(id => fd.append("categories", id));
    // availability must be JSON stringified — backend does JSON.parse on it
    fd.append("availability", JSON.stringify(availabilityArray));

    try {
      const res = await fetch(`${API_BASE}/api/pros/register`, {
        method: "POST",
        // Do NOT set Content-Type — browser sets it with boundary for FormData
        body:   fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Server error ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Password strength ──
  const pwScore = () => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 8)          s++;
    if (/[A-Z]/.test(form.password))        s++;
    if (/\d/.test(form.password))           s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  };
  const PW_LABEL = ["","Weak","Fair","Good","Strong"];
  const PW_COLOR = ["","#ef4444","#f59e0b","#3b82f6","#16a34a"];
  const pw = pwScore();

  // ── Icons ──
  const IconMail = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
  const IconLock = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );
  const IconPhone = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>
  );
  const IconMoney = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-6h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h2m2 0h2"/></svg>
  );

  return (
    <div style={{ fontFamily:"'Instrument Sans','Helvetica Neue',sans-serif", background:"#f7f7f5", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
        @keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .skill-chip{padding:9px 17px;border-radius:100px;border:1.5px solid #e4e4e4;background:#fff;font-size:13px;font-weight:500;color:#555;cursor:pointer;transition:all .18s;font-family:inherit;line-height:1;}
        .skill-chip.on{border-color:#1a6b47;background:#f0faf5;color:#1a6b47;}
        .skill-chip:hover:not(.on){border-color:#bbb;color:#222;}

        .day-row{display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #f2f2f2;}
        .day-row:last-child{border-bottom:none;}
        .day-toggle{width:42px;height:24px;border-radius:100px;border:none;cursor:pointer;transition:background .2s;position:relative;flex-shrink:0;}
        .day-toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
        .day-toggle.on{background:#1a6b47;}
        .day-toggle.off{background:#ddd;}
        .day-toggle.on::after{transform:translateX(18px);}

        .time-select{padding:8px 12px;border-radius:8px;border:1.5px solid #e4e4e4;font-size:13px;color:#333;background:#fff;outline:none;font-family:inherit;cursor:pointer;transition:border-color .2s;}
        .time-select:focus{border-color:#1a6b47;}
        .time-select:disabled{opacity:.4;cursor:default;}

        .exp-card{padding:16px 14px;border-radius:11px;cursor:pointer;text-align:center;font-family:inherit;border:1.5px solid #e4e4e4;background:#fff;transition:all .18s;}
        .exp-card.on{border-color:#1a6b47;background:#f0faf5;}
        .exp-card:hover:not(.on){border-color:#ccc;}

        .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;border-radius:10px;border:none;background:#1a6b47;color:#fff;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,transform .15s,box-shadow .2s;letter-spacing:.02em;}
        .btn-primary:hover:not(:disabled){background:#155a3a;transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,107,71,.28);}
        .btn-primary:disabled{opacity:.65;cursor:not-allowed;}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:10px;border:1.5px solid #ddd;background:#fff;color:#555;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all .18s;}
        .btn-outline:hover{border-color:#999;color:#222;}

        select.styled-sel{width:100%;padding:12px 16px;border-radius:10px;border:1.5px solid #e4e4e4;font-size:14px;color:#111;background:#fff;outline:none;font-family:inherit;appearance:none;transition:border-color .2s,box-shadow .2s;cursor:pointer;}
        select.styled-sel:focus{border-color:#1a6b47;box-shadow:0 0 0 3px rgba(26,107,71,.09);}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
      `}</style>

      <Nav />

      <main style={{ paddingTop:68 }}>
        {/* ── SUCCESS ──────────────────────────────── */}
        {submitted ? (
          <div style={{ minHeight:"calc(100vh - 68px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
            <div style={{ textAlign:"center",maxWidth:460,animation:"scaleIn .5s ease" }}>
              <div style={{ width:84,height:84,borderRadius:"50%",background:"#f0faf5",border:"3px solid #1a6b47",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",animation:"checkPop .5s ease .15s both" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a6b47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:40,fontWeight:300,color:"#111",letterSpacing:"-.03em",marginBottom:14 }}>You're all set!</h2>
              <p style={{ fontSize:15,color:"#777",lineHeight:1.8,marginBottom:32 }}>
                Welcome, <strong style={{color:"#111"}}>{form.firstName}</strong>. Your application is under review.<br/>
                We'll email you at <strong style={{color:"#1a6b47"}}>{form.email}</strong> within 24 hours.
              </p>
              <a href="/" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",borderRadius:10,background:"#1a6b47",color:"#fff",textDecoration:"none",fontWeight:600,fontSize:14 }}>
                ← Back to Home
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* ── HERO BANNER ───────────────────────── */}
            <div style={{ background:"linear-gradient(135deg,#0d4a30,#1a6b47)",padding:"56px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:32,flexWrap:"wrap" }}>
              <div style={{ maxWidth:540 }}>
                <p style={{ fontSize:11,letterSpacing:".24em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:14,fontWeight:600 }}>Join the platform</p>
                <h1 style={{ fontFamily:"'Fraunces',serif",fontSize:"clamp(34px,4vw,58px)",fontWeight:300,color:"#fff",letterSpacing:"-.03em",lineHeight:1.1,marginBottom:16 }}>
                  Become a Pro,<br/><em style={{ fontStyle:"italic",color:"rgba(255,255,255,.55)" }}>earn on your terms.</em>
                </h1>
                <p style={{ fontSize:15,color:"rgba(255,255,255,.6)",lineHeight:1.78,maxWidth:380 }}>
                  Join 500+ verified professionals already earning with Bricole across Morocco.
                </p>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,flexShrink:0 }}>
                {[{v:"500+",l:"Active pros"},{v:"10K+",l:"Jobs done"},{v:"4.9★",l:"Avg. rating"},{v:"24h",l:"First job avg."}].map((s,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.09)",backdropFilter:"blur(8px)",borderRadius:12,padding:"18px 22px",border:"1px solid rgba(255,255,255,.12)" }}>
                    <div style={{ fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:300,color:"#fff",lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.45)",marginTop:5,letterSpacing:".08em",textTransform:"uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FORM SHELL ────────────────────────── */}
            <div style={{ maxWidth:700,margin:"0 auto",padding:"52px 24px 80px" }}>

              {/* Stepper */}
              <div style={{ display:"flex",alignItems:"center",marginBottom:44 }}>
                {STEPS.map((s,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"none" }}>
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
                      <div style={{
                        width:36,height:36,borderRadius:"50%",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:13,fontWeight:600,transition:"all .25s",
                        background: i<step?"#1a6b47":"#fff",
                        border: i<=step?"2px solid #1a6b47":"2px solid #e4e4e4",
                        color: i<step?"#fff":i===step?"#1a6b47":"#bbb",
                        boxShadow: i===step?"0 0 0 4px rgba(26,107,71,.12)":"none",
                      }}>
                        {i < step
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          : i+1}
                      </div>
                      <span style={{ fontSize:10,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:i<=step?"#1a6b47":"#ccc",whiteSpace:"nowrap" }}>{s}</span>
                    </div>
                    {i < STEPS.length-1 && (
                      <div style={{ flex:1,height:2,background:i<step?"#1a6b47":"#e8e8e8",margin:"0 6px",marginBottom:20,transition:"background .3s",borderRadius:2 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Card */}
              <div
                key={step}
                style={{ background:"#fff",borderRadius:18,border:"1.5px solid #ebebeb",padding:"40px",boxShadow:"0 4px 32px rgba(0,0,0,.055)",animation:"fadeUp .45s ease" }}
              >
                {/* ── STEP 0: Account ── */}
                {step === 0 && (
                  <>
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:300,color:"#111",letterSpacing:"-.025em",marginBottom:5 }}>Create your account</h2>
                    <p style={{ fontSize:14,color:"#888",marginBottom:28 }}>Already have an account? <a href="/pro-login" style={{ color:"#1a6b47",fontWeight:600,textDecoration:"none" }}>Log in</a></p>

                    <Input label="Email address" required icon={<IconMail/>} placeholder="you@example.com"
                      value={form.email} onChange={e=>setField("email",e.target.value)} error={errors.email} />

                    <Input label="Password" required icon={<IconLock/>} type="password" placeholder="At least 8 characters"
                      value={form.password} onChange={e=>setField("password",e.target.value)} error={errors.password} />

                    {form.password && (
                      <div style={{ marginTop:-12,marginBottom:20 }}>
                        <div style={{ display:"flex",gap:4,marginBottom:5 }}>
                          {[1,2,3,4].map(i=>(
                            <div key={i} style={{ flex:1,height:3,borderRadius:2,background:i<=pw?PW_COLOR[pw]:"#f0f0f0",transition:"background .25s" }} />
                          ))}
                        </div>
                        {pw > 0 && <span style={{ fontSize:11,color:PW_COLOR[pw],fontWeight:600 }}>Password strength: {PW_LABEL[pw]}</span>}
                      </div>
                    )}

                    <Input label="Confirm password" required icon={<IconLock/>} type="password" placeholder="Repeat your password"
                      value={form.confirmPassword} onChange={e=>setField("confirmPassword",e.target.value)} error={errors.confirmPassword} />
                  </>
                )}

                {/* ── STEP 1: Profile ── */}
                {step === 1 && (
                  <>
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:300,color:"#111",letterSpacing:"-.025em",marginBottom:5 }}>Your profile</h2>
                    <p style={{ fontSize:14,color:"#888",marginBottom:28 }}>This is what customers will see when browsing pros.</p>

                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                      <Input label="First name" required placeholder="Youssef"
                        value={form.firstName} onChange={e=>setField("firstName",e.target.value)} error={errors.firstName} />
                      <Input label="Last name" required placeholder="Alami"
                        value={form.lastName} onChange={e=>setField("lastName",e.target.value)} error={errors.lastName} />
                    </div>

                    {/* Photo upload */}
                    <div style={{ marginBottom:20 }}>
                      <Label>Profile photo</Label>
                      <label style={{
                        display:"flex", alignItems:"center", gap:14,
                        padding:"14px 16px", borderRadius:10,
                        border:`1.5px dashed ${form.photo?"#1a6b47":"#e4e4e4"}`,
                        background: form.photo?"#f0faf5":"#fafaf8",
                        cursor:"pointer", transition:"all .2s",
                      }}>
                        <input type="file" accept="image/*" style={{ display:"none" }}
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) setField("photo", file);
                          }} />
                        {form.photo ? (
                          <>
                            <img src={URL.createObjectURL(form.photo)} alt="preview"
                              style={{ width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid #1a6b47" }} />
                            <div>
                              <div style={{ fontSize:13,fontWeight:600,color:"#1a6b47" }}>{form.photo.name}</div>
                              <div style={{ fontSize:11,color:"#aaa",marginTop:2 }}>Click to change</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ width:44,height:44,borderRadius:"50%",background:"#e8e8e8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                            </div>
                            <div>
                              <div style={{ fontSize:13,fontWeight:600,color:"#555" }}>Upload a photo</div>
                              <div style={{ fontSize:11,color:"#aaa",marginTop:2 }}>JPG, PNG up to 5MB</div>
                            </div>
                          </>
                        )}
                      </label>
                    </div>

                    <Input label="Phone number" required icon={<IconPhone/>} placeholder="+212 6XX XXX XXX"
                      value={form.phone} onChange={e=>setField("phone",e.target.value)} error={errors.phone} />

                    <div style={{ marginBottom:20 }}>
                      <Label required>City</Label>
                      <div style={{ position:"relative" }}>
                        <select className="styled-sel" value={form.city} onChange={e=>setField("city",e.target.value)}
                          style={{ borderColor:errors.city?"#dc2626":undefined }}>
                          <option value="">Select your city</option>
                          {CITIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <span style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#bbb",pointerEvents:"none",fontSize:11 }}>▼</span>
                      </div>
                      <FieldError msg={errors.city} />
                    </div>

                                        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                      <div style={{ marginBottom:20 }}>
                        <Label required>Gender</Label>
                        <div style={{ position:"relative" }}>
                          <select className="styled-sel" value={form.gender} onChange={e=>setField("gender",e.target.value)}
                            style={{ borderColor:errors.gender?"#dc2626":undefined }}>
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Prefer not to say</option>
                          </select>
                          <span style={{ position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"#bbb",pointerEvents:"none",fontSize:11 }}>▼</span>
                        </div>
                        <FieldError msg={errors.gender} />
                      </div>
                      <Input label="Date of birth" required type="date"
                        value={form.dateOfBirth} onChange={e=>setField("dateOfBirth",e.target.value)}
                        error={errors.dateOfBirth}
                        max={new Date(Date.now() - 18*365.25*24*3600*1000).toISOString().split('T')[0]} />
                    </div>

                    <Input label="Address" placeholder="e.g. 12 Rue Hassan II, Casablanca"
                      value={form.address} onChange={e=>setField("address",e.target.value)} />

                    <Textarea label="About you" required
                      hint="Describe your background, work style, and what makes you a great professional."
                      placeholder="e.g. I'm a certified electrician with 5 years of experience in residential installations…"
                      value={form.bio} onChange={e=>setField("bio",e.target.value)} error={errors.bio} />
                    <div style={{ fontSize:12,color:form.bio.length>280?"#dc2626":"#ccc",marginTop:-12 }}>
                      {form.bio.length} / 300 characters
                    </div>
                  </>
                )}

                {/* ── STEP 2: Skills ── */}
                {step === 2 && (
                  <>
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:300,color:"#111",letterSpacing:"-.025em",marginBottom:5 }}>Your skills</h2>
                    <p style={{ fontSize:14,color:"#888",marginBottom:28 }}>Select all that apply — you can update these anytime.</p>

                    <Label required>Service categories</Label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:6 }}>
                      {categoriesLoading ? (
                        <p style={{ fontSize:13,color:"#aaa",fontStyle:"italic" }}>Loading categories…</p>
                      ) : dbCategories.map(cat => {
                        // Use _id if it's a real DB record, otherwise fall back to name as key
                        const id = (cat._id && cat._id !== null) ? String(cat._id) : cat.name;
                        const selected = form.skills.includes(id);
                        return (
                          <button key={id} className={`skill-chip${selected?" on":""}`} onClick={()=>toggleSkill(id)}>
                            {selected && <span style={{ marginRight:5 }}>✓</span>}{cat.name}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.skills} />

                    <div style={{ marginTop:28,marginBottom:20 }}>
                      <Label required>Experience level</Label>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
                        {[{v:"entry",l:"Entry",d:"Less than 1 year"},{v:"mid",l:"Mid",d:"1 – 3 years"},{v:"senior",l:"Senior",d:"3+ years"}].map(opt=>(
                          <button key={opt.v} className={`exp-card${form.experience===opt.v?" on":""}`}
                            onClick={()=>setField("experience",opt.v)}>
                            <div style={{ fontSize:15,fontWeight:700,color:form.experience===opt.v?"#1a6b47":"#333",marginBottom:4 }}>{opt.l}</div>
                            <div style={{ fontSize:12,color:"#aaa" }}>{opt.d}</div>
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.experience} />
                    </div>

                    <Input label="Hourly rate (MAD)" required icon={<IconMoney/>}
                      hint="Set a competitive rate. The platform average is 120 MAD/hr."
                      placeholder="e.g. 120" type="number" min="10"
                      value={form.rate} onChange={e=>setField("rate",e.target.value)} error={errors.rate} />
                  </>
                )}

                {/* ── STEP 3: Availability ── */}
                {step === 3 && (
                  <>
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:300,color:"#111",letterSpacing:"-.025em",marginBottom:5 }}>Your availability</h2>
                    <p style={{ fontSize:14,color:"#888",marginBottom:28 }}>Toggle the days you're available and set your working hours.</p>

                    <div style={{ border:"1.5px solid #ebebeb",borderRadius:12,overflow:"hidden",marginBottom:8 }}>
                      {DAYS.map((day, i) => {
                        const d = form.availability[day];
                        return (
                          <div key={day} className="day-row"
                            style={{ padding:"13px 18px",background: i%2===0?"#fff":"#fafaf8",display:"flex",alignItems:"center",gap:14,borderBottom:i<DAYS.length-1?"1px solid #f2f2f2":"none" }}>

                            {/* Toggle */}
                            <button className={`day-toggle ${d.enabled?"on":"off"}`} onClick={()=>toggleDay(day)} />

                            {/* Day name */}
                            <span style={{ fontSize:14,fontWeight:600,color:d.enabled?"#111":"#bbb",width:96,flexShrink:0,transition:"color .18s" }}>{day}</span>

                            {/* Time pickers */}
                            {d.enabled ? (
                              <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                                <select className="time-select" value={d.from} onChange={e=>setDayTime(day,"from",e.target.value)}>
                                  {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                                </select>
                                <span style={{ fontSize:12,color:"#aaa",fontWeight:500 }}>to</span>
                                <select className="time-select" value={d.to} onChange={e=>setDayTime(day,"to",e.target.value)}>
                                  {TIME_SLOTS.filter(t=>t>d.from).map(t=><option key={t}>{t}</option>)}
                                </select>
                              </div>
                            ) : (
                              <span style={{ fontSize:13,color:"#ccc",fontStyle:"italic" }}>Not available</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.availability} />

                    {/* Quick presets */}
                    <div style={{ marginTop:16,display:"flex",gap:10,flexWrap:"wrap" }}>
                      <span style={{ fontSize:12,color:"#aaa",alignSelf:"center",marginRight:4 }}>Quick set:</span>
                      {[
                        { label:"Weekdays", days:["Monday","Tuesday","Wednesday","Thursday","Friday"] },
                        { label:"Weekends", days:["Saturday","Sunday"] },
                        { label:"All week", days:DAYS },
                      ].map(preset => (
                        <button key={preset.label} className="btn-outline" style={{ padding:"7px 16px",fontSize:12,borderRadius:100 }}
                          onClick={()=>setForm(f=>({
                            ...f,
                            availability: Object.fromEntries(
                              DAYS.map(d=>[d,{ ...f.availability[d], enabled:preset.days.includes(d) }])
                            )
                          }))}>
                          {preset.label}
                        </button>
                      ))}
                      <button className="btn-outline" style={{ padding:"7px 16px",fontSize:12,borderRadius:100,borderColor:"#fca5a5",color:"#ef4444" }}
                        onClick={()=>setForm(f=>({
                          ...f,
                          availability: Object.fromEntries(DAYS.map(d=>[d,{ ...f.availability[d],enabled:false }]))
                        }))}>
                        Clear all
                      </button>
                    </div>
                  </>
                )}

                {/* ── STEP 4: Review ── */}
                {step === 4 && (
                  <>
                    <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:300,color:"#111",letterSpacing:"-.025em",marginBottom:5 }}>Review & submit</h2>
                    <p style={{ fontSize:14,color:"#888",marginBottom:28 }}>Double-check your details before we save your profile.</p>

                    {[
                      { section:"Account", stepIdx:0, items:[{l:"Email",v:form.email}] },
                      { section:"Profile", stepIdx:1, items:[
                          {l:"Name",    v:`${form.firstName} ${form.lastName}`},
                          {l:"Phone",   v:form.phone},
                          {l:"City",    v:form.city},
                          {l:"Gender",  v:form.gender},
                          {l:"DOB",     v:form.dateOfBirth},
                          {l:"Address", v:form.address},
                          {l:"Bio",     v:form.bio},
                        ]},
                      { section:"Skills", stepIdx:2, items:[
                          {l:"Services", v:form.skills.map(id => {
                              const cat = dbCategories.find(c => String(c._id) === id || c.name === id);
                              return cat ? cat.name : id;
                            }).join(", ")},
                          {l:"Experience", v:form.experience},
                          {l:"Rate",       v:form.rate?`${form.rate} MAD/hr`:""},
                        ]},
                      { section:"Availability", stepIdx:3, items:
                          Object.entries(form.availability)
                            .filter(([,v])=>v.enabled)
                            .map(([day,v])=>({l:day.slice(0,3),v:`${v.from} – ${v.to}`}))
                            .concat(
                              Object.values(form.availability).every(v=>!v.enabled)
                                ? [{l:"Days",v:"None selected"}] : []
                            )
                        },
                    ].map((g,gi)=>(
                      <div key={gi} style={{ marginBottom:18 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                          <span style={{ fontSize:10,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#1a6b47" }}>{g.section}</span>
                          <button onClick={()=>setStep(g.stepIdx)} style={{ fontSize:12,color:"#1a6b47",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontFamily:"inherit" }}>Edit</button>
                        </div>
                        <div style={{ background:"#fafaf8",borderRadius:10,border:"1px solid #f0f0f0",overflow:"hidden" }}>
                          {g.items.map((item,ii)=>(
                            <div key={ii} style={{ display:"flex",gap:14,padding:"11px 16px",borderBottom:ii<g.items.length-1?"1px solid #f0f0f0":"none" }}>
                              <span style={{ fontSize:13,color:"#bbb",width:86,flexShrink:0,fontWeight:500 }}>{item.l}</span>
                              <span style={{ fontSize:13,color:"#333",fontWeight:500,wordBreak:"break-all",lineHeight:1.5 }}>
                                {item.v || <em style={{color:"#ddd"}}>—</em>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Terms */}
                    <div style={{ marginTop:24,padding:"16px",background:"#f9fdf9",borderRadius:10,border:"1px solid #d4eadc" }}>
                      <label style={{ display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer" }}>
                        <div onClick={()=>setField("agree",!form.agree)} style={{
                          width:20,height:20,borderRadius:5,flexShrink:0,marginTop:1,
                          border:`2px solid ${form.agree?"#1a6b47":errors.agree?"#dc2626":"#ccc"}`,
                          background:form.agree?"#1a6b47":"#fff",
                          display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s",
                        }}>
                          {form.agree && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{ fontSize:13,color:"#555",lineHeight:1.7 }}>
                          I agree to Bricole's{" "}
                          <a href="#" style={{ color:"#1a6b47",fontWeight:600,textDecoration:"none" }}>Terms of Service</a>{" "}
                          and{" "}
                          <a href="#" style={{ color:"#1a6b47",fontWeight:600,textDecoration:"none" }}>Privacy Policy</a>,
                          and confirm that all information provided is accurate and truthful.
                        </span>
                      </label>
                      <FieldError msg={errors.agree} />
                    </div>

                    {/* API error */}
                    {apiError && (
                      <div style={{ marginTop:16,padding:"12px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,fontSize:13,color:"#dc2626",display:"flex",gap:8,alignItems:"flex-start" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {apiError}
                      </div>
                    )}
                  </>
                )}

                {/* Navigation */}
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:36,paddingTop:26,borderTop:"1px solid #f2f2f2" }}>
                  {step > 0
                    ? <button className="btn-outline" onClick={back}>← Back</button>
                    : <div />
                  }
                  {step < STEPS.length - 1 ? (
                    <button className="btn-primary" onClick={next}>Continue →</button>
                  ) : (
                    <button className="btn-primary" onClick={submit} disabled={submitting}>
                      {submitting ? <><div className="spinner"/> Saving…</> : "Submit Application →"}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop:20 }}>
                <div style={{ height:3,background:"#ebebeb",borderRadius:2,overflow:"hidden" }}>
                  <div style={{ height:"100%",background:"#1a6b47",borderRadius:2,width:`${((step+1)/STEPS.length)*100}%`,transition:"width .35s ease" }} />
                </div>
                <p style={{ textAlign:"center",fontSize:12,color:"#ccc",marginTop:10 }}>
                  Step {step+1} of {STEPS.length} — {Math.round(((step+1)/STEPS.length)*100)}% complete
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
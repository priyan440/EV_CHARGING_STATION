import { useState } from 'react';
import { FiMail, FiPhone, FiSave, FiUser, FiTruck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', vehicle: user?.vehicle || '' });
  const [saved, setSaved] = useState(false);
  const submit = e => { e.preventDefault(); updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  return <div className="page-wrap narrow-page"><div className="page-heading"><div><span className="eyebrow"><FiUser /> ACCOUNT</span><h1>Your profile</h1><p>Keep your contact and vehicle information up to date.</p></div></div><div className="profile-layout"><div className="profile-hero"><div className="w-16 h-16 rounded-2xl border border-primary/30 bg-slate-800 flex items-center justify-center text-primary text-2xl shrink-0"><FiUser /></div><div><h2>{user.name}</h2><p>{user.email}</p><span>{user.role}</span></div><div className="profile-id">{user.id}</div></div><form className="modern-form" onSubmit={submit}><div className="two-col"><label>Full name<div className="input-with-icon"><FiUser /><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div></label><label>Email<div className="input-with-icon"><FiMail /><input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div></label></div><div className="two-col"><label>Phone<div className="input-with-icon"><FiPhone /><input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div></label><label>Vehicle registration<div className="input-with-icon"><FiTruck /><input value={form.vehicle} onChange={e => setForm({...form,vehicle:e.target.value})} /></div></label></div><button className="primary-btn" type="submit"><FiSave /> {saved ? 'Saved' : 'Save changes'}</button></form></div></div>;
}

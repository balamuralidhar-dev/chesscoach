import React, { useEffect, useRef, useState } from 'react';
import ChessPiece from './ChessPiece.jsx';
import ProfileDialog from './ProfileDialog.jsx';
import { AuthContext } from './auth-context.js';
async function authRequest(endpoint, input) {
  const response = await fetch(`/api/auth/${endpoint}`, {method:input ? 'POST' : 'GET',credentials:'same-origin',headers:input ? {'Content-Type':'application/json'} : {},body:input ? JSON.stringify(input) : undefined});
  const result = await response.json().catch(() => { throw new Error('Sign-in service is unavailable. Please try again.'); });
  if(!response.ok) throw new Error(result.error || 'Please try again.');return result;
}
export default function AuthGate({ children }) {
  const pending = useRef(null);
  const [profileOpen,setProfileOpen]=useState(false);
  const [authOpen,setAuthOpen]=useState(false);
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[view,setView]=useState('login');
  const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[visible,setVisible]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const restore = async () => {setLoading(true);setError('');try{const result=await authRequest('me');setUser(result.user);if(result.user && pending.current){setAuthOpen(false);const action=pending.current;pending.current=null;action();}}catch{setUser(null);}finally{setLoading(false);}};
  useEffect(()=>{restore();},[]);
  const submit = async e => {e.preventDefault();setBusy(true);setError('');try{const result=await authRequest(view === 'register' ? 'register' : 'login',{name,email,password});setPassword('');setUser(result.user);setAuthOpen(false);const action=pending.current;pending.current=null;action?.();}catch(e){setError(e.message);}finally{setBusy(false);}};
  const logout = async () => {setBusy(true);setError('');try{await authRequest('logout',{});setUser(null);setPassword('');setView('login');setAuthOpen(false);setProfileOpen(false);pending.current=null;}catch{setError('Could not sign out. Please try again.');}finally{setBusy(false);}};
  const saveProfile = async name => {const result=await authRequest('profile',{name});setUser(result.user);};
  const requireAuth = action => {if(user){action();return;}pending.current=action;setError('');setView('login');setAuthOpen(true);};
  const cancel = () => {pending.current=null;setAuthOpen(false);setPassword('');setError('');};
  const openProfile = () => {if(user){setProfileOpen(true);setError('');}else requireAuth(()=>{});};
  const context = {user,loading,requireAuth,openProfile};
  const app = <AuthContext.Provider value={context}>{!authOpen && error && <div className="account-error" role="alert">{error}</div>}{children}</AuthContext.Provider>;
  const login = <main data-cc-theme="light" className="auth-page"><section className="auth-story"><a className="auth-brand" href="/">♞ <span>Chess Coach</span></a><div><span className="play-eyebrow">ONE MOVE AT A TIME</span><h1>A better game<br/>starts with you.</h1><p>Find your rhythm. Challenge Stockfish.<br/>Make every move a little more thoughtful.</p><div className="auth-board-art" aria-hidden="true">{Array.from({length:16},(_,i)=><div key={i}>{({5:'n',10:'k',14:'p'})[i] && <ChessPiece type={({5:'n',10:'k',14:'p'})[i]} white={i!==5}/>}</div>)}</div></div><small>Play at your own pace. There’s always another move.</small></section>
  <section className="auth-form-panel"><form onSubmit={submit} className="auth-form" aria-busy={busy}><button type="button" className="auth-back" disabled={busy} onClick={cancel}>← Back to browsing</button><span className="play-eyebrow">{view==='register' ? 'JOIN THE BOARD' : 'WELCOME BACK'}</span><h2>{view==='register' ? 'Create your account' : 'Sign in to play'}</h2><p>{view==='register' ? 'Create your account to continue to Play.' : 'Sign in to continue to Play. You can browse without an account.'}</p><div className="auth-tabs"><button type="button" disabled={busy} aria-pressed={view==='login'} onClick={()=>{setView('login');setError('');setPassword('');}}>Sign in</button><button type="button" disabled={busy} aria-pressed={view==='register'} onClick={()=>{setView('register');setError('');setPassword('');}}>Create account</button></div>
  {view==='register' && <label>Your name<input required maxLength={60} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="How should we call you?" /></label>}
  <label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<div className="auth-password"><input required type={visible ? 'text' : 'password'} minLength={8} maxLength={128} autoComplete={view==='register' ? 'new-password' : 'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder={view==='register' ? 'At least 8 characters' : 'Enter your password'} /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={()=>setVisible(v=>!v)}>{visible ? 'Hide' : 'Show'}</button></div></label>
  {error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy} type="submit">{busy ? 'Please wait…' : view==='register' ? 'Create account & play →' : 'Sign in →'}</button><p className="auth-switch">{view==='register' ? 'Already have an account?' : 'New to Chess Coach?'} <button disabled={busy} type="button" onClick={()=>{setView(view==='register' ? 'login' : 'register');setError('');setPassword('');}}>{view==='register' ? 'Sign in' : 'Create an account'}</button></p></form></section></main>;
  return <><div hidden={authOpen}>{app}</div>{authOpen && login}{profileOpen && user && <ProfileDialog user={user} onSave={saveProfile} onClose={()=>setProfileOpen(false)} onLogout={logout} signingOut={busy}/>}</>;
}

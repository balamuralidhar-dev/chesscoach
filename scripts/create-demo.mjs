const credentials={name:'Demo Player',email:'demo@chesscoach.local',password:'ChessDemo!2026'};
const request=(endpoint)=>fetch(`http://127.0.0.1:3001/api/auth/${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:5173'},body:JSON.stringify(credentials)});
let response=await request('register');
if(response.status===409)response=await request('login');
if(!response.ok)throw new Error((await response.json()).error || 'Could not create demo account');
console.log('Demo account ready: demo@chesscoach.local / ChessDemo!2026');

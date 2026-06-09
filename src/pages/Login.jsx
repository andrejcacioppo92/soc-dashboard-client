import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUtente, pulisciErrore } from '../store/authSlice';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // leggo dallo store globale Redux invece di usare stato locale
    // così loading ed errore sono gestiti centralmente dallo slice
    const { token, loading, errore } = useSelector((state) => state.auth);

    // se sono già loggato vado dritto alla dashboard
    // utile se l'utente torna sul login per sbaglio
    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        // dispatch del thunk, Redux gestisce loading e errore in automatico
        const result = await dispatch(loginUtente({ username, password }));
        if (loginUtente.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    // pulisco l'errore quando l'utente ricomincia a digitare
    const handleChange = (setter) => (e) => {
        if (errore) dispatch(pulisciErrore());
        setter(e.target.value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
             style={{ background: 'linear-gradient(160deg, #1a1c1e 0%, #141618 40%, #111314 100%)' }}>

            <div className="absolute inset-0 opacity-[0.015]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                     backgroundSize: '150px 150px'
                 }}
            ></div>

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#2a3a2a]/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-sm mx-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                         style={{
                             background: 'linear-gradient(135deg, #2a332a 0%, #1e2422 100%)',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)'
                         }}>
                        <svg className="w-7 h-7 text-[#7fad90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-semibold text-[#c8ccc9] tracking-[0.25em] uppercase">SOC Platform</h1>
                    <p className="text-[10px] text-[#555b57] tracking-[0.3em] mt-2 font-mono uppercase">Secure Operations Center</p>
                </div>

                <div className="rounded-2xl p-8"
                     style={{
                         background: 'linear-gradient(145deg, #1e2120 0%, #1a1d1b 100%)',
                         border: '1px solid rgba(255,255,255,0.04)',
                         boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.02) inset'
                     }}>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Operatore</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleChange(setUsername)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                                style={{
                                    background: '#141816',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(127,173,144,0.3)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                                required
                                placeholder="ID operatore"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Codice di Sicurezza</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handleChange(setPassword)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                                style={{
                                    background: '#141816',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(127,173,144,0.3)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {errore && (
                            <div className="text-[#c97a7a] text-xs px-4 py-3 rounded-xl"
                                 style={{ background: 'rgba(180,80,80,0.08)', border: '1px solid rgba(180,80,80,0.15)' }}>
                                {errore}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full font-semibold py-3.5 rounded-xl uppercase tracking-[0.15em] text-sm transition-all duration-500"
                            style={{
                                background: loading
                                    ? 'linear-gradient(135deg, #252825 0%, #1e201f 100%)'
                                    : 'linear-gradient(135deg, #3a4a3d 0%, #2a352c 50%, #1e2820 100%)',
                                color: loading ? '#555b57' : '#b8ccbb',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: loading ? 'none' : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Verifica in corso...' : 'Accedi'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-[#3a3e3b] mt-8 font-mono tracking-[0.2em]">
                    CRITTOGRAFIA END-TO-END · JWT · HS256
                </p>
            </div>
        </div>
    );
}
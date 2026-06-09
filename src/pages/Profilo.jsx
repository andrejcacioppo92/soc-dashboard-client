import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMioProfilo } from '../store/authSlice';

export default function Profilo() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, utente } = useSelector((state) => state.auth);

    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [immagineProfilo, setImmagineProfilo] = useState('');
    const [loading, setLoading] = useState(false);
    const [messaggio, setMessaggio] = useState('');
    const [errore, setErrore] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        // carico il profilo dallo store così popolo i campi del form
        dispatch(fetchMioProfilo());
    }, [token, dispatch, navigate]);

    // quando arriva il profilo dallo store popolo i campi del form
    useEffect(() => {
        if (utente) {
            setNome(utente.nome || '');
            setCognome(utente.cognome || '');
            setImmagineProfilo(utente.immagineProfilo || '');
        }
    }, [utente]);

    const handleSalva = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessaggio('');
        setErrore('');

        try {
            const response = await fetch('http://localhost:8080/api/users/me', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, cognome, immagineProfilo }),
            });

            if (!response.ok) {
                throw new Error('Impossibile aggiornare il profilo');
            }

            setMessaggio('Profilo aggiornato correttamente');
            // ricarico il profilo aggiornato dallo store così la UI riflette i cambiamenti
            dispatch(fetchMioProfilo());
        } catch (err) {
            setErrore(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        background: 'linear-gradient(145deg, #1e2120 0%, #1a1d1b 100%)',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
    };

    const inputStyle = {
        background: '#141816',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
    };

    const btnStyle = {
        background: 'linear-gradient(135deg, #3a4a3d 0%, #2a352c 50%, #1e2820 100%)',
        color: '#b8ccbb',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
        cursor: 'pointer'
    };

    return (
        <div className="min-h-screen relative overflow-hidden"
             style={{ background: 'linear-gradient(160deg, #1a1c1e 0%, #141618 40%, #111314 100%)' }}>

            <div className="absolute inset-0 opacity-[0.015]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                     backgroundSize: '150px 150px'
                 }}
            ></div>

            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#2a3a2a]/10 rounded-full blur-[150px]"></div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">

                <button onClick={() => navigate('/dashboard')}
                        className="text-[11px] text-[#555b57] hover:text-[#c8ccc9] transition-colors duration-300 font-mono mb-8 block">
                    ← Torna all'inventario
                </button>

                <div className="rounded-xl p-8" style={cardStyle}>
                    <h1 className="text-lg font-semibold text-[#c8ccc9] tracking-[0.2em] uppercase mb-2">Profilo Operatore</h1>
                    <p className="text-[10px] text-[#555b57] font-mono tracking-[0.15em] mb-8">
                        {utente?.email} · ruolo: {utente?.ruoli ? Array.from(utente.ruoli).join(', ') : '-'}
                    </p>

                    {/* anteprima immagine profilo, se l'URL è valido la mostro */}
                    {immagineProfilo && (
                        <div className="flex justify-center mb-6">
                            <img src={immagineProfilo}
                                 alt="Profilo"
                                 className="w-24 h-24 rounded-full object-cover"
                                 style={{ border: '2px solid rgba(127,173,144,0.3)' }}
                                 onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSalva} className="space-y-5">
                        <div>
                            <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Nome</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                                style={inputStyle}
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Cognome</label>
                            <input
                                type="text"
                                value={cognome}
                                onChange={(e) => setCognome(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                                style={inputStyle}
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">URL Immagine Profilo</label>
                            <input
                                type="text"
                                value={immagineProfilo}
                                onChange={(e) => setImmagineProfilo(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300 font-mono"
                                style={inputStyle}
                                maxLength={500}
                                placeholder="https://esempio.com/immagine.jpg"
                            />
                        </div>

                        {messaggio && (
                            <div className="text-[#7fad90] text-xs px-4 py-3 rounded-xl"
                                 style={{ background: 'rgba(127,173,144,0.08)', border: '1px solid rgba(127,173,144,0.15)' }}>
                                {messaggio}
                            </div>
                        )}

                        {errore && (
                            <div className="text-[#c97a7a] text-xs px-4 py-3 rounded-xl"
                                 style={{ background: 'rgba(180,80,80,0.08)', border: '1px solid rgba(180,80,80,0.15)' }}>
                                {errore}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="font-semibold py-3 px-8 rounded-xl uppercase tracking-[0.15em] text-sm transition-all duration-500"
                            style={loading ? { background: '#252825', color: '#555b57', cursor: 'not-allowed' } : btnStyle}
                        >
                            {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                    </form>
                </div>

                <div className="mt-6 rounded-xl p-6" style={cardStyle}>
                    <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-4">Informazioni Account</h2>
                    <div className="space-y-2 text-sm text-[#888e89] font-mono">
                        <p>Email: <span className="text-[#c8ccc9]">{utente?.email}</span></p>
                        <p>Data registrazione: <span className="text-[#c8ccc9]">
              {utente?.dataRegistrazione ? new Date(utente.dataRegistrazione).toLocaleDateString('it-IT') : '-'}
            </span></p>
                        <p>Ruoli: <span className="text-[#c8ccc9]">
              {utente?.ruoli ? Array.from(utente.ruoli).join(', ') : '-'}
            </span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
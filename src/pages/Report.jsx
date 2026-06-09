import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Report() {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const [stats, setStats] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // filtri locali, di default nessuno applicato
    const [filtroGravita, setFiltroGravita] = useState('');
    const [filtroStato, setFiltroStato] = useState('');

    // funzione che ricarica i ticket quando cambiano i filtri
    // uso useCallback così evito ricreazioni inutili a ogni render
    const caricaTicket = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filtroGravita) params.append('gravita', filtroGravita);
            if (filtroStato) params.append('stato', filtroStato);

            const url = `http://localhost:8080/api/tickets?${params.toString()}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setTickets(await response.json());
            }
        } catch (err) {
            console.error('Errore caricamento ticket', err);
        }
    }, [token, filtroGravita, filtroStato]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const caricaStats = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/tickets/stats', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    setStats(await response.json());
                }
            } catch (err) {
                console.error('Errore caricamento stats', err);
            } finally {
                setLoading(false);
            }
        };

        caricaStats();
        caricaTicket();
    }, [token, navigate, caricaTicket]);

    const inputStyle = {
        background: '#141816',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
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

                <h1 className="text-lg font-semibold text-[#c8ccc9] tracking-[0.2em] uppercase mb-8">Report & Statistiche</h1>

                {loading ? (
                    <LoadingSpinner messaggio="Caricamento statistiche..." />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <Card className="p-5">
                                <p className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-3">Ticket per Gravità</p>
                                <div className="space-y-2">
                                    {stats && Object.entries(stats.perGravita).length > 0 ? (
                                        Object.entries(stats.perGravita).map(([g, count]) => (
                                            <div key={g} className="flex justify-between items-center">
                                                <Badge tipo="gravita" valore={g} />
                                                <span className="font-mono text-xl text-[#c8ccc9]">{count}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#555b57] font-mono text-xs">Nessun dato disponibile</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-5">
                                <p className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-3">Ticket per Stato</p>
                                <div className="space-y-2">
                                    {stats && Object.entries(stats.perStato).length > 0 ? (
                                        Object.entries(stats.perStato).map(([s, count]) => (
                                            <div key={s} className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-[#888e89] tracking-wider">{s}</span>
                                                <span className="font-mono text-xl text-[#c8ccc9]">{count}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#555b57] font-mono text-xs">Nessun dato disponibile</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <Card className="p-6 mb-6">
                            <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-4">Filtra Ticket</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Gravità</label>
                                    <select
                                        value={filtroGravita}
                                        onChange={(e) => setFiltroGravita(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] focus:outline-none transition-all duration-300"
                                        style={inputStyle}
                                    >
                                        <option value="">Tutte</option>
                                        <option value="CRITICAL">CRITICAL</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="LOW">LOW</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Stato</label>
                                    <select
                                        value={filtroStato}
                                        onChange={(e) => setFiltroStato(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] focus:outline-none transition-all duration-300"
                                        style={inputStyle}
                                    >
                                        <option value="">Tutti</option>
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="RESOLVED">RESOLVED</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-4">
                            Risultati ({tickets.length})
                        </h2>
                        {tickets.length === 0 ? (
                            <p className="text-[#3a3e3b] font-mono text-sm">Nessun ticket corrisponde ai filtri.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {tickets.map((ticket) => (
                                    <Card key={ticket.id} className="p-4">
                                        <p className="text-sm text-[#c8ccc9] mb-2">{ticket.descrizione}</p>
                                        <div className="flex gap-3 items-center">
                                            <Badge tipo="gravita" valore={ticket.gravita} />
                                            <span className="text-[9px] text-[#555b57] font-mono tracking-wider">{ticket.stato}</span>
                                            <span className="text-[10px] text-[#555b57] font-mono ml-auto">Asset: {ticket.assetIp}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
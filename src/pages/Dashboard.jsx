import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../store/assetsSlice';
import { logout } from '../store/authSlice';
import { API_BASE_URL } from '../config';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // leggo asset, stato di caricamento e profilo utente dallo store Redux
  // dal profilo ricavo i ruoli per decidere cosa mostrare nella UI
  const { lista: assets, loading: loadingAssets } = useSelector((state) => state.assets);
  const { token, utente } = useSelector((state) => state.auth);

  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // helper per controllare se l'utente ha un certo ruolo
  // i ruoli arrivano dal back-end come Set di stringhe nel campo ruoli
  const haRuolo = (ruolo) => utente?.ruoli?.includes(ruolo);
  const isAdmin = haRuolo('ADMIN');
  const isAnalyst = haRuolo('ANALYST');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // dispatch del thunk, Redux gestisce loading, success ed error in automatico
    dispatch(fetchAssets());
  }, [token, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const requestAiMitigation = async (ticketId) => {
    setLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/mitigate/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Accesso Negato (${response.status})`);
        }
        if (response.status === 404) {
          throw new Error("Nessun ticket trovato. Crea prima un ticket di vulnerabilità.");
        }
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      setAiResponse({ error: error.message || "Connessione fallita." });
    } finally {
      setLoading(false);
    }
  };

  const countByType = (tipo) => assets.filter(a => a.tipo === tipo).length;

  const btnStyle = {
    background: 'linear-gradient(135deg, #3a4a3d 0%, #2a352c 50%, #1e2820 100%)',
    color: '#b8ccbb',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
    cursor: 'pointer'
  };

  const btnHover = {
    background: 'linear-gradient(135deg, #455a48 0%, #354538 50%, #253025 100%)',
    color: '#d4e8d7',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
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

        <nav className="relative z-50 sticky top-0"
             style={{
               background: 'rgba(20,22,24,0.85)',
               backdropFilter: 'blur(20px)',
               borderBottom: '1px solid rgba(255,255,255,0.03)'
             }}>
          <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#7fad90] animate-pulse"></div>
              <span className="text-[#c8ccc9] font-semibold tracking-[0.2em] text-sm uppercase">SOC // Asset Inventory</span>
              {/* mostro il badge del ruolo dell'utente, utile per capire chi è loggato */}
              {utente?.ruoli && (
                  <span className="text-[9px] font-mono text-[#555b57] tracking-wider ml-2">
                [{Array.from(utente.ruoli).join(', ')}]
              </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* solo l'admin può creare nuovi asset, il bottone non lo mostro agli altri */}
              {isAdmin && (
                  <button
                      onClick={() => navigate('/create-asset')}
                      className="text-[11px] font-semibold py-2 px-4 rounded-lg uppercase tracking-[0.1em] transition-all duration-500"
                      style={btnStyle}
                      onMouseEnter={(e) => Object.assign(e.target.style, btnHover)}
                      onMouseLeave={(e) => Object.assign(e.target.style, btnStyle)}
                  >
                    + Nuovo Asset
                  </button>
              )}
              <button onClick={() => navigate('/report')} className="text-[11px] text-[#555b57] hover:text-[#c8ccc9] transition-colors duration-300 font-mono">
                [ Report ]
              </button>
              <button onClick={() => navigate('/profilo')} className="text-[11px] text-[#555b57] hover:text-[#c8ccc9] transition-colors duration-300 font-mono">
                [ Profilo ]
              </button>
              <button onClick={handleLogout} className="text-[11px] text-[#555b57] hover:text-[#c8ccc9] transition-colors duration-300 font-mono">
                [ Disconnetti ]
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Asset Totali', value: assets.length, color: '#c8ccc9' },
              { label: 'Server', value: countByType('SERVER'), color: '#7fad90' },
              { label: 'Firewall', value: countByType('FIREWALL'), color: '#8ba5c4' }
            ].map((stat, i) => (
                <Card key={i} className="p-5">
                  <p className="text-[10px] text-[#555b57] uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-3xl font-bold font-mono mt-2" style={{ color: stat.color }}>{stat.value}</p>
                </Card>
            ))}
          </div>

          {loadingAssets ? (
              <LoadingSpinner messaggio="Caricamento inventario..." />
          ) : assets.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#555b57] font-mono text-sm mb-5">Nessun asset registrato.</p>
                {/* anche qui mostro il bottone solo all'admin per coerenza */}
                {isAdmin && (
                    <button
                        onClick={() => navigate('/create-asset')}
                        className="text-sm font-semibold py-2.5 px-6 rounded-xl transition-all duration-500"
                        style={btnStyle}
                    >
                      Registra il primo asset
                    </button>
                )}
              </div>
          ) : (
              <div className="flex flex-col gap-4">
                {assets.map((asset) => {
                  const accentColor = asset.tipo === 'SERVER' ? '#7fad90' : '#8ba5c4';
                  return (
                      <Card key={asset.id} accentColor={accentColor}>
                        <div className="p-5 flex items-center gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-lg text-[#c8ccc9]">{asset.indirizzoIp}</span>
                              <Badge tipo="tipoAsset" valore={asset.tipo} />
                            </div>
                            <p className="text-sm text-[#888e89]">{asset.sistemaOperativo}</p>
                            <p className="text-[11px] text-[#555b57] font-mono mt-0.5">
                              {asset.tipo === 'SERVER' && `${asset.hostname} · ${asset.ruolo} · ${asset.ambiente}`}
                              {asset.tipo === 'FIREWALL' && `${asset.marca} · ${asset.firmware} · ${asset.zona}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => navigate(`/asset/${asset.id}`)}
                                className="text-[11px] text-[#555b57] hover:text-[#c8ccc9] transition-colors duration-300 font-mono"
                            >
                              [ Dettaglio ]
                            </button>
                            {(isAdmin || isAnalyst) && (
                                <button
                                    onClick={() => requestAiMitigation(asset.id)}
                                    disabled={loading}
                                    className="text-[10px] font-semibold py-1.5 px-3 rounded-lg uppercase tracking-[0.1em] transition-all duration-500"
                                    style={loading ? { background: '#252825', color: '#555b57', cursor: 'not-allowed' } : btnStyle}
                                    onMouseEnter={(e) => { if (!loading) Object.assign(e.target.style, btnHover); }}
                                    onMouseLeave={(e) => { if (!loading) Object.assign(e.target.style, btnStyle); }}
                                >
                                  {loading ? 'ANALISI...' : 'AI MITIGATION'}
                                </button>
                            )}
                          </div>
                        </div>
                      </Card>
                  );
                })}
              </div>
          )}

          {aiResponse && (
              <div className="mt-8">
                <Card accentColor="#7fad90">
                  <div className="p-6">
                    <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7fad90] animate-pulse"></div>
                      Mitigazione AI Ricevuta
                    </h2>
                    {aiResponse.error ? (
                        <p className="font-mono text-sm text-[#c97a7a]">{aiResponse.error}</p>
                    ) : (
                        <div className="space-y-4">
                          <div className="flex gap-3 text-[10px] font-mono items-center">
                      <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', color: '#888e89' }}>
                        Asset: {aiResponse.assetIp}
                      </span>
                            <Badge tipo="gravita" valore={aiResponse.gravita} />
                            <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', color: '#888e89' }}>
                        {aiResponse.aiModel}
                      </span>
                          </div>
                          <div className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: '#9bb8a4' }}>
                            {aiResponse.mitigationPlan}
                          </div>
                        </div>
                    )}
                  </div>
                </Card>
              </div>
          )}
        </div>
      </div>
  );
}
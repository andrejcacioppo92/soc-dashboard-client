import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingAsset, setLoadingAsset] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const [descrizione, setDescrizione] = useState('');
  const [gravita, setGravita] = useState('CRITICAL');
  const [loadingTicket, setLoadingTicket] = useState(false);

  const token = sessionStorage.getItem('jwt_token');

  const cardStyle = {
    background: 'linear-gradient(145deg, #1e2120 0%, #1a1d1b 100%)',
    border: '1px solid rgba(255,255,255,0.04)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
  };

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

  const btnDanger = {
    background: 'linear-gradient(135deg, #4a2a2a 0%, #3c2020 50%, #2e1818 100%)',
    color: '#c97a7a',
    border: '1px solid rgba(180,80,80,0.15)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
    cursor: 'pointer'
  };

  const btnDangerHover = {
    background: 'linear-gradient(135deg, #5a3535 0%, #4a2828 50%, #3a2020 100%)',
    color: '#e0a0a0',
    border: '1px solid rgba(180,80,80,0.25)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
    cursor: 'pointer'
  };

  const inputStyle = {
    background: '#141816',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const fetchData = async () => {
      try {
        const [assetRes, ticketRes] = await Promise.all([
          fetch(`http://localhost:8080/api/assets/${id}`, { headers }),
          fetch(`http://localhost:8080/api/tickets/asset/${id}`, { headers })
        ]);

        if (assetRes.status === 401 || assetRes.status === 403) {
          sessionStorage.removeItem('jwt_token');
          navigate('/login');
          return;
        }

        if (assetRes.ok) {
          setAsset(await assetRes.json());
        }

        if (ticketRes.ok) {
          setTickets(await ticketRes.json());
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setLoadingAsset(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleCreaTicket = async (e) => {
    e.preventDefault();
    setLoadingTicket(true);
    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descrizione,
          gravita,
          stato: 'OPEN',
          assetId: parseInt(id)
        })
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const nuovoTicket = await response.json();
      setTickets([...tickets, nuovoTicket]);
      setDescrizione('');
      setGravita('CRITICAL');
    } catch (error) {
      console.error("Errore nella creazione del ticket:", error);
    } finally {
      setLoadingTicket(false);
    }
  };

  const requestAiMitigation = async (ticketId) => {
    setLoadingAi(true);
    setAiResponse(null);
    try {
      const response = await fetch(`http://localhost:8080/api/ai/mitigate/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      setAiResponse({ error: error.message });
    } finally {
      setLoadingAi(false);
    }
  };

  if (loadingAsset) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #1a1c1e 0%, #141618 40%, #111314 100%)' }}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#7fad90] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#555b57] font-mono text-sm">Caricamento asset...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #1a1c1e 0%, #141618 40%, #111314 100%)' }}>
        <p className="text-[#c97a7a] font-mono">Asset non trovato.</p>
      </div>
    );
  }

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

        <div className="rounded-xl overflow-hidden mb-8" style={cardStyle}>
          <div className="h-[2px]"
            style={{ background: asset.tipo === 'SERVER'
              ? 'linear-gradient(90deg, transparent, #7fad90, transparent)'
              : 'linear-gradient(90deg, transparent, #8ba5c4, transparent)'
            }}></div>
          <div className="p-6 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-[#c8ccc9] font-mono">{asset.indirizzoIp}</h1>
              <p className="text-sm text-[#888e89] mt-1">{asset.sistemaOperativo}</p>
              <p className="text-[11px] text-[#555b57] font-mono mt-1">
                {asset.tipo === 'SERVER' && `${asset.hostname} · ${asset.ruolo} · ${asset.ambiente}`}
                {asset.tipo === 'FIREWALL' && `${asset.marca} · ${asset.firmware} · ${asset.zona}`}
              </p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-[0.15em]"
              style={{
                background: asset.tipo === 'SERVER' ? 'rgba(127,173,144,0.08)' : 'rgba(139,165,196,0.08)',
                color: asset.tipo === 'SERVER' ? '#7fad90' : '#8ba5c4',
                border: `1px solid ${asset.tipo === 'SERVER' ? 'rgba(127,173,144,0.15)' : 'rgba(139,165,196,0.15)'}`
              }}>
              {asset.tipo}
            </span>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-8" style={cardStyle}>
          <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-5">Segnala Vulnerabilità</h2>
          <form onSubmit={handleCreaTicket} className="space-y-4">
            <div>
              <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Descrizione</label>
              <textarea
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(127,173,144,0.3)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                rows="3"
                required
                maxLength={500}
                placeholder="Es. Remote Code Execution su porta 443 del servizio Apache"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Gravità</label>
              <select
                value={gravita}
                onChange={(e) => setGravita(e.target.value)}
                className="px-4 py-3 rounded-xl text-sm text-[#c8ccc9] focus:outline-none transition-all duration-300"
                style={inputStyle}
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loadingTicket}
              className="font-semibold py-2.5 px-6 rounded-xl uppercase tracking-[0.1em] text-sm transition-all duration-500"
              style={loadingTicket ? { background: '#252825', color: '#555b57', cursor: 'not-allowed' } : btnDanger}
              onMouseEnter={(e) => { if (!loadingTicket) Object.assign(e.target.style, btnDangerHover); }}
              onMouseLeave={(e) => { if (!loadingTicket) Object.assign(e.target.style, btnDanger); }}
            >
              {loadingTicket ? 'Invio...' : 'Apri Ticket'}
            </button>
          </form>
        </div>

        <div className="mb-8">
          <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-4">
            Ticket Vulnerabilità ({tickets.length})
          </h2>
          {tickets.length === 0 ? (
            <p className="text-[#3a3e3b] font-mono text-sm">Nessun ticket registrato per questo asset.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl p-4 flex justify-between items-center" style={cardStyle}>
                  <div>
                    <p className="text-sm text-[#c8ccc9]">{ticket.descrizione}</p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-[0.1em]"
                        style={{
                          background: ticket.gravita === 'CRITICAL' ? 'rgba(180,80,80,0.1)' :
                            ticket.gravita === 'HIGH' ? 'rgba(200,140,60,0.1)' :
                            ticket.gravita === 'MEDIUM' ? 'rgba(200,180,60,0.1)' :
                            'rgba(255,255,255,0.05)',
                          color: ticket.gravita === 'CRITICAL' ? '#c97a7a' :
                            ticket.gravita === 'HIGH' ? '#c8a060' :
                            ticket.gravita === 'MEDIUM' ? '#c8b860' :
                            '#888e89',
                          border: `1px solid ${ticket.gravita === 'CRITICAL' ? 'rgba(180,80,80,0.2)' :
                            ticket.gravita === 'HIGH' ? 'rgba(200,140,60,0.2)' :
                            ticket.gravita === 'MEDIUM' ? 'rgba(200,180,60,0.2)' :
                            'rgba(255,255,255,0.08)'}`
                        }}>
                        {ticket.gravita}
                      </span>
                      <span className="text-[9px] text-[#555b57] font-mono tracking-wider">{ticket.stato}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => requestAiMitigation(ticket.id)}
                    disabled={loadingAi}
                    className="text-[10px] font-semibold py-1.5 px-3 rounded-lg uppercase tracking-[0.1em] transition-all duration-500"
                    style={loadingAi ? { background: '#252825', color: '#555b57', cursor: 'not-allowed' } : btnStyle}
                    onMouseEnter={(e) => { if (!loadingAi) Object.assign(e.target.style, btnHover); }}
                    onMouseLeave={(e) => { if (!loadingAi) Object.assign(e.target.style, btnStyle); }}
                  >
                    {loadingAi ? 'ANALISI...' : 'AI MITIGATION'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {aiResponse && (
          <div className="rounded-xl overflow-hidden" style={cardStyle}>
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #7fad90, #8ba5c4, #7fad90)' }}></div>
            <div className="p-6">
              <h2 className="text-[10px] text-[#555b57] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7fad90] animate-pulse"></div>
                Mitigazione AI Ricevuta
              </h2>
              {aiResponse.error ? (
                <p className="font-mono text-sm text-[#c97a7a]">{aiResponse.error}</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3 text-[10px] font-mono">
                    <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', color: '#888e89' }}>
                      Asset: {aiResponse.assetIp}
                    </span>
                    <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(180,80,80,0.08)', color: '#c97a7a' }}>
                      {aiResponse.gravita}
                    </span>
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
          </div>
        )}
      </div>
    </div>
  );
}
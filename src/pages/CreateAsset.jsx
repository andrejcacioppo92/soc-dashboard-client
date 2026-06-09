import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { creaAsset, pulisciErroreAssets } from '../store/assetsSlice';

export default function CreateAsset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // errore lo leggo dallo store così se il back-end risponde 409 lo vedo qui
  const { errore } = useSelector((state) => state.assets);

  const [tipo, setTipo] = useState('SERVER');
  const [loading, setLoading] = useState(false);

  const [indirizzoIp, setIndirizzoIp] = useState('');
  const [sistemaOperativo, setSistemaOperativo] = useState('');

  const [hostname, setHostname] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [ambiente, setAmbiente] = useState('');

  const [marca, setMarca] = useState('');
  const [firmware, setFirmware] = useState('');
  const [zona, setZona] = useState('');

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

  const btnHover = {
    background: 'linear-gradient(135deg, #455a48 0%, #354538 50%, #253025 100%)',
    color: '#d4e8d7',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
    cursor: 'pointer'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(pulisciErroreAssets());

    const dati = tipo === 'SERVER'
        ? { indirizzoIp, sistemaOperativo, hostname, ruolo, ambiente }
        : { indirizzoIp, sistemaOperativo, marca, firmware, zona };

    const result = await dispatch(creaAsset({ tipo, dati }));
    setLoading(false);

    // se la creazione è andata a buon fine torno alla dashboard
    // l'asset è già stato aggiunto allo store dal reducer fulfilled
    if (creaAsset.fulfilled.match(result)) {
      navigate('/dashboard');
    }
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
            <h1 className="text-lg font-semibold text-[#c8ccc9] tracking-[0.2em] uppercase mb-8">Registra Nuovo Asset</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Tipo Asset</label>
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="px-4 py-3 rounded-xl text-sm text-[#c8ccc9] focus:outline-none transition-all duration-300"
                    style={inputStyle}
                >
                  <option value="SERVER">Server</option>
                  <option value="FIREWALL">Firewall</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Indirizzo IP</label>
                <input
                    type="text"
                    value={indirizzoIp}
                    onChange={(e) => setIndirizzoIp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300 font-mono"
                    style={inputStyle}
                    required
                    placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Sistema Operativo</label>
                <input
                    type="text"
                    value={sistemaOperativo}
                    onChange={(e) => setSistemaOperativo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                    style={inputStyle}
                    required
                    placeholder="Linux Ubuntu 22.04"
                />
              </div>

              {tipo === 'SERVER' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Hostname</label>
                      <input
                          type="text"
                          value={hostname}
                          onChange={(e) => setHostname(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300 font-mono"
                          style={inputStyle}
                          required
                          placeholder="srv-web-prod-01"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Ruolo</label>
                      <input
                          type="text"
                          value={ruolo}
                          onChange={(e) => setRuolo(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                          style={inputStyle}
                          required
                          placeholder="Web Server"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Ambiente</label>
                      <input
                          type="text"
                          value={ambiente}
                          onChange={(e) => setAmbiente(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                          style={inputStyle}
                          required
                          placeholder="Produzione"
                      />
                    </div>
                  </>
              )}

              {tipo === 'FIREWALL' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Marca</label>
                      <input
                          type="text"
                          value={marca}
                          onChange={(e) => setMarca(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                          style={inputStyle}
                          required
                          placeholder="Cisco"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Firmware</label>
                      <input
                          type="text"
                          value={firmware}
                          onChange={(e) => setFirmware(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300 font-mono"
                          style={inputStyle}
                          required
                          placeholder="9.18.2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#6b7268] uppercase tracking-[0.2em] mb-2">Zona</label>
                      <input
                          type="text"
                          value={zona}
                          onChange={(e) => setZona(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm text-[#c8ccc9] placeholder-[#3a3e3b] focus:outline-none transition-all duration-300"
                          style={inputStyle}
                          required
                          placeholder="DMZ"
                      />
                    </div>
                  </>
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
                  onMouseEnter={(e) => { if (!loading) Object.assign(e.target.style, btnHover); }}
                  onMouseLeave={(e) => { if (!loading) Object.assign(e.target.style, btnStyle); }}
              >
                {loading ? 'Salvataggio...' : 'Registra Asset'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}
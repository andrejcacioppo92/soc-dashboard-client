// componente per mostrare badge colorati basati sul tipo o gravità
// lo uso per gravità ticket, tipo asset, stato ticket
export default function Badge({ tipo, valore }) {
    // mappa di colori per ogni categoria di badge
    // così se cambio i colori in un posto si aggiornano ovunque
    const stili = {
        gravita: {
            CRITICAL: { bg: 'rgba(180,80,80,0.1)', text: '#c97a7a', border: 'rgba(180,80,80,0.2)' },
            HIGH: { bg: 'rgba(200,140,60,0.1)', text: '#c8a060', border: 'rgba(200,140,60,0.2)' },
            MEDIUM: { bg: 'rgba(200,180,60,0.1)', text: '#c8b860', border: 'rgba(200,180,60,0.2)' },
            LOW: { bg: 'rgba(255,255,255,0.05)', text: '#888e89', border: 'rgba(255,255,255,0.08)' },
        },
        tipoAsset: {
            SERVER: { bg: 'rgba(127,173,144,0.08)', text: '#7fad90', border: 'rgba(127,173,144,0.15)' },
            FIREWALL: { bg: 'rgba(139,165,196,0.08)', text: '#8ba5c4', border: 'rgba(139,165,196,0.15)' },
        },
    };

    // se non trovo lo stile uso un default neutro così evito errori
    const stile = stili[tipo]?.[valore] || {
        bg: 'rgba(255,255,255,0.05)',
        text: '#888e89',
        border: 'rgba(255,255,255,0.08)',
    };

    return (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-[0.15em]"
              style={{
                  background: stile.bg,
                  color: stile.text,
                  border: `1px solid ${stile.border}`,
              }}>
      {valore}
    </span>
    );
}
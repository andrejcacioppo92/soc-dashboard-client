// container con stile uniforme usato in tutte le pagine
// raccolgo qui il gradiente e i border così se devo cambiarli lo faccio in un solo posto
export default function Card({ children, className = '', accentColor = null }) {
    const cardStyle = {
        background: 'linear-gradient(145deg, #1e2120 0%, #1a1d1b 100%)',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)',
    };

    return (
        <div className={`rounded-xl overflow-hidden ${className}`} style={cardStyle}>
            {/* se passo un colore accent disegno una linea sottile in alto */}
            {/* utile per distinguere card di tipo diverso, es. asset Server vs Firewall */}
            {accentColor && (
                <div className="h-[2px]"
                     style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                ></div>
            )}
            {children}
        </div>
    );
}
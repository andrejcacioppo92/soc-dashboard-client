// spinner di caricamento riutilizzabile
// messaggio opzionale per indicare cosa si sta caricando
export default function LoadingSpinner({ messaggio = 'Caricamento...' }) {
    return (
        <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#7fad90] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#555b57] font-mono text-sm">{messaggio}</p>
        </div>
    );
}
# Note di Sicurezza — Front-End

Questo documento traccia la postura di sicurezza del client React della dashboard SOC, in particolare la gestione delle vulnerabilità delle dipendenze npm.

## Gestione delle dipendenze (npm audit)

Il progetto è sottoposto a controllo periodico delle dipendenze tramite `npm audit`.

### Interventi applicati

Una scansione ha inizialmente rilevato 11 vulnerabilità (6 high, 4 moderate, 1 low). Tramite `npm audit fix` (solo aggiornamenti compatibili, senza breaking change) ne sono state risolte 8, tra cui la più rilevante: **react-router**, affetta da diverse falle sfruttabili a runtime (XSS, open redirect, CSRF). Essendo react-router una libreria che gira effettivamente nel browser e gestisce la navigazione, la sua remediation era prioritaria ed è stata completata.

Dopo gli aggiornamenti l'applicazione è stata verificata manualmente (login, navigazione, caricamento dati, feature AI) per confermare l'assenza di regressioni.

### Rischio residuo accettato

Restano 3 vulnerabilità (high) nella catena `esbuild` → `vite` → `@vitejs/plugin-react`. Sono state consapevolmente **non risolte** per le seguenti ragioni:

- **Sono dipendenze di solo sviluppo.** esbuild e vite sono strumenti di build: girano sulla macchina dello sviluppatore durante `npm run dev` o la fase di build, e non vengono inclusi nel bundle distribuito agli utenti finali. Non rappresentano quindi una superficie d'attacco in produzione.
- **Le falle specifiche sono limitate all'ambiente di sviluppo.** Ad esempio, la vulnerabilità di arbitrary file read di esbuild si attiva solo mentre il dev server è in esecuzione localmente.
- **Il fix richiede un salto di major version** (Vite 8), che introduce breaking change nella configurazione di build. A ridosso della consegna, il rischio di regressione non è giustificato dal beneficio di sicurezza, essendo le falle non esposte in produzione.

Questa decisione segue lo stesso principio applicato sul back-end (rifiuto consapevole di aggiornamenti major rischiosi senza beneficio di sicurezza reale): la sicurezza delle dipendenze si gestisce valutando caso per caso necessità, rischio ed esposizione effettiva, non accettando ciecamente ogni aggiornamento.

### Revisione futura

Le 3 vulnerabilità residue verranno chiuse in una iterazione dedicata, pianificando la migrazione a Vite 8 con relativo adeguamento della configurazione di build e testing completo, fuori dalla finestra della consegna.
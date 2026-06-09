# SOC Asset & Vulnerability Manager — Front-End

Interfaccia web della dashboard SOC per la gestione di asset IT, ticketing di vulnerabilità e mitigazioni AI.

Progetto capstone full-stack per il corso di Cybersecurity presso EPICODE Institute of Technology.

## Panoramica

Single Page Application che consuma le API REST del back-end Spring Boot e offre agli operatori SOC un'interfaccia operativa per consultare l'inventario asset, segnalare vulnerabilità, richiedere piani di mitigazione AI e monitorare le statistiche del centro operativo. L'interfaccia è progettata per essere usata da operatori con ruoli diversi e mostra contenuti differenziati in base al ruolo dell'utente loggato.

## Stack Tecnologico

- **React 18** + **Vite** come build tool
- **Redux Toolkit** + **Redux Thunk** per la gestione dello stato globale
- **React Router 6** per la navigazione client-side
- **Tailwind CSS** per lo styling utility-first
- **Fetch API** nativa per le chiamate HTTP

## Architettura

Struttura modulare con separazione netta delle responsabilità:

- `src/pages/` contiene le 6 pagine principali (Login, Dashboard, AssetDetail, CreateAsset, Profilo, Report)
- `src/components/` contiene i componenti riutilizzabili (Card, Badge, LoadingSpinner)
- `src/store/` contiene gli slice Redux e la configurazione dello store

Le chiamate API sono gestite da Thunk Redux per le risorse condivise (autenticazione, asset) e direttamente nei componenti per dati locali alla pagina (statistiche, ticket filtrati).

## Sicurezza

- Token JWT salvato in `sessionStorage` (isolato alla scheda, non persistente come `localStorage`)
- Header `Authorization: Bearer <token>` su ogni chiamata autenticata
- Route private protette da un componente `ProtectedRoute` che redirige al login in assenza di token
- Logout sicuro che rimuove il token dalla sessione e svuota lo store
- Nessuna credenziale o chiave API hardcodata nel codice front-end

## Pagine

1. **Login** — autenticazione con username e password, dispatch di un thunk Redux
2. **Dashboard** — inventario asset con contatori, vista differenziata per ruolo, accesso rapido all'AI mitigation
3. **AssetDetail** — dettaglio del singolo asset con elenco ticket e form per segnalare nuove vulnerabilità
4. **CreateAsset** — form di registrazione di nuovi server o firewall (solo ADMIN)
5. **Profilo** — gestione del proprio profilo utente con possibilità di aggiornare nome, cognome e immagine profilo
6. **Report & Statistiche** — aggregazioni dei ticket per gravità e stato, filtri dinamici, lista filtrata

## Componenti Riutilizzabili

- **Card** — container con stile uniforme e accent color opzionale
- **Badge** — etichetta colorata per gravità ticket e tipo asset, con mappa colori centralizzata
- **LoadingSpinner** — indicatore di caricamento con messaggio personalizzabile

## Viste Differenziate per Ruolo

L'interfaccia adatta i contenuti visibili in base al ruolo dell'utente recuperato dal back-end:

| Funzionalità           | ADMIN | ANALYST | VIEWER |
|------------------------|-------|---------|--------|
| Visualizza inventario  | ✓     | ✓       | ✓      |
| Crea nuovo asset       | ✓     | ✗       | ✗      |
| Elimina asset          | ✓     | ✗       | ✗      |
| Crea ticket            | ✓     | ✓       | ✗      |
| Richiedi AI mitigation | ✓     | ✓       | ✗      |
| Visualizza report      | ✓     | ✓       | ✓      |
| Aggiorna proprio profilo | ✓   | ✓       | ✓      |

## Prerequisiti

- Node.js 18+
- npm 9+
- Back-end Spring Boot in esecuzione su `http://localhost:8080`

## Configurazione

1. Clona il repository
2. Installa le dipendenze:
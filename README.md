# SOC Dashboard - Front-End

Interfaccia web per il Security Operations Center. Permette la gestione dell'inventario asset, la creazione di ticket di vulnerabilità e la richiesta di piani di mitigazione tramite AI.

## Stack Tecnologico

- React 18
- Vite
- Tailwind CSS 3.4
- React Router DOM

## Prerequisiti

- Node.js 18+
- Back-End avviato su `http://localhost:8080`

## Installazione
```bash
npm install
```

## Avvio
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## Pagine

| Percorso | Componente | Descrizione |
|----------|------------|-------------|
| /login | Login | Autenticazione operatore |
| /dashboard | Dashboard | Inventario asset con statistiche |
| /asset/:id | AssetDetail | Dettaglio asset, ticket e AI |
| /create-asset | CreateAsset | Form creazione nuovo asset |

## Sicurezza Front-End

- Token JWT salvato in sessionStorage (isolato alla scheda)
- ProtectedRoute su tutte le pagine autenticate
- Redirect automatico al login se il token è scaduto o mancante
- Nessuna credenziale hardcodata nel codice
- Messaggi di errore generici senza dettagli tecnici

## Design

Estetica scandinava con texture naturali (pietra quarzitica e legno di rovere) su sfondo scuro. Palette colori: verde muschio per i server, blu ghiaccio per i firewall, marrone caldo per gli elementi interattivi.
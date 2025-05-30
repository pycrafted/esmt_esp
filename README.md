# Outil de Dimensionnement des Réseaux de Télécommunications

Ce projet est une application web full-stack permettant aux ingénieurs télécoms de planifier efficacement les déploiements de réseaux (GSM, UMTS, liaisons hertziennes, optiques) en tenant compte de la capacité, couverture, QoS et coûts.

## Technologies
- **Frontend** : React.js + Vite + Tailwind CSS
- **Backend** : (à venir) Node.js + Express.js
- **Base de données** : (à venir) SQLite
- **Graphiques** : (à venir) Chart.js ou Recharts

## Installation (Frontend)

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173) (ou un autre port si déjà utilisé).

## Structure recommandée

```
src/
├── components/
│   ├── common/         # Header, Sidebar, Layout
│   ├── gsm/            # Module GSM
│   ├── hertzien/       # Module Hertzien
│   ├── optique/        # Module Optique
│   ├── umts/           # Module UMTS
│   └── dashboard/      # Dashboard
├── utils/              # Fonctions utilitaires (calculs, validation, export PDF)
├── hooks/              # Custom React hooks
├── context/            # Context API
├── styles/             # Styles globaux
```

## Développement étape par étape
Le développement suit un plan en 5 étapes (voir `prompt_dimensionnement_telecom.md`).
- **Étape 1** : Interface de base, navigation, design responsive
- **Étape 2** : Module GSM (formulaire, calculs, résultats)
- **Étape 3** : Module Hertzien
- **Étape 4** : Modules Optique & UMTS
- **Étape 5** : Dashboard, sauvegarde, export, optimisations

**Testez chaque étape avant de passer à la suivante !**

## Auteur
Projet académique ESMT — 2024

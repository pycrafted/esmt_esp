# Prompt Complet : Outil de Dimensionnement des Réseaux de Télécommunications

## Contexte du Projet
Je dois développer un outil logiciel de dimensionnement pour réseaux de télécommunications dans le cadre d'un projet académique. L'objectif est de créer une application permettant aux ingénieurs télécoms de planifier efficacement les déploiements de réseaux en tenant compte de paramètres comme la capacité, couverture, qualité de service et coûts.

**IMPORTANT : NE PAS TOUT IMPLÉMENTER D'UN COUP !** 
Nous allons procéder étape par étape, tester chaque fonctionnalité avant de passer à la suivante.

## Technologies Recommandées
- **Frontend** : React.js avec Tailwind CSS pour l'interface
- **Backend** : Node.js avec Express.js
- **Base de données** : SQLite (simple et portable)
- **Graphiques** : Chart.js ou Recharts
- **Architecture** : Application web full-stack

## ÉTAPE 1 : FONDATIONS ET INTERFACE DE BASE (Jours 1-3)

### Objectif Étape 1
Créer la structure de base de l'application avec une interface utilisateur simple et fonctionnelle.

### Tâches Étape 1
1. **Initialiser le projet**
   - Créer un projet React avec Vite
   - Configurer Tailwind CSS
   - Créer la structure de dossiers

2. **Interface utilisateur de base**
   - Header avec titre "Outil de Dimensionnement Télécoms"
   - Sidebar avec navigation (Dashboard, GSM, UMTS, Bilan Hertzien, Bilan Optique)
   - Zone principale pour afficher le contenu
   - Design moderne et responsive

3. **Navigation fonctionnelle**
   - Routing entre les différentes sections
   - Composants de base pour chaque type de réseau
   - État de navigation actif

### Critères de Validation Étape 1
- [ ] L'application se lance sans erreur
- [ ] Navigation fluide entre les sections
- [ ] Interface propre et responsive
- [ ] Tous les onglets sont accessibles

**ARRÊT ÉTAPE 1** - Tester avant de continuer

---

## ÉTAPE 2 : MODULE GSM DE BASE (Jours 4-6)

### Objectif Étape 2
Implémenter le premier module de dimensionnement (GSM) avec calculs de base.

### Tâches Étape 2
1. **Formulaire de saisie GSM**
   - Zone de couverture (km²)
   - Densité de population (hab/km²)
   - Trafic par abonné (mErlang)
   - Facteurs de pénétration et d'activité
   - Validation des entrées

2. **Algorithmes de dimensionnement GSM**
   - Calcul du nombre d'abonnés
   - Calcul du trafic total
   - Dimensionnement des TRX (Transceivers)
   - Calcul du nombre de sites BTS
   - Formules d'Erlang B pour le trafic

3. **Affichage des résultats**
   - Tableau récapitulatif des résultats
   - Graphique simple (nombre de sites par zone)
   - Possibilité d'exporter en PDF

### Formules à Implémenter (GSM)
```
Nombre d'abonnés = Zone × Densité × Taux_pénétration
Trafic total = Nb_abonnés × Trafic_par_abonné × Facteur_activité
Nombre de TRX = ceil(Trafic_total / Capacité_TRX)
Nombre de sites = ceil(Zone / Couverture_par_site)
```

### Critères de Validation Étape 2
- [ ] Formulaire GSM fonctionnel avec validation
- [ ] Calculs corrects et cohérents
- [ ] Affichage des résultats en temps réel
- [ ] Export PDF basique fonctionne

**ARRÊT ÉTAPE 2** - Tester les calculs GSM avant de continuer

---

## ÉTAPE 3 : MODULE BILAN DE LIAISON HERTZIEN (Jours 7-9)

### Objectif Étape 3
Ajouter le module de calcul pour les bilans de liaison hertziens.

### Tâches Étape 3
1. **Formulaire bilan hertzien**
   - Fréquence (GHz)
   - Distance (km)
   - Puissance émission (dBm)
   - Gains antennes (dBi)
   - Pertes diverses (dB)
   - Seuil de réception (dBm)

2. **Algorithmes bilan hertzien**
   - Calcul de l'affaiblissement en espace libre
   - Marge de liaison
   - Disponibilité du lien
   - Analyse de la zone de Fresnel

3. **Visualisation avancée**
   - Graphique du profil de liaison
   - Indicateurs visuels (vert/orange/rouge) pour la marge
   - Recommandations automatiques

### Formules à Implémenter (Hertzien)
```
Affaiblissement_espace_libre = 32.4 + 20×log10(f) + 20×log10(d)
Bilan = Pe + Ge + Gr - Affaiblissement - Pertes
Marge = Bilan - Seuil_réception
```

### Critères de Validation Étape 3
- [ ] Calculs de bilan hertzien corrects
- [ ] Visualisation claire des résultats
- [ ] Recommandations pertinentes
- [ ] Interface cohérente avec le module GSM

**ARRÊT ÉTAPE 3** - Valider les calculs hertziens

---

## ÉTAPE 4 : MODULE BILAN OPTIQUE ET UMTS (Jours 10-12)

### Objectif Étape 4
Compléter les modules restants pour avoir un outil complet.

### Tâches Étape 4A : Bilan Optique
1. **Formulaire bilan optique**
   - Longueur de la liaison (km)
   - Atténuation fibre (dB/km)
   - Nombre d'épissures
   - Connecteurs et pertes
   - Puissance émetteur (dBm)

2. **Calculs optiques**
   - Bilan de puissance
   - Budget optique
   - Marge de liaison
   - Recommandations sur le type de fibre

### Tâches Étape 4B : Module UMTS
1. **Paramètres UMTS**
   - Zone de couverture
   - Nombre d'utilisateurs
   - Services (voix, data, vidéo)
   - Débits requis
   - Facteurs de charge

2. **Dimensionnement UMTS**
   - Calcul de la capacité par cellule
   - Nombre de NodeB nécessaires
   - Dimensionnement du cœur de réseau

### Critères de Validation Étape 4
- [ ] Module optique fonctionnel
- [ ] Module UMTS opérationnel
- [ ] Cohérence entre tous les modules
- [ ] Navigation fluide entre tous les outils

**ARRÊT ÉTAPE 4** - Test complet de tous les modules

---

## ÉTAPE 5 : FONCTIONNALITÉS AVANCÉES ET FINITION (Jours 13-15)

### Objectif Étape 5
Ajouter les fonctionnalités avancées et peaufiner l'application.

### Tâches Étape 5
1. **Dashboard récapitulatif**
   - Vue d'ensemble de tous les projets
   - Statistiques globales
   - Graphiques comparatifs

2. **Système de sauvegarde**
   - Sauvegarde des configurations
   - Historique des calculs
   - Import/Export de projets

3. **Génération de rapports**
   - Rapport PDF complet par module
   - Comparaison de scénarios
   - Graphiques professionnels

4. **Optimisations finales**
   - Validation robuste des données
   - Messages d'erreur clairs
   - Performance et responsive design
   - Documentation utilisateur intégrée

### Critères de Validation Étape 5
- [ ] Dashboard fonctionnel et informatif
- [ ] Système de sauvegarde opérationnel
- [ ] Génération de rapports professionnels
- [ ] Application stable et optimisée

---

## STRUCTURE DE FICHIERS RECOMMANDÉE

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── gsm/
│   │   ├── GSMForm.jsx
│   │   ├── GSMResults.jsx
│   │   └── GSMCalculations.js
│   ├── hertzien/
│   ├── optique/
│   ├── umts/
│   └── dashboard/
├── utils/
│   ├── calculations.js
│   ├── validation.js
│   └── exportPDF.js
├── hooks/
├── context/
└── styles/
```

## FONCTIONNALITÉS PRIORITAIRES PAR MODULE

### Module GSM (Essentiel)
- Dimensionnement de base
- Calcul du trafic Erlang
- Nombre de sites BTS
- Interface simple et claire

### Module Bilan Hertzien (Important)
- Calculs d'affaiblissement
- Marge de liaison
- Recommandations automatiques

### Module Optique (Important)
- Budget optique
- Calculs de pertes
- Validation des liaisons

### Module UMTS (Bonus)
- Dimensionnement cellulaire
- Capacité et couverture

## CONSEILS POUR LE DÉVELOPPEMENT

1. **Tester à chaque étape** - Ne pas passer à l'étape suivante sans validation
2. **Commencer simple** - Implémenter les fonctionnalités de base avant les avancées
3. **Documentation** - Commenter le code, surtout les formules
4. **Sauvegarde** - Utiliser Git pour versioning
5. **Design responsive** - Tester sur mobile/tablette
6. **Validation robuste** - Empêcher les erreurs utilisateur

## CRITÈRES D'ÉVALUATION ANTICIPÉS

- **Interface utilisateur (4/20)** : Intuitive, moderne, responsive
- **Algorithmes de dimensionnement (8/20)** : Précis, complets, bien documentés
- **Fonctionnalités (6/20)** : Complètes, robustes, bien intégrées
- **Documentation/Tests (2/20)** : Code propre, commenté, testé

## AIDE POUR CURSOR

Cursor, voici les points clés :
1. **Implémente UNE SEULE ÉTAPE à la fois**
2. **Teste chaque fonctionnalité avant de continuer**
3. **Utilise des composants réutilisables**
4. **Commente les formules mathématiques**
5. **Gère les erreurs utilisateur**
6. **Garde un design cohérent**

Commence par l'ÉTAPE 1 uniquement. Une fois que l'utilisateur confirme que l'étape fonctionne, nous passerons à l'étape suivante.
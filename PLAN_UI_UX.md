# Plan d'Amélioration UI/UX – Application de Dimensionnement Télécoms (adapté à Tailwind CSS 3)

## Introduction
Ce plan détaille les phases d'amélioration visuelle et ergonomique de l'application, à implémenter et tester étape par étape, en utilisant **exclusivement Tailwind CSS v3** et ses bonnes pratiques. Chaque phase doit être validée avant de passer à la suivante.

---

## PHASE 1 : FONDATIONS UI/UX (Structure et Navigation)

### Objectif
Mettre en place la structure de base et la navigation moderne avec Tailwind CSS 3.

### Tâches
- [ ] Définir la palette de couleurs et la police dans `tailwind.config.js` (utiliser `theme.extend.colors` et `theme.extend.fontFamily`)
- [ ] Créer/moderniser le header (logo, nom du projet, navigation) avec les utilitaires Tailwind v3
- [ ] Mettre en place une sidebar/menu de navigation (flex, gap, bg, shadow, etc.)
- [ ] Organiser le contenu principal (formulaires, résultats, graphiques) avec `container`, `mx-auto`, `p-*`, `rounded-*`, etc.
- [ ] Rendre l'interface responsive avec les breakpoints Tailwind v3 (`sm:`, `md:`, `lg:`, `xl:`)

### Conseils Tailwind v3
- Utiliser les utilitaires de spacing (`gap-*`, `space-x-*`, `space-y-*`)
- Privilégier les classes utilitaires pour la rapidité et la cohérence
- Utiliser les variantes de responsive et de dark mode si besoin

### Critères de validation
- [ ] Navigation fluide et claire
- [ ] Header et sidebar visibles et fonctionnels
- [ ] Palette et typographie cohérentes (définies dans la config v3)
- [ ] Responsive sur tous supports

**ARRÊT PHASE 1** – Tester la navigation et la structure avant de continuer

---

## PHASE 2 : MODERNISATION DES FORMULAIRES

### Objectif
Rendre les formulaires agréables, lisibles et interactifs avec les utilitaires Tailwind v3.

### Tâches
- [ ] Espacer les champs (`space-y-*`, `mb-*`)
- [ ] Clarifier les labels (`font-semibold`, `text-sm`, `text-gray-*`)
- [ ] Ajouter des icônes d'aide (SVG ou emoji, stylés avec Tailwind)
- [ ] Mettre en valeur les boutons principaux (`bg-*`, `hover:bg-*`, `rounded-lg`, `shadow`, `transition-colors`)
- [ ] Ajouter un feedback visuel sur la saisie (`focus:ring-*`, `focus:border-*`, `border-red-500` pour erreurs)

### Conseils Tailwind v3
- Utiliser les classes de focus et d'erreur (`focus:`, `invalid:`, `peer-invalid:`)
- Utiliser les transitions (`transition`, `duration-*`, `ease-*`)
- Utiliser les utilitaires d'accessibilité (`sr-only`, `aria-*`)

### Critères de validation
- [ ] Formulaires modernes et accessibles
- [ ] Feedback utilisateur immédiat
- [ ] Boutons bien visibles

**ARRÊT PHASE 2** – Tester l'expérience de saisie avant de continuer

---

## PHASE 3 : VISUALISATION DES RÉSULTATS

### Objectif
Présenter les résultats de façon claire, attractive et interactive avec Tailwind v3.

### Tâches
- [ ] Utiliser des cartes ou encadrés (`bg-*`, `rounded-*`, `shadow-*`, `p-*`) pour chaque indicateur
- [ ] Intégrer des graphiques (chart.js ou recharts, stylés avec Tailwind)
- [ ] Mettre en valeur les boutons d'action (`hover:`, `active:`, `focus:`)

### Conseils Tailwind v3
- Utiliser les utilitaires de layout (`grid`, `flex`, `gap-*`)
- Utiliser les couleurs personnalisées définies dans la config

### Critères de validation
- [ ] Résultats lisibles et attractifs
- [ ] Graphiques intégrés et fonctionnels
- [ ] Actions accessibles

**ARRÊT PHASE 3** – Valider la visualisation avant d'ajouter des animations

---

## PHASE 4 : UNIFORMISATION ET ANIMATIONS

### Objectif
Harmoniser l'ensemble de l'UI et ajouter des animations légères avec Tailwind v3.

### Tâches
- [ ] Uniformiser les boutons, icônes et styles (`rounded-*`, `font-*`, `shadow-*`)
- [ ] Ajouter des animations de survol, transitions douces (`transition`, `hover:`, `focus:`, `duration-*`)

### Conseils Tailwind v3
- Utiliser les utilitaires d'animation (`animate-*` si besoin, ou transitions CSS)
- Privilégier la cohérence des couleurs et des espacements

### Critères de validation
- [ ] UI homogène sur toute l'application
- [ ] Animations discrètes et agréables

**ARRÊT PHASE 4** – Vérifier l'homogénéité et l'agrément visuel

---

## PHASE 5 : TESTS GLOBAUX ET ACCESSIBILITÉ

### Objectif
S'assurer que l'application est agréable, accessible et cohérente partout, en respectant les bonnes pratiques Tailwind v3.

### Tâches
- [ ] Tester l'UI sur différents navigateurs et supports
- [ ] Vérifier l'accessibilité (contraste, navigation clavier, focus visible, etc.)
- [ ] Corriger les incohérences ou bugs restants

### Conseils Tailwind v3
- Utiliser les utilitaires d'accessibilité (`focus-visible`, `outline-*`, `aria-*`)
- Vérifier le contraste avec les outils Tailwind

### Critères de validation
- [ ] Application agréable et professionnelle sur tous supports
- [ ] Accessibilité respectée
- [ ] Aucun bug d'affichage ou de navigation

---

**Ce plan doit être suivi étape par étape, chaque phase étant validée avant de passer à la suivante.**

> **Note Tailwind v3 :**
> - Certaines classes utilitaires avancées (ex : `backdrop-blur`, `line-clamp`, `aspect-ratio`) sont disponibles nativement en v3.
> - Les plugins officiels sont compatibles (forms, typography, line-clamp, etc.).
> - Les couleurs par défaut sont différentes de la v2, vérifiez la palette !
> - Utilisez la purge (`content` dans la config) pour optimiser le CSS généré. 
# Migration de Tailwind CSS v4 à v3

## 1. Analyse de l'existant

### Fichiers et dossiers concernés
- `tailwind.config.js` (configuration principale)
- `postcss.config.cjs` (configuration PostCSS)
- `src/index.css` (import des directives Tailwind)
- Utilisation des classes utilitaires Tailwind dans tous les composants React (`src/components/`)
- Dépendances dans `package.json`

### Points d'attention
- Tailwind v4 introduit des changements sur la gestion des couleurs, des plugins, du dark mode, etc.
- Certaines classes ou fonctionnalités peuvent ne plus exister ou avoir changé de comportement entre v3 et v4.
- Les fichiers de config peuvent avoir des options non reconnues par v3.

---

## 2. Plan détaillé de migration Tailwind v4 → v3

### Étape 1 : Désinstaller Tailwind v4 et installer Tailwind v3
- Désinstalle Tailwind CSS v4 et ses plugins associés.
- Installe la version 3.x de Tailwind CSS et ses plugins compatibles.

### Étape 2 : Adapter la configuration
- Adapter `tailwind.config.js` :
  - Supprimer ou adapter les options spécifiques à v4 (ex : `color`, `darkMode`, plugins, etc.).
  - Vérifier la syntaxe des thèmes, plugins, variants, etc.
- Adapter `postcss.config.cjs` si besoin (la config de base reste compatible).

### Étape 3 : Adapter les fichiers CSS
- Vérifier que les directives dans `src/index.css` sont compatibles (elles le sont généralement).
- Supprimer les éventuelles classes ou utilitaires propres à v4 dans le code.

### Étape 4 : Adapter le code des composants
- Rechercher l'utilisation de classes ou fonctionnalités propres à v4 dans tous les composants.
- Adapter ou remplacer les classes qui n'existent pas en v3.
- Vérifier les plugins utilisés (forms, typography, line-clamp, etc.) et installer les versions compatibles v3.

### Étape 5 : Nettoyer et tester
- Supprimer le cache (`node_modules`, `.next`, `dist`, etc.).
- Relancer l'installation et le build.
- Tester l'UI pour vérifier que tout s'affiche correctement.

---

## 3. Plan d'action détaillé (étape par étape)

### A. Désinstallation et installation
1. Désinstaller Tailwind CSS v4 :
   ```sh
   npm uninstall tailwindcss
   ```
2. Installer Tailwind CSS v3 :
   ```sh
   npm install tailwindcss@3 postcss@latest autoprefixer@latest
   ```
   (ou la version 3.x la plus récente)

### B. Adapter la configuration
3. Ouvrir `tailwind.config.js` :
   - Supprimer les options non supportées par v3.
   - Adapter la structure du fichier à la syntaxe v3.
   - Vérifier la section `theme`, `plugins`, etc.

4. Vérifier `postcss.config.cjs` :
   - S'assurer qu'il contient bien :
     ```js
     module.exports = {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     }
     ```

### C. Adapter le CSS
5. Vérifier `src/index.css` :
   - Garder uniquement :
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - Les imports de fonts Google sont compatibles.

### D. Adapter le code React
6. Rechercher dans tous les fichiers du dossier `src/components/` :
   - Les classes utilitaires qui n'existent pas en v3 (ex : nouvelles couleurs, nouveaux spacings, etc.).
   - Les plugins ou utilitaires qui auraient changé de nom ou de comportement.

7. Adapter ou remplacer les classes non reconnues.

### E. Plugins
8. Si tu utilises des plugins (forms, typography, line-clamp, aspect-ratio), installe les versions compatibles v3 :
   ```sh
   npm install @tailwindcss/forms@latest @tailwindcss/typography@latest @tailwindcss/line-clamp@latest @tailwindcss/aspect-ratio@latest
   ```

### F. Nettoyage et test
9. Supprimer le dossier `node_modules` et le fichier `package-lock.json` :
   ```sh
   rm -rf node_modules package-lock.json
   ```
10. Réinstaller les dépendances :
    ```sh
    npm install
    ```
11. Relancer le projet et vérifier l'affichage.

---

## 4. Conseils supplémentaires

- **Documentation** : Consulte la doc officielle de Tailwind v3 pour les options de config et les classes utilitaires.
- **Recherche de classes inconnues** : Si tu as des erreurs de build, cherche les classes inconnues dans la console et adapte-les.
- **Sauvegarde** : Fais une sauvegarde du projet avant migration. 
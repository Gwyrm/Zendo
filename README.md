# 🎯 Zendo - Tableau Kanban Avancé

Une application de gestion de projets Kanban moderne et complète, construite avec React, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 🎯 Gestion des Tableaux
- **Tableaux multiples** : Créez et gérez plusieurs tableaux de projet
- **Modèles de tableaux** : Utilisez des modèles prédéfinis pour démarrer rapidement
- **Sélecteur de tableaux** : Naviguez facilement entre vos différents projets
- **Personnalisation** : Arrière-plans personnalisés pour chaque tableau

### 📋 Gestion des Cartes
- **Cartes riches** : Titre, description, étiquettes, dates d'échéance
- **Système de checklist** : Créez des listes de tâches au sein des cartes
- **Commentaires** : Système de commentaires collaboratif
- **Pièces jointes** : Support pour les fichiers et liens
- **Priorités** : Système de priorités (faible, moyenne, haute, urgente)
- **Dépendances** : Gérez les relations entre cartes
- **Suivi du temps** : Enregistrez le temps passé sur chaque tâche

### 👥 Collaboration
- **Membres d'équipe** : Assignez des membres aux cartes et tableaux
- **Avatars** : Interface utilisateur intuitive avec photos de profil
- **Notifications** : Système d'activité et de notifications
- **Permissions** : Contrôle des permissions (commentaires, votes)

### 🔍 Fonctionnalités Avancées
- **Recherche avancée** : Recherchez dans tous vos contenus
- **Filtres puissants** : Filtrez par membres, étiquettes, dates, priorités
- **Actions en lot** : Effectuez des opérations sur plusieurs cartes
- **Mode sombre** : Interface adaptable jour/nuit
- **Raccourcis clavier** : Navigation rapide au clavier
- **Limites WIP** : Contrôlez le travail en cours dans chaque liste

### 📊 Analytics et Suivi
- **Statistiques de tableau** : Visualisez les métriques de votre projet
- **Chronologie d'activité** : Suivez toutes les modifications
- **Graphiques** : Analyse visuelle des performances
- **Rapports** : Exportez vos données

### 💾 Persistance et Import/Export
- **Sauvegarde locale** : Données persistées dans le navigateur
- **Export/Import** : Sauvegardez et restaurez vos tableaux
- **Modèles** : Créez des modèles réutilisables

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <votre-repo-url>
cd Zendo

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### État du Projet

✅ **Fonctionnel** : L'application se lance et fonctionne correctement  
✅ **Build** : La compilation en production fonctionne sans erreur  
⚠️ **Code Quality** : Quelques variables inutilisées à nettoyer (non bloquant)  
✅ **TypeScript** : Configuration complète avec types stricts

### Scripts Disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile l'application pour la production
npm run preview  # Prévisualise la version de production
npm run lint     # Vérifie le code avec ESLint
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI moderne
- **TypeScript** - Typage statique pour JavaScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire

### Gestion d'État
- **React Hooks** - useState, useEffect, custom hooks
- **Local Storage** - Persistance des données côté client

### Icônes et UI
- **Lucide React** - Bibliothèque d'icônes moderne
- **date-fns** - Manipulation des dates

### Outils de Développement
- **ESLint** - Linting du code JavaScript/TypeScript
- **PostCSS** - Traitement CSS avancé
- **Autoprefixer** - Compatibilité CSS cross-browser

## 📁 Structure du Projet

```
src/
├── components/          # Composants React réutilisables
│   ├── Board.tsx       # Composant principal du tableau
│   ├── Card.tsx        # Composant carte individuelle
│   ├── List.tsx        # Composant liste/colonne
│   ├── CardModal.tsx   # Modal d'édition de carte
│   ├── FilterPanel.tsx # Panneau de filtres
│   └── ...            # Autres composants
├── hooks/              # Hooks React personnalisés
│   ├── useDragAndDrop.ts    # Logique drag & drop
│   ├── useLocalStorage.ts   # Persistance locale
│   ├── useKeyboardShortcuts.ts # Raccourcis clavier
│   └── useDarkMode.ts      # Mode sombre
├── types/              # Définitions TypeScript
│   └── index.ts        # Types principaux
├── data/               # Données de démo et modèles
│   ├── mockData.ts     # Données d'exemple
│   └── boardTemplates.ts # Modèles de tableaux
└── main.tsx           # Point d'entrée de l'application
```

## 🎮 Raccourcis Clavier

- **Ctrl/Cmd + N** : Nouvelle carte
- **Ctrl/Cmd + F** : Rechercher
- **Ctrl/Cmd + D** : Basculer le mode sombre
- **Ctrl/Cmd + B** : Mode sélection multiple
- **Échap** : Fermer les modals

## 🎨 Personnalisation

### Thèmes
L'application supporte le mode sombre/clair automatique basé sur les préférences système ou manuel.

### Étiquettes
Créez et personnalisez vos étiquettes avec des couleurs personnalisées.

### Arrière-plans
Personnalisez l'apparence de vos tableaux avec des dégradés.

## 📈 Fonctionnalités Avancées

### Drag & Drop
- Déplacez les cartes entre les listes
- Réorganisez l'ordre des cartes
- Interface tactile intuitive

### Gestion du Temps
- Suivi du temps par carte
- Historique des sessions
- Estimation vs temps réel

### Workflow Avancé
- Limites de travail en cours (WIP)
- Dépendances entre cartes
- Archivage et restauration

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajouter une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes ou avez des questions :
1. Vérifiez les [issues existantes](../../issues)
2. Créez une [nouvelle issue](../../issues/new) si nécessaire
3. Consultez la documentation des technologies utilisées

---

**Développé avec ❤️ en utilisant React et TypeScript**

# Plan d'exécution — migration propre Ionic/Angular + Capacitor

## Objectif
Publier l'application sur les stores avec une base technique maintenable, en conservant les fonctionnalités existantes.

## Contraintes actuelles observées
- Le projet actuel utilise un socle ancien (Angular 13 / Capacitor 3 / plugins Cordova legacy).
- L'environnement CI local bloque les téléchargements npm/gradle (HTTP 403), ce qui empêche la génération immédiate d'un nouveau projet depuis ce runner.

---

## Phase 1 — Freeze et inventaire (à exécuter immédiatement)

### 1.1 Geler l'existant
```bash
git checkout work
git pull
git tag -a legacy-store-freeze -m "Snapshot avant migration propre"
git push origin legacy-store-freeze
```

### 1.2 Générer un inventaire technique
```bash
bash scripts/inventory-current-project.sh
```
Sorties attendues:
- `reports/migration/plugins.txt`
- `reports/migration/android-config.txt`
- `reports/migration/ios-tree.txt`
- `reports/migration/src-tree.txt`

### 1.3 Définir la checklist de non-régression fonctionnelle
Créer `reports/migration/regression-checklist.md` avec:
- parcours d'accueil
- recherche produit
- appel téléphonique
- navigation GPS
- accès caméra / fichiers (si utilisé)

---

## Phase 2 — Nouveau shell applicatif (sur machine avec accès npm)

```bash
npm i -g @ionic/cli
ionic start pharmacie-mozart-next blank --type=angular --no-interactive
cd pharmacie-mozart-next
npm install
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Pharmacie Mozart" "jkc.pharmacie.mozart"
```

Puis:
```bash
ionic build
npx cap add android
npx cap add ios
```

Validation minimale:
- build web OK
- ouverture Android Studio/Xcode OK

---

## Phase 3 — Migration code web (sans logique native d'abord)

1. Copier `src/app`, `src/assets`, `src/theme`, `src/environments` progressivement.
2. Réinstaller dépendances Angular/Ionic nécessaires au code.
3. Corriger APIs obsolètes Angular/Ionic.
4. Faire passer `ionic build`.

Commande type:
```bash
ionic build
```

---

## Phase 4 — Migration native propre

1. Lister les plugins legacy et décider remplacement:
   - Capacitor natif si disponible
   - Cordova maintenu si indispensable
2. Ajouter plugins un par un, avec test fonctionnel après chaque ajout.
3. Configurer permissions Android/iOS minimales.

Commandes types:
```bash
npm i <plugin>
npx cap sync
```

---

## Phase 5 — Signature, release, stores

1. Android:
   - configurer `keystore.properties` (hors Git)
   - produire AAB release
2. iOS:
   - configurer signing/provisioning
   - archive IPA
3. Vérifier les policies stores (permissions, privacy, métadonnées)

---

## Critères de succès
- Même périmètre fonctionnel que l'app actuelle
- Build Android AAB et iOS IPA reproductibles
- Aucune dépendance à des hacks Gradle non maintenables
- Secret sensible sorti du code source

import React from 'react';

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">🔧 Installation</h1>

      <p className="text-lg text-gray-600 mb-8">
        Ce guide vous accompagne dans l'installation et la configuration de l'application ClientJO.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-yellow-900 mb-4">Prérequis</h2>
        <p className="text-yellow-800 mb-4">Avant de commencer, assurez-vous d'avoir installé :</p>
        <ul className="space-y-2 text-yellow-800">
          <li>• <strong>Node.js</strong> (version 18+ recommandée)</li>
          <li>• <strong>npm</strong> ou <strong>yarn</strong></li>
          <li>• <strong>Git</strong></li>
        </ul>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Cloner le repository</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
            git clone https://github.com/votre-repo/ClientJO_Front.git<br/>
            cd ClientJO_Front/application
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Installer les dépendances</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
            npm install<br/>
            # ou<br/>
            yarn install
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Configuration de l'environnement</h2>
          <p className="text-gray-600 mb-4">Créez un fichier <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> à la racine du projet :</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
            # API Configuration<br/>
            NEXT_PUBLIC_API_URL=http://localhost:8000/api<br/>
            NEXT_PUBLIC_API_TIMEOUT=10000<br/><br/>
            # Authentication<br/>
            NEXT_PUBLIC_JWT_SECRET=your-secret-key<br/>
            NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT=/auth/refresh<br/><br/>
            # Payment (si applicable)<br/>
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Lancer l'application</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm mb-4">
            # Mode développement<br/>
            npm run dev<br/><br/>
            # L'application sera disponible sur http://localhost:3000
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
            # Documentation (cette page)<br/>
            # Accessible via http://localhost:3000/docs
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scripts disponibles</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Script</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run dev</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Lance le serveur de développement</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run build</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Build de production</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run start</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Lance l'application en production</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run test</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Exécute les tests</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run test:watch</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Tests en mode watch</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run lint</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Vérifie le code avec ESLint</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">npm run check</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Lance lint + TypeScript + tests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vérification de l'installation</h2>
          <p className="text-gray-600 mb-4">Pour vérifier que tout fonctionne correctement :</p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <div>
                <strong>Tests</strong> : <code className="bg-gray-100 px-2 py-1 rounded">npm run test</code>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <div>
                <strong>Lint</strong> : <code className="bg-gray-100 px-2 py-1 rounded">npm run lint</code>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <div>
                <strong>Build</strong> : <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-800">✅ Si tous les scripts s'exécutent sans erreur, votre installation est réussie !</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔧 Dépannage</h2>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Node.js version incompatible</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                # Vérifier la version<br/>
                node --version<br/><br/>
                # Mettre à jour si nécessaire<br/>
                npm install -g n<br/>
                n latest
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Erreurs de dépendances</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                # Nettoyer et réinstaller<br/>
                rm -rf node_modules package-lock.json<br/>
                npm install
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Port déjà utilisé</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                # Utiliser un autre port<br/>
                npm run dev -- -p 3001
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

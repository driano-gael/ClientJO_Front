import React from 'react';

export default function ArchitecturePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">🏗️ Architecture</h1>

      <p className="text-lg text-gray-600 mb-8">
        Cette section détaille l'architecture et l'organisation du code de l'application ClientJO.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Structure du projet</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
          <pre>{`application/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── billets/           # Page de gestion des billets
│   │   ├── evenements/        # Catalogue des événements
│   │   ├── panier/            # Panier d'achat
│   │   ├── docs/              # Documentation (cette section)
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Composants React réutilisables
│   │   ├── billet/           # Composants liés aux billets
│   │   ├── common/           # Composants génériques
│   │   ├── connexion/        # Authentification
│   │   ├── evenements/       # Affichage des événements
│   │   ├── footer/           # Pied de page
│   │   ├── header/           # En-tête et navigation
│   │   └── home/             # Page d'accueil
│   ├── context/              # Contexts React
│   ├── hook/                 # Hooks personnalisés
│   ├── lib/                  # Utilitaires et services
│   │   ├── api/              # Services API
│   │   ├── filter/           # Logique de filtrage
│   │   └── reducer/          # Reducers Redux
│   ├── store/                # Configuration Redux
│   ├── style/                # Styles globaux
│   ├── type/                 # Définitions TypeScript
│   └── utils/                # Fonctions utilitaires
└── __test__/                 # Tests unitaires`}</pre>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">⚡ Patterns architecturaux</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Architecture en couches</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Composants UI → Hooks personnalisés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Hooks → Services API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span>Services → Backend</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span>Redux Store ← → LocalStorage</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Gestion d'état Redux</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Store</strong> : Configuration centrale</li>
                <li>• <strong>Slices</strong> : Logique métier découpée</li>
                <li>• <strong>Persistence</strong> : Redux Persist</li>
                <li>• <strong>Middleware</strong> : Gestion asynchrone</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🌐 Services et API</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Structure des services</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
              <pre>{`src/lib/api/service/
├── authService.ts         # Authentification
├── billetService.ts       # Gestion des billets
├── evenementService.ts    # Événements olympiques
├── offreService.ts        # Offres commerciales
├── paiementService.ts     # Paiements
└── qrCodeService.ts       # Génération QR codes`}</pre>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pattern de service</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
              <pre>{`class ApiService {
  private baseURL: string;
  private timeout: number;
  
  async get<T>(endpoint: string): Promise<T> {
    // Logique commune (auth, headers, etc.)
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    // Logique commune
  }
}`}</pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🪝 Hooks personnalisés</h2>

          <p className="text-gray-600 mb-4">Les hooks encapsulent la logique métier réutilisable :</p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hook</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsabilité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">useAuth()</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Authentification utilisateur</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">useTickets()</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Gestion des billets</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">useOffre()</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Offres commerciales</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">useIsMobile()</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Détection mobile/desktop</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">useDisciplines()</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Disciplines olympiques</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📝 Gestion des types</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Organisation TypeScript</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                <pre>{`src/type/
├── achat/          # Types pour les achats
├── client/         # Types utilisateur
├── common/         # Types partagés
├── evenement/      # Types événements/épreuves
└── paiement/       # Types paiement`}</pre>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Convention de nommage</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Interfaces</strong> : PascalCase (<code>UserInterface</code>)</li>
                <li>• <strong>Types</strong> : PascalCase + suffixe (<code>UserType</code>)</li>
                <li>• <strong>Enums</strong> : PascalCase (<code>StatusEnum</code>)</li>
                <li>• <strong>Constantes</strong> : UPPER_CASE</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🧪 Stratégie de tests</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Organisation des tests</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
              <pre>{`__test__/
├── components/     # Tests des composants
├── context/        # Tests des contexts
├── hook/          # Tests des hooks
└── lib/           # Tests des services`}</pre>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Types de tests</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Unit tests</strong> : Composants isolés</li>
                <li>• <strong>Integration tests</strong> : Interaction composants</li>
                <li>• <strong>Hook tests</strong> : Logique des hooks</li>
                <li>• <strong>Service tests</strong> : API et logique métier</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Outils de test</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Jest</strong> : Framework principal</li>
                <li>• <strong>Testing Library</strong> : Tests React</li>
                <li>• <strong>User Event</strong> : Simulations utilisateur</li>
                <li>• <strong>MSW</strong> : Mock des API</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Performance et optimisation</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Stratégies utilisées</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• <strong>Code splitting</strong> : Chargement paresseux</li>
                <li>• <strong>Image optimization</strong> : Next.js Image</li>
                <li>• <strong>Bundle analysis</strong> : Optimisation deps</li>
                <li>• <strong>Memoization</strong> : React.memo, useMemo</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Monitoring</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• <strong>ESLint</strong> : Qualité du code</li>
                <li>• <strong>TypeScript</strong> : Vérification types</li>
                <li>• <strong>Tests</strong> : Couverture automatisée</li>
                <li>• <strong>CI/CD</strong> : Intégration continue</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

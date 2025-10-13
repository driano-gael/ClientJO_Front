import React from 'react';

export default function DocsHome() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">ClientJO - Documentation</h1>

      <p className="text-xl text-gray-600 mb-8">
        Bienvenue dans la documentation de l'application <strong>ClientJO</strong>, une plateforme de vente de billets pour les Jeux Olympiques de Paris 2024.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">🎯 Vue d'ensemble</h2>
        <p className="text-blue-800">
          ClientJO est une application web moderne développée avec <strong>Next.js 15</strong> et <strong>TypeScript</strong>,
          offrant une interface utilisateur intuitive pour l'achat de billets olympiques.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎫 Fonctionnalités principales</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Gestion des billets</strong> - Achat, visualisation et validation</li>
            <li>• <strong>Catalogue d'événements</strong> - Navigation par disciplines</li>
            <li>• <strong>Panier intelligent</strong> - Gestion avec Redux</li>
            <li>• <strong>Authentification</strong> - Système sécurisé avec JWT</li>
            <li>• <strong>Design responsive</strong> - Mobile et desktop</li>
            <li>• <strong>Paiements sécurisés</strong> - Solutions intégrées</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">⚡ Technologies utilisées</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Frontend</strong>: Next.js 15, React 19, TypeScript</li>
            <li>• <strong>State Management</strong>: Redux Toolkit, Redux Persist</li>
            <li>• <strong>Styles</strong>: TailwindCSS, DaisyUI</li>
            <li>• <strong>Tests</strong>: Jest, Testing Library</li>
            <li>• <strong>Documentation</strong>: MDX intégré</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-green-900 mb-4">🚀 Démarrage rapide</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
          <div># Installation des dépendances</div>
          <div>npm install</div>
          <br />
          <div># Lancement en mode développement</div>
          <div>npm run dev</div>
          <br />
          <div># Tests</div>
          <div>npm run test</div>
          <br />
          <div># Build de production</div>
          <div>npm run build</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <a href="/docs/installation" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">🔧</div>
          <h3 className="font-semibold text-gray-900">Installation</h3>
          <p className="text-sm text-gray-600">Configuration de l'environnement</p>
        </a>

        <a href="/docs/architecture" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">🏗️</div>
          <h3 className="font-semibold text-gray-900">Architecture</h3>
          <p className="text-sm text-gray-600">Structure et patterns utilisés</p>
        </a>

        <a href="/docs/components" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">🧩</div>
          <h3 className="font-semibold text-gray-900">Composants</h3>
          <p className="text-sm text-gray-600">Documentation des composants React</p>
        </a>
      </div>

      <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        <p><em>Cette documentation est mise à jour régulièrement avec les nouvelles fonctionnalités.</em></p>
      </div>
    </div>
  );
}

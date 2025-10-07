import {Ticket} from "@/type/achat/ticket";

type props = {
    ticket: Ticket;
    type: 'valide' | 'invalide';
}


export default function BilletCard({ ticket, type }: props) {
  const isValide = type === 'valide';
  const bgColor = isValide ? 'bg-green-50' : 'bg-red-50';
  const badgeColor = isValide ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const badgeText = isValide ? 'Billet Valide' : 'Billet Non Valide';


  return (
    <div className={`w-full max-w-md ${bgColor} m-0 p-4 border rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500">{ticket.client.nom} - {ticket.client.prenom}</p>
        <span className={`text-xs font-semibold py-1 px-2 rounded-full ${badgeColor}`}>{badgeText}</span>
      </div>
        <h2 className="text-lg font-semibold">{ticket.evenement.description}</h2>
      <p className="text-sm text-gray-700">Offre : {ticket.offre.libelle}</p>
      <p className="text-sm text-gray-700">Nombre de personnes : {ticket.offre.nb_personne}</p>
      <p className="text-sm text-gray-700">Montant : {ticket.offre.montant} €</p>
      <p className="text-sm text-gray-700 mb-4">Description : {ticket.offre.description}</p>
      <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200">
        Détails
      </button>
    </div>
  );
}
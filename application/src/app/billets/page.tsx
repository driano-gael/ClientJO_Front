'use client'

import {useTickets} from "@/hook/useTickets";

export default function Billet(){
  const {tickets} = useTickets()
  console.log('tickets', tickets)
  return (
    <>
      tickets.map(ticket => (
        <div key={ticket.id}>
          <h2>{ticket.evenement.nom}</h2>
          <p>Offre: {ticket.offre.libelle}</p>
          <p>Nombre de personnes: {ticket.offre.nb_personne}</p>
          <p>Montant: {ticket.offre.montant} €</p>
          <p>Description: {ticket.offre.description}</p>
        </div>
      ))
    </>
  )
}
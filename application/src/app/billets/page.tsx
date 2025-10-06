'use client'

import {useTickets} from "@/hook/useTickets";
import BilletCard from "@/components/billet/billetCard";
import Header from "@/components/header/Header";


export default function Billet() {
    const {tickets} = useTickets()
    const billetsValides = tickets?.filter(ticket => ticket.statut === "valide");
    const billetsNonValides = tickets?.filter(ticket => ticket.statut === "invalide");

    return (
        <>
            <Header/>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Section Billets Valides */}
                <section>
                    <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Billets valides</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {billetsValides && billetsValides.length > 0 ? (
                            billetsValides.map(ticket => (
                                <BilletCard key={ticket.id} ticket={ticket} type="valide"/>
                            ))
                        ) : (
                            <p className="text-gray-400 italic ml-2">Aucun billet valide.</p>
                        )}
                    </div>
                </section>
                {/* Section Billets Non Valides */}
                <section className="mt-8">
                    <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Billets non valides</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {billetsNonValides && billetsNonValides.length > 0 ? (
                            billetsNonValides.map(ticket => (
                                <BilletCard key={ticket.id} ticket={ticket} type="invalide"/>
                            ))
                        ) : (
                            <p className="text-gray-400 italic ml-2">Aucun billet non valide.</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

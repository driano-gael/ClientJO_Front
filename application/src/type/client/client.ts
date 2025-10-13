/**
 * Interface représentant un client
 */
export default interface Client {
    /** Adresse email du client */
    email: string;
    /** Nom de famille du client */
    nom: string;
    /** Prénom du client */
    prenom: string;
    /** Numéro de téléphone du client */
    telephone: string;
}
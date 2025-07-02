type PartialFormData = Partial<{
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    acceptTerms: boolean;
}>;

type Errors = Partial<Record<keyof PartialFormData, string>>;

export function validateClientForm(formData: PartialFormData): Errors {
    const errors: Errors = {};

    if ('email' in formData) {
        if (!formData.email) {
            errors.email = "Email obligatoire.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) errors.email = "Email invalide.";
        }
    }

    if ('password' in formData) {
        if (!formData.password) {
            errors.password = "Mot de passe obligatoire.";
        } else {
        if (formData.password.length < 12) {
            errors.password = "Le mot de passe doit contenir au moins 12 caractères.";
        } else {
            const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
            if (!strongPassRegex.test(formData.password)) {
                errors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
            }
        }
        }
    }

    if ('nom' in formData) {
        if (!formData.nom) {
            errors.nom = "Nom obligatoire.";
        } else if (formData.nom.length < 2) {
            errors.nom = "Nom trop court.";
        }
    }

    if ('prenom' in formData) {
        if (!formData.prenom) {
            errors.prenom = "Prénom obligatoire.";
        } else if (formData.prenom.length < 2) {
            errors.prenom = "Prénom trop court.";
        }
    }

    if ('telephone' in formData) {
        if (!formData.telephone) {
            errors.telephone = "Téléphone obligatoire.";
        } else {
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
        if (!phoneRegex.test(formData.telephone)) errors.telephone = "Téléphone invalide.";
        }
    }

    if ('acceptTerms' in formData && formData.acceptTerms === false) {
        errors.acceptTerms = "Vous devez accepter les CGU et la politique de confidentialité.";
    }

    return errors;
}

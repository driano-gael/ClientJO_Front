import { validateClientForm, PartialFormData } from '@/utils/validateForms';

describe('validateClientForm', () => {
  describe('Validation email', () => {
    it('retourne une erreur si email est vide', () => {
      const formData: PartialFormData = { email: '' };
      const errors = validateClientForm(formData);

      expect(errors.email).toBe("Email obligatoire.");
    });

    it('retourne une erreur si email est invalide', () => {
      const formData: PartialFormData = { email: 'invalid-email' };
      const errors = validateClientForm(formData);

      expect(errors.email).toBe("Email invalide.");
    });

    it('accepte un email valide', () => {
      const formData: PartialFormData = { email: 'test@example.com' };
      const errors = validateClientForm(formData);

      expect(errors.email).toBeUndefined();
    });
  });

  describe('Validation password', () => {
    it('retourne une erreur si password est vide', () => {
      const formData: PartialFormData = { password: '' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Mot de passe obligatoire.");
    });

    it('retourne une erreur si password est trop court', () => {
      const formData: PartialFormData = { password: 'Short1!' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Le mot de passe doit contenir au moins 12 caractères.");
    });

    it('retourne une erreur si password manque de majuscule', () => {
      const formData: PartialFormData = { password: 'lowercase123!' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it('retourne une erreur si password manque de minuscule', () => {
      const formData: PartialFormData = { password: 'UPPERCASE123!' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it('retourne une erreur si password manque de chiffre', () => {
      const formData: PartialFormData = { password: 'PasswordNoNum!' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it('retourne une erreur si password manque de caractère spécial', () => {
      const formData: PartialFormData = { password: 'Password1234' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBe("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it('accepte un password valide', () => {
      const formData: PartialFormData = { password: 'ValidPass123!' };
      const errors = validateClientForm(formData);

      expect(errors.password).toBeUndefined();
    });
  });

  describe('Validation nom', () => {
    it('retourne une erreur si nom est vide', () => {
      const formData: PartialFormData = { nom: '' };
      const errors = validateClientForm(formData);

      expect(errors.nom).toBe("Nom obligatoire.");
    });

    it('retourne une erreur si nom est trop court', () => {
      const formData: PartialFormData = { nom: 'A' };
      const errors = validateClientForm(formData);

      expect(errors.nom).toBe("Nom trop court.");
    });

    it('accepte un nom valide', () => {
      const formData: PartialFormData = { nom: 'Dupont' };
      const errors = validateClientForm(formData);

      expect(errors.nom).toBeUndefined();
    });
  });

  describe('Validation prenom', () => {
    it('retourne une erreur si prenom est vide', () => {
      const formData: PartialFormData = { prenom: '' };
      const errors = validateClientForm(formData);

      expect(errors.prenom).toBe("Prénom obligatoire.");
    });

    it('retourne une erreur si prenom est trop court', () => {
      const formData: PartialFormData = { prenom: 'A' };
      const errors = validateClientForm(formData);

      expect(errors.prenom).toBe("Prénom trop court.");
    });

    it('accepte un prenom valide', () => {
      const formData: PartialFormData = { prenom: 'Jean' };
      const errors = validateClientForm(formData);

      expect(errors.prenom).toBeUndefined();
    });
  });

  describe('Validation telephone', () => {
    it('retourne une erreur si telephone est vide', () => {
      const formData: PartialFormData = { telephone: '' };
      const errors = validateClientForm(formData);

      expect(errors.telephone).toBe("Téléphone obligatoire.");
    });

    it('retourne une erreur si telephone est invalide', () => {
      const formData: PartialFormData = { telephone: '123456' };
      const errors = validateClientForm(formData);

      expect(errors.telephone).toBe("Téléphone invalide.");
    });

    it('accepte un téléphone valide français avec 0', () => {
      const formData: PartialFormData = { telephone: '0612345678' };
      const errors = validateClientForm(formData);

      expect(errors.telephone).toBeUndefined();
    });

    it('accepte un téléphone valide français avec +33', () => {
      const formData: PartialFormData = { telephone: '+33612345678' };
      const errors = validateClientForm(formData);

      expect(errors.telephone).toBeUndefined();
    });
  });

  describe('Validation acceptTerms', () => {
    it('retourne une erreur si acceptTerms est false', () => {
      const formData: PartialFormData = { acceptTerms: false };
      const errors = validateClientForm(formData);

      expect(errors.acceptTerms).toBe("Vous devez accepter les CGU et la politique de confidentialité.");
    });

    it('accepte si acceptTerms est true', () => {
      const formData: PartialFormData = { acceptTerms: true };
      const errors = validateClientForm(formData);

      expect(errors.acceptTerms).toBeUndefined();
    });
  });

  describe('Validation de formulaire complet', () => {
    it('retourne plusieurs erreurs pour un formulaire invalide', () => {
      const formData: PartialFormData = {
        email: 'invalid',
        password: 'short',
        nom: '',
        prenom: 'A',
        telephone: '123',
        acceptTerms: false
      };
      const errors = validateClientForm(formData);

      expect(Object.keys(errors).length).toBeGreaterThan(0);
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(errors.nom).toBeDefined();
      expect(errors.prenom).toBeDefined();
      expect(errors.telephone).toBeDefined();
      expect(errors.acceptTerms).toBeDefined();
    });

    it('retourne aucune erreur pour un formulaire valide', () => {
      const formData: PartialFormData = {
        email: 'jean.dupont@example.com',
        password: 'ValidPass123!',
        nom: 'Dupont',
        prenom: 'Jean',
        telephone: '0612345678',
        acceptTerms: true
      };
      const errors = validateClientForm(formData);

      expect(Object.keys(errors).length).toBe(0);
    });
  });
});


'use client';

import { useState } from 'react';
import { registerClient } from '@/lib/api/authService';

export default function RegisterClientForm() {
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await registerClient(formData);
            console.log('Inscription réussie:', res);
        }catch (err: any) {
            if (err.data) {
                console.error('Erreurs de validation reçues :');
                for (const [field, messages] of Object.entries(err.data)) {
                    console.error(`- ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
                }
                } else {
                console.error('Erreur à l’inscription:', err.message);
            }
        }
    };

    return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <input
            name="email" 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            autoComplete='email'
            className="w-full border p-2 rounded" 
        />
        <input 
            name="password" 
            type="password" 
            placeholder="Mot de passe" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            autoComplete='current-password'
            className="w-full border p-2 rounded" 
        />
        <input 
            name="nom" 
            placeholder="Nom" 
            value={formData.nom} 
            onChange={handleChange} 
            required 
            autoComplete='family-name'
            className="w-full border p-2 rounded" 
        />
        <input 
            name="prenom" 
            placeholder="Prénom" 
            value={formData.prenom} 
            onChange={handleChange} 
            required
            autoComplete='given-name'
            className="w-full border p-2 rounded" 
        />
        <input 
            name="telephone" 
            placeholder="Téléphone" 
            value={formData.telephone} 
            onChange={handleChange} 
            required 
            className="w-full border p-2 rounded" 
        />
        <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            S’inscrire
        </button>
    </form>
    );
}

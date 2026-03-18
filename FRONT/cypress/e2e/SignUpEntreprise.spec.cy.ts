import { faker } from '@faker-js/faker'

const fillEntrepriseForm = (data: { [key: string]: string | string[] }) => {
    cy.get('input[name="companyName"]').type(data.companyName as string)
    cy.get('input[name="siret"]').type(data.siret as string)
    cy.get('input[name="email"]').type(data.email as string)
    cy.get('input[name="contactName"]').type(data.contactName as string)
    cy.get('input[name="phone"]').type(data.phone as string)
    cy.get('input[name="address"]').type(data.address as string)
    cy.get('input[name="zipCode"]').type(data.zipCode as string)
    cy.get('input[name="city"]').type(data.city as string)
    cy.get('input[name="country"]').type(data.country as string)
    cy.get('input[name="password"]').type(data.password as string)
    cy.get('input[name="confirmPassword"]').type(data.confirmPassword as string)
   
}

 describe('Signup Entreprise Tests', () => {
    const validPassword = 'ValidPass123!'
    const validSiret = '12395478901934' 
    const validPhone = '+33612345678' 

    beforeEach(() => {
       
        cy.visit('/signupEntreprise')
    })

    describe('Validation des Champs', () => {
        it('should display the signup form', () => {
            cy.contains('Créer un compte Entreprise').should('be.visible')
            cy.get('input[name="companyName"]').should('be.visible')
            cy.get('input[name="siret"]').should('be.visible')
            cy.get('input[name="email"]').should('be.visible')
            cy.get('input[name="contactName"]').should('be.visible')
            cy.get('input[name="phone"]').should('be.visible')
            cy.get('input[name="address"]').should('be.visible')
            cy.get('input[name="zipCode"]').should('be.visible')
            cy.get('input[name="city"]').should('be.visible')
            cy.get('input[name="country"]').should('be.visible')
            cy.get('input[name="password"]').should('be.visible')
            cy.get('input[name="confirmPassword"]').should('be.visible')
        })

        it('should show validation errors when submitting empty form', () => {
            cy.get('input[name="confirmPassword"]').focus().blur() 
            cy.contains("S'inscrire").click()

            cy.contains("Le nom de l’entreprise est requis").should('be.visible')
            cy.contains('Le SIRET est requis').should('be.visible')
            cy.contains("L’email est requis").should('be.visible')
            cy.contains('Le nom du contact est requis').should('be.visible')
            cy.contains('Le numéro de téléphone est requis').should('be.visible')
            cy.contains("L’adresse du siège est requise").should('be.visible')
            cy.contains('Le code postal est requis').should('be.visible')
            cy.contains('La ville est requise').should('be.visible')
            cy.contains('Le pays est requis').should('be.visible')
            cy.contains('Le mot de passe est requis').should('be.visible')
            cy.contains('La confirmation du mot de passe est requise').should('be.visible')
        })

        it('should show error for invalid SIRET format', () => {
            cy.get('input[name="siret"]').type('12345').blur()
            cy.contains('Le SIRET doit contenir exactement 14 chiffres.').should('be.visible')
        })

        it('should show error for invalid email format', () => {
            cy.get('input[name="email"]').type('invalid-email').blur()
            cy.contains('Adresse e-mail invalide.').should('be.visible')
        })

        it('should show error for invalid phone number format', () => {
            cy.get('input[name="phone"]').type('123').blur()
            cy.contains('Numéro de téléphone invalide (ex: +33612345678).').should('be.visible')
        })
        
        it('should show error for invalid zip code format', () => {
            cy.get('input[name="zipCode"]').type('123').blur() 
            cy.contains('Code postal invalide').should('be.visible')
        })

        it('should show error for weak password', () => {
            cy.get('input[name="password"]').type('weak').blur()
            cy.contains('8+ caractères, majuscule, minuscule, chiffre et symbole.').should('be.visible')
        })

        it('should show error when passwords do not match', () => {
            cy.get('input[name="password"]').type(validPassword)
            cy.get('input[name="confirmPassword"]').type('DifferentPass123!').blur()
            cy.contains('Les mots de passe doivent correspondre.').should('be.visible')
        })
    })
    
    describe('Soumission du Formulaire', () => {
        
        const data = {
            companyName: faker.company.name(),
            siret: validSiret,
            email: faker.internet.email(),
            contactName: faker.person.fullName(),
            phone: validPhone,
            address: faker.location.streetAddress(),
            zipCode: '75001',
            city: faker.location.city(),
            country: 'France',
            password: validPassword,
            confirmPassword: validPassword,
           
        };
        
        it('should successfully submit valid form and redirect to login', () => {
            cy.intercept('POST', '**/auth/signup-entreprise', { statusCode: 201 }).as('signupEntreprise')
    
            fillEntrepriseForm(data)

            cy.get('button[type="submit"]').click()
            cy.wait('@signupEntreprise').its('request.body').should('include', {
                raisonSociale: data.companyName,
                siret: data.siret,
                email: data.email,
            })

            cy.url().should('include', '/login')
        })

        it('should not successfully submit valid form when email already exists', () => {
            
            const conflictData = { ...data, email: 'kilian.ide@gmail.com' };
             fillEntrepriseForm(conflictData)

            
            cy.on('window:alert', (text) => {
                expect(text).to.contains('Email déjà utilisé')
            })

            cy.get('button[type="submit"]').click()

            cy.url().should('not.include', '/login')
        })
    })
    
    describe('Navigation', () => {
        it('should navigate to login page when clicking "Se connecter" button', () => {
            cy.contains('Se connecter').click()
            cy.url().should('include', '/login')
        })
    })
})
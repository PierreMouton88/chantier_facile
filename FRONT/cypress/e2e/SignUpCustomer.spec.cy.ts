import { faker } from '@faker-js/faker';

describe('Signup User (Customer)', () => {
  beforeEach(() => {
    // Intercepter les appels API pour éviter les vrais appels
    cy.intercept('POST', '**/auth/signup', { statusCode: 201 }).as('signupCustomer')
    cy.visit('/signupUser')
  })

    it('should display the signup form', () => {
      cy.contains('Créer un compte').should('be.visible')
      cy.get('input[name="firstName"]').should('be.visible')
      cy.get('input[name="lastName"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="telephone"]').should('be.visible')
      cy.get('input[name="address"]').should('be.visible')
      cy.get('input[name="zipCode"]').should('be.visible')
      cy.get('input[name="city"]').should('be.visible')
      cy.get('input[name="country"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')
    })

    it('should show validation errors when submitting empty form', () => {
      cy.contains('Créer un compte').click()
      cy.get('input[name="firstName"]').click()
      cy.get('input[name="lastName"]').click()
      cy.get('input[name="email"]').click()
      cy.get('input[name="telephone"]').click()
      cy.get('input[name="address"]').click()
      cy.get('input[name="zipCode"]').click()
      cy.get('input[name="city"]').click()
      cy.get('input[name="country"]').click()
      cy.get('input[name="password"]').click()
      cy.get('input[name="confirmPassword"]').click()
      cy.get('button[type="submit"]').click()

      cy.contains('Le prénom est requis').should('be.visible')
      cy.contains('Le nom est requis').should('be.visible')
      cy.contains("L'email est requis").should('be.visible')
      cy.contains('Le numéro de téléphone est requis').should('be.visible')
      cy.contains('L\'addresse (numéro et rue) est requise').should('be.visible')
      cy.contains('Le code postal est requis').should('be.visible')
      cy.contains('La ville est requise').should('be.visible')
      cy.contains('Le pays est requis').should('be.visible')
      cy.contains('Le mot de passe est requis').should('be.visible')
      cy.contains('La confirmation du mot de passe est requise').should('be.visible')
    })

    it('should show error for invalid email format', () => {
      cy.get('input[name="email"]').type('invalid-email').blur()
      cy.contains('Addresse email invalide').should('be.visible')
    })

    it('should show error for invalid phone number', () => {
      cy.get('input[name="telephone"]').type('123').blur()
      cy.contains('Numéro français invalide').should('be.visible')
    })

    it('should show error for invalid zip code', () => {
      cy.get('input[name="zipCode"]').type('abc').blur()
      cy.contains('Code postal invalide').should('be.visible')
    })

    it('should show error for weak password', () => {
      cy.get('input[name="password"]').type('weak').blur()
      cy.contains('8+ caractères, majuscule, minuscule, chiffre et symbole.').should('be.visible')
    })

    it('should show error when passwords do not match', () => {
      cy.get('input[name="password"]').type('ValidPass123!')
      cy.get('input[name="confirmPassword"]').type('DifferentPass123!').blur()
      cy.contains('Les mots de passe doivent correspondre').should('be.visible')
    })

    it('should not successfully submit valid form when email already exists', () => {
      // Override l'intercept pour simuler un email déjà utilisé
      cy.intercept('POST', '**/auth/signup', {
        statusCode: 409,
        body: { message: 'Email déjà utilisé' },
      }).as('signupCustomerFail')

      // Écouter l'alert AVANT l'action qui la déclenche
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Email déjà utilisé')
      })

      // Remplir tous les champs avec des données valides
      cy.get('input[name="firstName"]').type('Jean')
      cy.get('input[name="lastName"]').type('Dupont')
      cy.get('input[name="email"]').type('jean.dupont@example.com')
      cy.get('input[name="telephone"]').type('0612345678')
      cy.get('input[name="address"]').type('123 Rue de la Paix')
      cy.get('input[name="zipCode"]').type('75001')
      cy.get('input[name="city"]').type('Paris')
      cy.get('input[name="country"]').type('France')
      cy.get('input[name="password"]').type('ValidPass123!')
      cy.get('input[name="confirmPassword"]').type('ValidPass123!')

      // Soumettre le formulaire
      cy.get('button[type="submit"]').click()
      cy.wait('@signupCustomerFail')

      // Vérifier qu'on ne redirige PAS vers login
      cy.url().should('not.include', '/login')
    })

    it('should successfully submit with faker generated data', () => {
      // Utiliser faker pour générer des données aléatoires
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = faker.internet.email()
      const phone = '0612345678' // Numéro français valide
      const address = faker.location.streetAddress()
      const zipCode = '75001'
      const city = faker.location.city()
      const country = 'France'
      const password = 'ValidPass123!'

      cy.get('input[name="firstName"]').type(firstName)
      cy.get('input[name="lastName"]').type(lastName)
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="telephone"]').type(phone)
      cy.get('input[name="address"]').type(address)
      cy.get('input[name="zipCode"]').type(zipCode)
      cy.get('input[name="city"]').type(city)
      cy.get('input[name="country"]').type(country)
      cy.get('input[name="password"]').type(password)
      cy.get('input[name="confirmPassword"]').type(password)

      cy.get('button[type="submit"]').click()
      cy.wait('@signupCustomer')
      cy.url().should('include', '/login')
    })

    it('should navigate to login page when clicking "Se connecter" button', () => {
      cy.contains('Se connecter').click()
      cy.url().should('include', '/login')
    })

    it('should accept valid French phone number formats', () => {
      const validNumbers = [
        '0612345678',
        '06 12 34 56 78',
        '+33612345678',
      ]

      validNumbers.forEach((number) => {
        cy.get('input[name="telephone"]').clear().type(number).blur()

        // Vérifier qu'il n'y a pas d'erreur de validation
        cy.get('input[name="telephone"]')
          .parent()
          .should('not.contain', 'Numéro français invalide')
      })
    })
  })

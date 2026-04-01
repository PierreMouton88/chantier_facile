# Chantier Facile

Application web permettant de gérer un projet de travaux de bout en bout : mise en relation, organisation du chantier, suivi des tâches, gestion des devis et factures.

---

## 🚀 Contexte

Ce projet a été réalisé dans le cadre de ma formation de Concepteur Développeur d’Application.

L’objectif était de concevoir une application complète en partant d’un besoin métier concret jusqu’à la mise en production.

---

## 🧠 Fonctionnalités principales

- Création et gestion de projets de travaux
- Structuration des chantiers en tâches
- Mise en relation entre particuliers et entreprises
- Gestion des devis et factures
- Système de rôles (particulier / entreprise / admin)
- Authentification sécurisée (JWT avec refresh)

---

## 🛠️ Stack technique

### Frontend
- React
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend
- NestJS
- Prisma
- MySQL

### Infra & outils
- Docker / Docker Compose
- Nginx (reverse proxy)
- AWS EC2
- GitLab CI/CD (basique)

### Tests
- Jest (backend)
- Cypress (E2E)

---

## 🏗️ Architecture

L’application repose sur une architecture client–serveur avec une séparation claire des responsabilités :

- Frontend : interface utilisateur et gestion des états
- Backend : logique métier et gestion des accès
- Base de données : modèle relationnel structuré (MySQL)

Le backend est organisé en modules NestJS (controller / service / DTO / guards), permettant une bonne maintenabilité et une séparation des responsabilités.

---

## 🔐 Sécurité

- Authentification via JWT
- Refresh token automatique
- Contrôle d’accès par ressource (guards NestJS)
- Validation des données via DTO

---

## 🧪 Tests

- Tests unitaires backend avec Jest
- Tests end-to-end avec Cypress
- Tests API via Postman

---

## ⚙️ Déploiement

- Conteneurisation avec Docker
- Orchestration avec Docker Compose
- Déploiement sur AWS EC2
- Reverse proxy avec Nginx
- HTTPS via Let’s Encrypt

---

## 📚 Ce que j’ai appris

- Concevoir une application de bout en bout (fonctionnel → technique)
- Structurer une architecture backend propre (NestJS)
- Gérer l’authentification et la sécurité
- Déployer une application en production
- Travailler en équipe et en pair programming

---

## 🔮 Améliorations possibles

- Mise en place d’une CI/CD complète
- Notifications en temps réel (WebSockets)
- Paiement en ligne (Stripe)
- Monitoring et logging

---

## 👤 Auteur

Pierre Mouton  
[LinkedIn]:pierremouton4
[GitHub]: PierreMouton88

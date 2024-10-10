# Bliss - System Rezerwacji Biletów na Koncerty Online 🎫🎶

## Opis Projektu
Bliss to nowoczesny system rezerwacji biletów na koncerty, który umożliwia użytkownikom przeglądanie, rezerwowanie oraz zakup biletów na różne wydarzenia muzyczne. Nasz system został zaprojektowany z myślą o intuicyjności, szybkości i responsywności, aby zapewnić użytkownikom jak najlepsze doświadczenie przy zakupie biletów na ulubione koncerty.

### Funkcje:
- Przeglądanie nadchodzących wydarzeń koncertowych w formie listy lub kalendarza.
- Wyszukiwanie i filtrowanie wydarzeń według daty, lokalizacji, gatunku muzycznego.
- Rezerwacja miejsc na koncerty, z wizualizacją dostępnych miejsc w formie interaktywnej siatki.
- Bezpieczna płatność online z wieloma metodami płatności.
- Historia zamówień użytkownika z możliwością zarządzania rezerwacjami.
- Wersja responsywna, dostosowana do urządzeń mobilnych.

## Technologia
System został zbudowany przy użyciu nowoczesnych technologii, co zapewnia wysoką wydajność i skalowalność:
- **Frontend**: React (z responsywnym layoutem za pomocą CSS Flexbox/Grid), JSX, CSS Modules.
- **Backend**: Node.js, Express, PostgreSQL jako baza danych.
- **Diagramy UML**: Służące do przedstawienia relacji między tabelami (ERD).
- **Autoryzacja użytkowników**: JWT (JSON Web Tokens) do obsługi sesji i logowania.
- **Płatności**: Zintegrowane z systemami płatności (np. Stripe, PayPal).

## Instalacja

Aby uruchomić projekt lokalnie:

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-uzytkownik/Bliss.git
   ```
2. Przejdź do katalogu projektu:
   ```bash
   cd Bliss
   ```
3. Zainstaluj zależności frontendowe:
   ```bash
   cd frontend
   npm install
   ```
4. Zainstaluj zależności backendowe:
   ```bash
   cd ../backend
   npm install
   ```
5. Skonfiguruj pliki środowiskowe `.env` dla połączeń do bazy danych i kluczy API.
6. Uruchom aplikację:
   ```bash
   npm run dev
   ```
   Aplikacja powinna być teraz dostępna pod adresem `http://localhost:3000`.

## Struktura Plików

```
/frontend            - Frontend React
/backend             - Backend Node.js
/database            - Modele i diagramy UML dla bazy danych
README.md            - Dokumentacja projektu
```

## Licencja

Projekt jest objęty licencją MIT. Szczegóły w pliku [LICENSE](LICENSE).

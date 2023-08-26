
KLON AMAZONA, STACK TECHNOLOGICZNY: REACT + TS + DJANGO REST FRAMEWORK + CELERY + RABBITMQ

URUCHOMIENIE:
w folderze głównym komendy w oddzielnych konsolach:
python manage.py runserver - włączenie servera backend
celery -A amazon worker -l info -P eventlet - używane to pracy z zadaniami w tle; z powodu produkcji aplikacji an windowsie, użyto biblioteke eventlet
celery -A amazon beat -l info - cykliczne wywoływanie API walutowego o czas zdefiniowany w settings.py

w folderze frontend
npm start - włączenie servera frontend


DO USER AUTHENTICATION UŻYTO JWT (ADMIN PANEL Z KOLEI KORZYSTA DEFAULTOWO Z SESSIONS)

APLIKACJA ZAWIERA TAKIE FEATURY JAK:
1. REJESTRACJA
2. LOGOWANIE/WYLOGOWYWANIE
3. FILTR PRODUKTÓW
4. MOŻLIWOŚĆ TRANSAKCJI 
5. KOSZYK
6. PODGLĄD ZAMÓWIEŃ ORAZ MOŻLIWOŚĆ WYSTAWIENIA OCENY DLA ZAMÓWIONYCH PRODUKTÓW
7. ZMIANA WALUTY
8. BACKGROUND TASK W POSTACI API KTORE RAZ, A NASTĘPNIE CO CZAS OKRESLONY W settings.py ZA POMOCA CELERY AKTUALIZUJE KURSY WALUT
9. MOŻLIWOŚĆ EDYCJI DANYCH UŻYTKOWNIKA
10. REKOMENDACJE


UWAGI:
API WALUTOWE MOŻE BYĆ WYCZERPANE. W TAKIM WYPADKU ZACHĘCAM DO ZMIANY KLUCZA NA WŁASNY W PLIKU settings.py - FIXER_API_KEY.


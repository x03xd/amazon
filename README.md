
KLON AMAZONA, STACK TECHNOLOGICZNY: REACT + TS + DJANGO REST FRAMEWORK + CELERY + RABBITMQ

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
URUCHOMIENIE:
w root folderze:
python manage.py runserver - włączenie servera backend
celery -A amazon worker -l info -P eventlet - używane to pracy z zadaniami w tle na systemie windows
celery -A amazon beat -l info - cykliczne wywoływanie API walutowego o czas zdefiniowany w settings.py

w folderze frontend
npm start - włączenie servera frontend

PONADTO ZAINSTALOWAC STRIPE CLI I ZALACZYC ENDPOINTA WEBHOOKA 'stripe-webhook/' POSTEPUJAC ZGODNIE Z KROKAMI PONIZEJ (POTRZEBNE W CELU )
1. INSTALACJA:
https://github.com/stripe/stripe-cli/releases/tag/v1.17.2
I WYPAKOWAC

2. WPISAC W KONSOLĘ
stripe login 
I POSTĄPIĆ ZGODNIE Z INSTRUKCJĄ

3. WPISAC W KONSOLĘ
stripe listen --forward-to http://127.0.0.1:8000/stripe-webhook

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

DO USER AUTHENTICATION UŻYTO JWT (ADMIN PANEL Z KOLEI KORZYSTA DEFAULTOWO Z SESSIONS)

APLIKACJA ZAWIERA TAKIE FEATURY JAK:
1. REJESTRACJA
2. LOGOWANIE/WYLOGOWYWANIE
3. FILTR PRODUKTÓW
4. MOŻLIWOŚĆ KUPNA PRODUKTU/PRODUKTÓW
5. KOSZYK
6. PODGLĄD ZAMÓWIEŃ ORAZ MOŻLIWOŚĆ WYSTAWIENIA OCENY DLA ZAMÓWIONYCH PRODUKTÓW
7. ZMIANA WALUTY
8. BACKGROUND TASK W POSTACI API KTORE RAZ, A NASTĘPNIE CO CZAS OKRESLONY W settings.py ZA POMOCA CELERY AKTUALIZUJE KURSY WALUT
9. MOŻLIWOŚĆ EDYCJI DANYCH UŻYTKOWNIKA
10. REKOMENDACJE
11. SYSTEM OPINII
12. SYSTEM PŁATNOŚCI ZE STRIPE PAYMENT ORAZ WEBHOOKIEM KONTROLUJACYM OPERACJE NA BAZIE DANYCH


UWAGI:
API WALUTOWE MOŻE BYĆ WYCZERPANE. W TAKIM WYPADKU ZACHĘCAM DO ZMIANY KLUCZA NA WŁASNY W PLIKU settings.py - FIXER_API_KEY.


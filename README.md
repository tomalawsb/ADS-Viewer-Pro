# ADS Viewer Pro

Wersja: **V15 - 3005261440**

## Opis

Lekka aplikacja PWA do podglądu samolotów ADS-B na mapie.

## Najważniejsze funkcje

- automatyczna lokalizacja po starcie,
- automatyczne wczytywanie i odświeżanie samolotów,
- mapa samolotów z markerami i śladami lotu,
- przycisk ADS obowiązkowy przy samolotach,
- zapisane samoloty,
- lista obserwowanych samolotów,
- alerty tylko dla listy obserwowanych,
- lokalne powiadomienia systemowe, gdy aplikacja działa,
- synchronizacja zapisanych samolotów przez Firestore,
- dolny panel mobilny,
- tryb wydajności.

## Ważne zasady projektu

- Nie usuwać przycisku **ADS**.
- W listach mają zostać akcje **ADS**, **Mapa**, **Usuń**.
- Nie przywracać funkcji **Śledź**.
- Alerty mają działać tylko dla samolotów z listy **Obserwowane**.
- Automatyczna lokalizacja i automatyczne ładowanie samolotów po starcie mają zostać włączone.

## Uruchomienie

Najlepiej publikować jako statyczną stronę, np. GitHub Pages. Lokalizacja i powiadomienia wymagają HTTPS albo localhost.


## Alerty jednorazowe

Alerty są wysyłane tylko dla samolotów z listy **Obserwowane** i tylko jeden raz dla danego samolotu. Aby pozwolić na ponowny alert, usuń samolot z obserwowanych i dodaj go ponownie.

## Nawigacja

Przycisk **Obserwowane** jest na głównym pasku na dole. Panel **Alerty** jest dostępny w menu **Więcej**.

## Zmiany V15 - 3005261440

- START/STOP na mapie są rysowane tylko wtedy, gdy program ma potwierdzone punkty startu i lądowania z danymi lotnisk.
- Gdy brak potwierdzonej trasy, program rysuje tylko ślad live wybranego samolotu bez fałszywych znaczników START/STOP.
- Automatyczne odświeżenie wybranego samolotu nie przejmuje już widoku po kliknięciu lokalizacji użytkownika.
- Ścieżki innych samolotów są zapisywane w tle, ale nie są rysowane na mapie; widoczna jest tylko ścieżka wybranego samolotu.
- Numer wersji jest widoczny na górze oraz w ustawieniach programu.
- Dodano pytanie instalacyjne PWA: „Zainstaluj” albo „Korzystaj w przeglądarce”.
- Dodano różne sylwetki ikon statków powietrznych: duży pasażerski, odrzutowy, mały śmigłowy, śmigłowiec, szybowiec i specjalny/wojskowy.
- Kolory ikon pozostają zgodne z dotychczasowym ustawieniem programu.
- Naprawiono przycisk „Szczegóły” w panelu samolotu: teraz pokazuje/ukrywa panel szczegółów i rozwija kartę.

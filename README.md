# ADS Viewer Pro

Wersja: **V19 - 3005261819**

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
- synchronizacja zapisanych samolotów, obserwowanych i ustawień przez Firestore,
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

## Zmiany V19 - 3005261819

- Zastąpiono ikony PNG ikonami SVG dostarczonymi przez użytkownika.
- Ikony samolotów są teraz osadzane jako wektorowe SVG, więc nie powinny znikać przez problemy z maską PNG.
- Kolory ikon nadal pobierają obecny kolor programu przez `currentColor`.
- Pliki SVG dodano do katalogu `assets/aircraft/` i do cache PWA/service workera.
- Usunięto z paczki stare ikony PNG statków powietrznych.

## Zmiany V16 - 3005261546

- Podpięto zewnętrzne ikony PNG z katalogu `assets/aircraft/`.
- Ikony PNG mają przezroczyste tło i są używane jako maski CSS, więc zachowują obecne kolory programu.
- Obsługiwane typy ikon PNG: odrzutowy, duży samolot, śmigłowy, śmigłowiec, szybowiec i specjalny/wojskowy.
- Pliki ikon PNG zostały dodane do cache PWA/service workera, aby działały offline po zainstalowaniu aplikacji.
- Usunięto z paczki surowe pliki `ChatGPT Image...png`, bo miały tło szachownicy i nie były używane przez program.

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

## Zmiany V18 - 3005261605
- Rozszerzono synchronizację Firestore: oprócz zapisanych samolotów synchronizowane są teraz ustawienia programu i lista obserwowanych.
- Synchronizowane sekcje: źródło danych/API, motyw, filtry samolotów, ustawienia wydajności, obserwowane samoloty, ustawienia alertów i stan alertów jednorazowych.
- Dodano techniczny dokument stanu aplikacji w Firestore: `adsViewerSync/{kod}/flights/__app_state`, żeby zachować zgodność z dotychczasowymi regułami Firestore.
- Status synchronizacji pokazuje teraz liczbę zapisanych i obserwowanych samolotów.

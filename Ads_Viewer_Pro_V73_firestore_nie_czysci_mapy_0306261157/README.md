# ADS Viewer Pro V67 - 0206261932

# ADS Viewer Pro

Wersja: **V67 - 0206261932**

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

## Zmiany V27 - 3105260930
- Rozszerzono synchronizację Firestore: oprócz zapisanych samolotów synchronizowane są teraz ustawienia programu i lista obserwowanych.
- Synchronizowane sekcje: źródło danych/API, motyw, filtry samolotów, ustawienia wydajności, obserwowane samoloty, ustawienia alertów i stan alertów jednorazowych.
- Dodano techniczny dokument stanu aplikacji w Firestore: `adsViewerSync/{kod}/flights/__app_state`, żeby zachować zgodność z dotychczasowymi regułami Firestore.
- Status synchronizacji pokazuje teraz liczbę zapisanych i obserwowanych samolotów.


## V27 - 3105260930
- Naprawiono błąd z V19: przywrócono komplet funkcji ładowania i filtrów samolotów.
- Ikony samolotów działają jako SVG zamiast PNG.
- Zachowano synchronizację Firestore z V17/V18.

## V27 - 3105260930

Poprawki:
- wyszukiwanie po HEX jest ścisłe: program nie pokazuje innego samolotu, jeśli API zwróci wynik niezgodny z wpisanym HEX;
- po nieudanym wyszukiwaniu pole wyszukiwania zostaje bez zmian i pojawia się komunikat „Nie znaleziono samolotu”;
- ręczne wyszukanie samolotu przenosi mapę do jego pozycji;
- kliknięcie samolotu na mapie nadal nie wymusza centrowania;
- przy pobieraniu samolotów z mapy program bierze aktualny środek mapy i promień ustawiony w opcjach.


## Zmiany V27 - 3105260930
- Ręczne wyszukanie samolotu przenosi mapę do znalezionej pozycji.
- Kliknięcie samolotu na mapie nadal nie centruje mapy.
- Przy wyszukiwaniu zachowany jest bliski zoom na ikonę samolotu, bez dopasowywania do całej trasy.


## Zmiany V27 - 3105260930
- Po ręcznym wyszukaniu samolotu spoza aktualnego obszaru program najpierw przenosi mapę do pozycji samolotu, automatycznie odświeża obszar według ustawionego promienia, a dopiero potem pokazuje kartę samolotu z danymi.
- Współrzędne przeglądania są aktualizowane do znalezionego samolotu, żeby kolejne odświeżenie dotyczyło tej samej sekcji mapy.

## Zmiany V28 - 3105260955

- Dodano przycisk **Eksportuj** w karcie wybranego samolotu.
- Eksport zapisuje do wskazanego katalogu: `dane.json`, `opis.txt`, `raport.html`, `historia_trasy.csv`, `historia_widzen.csv`, zdjęcie lub grafikę poglądową oraz link do źródła zdjęcia, jeśli jest dostępny.
- W Chrome/Edge program używa wyboru katalogu. Gdy przeglądarka tego nie obsługuje, pobiera pliki osobno.
- Historia przelotów obejmuje dane zapisane lokalnie przez program oraz punkty trasy zebrane podczas odświeżania/obserwowania.


## Zmiany V31 - 3105261025

- Naprawiono przycisk Eksportuj: wybór katalogu otwiera się natychmiast po kliknięciu, zanim program zacznie pobierać zdjęcie i budować pliki eksportu.
- Usunięto przycisk Szczegóły z karty samolotu.


## Zmiany V31 - 3105261025
- Naprawiono eksport do katalogu: program od razu tworzy folder samolotu i plik kontrolny `_eksport_start.txt`.
- Dane tekstowe/JSON/CSV zapisują się przed pobieraniem zdjęcia, żeby problem ze zdjęciem nie blokował eksportu.
- Dodano sprawdzanie uprawnień zapisu do katalogu.
- Raport HTML i zdjęcie zapisywane są na końcu.


## V31 - 3105261025
- Poprawiono eksport karty samolotu: dane są najpierw przygotowywane w pamięci, potem zapisywane do folderu.
- Dodano awaryjny eksport ZIP, jeśli przeglądarka zablokuje zapis bezpośrednio do katalogu.
- ZIP zawiera ten sam folder samolotu i te same pliki: dane.json, opis.txt, raport.html, CSV, zdjęcie/grafikę poglądową i pliki kontrolne.

## V67 - 0206261932

- Trwały panel historii z przyciskiem X.
- Historia nie zamyka się po pobraniu trasy ani po kliknięciu w mapę.
- Zmiana daty automatycznie przeładowuje trasę wybranego samolotu.
- Panel historii jest boczny na desktopie i responsywny jako dolny panel na telefonie.

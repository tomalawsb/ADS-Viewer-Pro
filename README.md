# ADS Viewer Pro

Wersja: **V8 - 2905262217**

## Co robi program

ADS Viewer Pro to lekka aplikacja PWA do podglądu samolotów ADS-B na mapie. Działa jako statyczna strona, więc nadaje się do publikacji na GitHub Pages.

## Najważniejsze funkcje

- mapa samolotów z automatycznym odświeżaniem,
- ślady lotu budowane lokalnie z kolejnych pozycji,
- filtry samolotów,
- zapisane samoloty,
- obserwowane samoloty,
- alerty,
- historia przelotów,
- tryb wydajności,
- wskaźnik świeżości danych,
- linki ADS,
- uproszczony dolny panel mobilny.

## Zmiany V8 - 2905262217

- Przebudowano dolny panel na telefonie.
- Zostawiono 5 głównych pozycji: **Radar**, **Szukaj**, **Zapisane**, **Alerty**, **Więcej**.
- Przeniesiono pod **Więcej**: **Obserwowane**, **Historia**, **Status**, **Ustawienia** oraz **Z linku**.
- Usunięto problem zlewających się podpisów typu „ZapisaneObserw.” i „HistoriaAlerty”.
- Zachowano wszystkie dotychczasowe funkcje programu.

## Zmiany V7 - 2905262151

- Dodano lokalną historię przelotów.
- Program zapisuje samoloty widziane na mapie i łączy wpisy w 15-minutowe okna.
- Dodano wyszukiwanie historii, akcje ADS/Mapa/Obserwuj/Usuń oraz eksport historii do CSV przez schowek.
- Historia jest ograniczona do 450 pozycji, żeby nie spowalniać aplikacji.

## Zmiany V6 - 2905262145

- Dodano automatyczne wygaszanie i ukrywanie starych samolotów.
- Dodano tryb wydajności z profilami: Responsywny, Zrównoważony, Oszczędny.
- Dodano ustawienia interwału odświeżania, limitu markerów, limitu listy i czasu usuwania starych danych.

## Zmiany V5 - 2905261941

- Rozbudowano panel szczegółów samolotu.
- Dodano wskaźnik świeżości danych: LIVE, Świeże, Opóźnione, Stare.

## Zmiany V4 - 2905262136

- Dodano alerty.
- Dodano listę obserwowanych samolotów.

## Zmiany V3 - 2905261927

- Dodano ślady lotu.
- Dodano filtry samolotów.
- Zmieniono numerację wersji na format: V3 - DDMMRRHHMM.

## Ważne ograniczenie

Pełna trasa i dane start/cel pojawią się tylko wtedy, gdy użyte źródło ADS-B zwróci takie informacje. Darmowe źródła często pokazują głównie aktualną pozycję, wysokość, prędkość i callsign.

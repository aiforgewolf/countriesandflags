# 🌍 Geografická hra - Země a vlajky

Interaktivní vzdělávací hra pro testování geografických znalostí. Poznej země podle vlajek, nauč se hlavní města a zjisti, kde se jednotlivé státy nacházejí na mapě!

## 🎮 Herní módy

1. **🚩 Vlajka → Země** - Poznáš zemi podle její vlajky?
2. **🏴 Země → Vlajka** - Vyber správnou vlajku pro danou zemi
3. **🏛️ Hlavní města** - Otestuj své znalosti hlavních měst
4. **🗺️ Mapa světa** - Klikni na region, kde se země nachází
5. **⏱️ Časový režim** - Kolik otázek zvládneš za 60 sekund?
6. **♾️ Nekonečný režim** - Hraj dokud neuděláš 3 chyby

## 📊 Funkce

- **80+ zemí** ze všech kontinentů
- **Statistiky a sledování postupu** uložené v prohlížeči
- **Responzivní design** - funguje na mobilu i desktopu
- **Plynulé animace** a vizuální feedback
- **Ukládání nejlepších výsledků**

## 🚀 Nasazení na GitHub Pages

Pro zpřístupnění hry na GitHub Pages postupuj následovně:

### Možnost 1: Přes webové rozhraní GitHub

1. Jdi na https://github.com/aiforgewolf/countriesandflags
2. Klikni na **Settings** (Nastavení)
3. V levém menu vyber **Pages**
4. V sekci **Source** vyber:
   - **Branch:** `claude/geography-guessing-game-011Rt1XTV1ZFDWdHyoLRB4ZY`
   - **Folder:** `/ (root)`
5. Klikni na **Save**
6. Počkej 1-2 minuty na deployment
7. Hra bude dostupná na: `https://aiforgewolf.github.io/countriesandflags/`

### Možnost 2: Sloučení do main větve

Pokud chceš použít standardní větev pro GitHub Pages:

1. Vytvoř pull request z větve `claude/geography-guessing-game-011Rt1XTV1ZFDWdHyoLRB4ZY` do `main`
2. Slouč pull request
3. V Settings → Pages nastav source na `main` branch
4. Hra bude dostupná na: `https://aiforgewolf.github.io/countriesandflags/`

## 🎯 Jak hrát

1. Otevři `index.html` v prohlížeči nebo navštiv nasazenou verzi na GitHub Pages
2. Vyber herní mód z hlavního menu
3. Odpovídej na otázky kliknutím na správnou možnost
4. Sleduj své skóre a statistiky
5. Porovnávej své nejlepší výsledky!

## 🛠️ Technologie

- **Čistý HTML5, CSS3 a JavaScript** - žádné závislosti
- **localStorage** pro ukládání statistik
- **SVG** pro mapu světa
- **CSS Grid a Flexbox** pro responzivní layout
- **CSS animace** pro plynulé přechody

## 📁 Struktura projektu

```
countriesandflags/
├── index.html          # Hlavní HTML struktura
├── styles.css          # Styly a animace
├── game.js            # Herní logika
├── countries-data.js  # Data o zemích, vlajkách a hlavních městech
└── README.md          # Dokumentace
```

## 🌟 Přidání nových zemí

Pro přidání nové země do hry, edituj soubor `countries-data.js`:

```javascript
{
    name: "Název země",
    flag: "🏴", // Emoji vlajky
    capital: "Hlavní město",
    region: "Region", // Europe, Asia, Africa, Americas, Oceania
    x: 500, // X souřadnice na mapě (0-1000)
    y: 250  // Y souřadnice na mapě (0-500)
}
```

## 📝 Licence

Tento projekt je open source a volně k použití.

## 🎓 Výukové využití

Hra je ideální pro:
- Výuku geografie ve školách
- Procvičování znalostí před testy
- Zábavné učení pro děti i dospělé
- Trénink paměti a asociačních dovedností

---

**Užij si hraní a učení!** 🌍✨

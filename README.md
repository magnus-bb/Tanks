# Tanks (*TBD*)
A recreation of the flash game Tank Trouble

Guidelines
----------
- Hent 'Better Comments' af *Aaron Bond* til VSCode for bedre at kunne følge med i todos, fejl m.m. følgende tegn indsættes som det første i en kommentars linje, for at tilføje farve
	- Sæt '`*`' for at markere noget vigtigt
	- Sæt '`!`' for at markere noget, der skal slettes eller som ikke virker
	- Sæt '`?`' for at markere, at der måske skal kigges nærmere eller genovervejes el. lign.
	- Skriv '`TODO: `' for at henvise til noget, der mangler at blive gjort
	- Skriv '`@param XXX`' efterfulgt af tekst, for at beskrive et bestemt parameter til en funktion
	- Skriv '`//`' inde i kommentaren for at overstrege
	- Eks: `//! Not working yet. Fix before testing` - Laver kommentaren **rød**, så den lettere ses
- Spil-assets
	- Skal have samme filnavn som deres tilsvarende navn i koden, for at tillade generisk loading
	- Images skal original vende mod højre, hvis `rotate()` skal bruges
- Brug *ikke* semikolon i slutningen af linjer; kun ved flere single line statements (det er bare en personlig præference)
- Prøv så vidt muligt *kun* at holde kode, hvor det passer. Dvs:
	- Brug filerne til at organisere
	- Opdel lange scripts i hjælpefunktioner, der så står sit eget sted
	- Hvis en funktion eksempelvis hedder `bounce()`, så sørg for at funktionen kun **bouncer**, og abstrahér underprocesser til en anden funktion, *eller* navngiv funktionen noget andet
- Permanente kommentarer og variabel-/funktionsnavne på engelsk, hvis projektet senere skal deles
- Sørg for at bruge `p5.pop()` og `p5.push()` til at containe canvas-ændringer
- Brug hvert objekts `onFrame()` til at redigere alt, der *kun* har med objektet selv at gøre
	- Dette skal ikke være listeners
	- Dette skal ikke være noget, der gennemløber andre elementer i `gameState`

Todos
-----
### Tilføj
- En lækker effekt når et projektil kalder `destroy()`, så det ikke bare forsvinder.
- Finde og loade open source lydeffekter til skud (*gud forbyde, at jeg bliver nødt til at optage mundlyde*)
- Tank collisions med hinanden?
- Feedback på player created
- Statusfelter skal kun vise det mest basale, og så give udvidet info ved hover (f.eks. antal selvmord)
- Tilføj fejlmeddelelse, hvis ikke alle controls er valgt
- Graying af brugte controls + besked hvis CTRL + W er valgt som controls på tværs af spillere også
- Tilføj en counter til selvmord, sørg for at et selvmord ikke tæller almindelige kills
- Tildeling af point i `Game.end()` eller i en funktion, den kalder
- Lav muzzle-effekt om til noget nyt grafisk i stedet for at manipulere størrelsen af projektilet
- Autostørrelse (på max eller evt default) af canvas ved at tage vinduets width divideret med cellestørrelsen?
- Tilføj mulighed for altid at have laser sight i config
- P5Vector er fucking nemt med .add(), og man kan stadig bare x / y *= -1 for at omvende en akse nemt: Lav om til vektorer (så skrå vægge etc kan laves)
- Opfordr til at bruge ALT, SHIFT, CONTROL etc, da disse oftes kan bruges med flere taster
- Sørg for at det er muligt at slette en spiller nede i status, så længe spillet ikke er startet
- et `?` til at se enheder på configs (px, frames etc)
- Besked om restartnødvendighed på nogle configs (fps f.eks.)
- Collisionchecking skal loope igennem det, der flytter sig (tanks, projektiler etc), og så bruge sin egen x, y til kun at finde sin egen celle, og så kun checke collisions på de walls, der er rundt om (bliver stadig nødt til at gennemløbe alle andre ting, der flytter sig, for at se deres position)
- Animationer i menuer
- Ikon til alm bullets til at vise ammo i statusbar og laserSight af samme årsag

### Fix
- Se om projectiles, cells, tanks, pickups osv ofte får udregnet props, som bare kan være på objektet
- Rename helpers navne til at give bedre mening
- Loops i `draw.js` kan slås sammen. F.eks. kan tanks + projectiles vist lægges ind i projectiles (bare tjek om rækkefølgen tillader det først)
- Random selections, der skal ekskludere noget bestemt (f.eks de steder, der allerede er en pickup eller tanks, der ikke skal vælge sig selv) skal omskrives så de tager arrayet, kloner det og fjerner sig selv/de ekskluderede fra klonen og bare vælger en random. På denne måde skal funtionen ikke kalde sig selv igen, hvis den rammer noget ekskluderet.
- Omskriv metoder, der *kun* kaldes af et objekt selv til private (med underscores) - `.show()`, `.move()` etc som kaldes af `onFrame()`
- Evt. del tanks' `handleHit` til `handleHit` og `killed`, så `handleHit` kan tjekke eventuelle skjolde først etc?
- Flyt static props og metoder til toppen af classes
- Colors skal være kopier af owner, ikke den samme (hvis det ikke allerede er sådan), for at forhindre problemer med setAlpha etc
- lav steps på `tankHit()` (se kommentar ved tankHit())
- Sørg for steps på ALT der kan ændres i config, dvs også movespeed evt (hvis det bliver muligt at gøre denne stor nok til at gå igennem vægge etc)
- Hjørnecollisions bugger på bounce med det nye step lookaheads (den når vist at procce flere gange per frame nogle gange?)
- Se om nogle helpers kan flyttes til en enkelt class / constructor etc, hvis kun dén bruger helperen
- Fjern alle gamle kommentarer
- Se om noget state kan flyttes ud af Vuex
- Ny løsning til `fire` controls-listener, som enten ikke er p5 (men stadig ikke kan fyre flere pr frame), eller bare som minimum ikke er i ekstern js
	- Se om Fire kan flyttes ind i tanken, (evt med `keyIsDown()`) selvom hvert frame så tjekker om man skyder, og man bare kan holde den inde
- Organisér `mutations`
- Separér `darkMode` fra spillets farver, men sæt default farver til at være det samme
- Fix colorpicker location (se kommentar i component om problemet)
- Lav menu en fixed størrelse, så denne ikke bliver åndssvag, hvis man vælger en mindre / større bane
- Projektil-speed under 3 virker ikke!
- Tilføj ammo til alle våben, så det kan ændres, men brug defaults på 1 også.
- Color tank skal være ligeså lækker som color-input-buttons i config
- Bullet skal bruge circle-intersections frem for midtpunkt, så man kan ændre størrelse på projektil
	- Tilføj projektilstørrelse til config igen
	- https://forum.vuejs.org/t/vue-loader-unexpected-token-error-for-using-spread-operator-on-my-vue-component/10241/6 (nederst)
	- Tror faktisk spread virker, og babel er unødvendigt
- Fjern passed names til equipment? De ved vel selv, hvad de hedder
- Se om alle `tank.modifiers` referencer er omskrevet til array frem for set
- Lav pickups om til at være farvedelt i powerup (grøn), equipment (rød), modifier (blå) og med border delt i usable (sort) , auto-use (hvid) og evt non-use (grå?)
- Flyt `getCell()` ind i grid? Nu hvor celler har adgang til egne naboer
	- Find steder `getCell()` bruges og fjern check om cellen findes - `getCell()` checker selv om den findes og ellers returner null
- Skriv `unvisitedNeighbors` om til at bruge cell.neighborhood
- Opdel collision checks i wall og edge, så det ikke er samme funktion, der bruges (der er mere logik per gang den bliver kaldt, end der bør være)
- Redesign pickups til at være mere ligesom status-item / color-picker med farve og gradient, men uden hul igennem
- Flyt mest muligt config ind i objekter, når de initialiseres, så de ikke skal gettes hvert frame
- Se på om `#` kan bruges til private metoder osv i objekter

Idéer til spillet
--------------------------
- Bruger får lov at bruge musen (lol) i 20? sekunder. Kun 1 ad gangen.
- Laser, men med lidt vedvarende beam også, uden tracing
- Mortar, der lobbes en fixed afstand (over vægge også)
- Hjemsøgende missil
- Minigun
- Kortere lifetime på projektiler i en stund / flere projektiler
- Portal (skyd 1, aktiver for at sætte. Gentag)
- Sniper - hurtigt projektil med tracing, der ikke bouncer
- Skjold der dækker x grader omkring tank indtil 1 hit
- Mini-ai som hjælper
- Debuff fjenders move-/projektil-speed
- En cooldown på en slags dash som en ability alle har
- Stealthed tank (alpha kommer nok til at influere bullets etc, der arver color)
- Til tider skal vægge skifte / fjernes / tilføjes
- Lav presets på `config` (realism, hyped etc)
- Skyggeeffekter på spillet?
- Custom cursor á la: https://www.youtube.com/watch?v=TpwpAYi-p2w 
- Shotgun med små pellets og 1x bounce?
- Game modes? CTF, parkour (fra a til b), flere liv etc

Links
-----
- **Collisions**: https://happycoding.io/tutorials/processing/collision-detection
- **P5 reference**: https://p5js.org/reference/
- **Labyrinter**: https://en.wikipedia.org/wiki/Maze_generation_algorithm - Recursive Backtracker
- **Hotkeys / Keybindings**: https://wangchujiang.com/hotkeys/
	- *SPECIELT* isPressed i stedet for P5!
# Tanks (*TBD*)
A recreation of the flash game Tank Trouble

Guidelines
----------
- Hent 'Better Comments' af *Aaron Bond* til VSCode for bedre at kunne følge med i todos, fejl m.m. følgende tegn indsættes som det første i en kommentars linje, for at tilføje farve
	- Sæt '`*`' for at markere noget vigtigt
	- Sæt '`!`' for at markere noget, der skal slettes eller som ikke virker endnu
	- Sæt '`?`' for at markere, at der måske skal kigges nærmere eller genovervejes el. lign.
	- Skriv '`TODO: `' for at henvise til noget, der mangler at blive gjort
	- Skriv '`@param XXX`' efterfulgt af tekst, for at beskrive et bestemt parameter til en funktion
	- Skriv '`//`' inde i kommentaren for at overstrege
	- Eks: `//! Not working yet. Fix before testing` - Laver kommentaren **rød**, så den lettere ses
- Brug *ikke* semikolon i slutningen af linjer; kun ved flere single line statements (det er bare en personlig præference, men vil gerne have det uniformt)
- Prøv så vidt muligt *kun* at holde kode, hvor det passer. Dvs:
	- Brug filerne til at organisere
		- **helpers.js**: Generiske hjælpemetoder (forkortelser, ikke spilrelaterede handlinger etc.)
		- **config.js**: Alle spilindstillinger eller ting man sikkert gerne vil tweake, når spillet engang er bygget
			- Opret props i config-objektet til disse indstillinger
			- Brug `config` når det er noget, der kun indlæses af programmet, men aldrig ændres
		- **[class].js**: Spilelementer - *specielt* dem, der skal kunne replikeres
			- Hvis et objekt/spilelement skal interagere med andet eller mutere sig selv, skal det *specielt* være en class method
			- Brug `static` props til at opbevare ting til setup af spillet, i modsætning til: `state` til at opbevare props relevante under spillet
		- **draw.js**: Skal stort set *kun* kalde funktioner, der skal opdatere noget hvert frame (oftest rendering)
		- **effects.js**: Større, globale effekter (som `shake()`). Eventuelt også fremtidige *events*, som ændrer lidt på spillet
		- **preload.js**: Stort set kun til at loade sprites, lydeffekter og andet, der skal være loadet inden spillet starter
		- **setup.js**: Opsætning af spillet, som kun gøres 1 gang
		- **state.js**: Alle de objekter, der skal holdes styr på og lignende
	- Opdel lange scripts i hjælpefunktioner, der så står sit eget sted
	- Hvis en funktion eksempelvis hedder `bounce()`, så sørg for at funktionen kun **bouncer**, og abstrahér underprocesser til en anden funktion, *eller* navngiv funktionen noget andet
- Permanente kommentarer og variabel-/funktionsnavne på engelsk, hvis projektet senere skal deles

Todos
-----
- Tanks skal spawne med `config.player.spawnDistance` celler fra hinanden (skal flyttes fra `setup.js` ind i classen)
- En lækker effekt når et projektil kalder `destroy()`, så det ikke bare forsvinder.
- Finde og loade open source lydeffekter til skud (*gud forbyde, at jeg bliver nødt til at optage mundlyde*)
- `Bullet` class skal omskrives til at extende en `Projectile` class i stedet, og så skal fælleskarakteristika med andre våben flyttes dertil
- Relevante hjælpefunktioner og instance-props (eks. `cell.w`) skal flyttes ind i deres class ved brug af static methods?
	- `wallCollision()` og `edgeCollision()` skal evt i static methods
		- Skal også abstraheres en smule til helpers
- `Bullet` driller inde i vægge
- Tanks' kanoner skal også indgå i collisions
- Bedre `Bullet` og `Tank` collisions på enderne af walls
- Tilføjelse af tilfældige celler, der til tider "brænder" og ikke må passeres
- Bullet collision med tanks - når man skyder hinanden
- Tank collisions med hinanden?
- Fix helpers osv i sine rette classes først!
- Ændr `Player` til at være en class for sig selv, og ikke en `Tank` (`Tank` skal kun være inde i spil, `Player` skal være med score osv)

Links
-----
- **Collisions**: https://happycoding.io/tutorials/processing/collision-detection
- **P5 reference**: https://p5js.org/reference/
- **Labyrinter**: https://en.wikipedia.org/wiki/Maze_generation_algorithm - Recursive Backtracker

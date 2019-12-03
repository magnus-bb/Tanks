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
		- **config.js**: Alle spilindstillinger eller ting man sikkert gerne vil tweake, når spillet er bygget
			- Opret props i config-objektet til disse indstillinger
		- **classes.js**: Spilelementer - *specielt* dem, der skal kunne replikeres
			- Hvis et objekt/spilelement skal interagere med andet eller mutere sig selv, skal det *specielt* være en class method
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
- Tanks skal spawne i **midten** af en celle
- En lækker effekt når et projektil kalder `destroy()`, så det ikke bare forsvinder. Evt. også fade på projektilets hale
- Finde og loade open source lydeffekter til skud (*gud forbyde, at jeg bliver nødt til at optage mundlyde*)
- `Bullet` class skal omskrives til at extende en `Projectile` class i stedet, og så skal fælleskarakteristika med andre våben flyttes dertil
- `Bullet`'s startkoordinat skal være spidsen af kanonen
- Flyt collision ved canvas-kanter ud af wall-loopet i `Bullet`
- Mange dele af `checkCollisions()` og `outOfBounds()` går igen. Se om de kan samles i en hjælpefunktion eller lign
- Bedre bullet collisions på kanterne af walls

Links
-----
- **Collisions**: https://happycoding.io/tutorials/processing/collision-detection
- **P5 reference**: https://p5js.org/reference/

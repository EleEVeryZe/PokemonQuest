CREATE TABLE "types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

CREATE TABLE "pokemons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "_PokemonTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PokemonTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PokemonTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "types_name_key" ON "types"("name");
CREATE UNIQUE INDEX "pokemons_name_key" ON "pokemons"("name");
CREATE UNIQUE INDEX "_PokemonTypes_AB_unique" ON "_PokemonTypes"("A", "B");
CREATE INDEX "_PokemonTypes_B_index" ON "_PokemonTypes"("B");
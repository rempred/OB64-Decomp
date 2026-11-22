#ifndef OB64_GAME_BATTLE_RECORD_FLAG_H
#define OB64_GAME_BATTLE_RECORD_FLAG_H

/* Read bit 8 of the record word at +0x40. A null record returns zero. */
int func_0020BFF8(void *record);

/* Return one when a non-null record has bit 8 clear in the word at +0x40. */
int func_0020C014(void *record);

#endif

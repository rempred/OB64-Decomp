#ifndef OB64_GAME_BATTLE_RECORD_FLAG_H
#define OB64_GAME_BATTLE_RECORD_FLAG_H

/* Read bit 8 of the record word at +0x40. A null record returns zero. */
int func_0020BFF8(void *record);

/* Return one when a non-null record has bit 8 clear in the word at +0x40. */
int func_0020C014(void *record);

/* Read bit 0 of the same record word. A null record returns one. */
int func_0020C2C0(void *record);

/* Read bit 1 of the same record word. A null record returns zero. */
int func_0020C32C(void *record);

/* Read bit 9 of the same record word. A null record returns zero. */
int func_0020C0E8(void *record);

/* Test the signed word at +0x4C for one. A null record returns zero. */
int func_0020C104(void *record);

/* Read bits 3 and 2 from the word at +0x40. A null record returns zero. */
int func_0020C2F4(void *record);
int func_0020C310(void *record);

/* Apply the C014 bit-8-clear choice to a record. */
int func_0020D814(void *record);

#endif

#ifndef OB64_GAME_BATTLE_RECORD_FLAG_H
#define OB64_GAME_BATTLE_RECORD_FLAG_H

/* Read bit 8 of the record word at +0x40. A null record returns zero. */
int battle_actor_is_side_one(void *record);

/* Return one when a non-null record has bit 8 clear in the word at +0x40. */
int battle_actor_is_side_zero(void *record);

/* Read bit 0 of the same record word. A null record returns one. */
int battle_actor_is_absent_or_has_flag_0(void *record);

/* Read bit 1 of the same record word. A null record returns zero. */
int battle_actor_has_flag_1(void *record);

/* Read bit 9 of the same record word. A null record returns zero. */
int battle_actor_has_flag_9(void *record);

/* Test the signed word at +0x4C for one. A null record returns zero. */
int battle_actor_secondary_class_is_one(void *record);

/* Each reads its respective bit from the word at +0x40. A null record returns zero. */
int battle_actor_has_flag_3(void *record);
int battle_actor_has_flag_2(void *record);

/* Apply the side-zero choice to a record. */
int func_0020D814(void *record);

#endif

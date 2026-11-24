#ifndef OB64_GAME_BATTLE_ROSTER_RECORD_H
#define OB64_GAME_BATTLE_ROSTER_RECORD_H

#include "game/battle_roster_types.h"

void battle_show_class_change_message(BattleRosterRecord *actor, BattleRosterRecord *replacement_actor);
int battle_actor_secondary_class_is_71_or_72(BattleRosterRecord *record);
BattleRosterRecord *battle_roster_find_first_side_one_with_flag_9(void);
BattleRosterRecord *battle_roster_find_first_side_zero_with_flag_9(void);
void func_0020CBDC(BattleRosterRecord *record, int mode);
void battle_roster_init_actor_from_army_member(BattleRosterRecord *actor, int member_index);
int battle_actor_scaled_distance_from_center_row(BattleRosterRecord *actor, int divisor);
void battle_roster_init_actor_from_scenario_member(BattleRosterRecord *actor, int member_index);

/* The assembler helpers write and consume a caller-owned array of roster rows. */
int func_002337E4(BattleRosterRecord **out, int start, int column);
BattleRosterRecord *func_00233D0C(BattleRosterRecord *source, BattleRosterRecord **rows, int count);

int func_00233ED4(BattleRosterRecord *source);
int func_00233F38(BattleRosterRecord *source);
int func_00233F94(BattleRosterRecord *source);
int battle_actor_roll_luck_advantage(BattleRosterRecord *source, BattleRosterRecord *target);

int func_00222190(BattleRosterRecord *actor, int x0, int z0, int x1, int z1);
int func_0022222C(BattleRosterRecord *actor, BattleRosterRecord *target, int x, int z);
int func_00222344(BattleRosterRecord *actor, int x0, int z0, int x1, int z1);
int func_0022B1F4(BattleRosterRecord *source, int *outWord);

int func_00237750(BattleRosterRecord *actor, BattleRosterRecord *target, int c, int d, int e);
int func_00237890(void *source, void *target);
int func_002379AC(int effect, void *record);
void battle_roster_change_actor_secondary_class(void *actor_record, int new_secondary_class_id);
int func_002223E0(BattleRosterRecord *actor, BattleRosterRecord *target, int formation_column, int formation_row, int x, int z);
int func_002AB810(int *slots, BattleRosterRecord *actor, int actor_index, int flip,
                  int primary_class_id, int secondary_class_id, unsigned char seen_leader);

/* Read equipment-derived element, falling back to the roster element byte. */
int func_00233568(void *record);

#endif

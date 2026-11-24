typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
s32 rand(void);
s32 battle_actor_has_flag_3(void *u);
s32 battle_actor_has_flag_2(void *u);
s32 battle_actor_has_flag_1(void *u);
s32 battle_actor_has_flag_4(void *u);
s32 func_00235754(BattleUnit *a, BattleUnit *b);
s32 func_00235BB0(BattleUnit *a, BattleUnit *b);
s32 func_00235DC8(BattleUnit *a, BattleUnit *b);
BattleUnit *func_00233B6C(BattleUnit *self, BattleUnit **candidates, s32 candidate_count, u8 mode) {
    s32 best_score = -9999;
    s32 best_index = -1;
    s32 candidate_index;
    s32 score;
    for (candidate_index = 0; candidate_index < candidate_count; candidate_index++) {
        score = func_00235754(candidates[candidate_index], ((void *)0)) + func_00235DC8(candidates[candidate_index], ((void *)0)) +
            func_00235BB0(candidates[candidate_index], ((void *)0));
        score *= candidates[candidate_index]->action_limit - candidates[candidate_index]->actions_used;
        score++;
        if (mode != 0 && battle_actor_has_flag_1(candidates[candidate_index])) {
            score = 0;
        } else if (mode == 8 && battle_actor_has_flag_3(candidates[candidate_index])) {
            score = 0;
        } else if (mode == 10 && battle_actor_has_flag_4(candidates[candidate_index])) {
            score = 0;
        } else if (mode == 4 && battle_actor_has_flag_2(candidates[candidate_index])) {
            score = 0;
        }
        if (score == best_score) {
            best_score = score - (rand() & 1);
        }
        if (best_score < score) {
            best_score = score;
            best_index = candidate_index;
        }
    }
    if (best_index < 0) {
        return ((void *)0);
    }
    return candidates[best_index];
}

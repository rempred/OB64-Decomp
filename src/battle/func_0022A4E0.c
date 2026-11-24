#include "game/battle_roster_types.h"

#include "game/battle_position_lookup.h"
typedef unsigned char u8;
typedef signed int s32;

s32 battle_actor_is_side_zero(void *);
s32 func_0020C24C(void *);
s32 func_0020C284(void *);
s32 battle_actor_is_absent_or_has_flag_0(void *);

s32 func_0022A4E0(void *record)
{
    s32 forward58, back58;
    s32 field54, field58, result, predicate;
    void *entry;
    result = 1;
    if (func_0020C24C(record) != 0) {
        return 0;
    }
    if (*(u8 *)0x801936E0 != 0) {
        return 0;
    }
    if (battle_actor_is_side_zero(record) != 0) {
        forward58 = ((BattleRosterRecord *)record)->formation_row;
        if (forward58 == 8) {
            result = 0;
            goto done;
        }
        if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, forward58 + 1)) == 0) {
            result = 0;
            goto done;
        }
        if (func_0020C284(record) != 0) {
            result = battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, ((BattleRosterRecord *)record)->formation_row + 2)) != 0;
            if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column + 1, ((BattleRosterRecord *)record)->formation_row + 2)) == 0) result = 0;
            if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column - 1, ((BattleRosterRecord *)record)->formation_row + 2)) == 0) result = 0;
            goto done;
        }
        entry = battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, ((BattleRosterRecord *)record)->formation_row + 2);
        if (battle_actor_is_absent_or_has_flag_0(entry) == 0) {
            result = func_0020C284(entry) == 0;
        }
        entry = battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column + 1, ((BattleRosterRecord *)record)->formation_row + 2);
        if (battle_actor_is_absent_or_has_flag_0(entry) == 0) {
            result &= 0 - (func_0020C284(entry) == 0);
        }
        field54 = ((BattleRosterRecord *)record)->formation_column;
        field58 = ((BattleRosterRecord *)record)->formation_row;
        field54--;
        field58 += 2;
        goto final_neighbor;
    }
    back58 = ((BattleRosterRecord *)record)->formation_row;
    if (back58 == 0) {
        result = 0;
        goto done;
    }
    if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, back58 - 1)) == 0) {
        result = 0;
        goto done;
    }
    if (func_0020C284(record) != 0) {
        result = battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, ((BattleRosterRecord *)record)->formation_row - 2)) != 0;
        if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column + 1, ((BattleRosterRecord *)record)->formation_row - 2)) == 0) result = 0;
        if (battle_actor_is_absent_or_has_flag_0(battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column - 1, ((BattleRosterRecord *)record)->formation_row - 2)) == 0) result = 0;
        goto done;
    }
    entry = battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column, ((BattleRosterRecord *)record)->formation_row - 2);
    if (battle_actor_is_absent_or_has_flag_0(entry) == 0) {
        result = func_0020C284(entry) == 0;
    }
    entry = battle_roster_find_actor_at_position(((BattleRosterRecord *)record)->formation_column + 1, ((BattleRosterRecord *)record)->formation_row - 2);
    if (battle_actor_is_absent_or_has_flag_0(entry) == 0) {
        result &= 0 - (func_0020C284(entry) == 0);
    }
    field54 = ((BattleRosterRecord *)record)->formation_column;
    field58 = ((BattleRosterRecord *)record)->formation_row;
    field54--;
    field58 -= 2;
final_neighbor:
    entry = battle_roster_find_actor_at_position(field54, field58);
    if (battle_actor_is_absent_or_has_flag_0(entry) == 0) {
        predicate = func_0020C284(entry) == 0;
        result = result & (0 - predicate);
    }
done:
    return result;
}

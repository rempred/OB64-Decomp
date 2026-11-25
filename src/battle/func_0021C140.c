#include "game/battle_predicates.h"
#include "game/battle_record_flag.h"
#include "game/character_record.h"

extern u8 D_80190F80[];
extern u8 D_801953F0[];
extern u8 D_801976DC;
extern u8 D_801976E8;

void func_0021D7CC(void *record);

/* Write the battle-adjusted stats of one actor to its selected roster. */
void func_0021C140(void *record)
{
    BattleRosterRecord *actor = record;
    u32 saved[10];
    u32 character_address;
    u8 *special_member_pool;
    int squad_source_index;
    u8 member_index;

    /* Preserve the 40-byte block beginning at HP across the battle update. */
    __builtin_memcpy(saved, (u8 *)actor + 0x20, sizeof(saved));
    actor->battle_flags &= ~0x1C;
    actor->unknown44 = 0;
    func_0021D7CC(actor);
    if (battle_actor_has_flag_12(actor) != 0) {
        return;
    }

    if (battle_actor_is_side_zero(actor) != 0) {
        squad_source_index = D_801976DC;
    } else {
        squad_source_index = D_801976E8;
    }
    if (squad_source_index < 30) {
        special_member_pool = D_80190F80;
        character_address = (u32)D_80193BC0 + actor->member_index * sizeof(CharacterRecord56);
    } else {
        special_member_pool = D_801953F0;
        character_address = (u32)D_80195560 + actor->member_index * sizeof(CharacterRecord);
    }

    member_index = actor->member_index;
    if ((unsigned int)member_index < 100) {
        CharacterRecord *character = (CharacterRecord *)character_address;
        character->hp = actor->hp;
        character->alignment = actor->alignment;
        if (squad_source_index < 30) {
            character->max_hp = actor->max_hp;
            character->strength = actor->strength;
            character->vitality = actor->vitality;
            character->intelligence = actor->intelligence;
            character->mentality = actor->mentality;
            character->agility = actor->agility;
            character->dexterity = actor->dexterity;
            character->luck = actor->luck;
            ((CharacterRecord56 *)character)->experience = actor->experience;
            character->level = actor->level;
        }

        if (battle_actor_has_flag_1(actor) != 0) {
            character->status_flags |= 4;
        } else {
            character->status_flags &= 0xFB;
        }
    } else {
        u8 *special_member_data = special_member_pool;
        special_member_data += member_index * 2;
        *(u16 *)(special_member_data - 0xC4) = actor->hp;
        if (battle_actor_is_absent_or_has_flag_0(actor) == 0 &&
            battle_actor_has_flag_1(actor) != 0) {
            (special_member_pool + actor->member_index)[0x90] |= 4;
        } else {
            (special_member_pool + actor->member_index)[0x90] &= 0xFB;
        }
    }

    __builtin_memcpy((u8 *)actor + 0x20, saved, sizeof(saved));
}

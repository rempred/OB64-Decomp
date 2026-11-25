#include "game/battle_predicates.h"
#include "game/battle_record_flag.h"
#include "game/character_record.h"

/* Aligned snapshot of the roster fields from HP through the word at +0x44. */
typedef struct BattleWritebackSnapshot {
    u16 hp, max_hp, strength, vitality;
    u16 intelligence, mentality, agility, dexterity;
    u8 luck, level, experience, element, alignment, field_35;
    u16 equipment_slot_0, equipment_slot_1, equipment_slot_2, equipment_slot_3;
    u8 fatigue, reference_alignment;
    u32 battle_flags;
    int word_44;
} BattleWritebackSnapshot;

extern u8 D_80190F80[];
extern u8 D_801953F0[];
extern u8 D_801976DC;
extern u8 D_801976E8;

void func_0021D7CC(void *record);

/* Write the battle-adjusted stats of one actor to its selected roster. */
void func_0021C140(void *record)
{
    BattleRosterRecord *actor = record;
    BattleWritebackSnapshot saved = *(BattleWritebackSnapshot *)&actor->hp;
    CharacterRecord *character;
    u8 *special_member_pool;
    int squad_source_index;
    u8 member_index;

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
        character = &D_80193BC0[actor->member_index].record;
    } else {
        special_member_pool = D_801953F0;
        character = &D_80195560[actor->member_index];
    }

    member_index = actor->member_index;
    if ((unsigned int)member_index < 100) {
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
        *(u16 *)(special_member_pool + member_index * 2 - 0xC4) = actor->hp;
        if (battle_actor_is_absent_or_has_flag_0(actor) == 0 &&
            battle_actor_has_flag_1(actor) != 0) {
            (special_member_pool + actor->member_index)[0x90] |= 4;
        } else {
            (special_member_pool + actor->member_index)[0x90] &= 0xFB;
        }
    }

    *(BattleWritebackSnapshot *)&actor->hp = saved;
}

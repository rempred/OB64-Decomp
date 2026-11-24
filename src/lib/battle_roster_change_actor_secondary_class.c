#include "game/battle_roster_record.h"

#include "game/class_field_lookups.h"
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
u8 D_801C9FA4(s32 a);
int battle_actor_is_side_one(void *actor_record);
s32 battle_actor_has_flag_10(void *actor_record);
s32 D_801BE138(s32 a, s32 new_secondary_class_id, s32 c, s32 d);
void D_801E15E0(u8 *actor_record, s32 new_secondary_class_id);
/* Update an actor's class, default equipment, action limit and body resource. */
inline void battle_roster_change_actor_secondary_class(void *actor_record, s32 new_secondary_class_id) {
    BattleRosterRecord *actor = actor_record;
    BattleObj *primary_child;
    s32 body_resource_key;
    s32 resource_flag;
    if (actor->secondary_class_id.word == actor->primary_class_id.word) {
        actor->primary_class_id.word = new_secondary_class_id;
    }
    actor->secondary_class_id.word = new_secondary_class_id;
    actor->equipment_slot_0 = D_8016DF88((u8)actor->primary_class_id.word, (u8)new_secondary_class_id);
    actor->equipment_slot_1 = D_8016DFDC((u8)actor->primary_class_id.word, (u8)new_secondary_class_id);
    actor->equipment_slot_2 = D_8016E030((u8)actor->primary_class_id.word, (u8)new_secondary_class_id);
    actor->equipment_slot_3 = D_8016E084((u8)actor->primary_class_id.word, (u8)new_secondary_class_id);
    actor->action_limit = (u8)D_8016E338((u8)actor->primary_class_id.word, (u8)actor->secondary_class_id.word, D_801C9FA4(actor->formation_row));
    resource_flag = battle_actor_is_side_one(actor);
    body_resource_key = D_801BE138(actor->primary_class_id.word, new_secondary_class_id, resource_flag, battle_actor_has_flag_10(actor));
    primary_child = actor->primary_children[0];
    actor->body_resource_key = body_resource_key;
    primary_child->unk44 = body_resource_key;
    primary_child->unk18 = body_resource_key;
    D_801E15E0((u8 *)actor, new_secondary_class_id);
}

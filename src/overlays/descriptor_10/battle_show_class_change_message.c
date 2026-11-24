#include "game/battle_record_flag.h"
#include "game/battle_roster_record.h"

#include "game/class_field_lookups.h"
extern u8 D_801976DC;
typedef struct {
    u8 record_bytes[0x38];
} ArmyRosterNameRow;
typedef struct {
    u8 record_bytes[0x34];
} ScenarioRosterNameRow;
extern ArmyRosterNameRow D_80193BC0_copy[];
extern ScenarioRosterNameRow D_80195560_copy[];
extern u8 D_801976E8;
extern const char D_801CE890[];
int func_000238B0(char *buf, const char *fmt, ...);
void func_001F2E48(signed char *s, s32 side);
/* Show the class-change message with the actor's persistent name. */
void battle_show_class_change_message(BattleRosterRecord *actor, BattleRosterRecord *replacement_actor) {
    signed char message[64];
    u8 *character_name;
    s32 uses_army_roster;
    if (battle_actor_is_side_zero(actor)) {
        s32 squad_source_index = D_801976DC;
        uses_army_roster = squad_source_index < 30;
    } else {
        s32 squad_source_index = D_801976E8;
        uses_army_roster = squad_source_index < 30;
    }
    if (uses_army_roster) {
        character_name = D_80193BC0_copy[actor->member_index].record_bytes;
    } else {
        character_name = D_80195560_copy[actor->member_index].record_bytes;
    }
    func_000238B0((char *)message, D_801CE890, character_name, D_8016E1DC(replacement_actor->primary_class_id.bytes.low, replacement_actor->secondary_class_id.bytes.low));
    func_001F2E48(message, battle_actor_is_side_zero(actor));
}

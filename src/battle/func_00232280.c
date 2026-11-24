#include "game/battle_record_flag.h"

#include "game/battle_resolution_record.h"

typedef unsigned char u8;
typedef unsigned int u32;

typedef struct ResolutionGlobal {
    u8 unknown00[0x6074];
    u8 field6074;
} ResolutionGlobal;

extern ResolutionGlobal *D_801CE8BC;
extern int func_0020BF6C(void);
extern void *battle_roster_lookup_actor(unsigned int index);

/* Move the selected actor's row to the front, rebuilding the list if needed. */
void func_00232280(BattleResolutionRecord *records)
{
    BattleRosterRecord *actor;
    BattleResolutionRecord temporary;
    int i;
    u32 j;

    if (!func_0020BF6C())
        return;
    if (!D_801CE8BC->field6074)
        return;

    for (i = 0; i < 20; ++i) {
        actor = battle_roster_lookup_actor(i);
        if (!battle_actor_is_absent_or_has_flag_0(actor) && !battle_actor_is_side_zero(actor))
            break;
    }
    if (i >= 20)
        return;

    for (i = 0; i < 6; ++i) {
        for (j = 0; j < 3; ++j) {
            if (records[i].actors[j] == actor) {
                while (i != 0) {
                    temporary = records[i];
                    records[i] = records[i - 1];
                    records[i - 1] = temporary;
                    --i;
                }
                D_801CE8BC->field6074 = 0;
                return;
            }
        }
    }

    --actor->actions_used;
    func_00231CC0(records);
    func_00232280(records);
}

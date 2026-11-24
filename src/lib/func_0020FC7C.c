#include "game/battle_roster_record.h"

#include "game/combat_types.h"

struct Func001F0E64Record;
extern void func_001F0E64(struct Func001F0E64Record *, u32);
extern void func_0020FA04(void *, int);

static __inline__ int flag(BattleRosterRecord *actor, int bit)
{
    if (!actor) return 0;
    return (actor->battle_flags >> bit) & 1;
}

void func_0020FC7C(BattleRosterRecord *actor)
{
    u32 child_pose_selector = 0;
    int action_code = 0;
    u32 child_index;
    if (flag(actor, 3)) {
        action_code = 9;
        child_pose_selector = 0x20;
    } else if (!flag(actor, 3) && flag(actor, 2)) {
        action_code = 5;
        child_pose_selector = 0x22;
    } else if (!flag(actor, 3) && !flag(actor, 2) && flag(actor, 4)) {
        action_code = 1;
        child_pose_selector = 0;
    }
    if (action_code) {
        func_0020FA04(actor, action_code);
        for (child_index = 0; child_index < 3; child_index++) {
            void *child = actor->primary_children[child_index];
            if (child) {
                func_001F0E64((struct Func001F0E64Record *)((unsigned char *)child + 0x44), child_pose_selector);
            }
        }
    }
}

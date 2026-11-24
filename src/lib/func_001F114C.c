#include "game/combat_state.h"

extern int battle_actor_is_side_one(void *object);
extern int battle_actor_has_flag_10(void *object);

typedef struct {
    unsigned char prefix[0x44];
    Func001F1218State state;
} ChildRecord;

typedef struct {
    ChildRecord *children[3];
    unsigned char unk0C[0xC];
    ChildRecord *extra18;
    ChildRecord *extra1C;
    unsigned char unk20[0x28];
    int field48;
    int field4C;
} ParentRecord;

void func_001F114C(void *object)
{
    ParentRecord *parent;
    ChildRecord **cursor;
    unsigned int index;
    int flag;
    ChildRecord *child;

    parent = object;
    index = 0;
    cursor = parent->children;
    do {
        if (*cursor != 0) {
            flag = battle_actor_is_side_one(parent);
            func_001F1218(&(*cursor)->state,
                         parent->field48, parent->field4C,
                         flag, battle_actor_has_flag_10(parent));
        }
        index++;
        cursor++;
    } while (index < 3);

    child = parent->extra18;
    if (child != 0) {
        func_001F1218(&child->state,
                     parent->field48, parent->field4C, 0, 0);
    }
    child = parent->extra1C;
    if (child != 0) {
        func_001F1218(&child->state,
                     parent->field48, parent->field4C, 0, 0);
    }
}

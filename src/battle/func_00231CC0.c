#include "game/battle_record_flag.h"

#include "game/battle_resolution_record.h"

typedef unsigned char u8;
typedef unsigned int u32;

typedef struct ResolutionContext {
    int field00;
} ResolutionContext;

extern ResolutionContext *D_801CE8C0;
extern void func_00023780(void *base, u32 bytes);
extern void *func_0020C478(unsigned int index);

static inline int object_qualified(BattleRosterRecord *object)
{
    if (object == 0)
        return 0;
    if ((object->flags40 & 3) != 0)
        return 0;
    if (object->field6C >= object->field70)
        return 0;
    return object->field6C == D_801CE8C0->field00;
}

void func_00231CC0(BattleResolutionRecord *records)
{
    BattleRosterRecord *object;
    BattleRosterRecord *previous;
    BattleResolutionRecord temporary;
    int i;
    int slot;
    int below;
    int above;

    func_00023780(records, 6 * sizeof(*records));
    records[0].field10 = 0;
    records[1].field10 = 1;
    records[2].field10 = 2;
    records[3].field10 = 6;
    records[4].field10 = 7;
    records[5].field10 = 8;

    for (i = 0; i < 20; ++i) {
        object = func_0020C478(i);
        if (object == 0 || func_0020C2C0(object) ||
            object->field6C != D_801CE8C0->field00 ||
            object->field6C >= object->field70)
            continue;

        /* The raw slot domain is an upstream precondition of the original path. */
        slot = object->row58;
        if (slot >= 6)
            slot -= 3;

        if (records[slot].objects[0] == 0) {
            records[slot].objects[0] = object;
            continue;
        }
        previous = records[slot].objects[0];
        if (previous->field_2C < object->field_2C) {
            records[slot].objects[0] = object;
            object = previous;
        }

        if (records[slot].objects[1] == 0) {
            records[slot].objects[1] = object;
            continue;
        }
        previous = records[slot].objects[1];
        if (previous->field_2C < object->field_2C) {
            records[slot].objects[1] = object;
            object = previous;
        }
        records[slot].objects[2] = object;
    }

    for (i = 0; i < 6; ++i) {
        int score;
        if (object_qualified(records[i].objects[0])) {
            if (object_qualified(records[i].objects[1])) {
                if (object_qualified(records[i].objects[2])) {
                    score = records[i].objects[2]->field_2C +
                        ((records[i].objects[1]->field_2C + records[i].objects[0]->field_2C) >> 1);
                } else {
                    score = records[i].objects[1]->field_2C + records[i].objects[0]->field_2C;
                }
            } else if (object_qualified(records[i].objects[2])) {
                score = records[i].objects[2]->field_2C + records[i].objects[0]->field_2C;
            } else {
                score = records[i].objects[0]->field_2C;
            }
        } else if (object_qualified(records[i].objects[1])) {
            if (object_qualified(records[i].objects[2])) {
                score = records[i].objects[2]->field_2C + records[i].objects[1]->field_2C;
            } else {
                score = records[i].objects[1]->field_2C;
            }
        } else if (object_qualified(records[i].objects[2])) {
            score = records[i].objects[2]->field_2C;
        } else {
            score = 0;
        }
        records[i].field0C = score;
    }

    below = -1;
    above = -1;
    for (i = 0; i < 6; ++i) {
        if (records[i].objects[0] != 0) {
            if (records[i].field10 >= 6) {
                if (above < 0 || records[i].field10 < records[above].field10)
                    above = i;
            } else {
                if (below < 0 || records[below].field10 < records[i].field10)
                    below = i;
            }
        }
    }

    if (above >= 0 && below < 0) {
        i = above;
    } else if (below >= 0 && above < 0) {
        i = below;
    } else if (above >= 0 && below >= 0) {
        /* KMC reverses the two ADD operands for ordinary indexed pointers here.
         * Form the real 36-byte offsets first to retain the original order;
         * both category indices have already been bounded to 0..5. */
        BattleResolutionRecord *aboveRecord = (BattleResolutionRecord *)
            ((u32)(above * 0x24) + (u32)records);
        BattleResolutionRecord *belowRecord = (BattleResolutionRecord *)
            ((u32)(below * 0x24) + (u32)records);
        int aboveScore = aboveRecord->field0C;
        int belowScore = belowRecord->field0C;
        i = below;
        if (aboveScore >= belowScore)
            i = above;
    } else {
        i = 0;
    }

    while (i != 0) {
        temporary = records[i];
        records[i] = records[i - 1];
        records[i - 1] = temporary;
        --i;
    }
}

#include "game/battle_record_flag.h"

#include "game/battle_resolution_record.h"

typedef unsigned char u8;
typedef unsigned int u32;

typedef struct ResolutionContext {
    int action_index;
} ResolutionContext;

extern ResolutionContext *D_801CE8C0;
extern void func_00023780(void *base, u32 bytes);
extern void *func_0020C478(unsigned int index);

static inline int object_qualified(BattleRosterRecord *actor)
{
    if (actor == 0)
        return 0;
    if ((actor->battle_flags & 3) != 0)
        return 0;
    if (actor->actions_used >= actor->action_limit)
        return 0;
    return actor->actions_used == D_801CE8C0->action_index;
}

/* Group eligible actors by formation row and prioritize groups by agility. */
void func_00231CC0(BattleResolutionRecord *records)
{
    BattleRosterRecord *actor;
    BattleRosterRecord *displaced_actor;
    BattleResolutionRecord swap_record;
    int i;
    int record_index;
    int lower_side_record;
    int upper_side_record;

    func_00023780(records, 6 * sizeof(*records));
    records[0].formation_row = 0;
    records[1].formation_row = 1;
    records[2].formation_row = 2;
    records[3].formation_row = 6;
    records[4].formation_row = 7;
    records[5].formation_row = 8;

    for (i = 0; i < 20; ++i) {
        actor = func_0020C478(i);
        if (actor == 0 || func_0020C2C0(actor) ||
            actor->actions_used != D_801CE8C0->action_index ||
            actor->actions_used >= actor->action_limit)
            continue;

        /* The raw slot domain is an upstream precondition of the original path. */
        record_index = actor->formation_row;
        if (record_index >= 6)
            record_index -= 3;

        if (records[record_index].actors[0] == 0) {
            records[record_index].actors[0] = actor;
            continue;
        }
        displaced_actor = records[record_index].actors[0];
        if (displaced_actor->agility < actor->agility) {
            records[record_index].actors[0] = actor;
            actor = displaced_actor;
        }

        if (records[record_index].actors[1] == 0) {
            records[record_index].actors[1] = actor;
            continue;
        }
        displaced_actor = records[record_index].actors[1];
        if (displaced_actor->agility < actor->agility) {
            records[record_index].actors[1] = actor;
            actor = displaced_actor;
        }
        records[record_index].actors[2] = actor;
    }

    for (i = 0; i < 6; ++i) {
        int score;
        if (object_qualified(records[i].actors[0])) {
            if (object_qualified(records[i].actors[1])) {
                if (object_qualified(records[i].actors[2])) {
                    score = records[i].actors[2]->agility +
                        ((records[i].actors[1]->agility + records[i].actors[0]->agility) >> 1);
                } else {
                    score = records[i].actors[1]->agility + records[i].actors[0]->agility;
                }
            } else if (object_qualified(records[i].actors[2])) {
                score = records[i].actors[2]->agility + records[i].actors[0]->agility;
            } else {
                score = records[i].actors[0]->agility;
            }
        } else if (object_qualified(records[i].actors[1])) {
            if (object_qualified(records[i].actors[2])) {
                score = records[i].actors[2]->agility + records[i].actors[1]->agility;
            } else {
                score = records[i].actors[1]->agility;
            }
        } else if (object_qualified(records[i].actors[2])) {
            score = records[i].actors[2]->agility;
        } else {
            score = 0;
        }
        records[i].agility_score = score;
    }

    lower_side_record = -1;
    upper_side_record = -1;
    for (i = 0; i < 6; ++i) {
        if (records[i].actors[0] != 0) {
            if (records[i].formation_row >= 6) {
                if (upper_side_record < 0 || records[i].formation_row < records[upper_side_record].formation_row)
                    upper_side_record = i;
            } else {
                if (lower_side_record < 0 || records[lower_side_record].formation_row < records[i].formation_row)
                    lower_side_record = i;
            }
        }
    }

    if (upper_side_record >= 0 && lower_side_record < 0) {
        i = upper_side_record;
    } else if (lower_side_record >= 0 && upper_side_record < 0) {
        i = lower_side_record;
    } else if (upper_side_record >= 0 && lower_side_record >= 0) {
        /* KMC reverses the two ADD operands for ordinary indexed pointers here.
         * Form the real 36-byte offsets first to retain the original order;
         * both category indices have already been bounded to 0..5. */
        BattleResolutionRecord *aboveRecord = (BattleResolutionRecord *)
            ((u32)(upper_side_record * 0x24) + (u32)records);
        BattleResolutionRecord *belowRecord = (BattleResolutionRecord *)
            ((u32)(lower_side_record * 0x24) + (u32)records);
        int aboveScore = aboveRecord->agility_score;
        int belowScore = belowRecord->agility_score;
        i = lower_side_record;
        if (aboveScore >= belowScore)
            i = upper_side_record;
    } else {
        i = 0;
    }

    while (i != 0) {
        swap_record = records[i];
        records[i] = records[i - 1];
        records[i - 1] = swap_record;
        --i;
    }
}

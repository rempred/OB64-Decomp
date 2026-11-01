#include "common/types.h"

typedef struct C3dcEntry {
    void *value_00;
    u8 unknown_04[0x2C];
    void *value_30;
    u16 value_34, value_36, value_38, value_3A;
    u16 value_3C, value_3E, value_40, value_42;
} C3dcEntry;

typedef struct C3dcState {
    u8 unknown_00[0x58];
    C3dcEntry **entries_58;
} C3dcState;

extern s16 D_8020A1AC[];
extern void func_00264f24();
extern void func_00260C24(void *);
extern void *func_00261560(s32);

void func_0025C3DC(u16 command, C3dcState *state)
{
    switch (command) {
    case 0: {
        s16 *index;

        for (index = D_8020A1AC; *index >= 0; index++) {
            C3dcEntry *entry = state->entries_58[*index];

            entry->value_00 = (void *)func_00264f24;
            entry->value_36 = 0;
            entry->value_34 = 0;
            entry->value_3A = 31;
            entry->value_38 = 31;
            entry->value_3E = 0;
            entry->value_3C = 0;
            entry->value_42 = 31;
            entry->value_40 = 31;
            entry->value_30 = func_00261560(1);
        }
        break;
    }
    case 1: {
        s16 *index;

        for (index = D_8020A1AC; *index >= 0; index++) {
            func_00260C24(state->entries_58[*index]->value_30);
        }
        break;
    }
    case 2: {
        s16 *index;

        for (index = D_8020A1AC; *index >= 0; index++) {
            C3dcEntry *entry = state->entries_58[*index];
            u32 value3E;

            /* The original performs this halfword load/store unchanged. */
            entry->value_36 = entry->value_36;
            value3E = entry->value_3E;
            entry->value_34 += 2;
            entry->value_3E = value3E + 2;
            entry->value_42 = value3E + 33;
            entry->value_38 = entry->value_34 + 31;
            entry->value_3A = entry->value_36 + 31;
        }
        break;
    }
    }
}

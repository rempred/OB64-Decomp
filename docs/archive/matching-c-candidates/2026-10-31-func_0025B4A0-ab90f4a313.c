#include "common/types.h"

/* Offset views cover only the fields accessed by this callback. */
typedef struct B4a0Entry {
    void *value_00;
    u8 unknown_04[0x2C];
    u16 value_30, value_32, value_34, value_36;
} B4a0Entry;

typedef struct B4a0State {
    u8 unknown_00[0x58];
    B4a0Entry **entries_58;
} B4a0State;

/* Only this provider's address is used here; its arguments remain unspecified. */
extern void func_00263F40();

void func_0025B4A0(u32 argument, B4a0State *state)
{
    B4a0Entry *entry;
    s16 i;
    u16 command = (u16)argument;

    switch (command) {
    case 0:
        state->entries_58[0]->value_00 = (void *)func_00263F40;
        entry = state->entries_58[0];
        entry->value_32 = 0;
        entry->value_30 = 0;
        entry->value_36 = 31;
        entry->value_34 = 31;
        for (i = 1; i < 3; i++) {
            state->entries_58[i]->value_00 = (void *)func_00263F40;
            entry = state->entries_58[i];
            entry->value_32 = 0;
            entry->value_30 = 0;
            entry->value_34 = 15;
            entry->value_36 = entry->value_32 + 31;
        }
        break;
    case 2:
        entry = state->entries_58[0];
        entry->value_30 = (entry->value_30 - 2) & 31;
        entry->value_34 = entry->value_30 + 31;
        entry->value_36 = entry->value_32 + 31;
        for (i = 1; i < 3; i++) {
            entry = state->entries_58[i];
            entry->value_30 = (entry->value_30 + 2) & 31;
            entry->value_34 = entry->value_30 + 15;
            entry->value_36 = entry->value_32 + 31;
        }
        break;
    case 1:
        break;
    }
}

#include "common/types.h"

typedef struct ResourceEntry16 {
    s16 unknown00;
    u16 code02;
    s32 key04;
    void *data08;
    u16 next0C;
    u16 unknown0E;
} ResourceEntry16;

extern ResourceEntry16 *D_80220E14;
extern u16 D_80220E10;
extern void *func_00261608(u16 code, s32 key04);

void *func_002637DC(u16 code, s32 key04)
{
    ResourceEntry16 *entry;

    for (entry = D_80220E14; entry < D_80220E14 + 64; entry++) {
        if (entry->unknown00 != 0 && entry->code02 == code &&
            entry->key04 == key04) {
            entry->unknown00 = 5;
            return entry->data08;
        }
    }
    if (D_80220E10 == 0xFFFF) {
        /* Retail spins when no free entry remains. */
        for (;;) {
        }
    }
    entry = &D_80220E14[D_80220E10];
    D_80220E10 = entry->next0C;
    entry->unknown00 = 5;
    entry->code02 = code;
    entry->key04 = key04;
    entry->data08 = func_00261608(code, key04);
    if (entry->data08 == 0) {
        /* The resource-creation failure has its own retail spin. */
        for (;;) {
        }
    }
    return entry->data08;
}
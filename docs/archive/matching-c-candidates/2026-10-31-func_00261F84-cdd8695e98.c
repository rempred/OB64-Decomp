#ifndef E03_PRIVATE_H
#define E03_PRIVATE_H

#include "common/types.h"

/* Private reconstruction layouts; field names describe observed offsets only. */
typedef struct E03Pool80 {
    u16 next_00;
    u16 unknown_02;
    u32 field_04;
    u32 field_08;
    u32 field_0C;
    u32 field_10;
    u32 field_14;
    u8 field_18;
    u8 unknown_19[0x67];
} E03Pool80;

typedef struct E03Pool94 E03Pool94;
typedef s32 (*E03Callback94)(u32 command, E03Pool94 *record);
struct E03Pool94 {
    u16 next_00;
    u16 unknown_02;
    E03Callback94 callback_04;
    u16 flags_08;
    u16 flags_0A;
    s32 field_0C;
    s32 field_10;
    s32 field_14;
    s32 field_18;
    u8 unknown_1C[0x78];
};

typedef struct E03Task E03Task;
typedef s32 (*E03TaskCallback)(u32 command, void *payload);
struct E03Task {
    u16 next_free_00;
    u16 unknown_02;
    E03TaskCallback callback_04;
    u16 state_08;
    u16 unknown_0A;
    E03Task *previous_0C;
    E03Task *next_10;
    E03Task *field_14;
    u16 resume_state_18;
    s16 countdown_1A;
    E03Pool94 *field_1C;
    s32 field_20;
    u8 payload_24[0x78];
};

typedef struct E03RenderRecord E03RenderRecord;
typedef void (*E03RenderCallback)(E03RenderRecord *record);
struct E03RenderRecord {
    u16 next_free_00;
    u16 unknown_02;
    E03RenderCallback callback_04;
    float field_08;
    s32 field_0C;
    u16 field_10;
    u16 unknown_12;
    u8 unknown_14[0x64];
};

extern u16 D_80220D50;
extern u32 D_80220D54;
extern E03Pool80 *D_80220D58;
extern void *D_80220D60;
extern u16 D_80220D64;
extern s32 D_80220D68;
extern E03Pool94 *D_80220D6C;
extern E03Pool94 **D_80220D70;
extern s32 D_80220D80;
extern E03Task *D_80220D84;
extern E03Task *D_80220D88;
extern E03Task *D_80220D8C;
extern s32 D_80220D90;
extern E03Task **D_80220D94;
extern u16 D_80220DA0;
extern s32 D_80220DA4;
extern E03RenderRecord *D_80220DA8;
extern E03RenderRecord **D_80220DAC;
extern u16 D_80220E8E;
extern void *D_80220EDC;
extern E03Task *D_80220FE8;

extern void *func_80070F30(s32 size);
extern void func_800712C4(void *memory);
extern void func_001F0F6C(void *record);
extern void func_001F0F90(void *record);

extern void func_002622B4(E03Pool94 *record);
extern void func_002623C4(E03Pool94 *record);
extern s32 func_002623E0(E03Pool94 *record);
extern void func_0026285C(E03Task *task, u16 command);
extern E03Task *func_00262910(E03TaskCallback callback, E03Task *after);
extern void func_00262DD4(u16 value);

#endif


typedef struct E03CommandPair {
    u16 mask_00;
    u16 command_02;
} E03CommandPair;

extern E03CommandPair D_80220240[3];

void func_00261F84(void)
{
    E03Pool94 *record;
    E03Pool94 *other;
    s32 count;
    s32 used;
    s32 index;
    s32 other_index;
    s32 pair_offset;
    u32 flags;

    count = D_80220D68;
    record = D_80220D6C;
    for (index = 0; index < count; index++, record++) {
        record->flags_0A &= 0xFFFE;
    }

    used = 0;
    record = D_80220D6C;
    for (index = 0; index < D_80220D68; record++, index++) {
        if (record->callback_04 != 0 && !(record->flags_0A & 1)) {
            D_80220D70[used] = record;
            used++;
            record->flags_0A |= 1;
            for (other_index = index + 1, other = record + 1;
                 other_index < D_80220D68; other_index++, other++) {
                if (other->callback_04 == record->callback_04) {
                    D_80220D70[used] = other;
                    used++;
                    other->flags_0A |= 1;
                }
            }
        }
    }
    if (used < D_80220D68) {
        D_80220D70[used] = 0;
    }

    for (index = 0; index < D_80220D68; index++) {
        record = D_80220D70[index];
        if (record == 0) {
            break;
        }
        flags = record->flags_08;
        if (flags & 0x8000) {
            if (flags & 0x4000) {
                record->callback_04(2, record);
                record->callback_04 = 0;
                func_002622B4(record);
            } else {
                record->callback_04(1, record);
                record->flags_08 |= 0x4000;
            }
        } else {
            for (pair_offset = 0; pair_offset < 3; pair_offset++) {
                if (D_80220240[pair_offset].mask_00 & flags) {
                    record->callback_04(D_80220240[pair_offset].command_02,
                                        record);
                }
            }
            if (!(record->flags_0A & 0x2000)) {
                record->field_10++;
                if (record->flags_0A & 0x0200) {
                    if (record->field_18 < record->field_10) {
                        record->field_10 = record->field_14;
                    }
                } else if (func_002623E0(record)) {
                    if (record->flags_0A & 0x8000) {
                        func_002623C4(record);
                    } else if (record->flags_0A & 0x4000) {
                        record->field_10 = 0;
                    } else {
                        record->field_10 = record->callback_04(6, record);
                    }
                }
            }
        }
    }
}

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
extern s32 func_0026285C(E03Task *task, u16 command);
extern E03Task *func_00262910(E03TaskCallback callback, E03Task *after);
extern void func_00262DD4(u16 value);

#endif


void func_00262DD4(u16 value)
{
    E03RenderRecord *temporary;
    s32 used;
    s32 index;
    s32 scan;
    s32 right;

    /* This initialization order retains the KMC save/init scheduling. */
    index = 0;
    used = 0;
    for (; index < D_80220DA4; index++) {
        if (D_80220DA8[index].callback_04 != 0 &&
            D_80220DA8[index].field_0C == 1 &&
            D_80220DA8[index].field_10 == value) {
            D_80220DAC[used] = &D_80220DA8[index];
            used++;
        }
    }
    if (used > 0) {
        for (index = 0, right = used - 1; index < right; index++, right--) {
            for (scan = index; scan <= right; scan++) {
                if (D_80220DAC[scan]->field_08 <
                    D_80220DAC[index]->field_08) {
                    temporary = D_80220DAC[index];
                    D_80220DAC[index] = D_80220DAC[scan];
                    D_80220DAC[scan] = temporary;
                }
                if (D_80220DAC[scan]->field_08 >
                    D_80220DAC[right]->field_08) {
                    temporary = D_80220DAC[right];
                    D_80220DAC[right] = D_80220DAC[scan];
                    D_80220DAC[scan] = temporary;
                }
            }
        }
        for (index = 0; index < used; index++) {
            D_80220DAC[index]->callback_04(D_80220DAC[index]);
        }
    }
}

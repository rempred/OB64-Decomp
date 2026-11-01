#include "common/types.h"

typedef struct Func0026ADD0Record {
    u32 unknown_00;
    u32 *entry_04;
    void *records_08;
    void *slots_0C;
    u16 value_10;
    u8 unknown_12[6];
} Func0026ADD0Record;

typedef struct Func0026ADD0Fields {
    float (*matrices_00)[4][4];
    s32 count_04;
    u16 *flags_08;
    Func0026ADD0Record *records_0C;
} Func0026ADD0Fields;

typedef struct Func0026ADD0State {
    u8 unknown_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *value_0C;
    void *value_10;
    u8 unknown_14[8];
    Func0026ADD0Fields fields_1C;
} Func0026ADD0State;

extern volatile u32 g_func_0026B360_value_38;
extern volatile u32 g_func_0026B360_count;
extern void *func_00001330(u32 bytes);
extern void func_000016C4(void *allocation);
extern void func_00268798(void *record);
extern void func_00268800(void *record);
extern void func_00268678(void *record, void *value);
extern void guMtxIdentF(float matrix[4][4]);
extern void func_00268358(u32 count, void *slots);
extern void func_00267FD0(void *argument, u32 *entry, void *records);
extern void func_002682A4(void *matrix, u32 *entry, void *records);
extern void func_00268400(u32 count, void *records, void *slots);
extern void func_002677D0(u32 count, void *slots, void *argument);
extern void func_00268F64(void *argument, u32 *entry, void *slots);

u32 func_0026add0(u16 command, Func0026ADD0State *state)
{
    u32 result = 0;
    Func0026ADD0Fields *fields = &state->fields_1C;
    s32 item;

    switch (command) {
    case 1:
        for (item = 0; item < fields->count_04; item++) {
            func_00268798(&fields->records_0C[item]);
        }
        break;

    case 2:
        for (item = 0; item < fields->count_04; item++) {
            func_00268800(&fields->records_0C[item]);
        }
        func_000016C4(fields->matrices_00);
        func_000016C4(fields->flags_08);
        func_000016C4(fields->records_0C);
        break;

    case 6:
        result = fields->records_0C[0].entry_04[0];
        break;

    case 0:
        fields->count_04 = g_func_0026B360_count;
        fields->matrices_00 = func_00001330(fields->count_04 * sizeof(*fields->matrices_00));
        fields->flags_08 = func_00001330(fields->count_04 * sizeof(*fields->flags_08));
        fields->records_0C = func_00001330(fields->count_04 * sizeof(*fields->records_0C));
        for (item = 0; item < fields->count_04; item++) {
            func_00268678(&fields->records_0C[item], (void *)g_func_0026B360_value_38);
            fields->flags_08[item] = 1;
            guMtxIdentF(fields->matrices_00[item]);
        }
        break;

    case 5:
        for (item = 0; item < fields->count_04; item++) {
            u16 flags = fields->flags_08[item];

            if ((flags & 1) && !(flags & 0x8000)) {
                func_00268358(fields->records_0C[item].entry_04[1],
                              fields->records_0C[item].slots_0C);
                fields->flags_08[item] |= 0x8000;
            }
        }
        state->flags_08 &= ~4;
        break;

    case 3:
        for (item = 0; item < fields->count_04; item++) {
            if (fields->flags_08[item] & 1) {
                func_00267FD0(state->value_10, fields->records_0C[item].entry_04,
                              fields->records_0C[item].records_08);
            }
        }
        for (item = 0; item < fields->count_04; item++) {
            if (fields->flags_08[item] & 1) {
                func_002682A4(fields->matrices_00[item], fields->records_0C[item].entry_04,
                              fields->records_0C[item].records_08);
            }
        }
        for (item = 0; item < fields->count_04; item++) {
            if (fields->flags_08[item] & 1) {
                func_00268400(fields->records_0C[item].entry_04[1],
                              fields->records_0C[item].records_08,
                              fields->records_0C[item].slots_0C);
            }
        }
        for (item = 0; item < fields->count_04; item++) {
            if ((fields->flags_08[item] & 1) && (state->flags_0A & 0x1000)) {
                func_002677D0(fields->records_0C[item].entry_04[1],
                              fields->records_0C[item].slots_0C, state->value_0C);
            }
        }
        break;

    case 4:
        for (item = 0; item < fields->count_04; item++) {
            if ((fields->flags_08[item] & 1) && fields->records_0C[item].value_10) {
                func_00268F64(state->value_10, fields->records_0C[item].entry_04,
                              fields->records_0C[item].slots_0C);
            }
        }
        break;
    }
    return result;
}

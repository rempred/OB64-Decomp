#include "common/types.h"

typedef void (*Func00269470Callback)(u32 reason, void *fields, void *argument);

typedef struct Func0026A204Fields {
    u8 unknown_00[0x40];
    float value_40;
    u16 flags_44;
    u16 unknown_46;
    u32 value_48;
    u32 *record_4C;
    void *value_50;
    void *value_54;
    u16 value_58;
    u8 unknown_5A[0x12];
    Func00269470Callback callback_6C;
} Func0026A204Fields;

typedef struct Func0026A204State {
    u8 unknown_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *value_0C;
    void *value_10;
    u8 unknown_14[8];
    Func0026A204Fields fields_1C;
} Func0026A204State;

struct Func0026A078Input;
struct Func0026A078Record;

extern u16 g_func_00269470_flags;
extern void *g_func_00269470_value_3C;
/* Preserve the reference order of the flag store/reload and callback load. */
extern volatile Func00269470Callback g_func_00269470_callback;
extern void func_00268798(void *target);
extern void func_00268800(void *target);
extern void func_00268678(void *target, void *value);
extern void func_00028C40(void *fields);
extern void func_00268358(u32 count, void *value);
extern void func_00267FD0(void *argument, u32 *record, void *value);
extern void func_002682A4(void *fields, u32 *record, void *value);
extern void func_00268400(u32 count, void *value_50, void *value_54);
extern void func_002677D0(u32 count, void *value_54, void *value_0C);
extern void func_00268478(u32 count, void *value, float value_40);
extern void func_00268F64(void *argument, u32 *record, void *value);
extern void func_0026a078(s32 argument, struct Func0026A078Input *input,
                        struct Func0026A078Record *output);

u32 func_0026a204(u16 command, Func0026A204State *state)
{
    u32 result = 0;
    Func0026A204Fields *fields = &state->fields_1C;

    switch (command) {
    case 1:
        if ((fields->flags_44 & 1) && fields->callback_6C) {
            fields->callback_6C(1, fields, 0);
        }
        func_00268798(&fields->value_48);
        break;
    case 2:
        /* Each mask-0x4 path below is a local self-loop in the reference body. */
        if (fields->flags_44 & 4) {
            for (;;) {
            }
        }
        func_00268800(&fields->value_48);
        break;
    case 6:
        result = fields->record_4C[0];
        break;
    case 0:
        fields->flags_44 = g_func_00269470_flags;
        fields->callback_6C = g_func_00269470_callback;
        if (fields->flags_44 & 4) {
            for (;;) {
            }
        }
        func_00268678(&fields->value_48, g_func_00269470_value_3C);
        func_00028C40(fields);
        fields->value_40 = 1.0f;
        if ((fields->flags_44 & 1) && fields->callback_6C) {
            fields->callback_6C(0, fields, 0);
        }
        break;
    case 5:
        func_00268358(fields->record_4C[1], fields->value_54);
        state->flags_08 &= ~4;
        break;
    case 3:
        func_00267FD0(state->value_10, fields->record_4C, fields->value_50);
        func_002682A4(fields, fields->record_4C, fields->value_50);
        func_00268400(fields->record_4C[1], fields->value_50, fields->value_54);
        if (state->flags_0A & 0x1000) {
            func_002677D0(fields->record_4C[1], fields->value_54, state->value_0C);
        }
        func_0026a078((s32)state->value_10,
                     (struct Func0026A078Input *)fields->record_4C,
                     (struct Func0026A078Record *)fields->value_50);
        break;
    case 4:
        if (fields->flags_44 & 2) {
            func_00268478(fields->record_4C[1], fields->value_50, fields->value_40);
        }
        if (fields->value_58) {
            if (fields->flags_44 & 4) {
                for (;;) {
                }
            }
            func_00268F64(state->value_10, fields->record_4C, fields->value_54);
        }
        if ((fields->flags_44 & 1) && fields->callback_6C) {
            fields->callback_6C(2, fields, state->value_10);
        }
        break;
    }
    return result;
}

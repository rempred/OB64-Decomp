#include "common/types.h"

typedef void (*Func00269470Callback)(u32 reason, void *state_fields, void *argument);

typedef union Func00269470Value40 {
    float as_float;
    u32 as_u32;
} Func00269470Value40;

typedef struct Func00269470Fields {
    u8 unused_00[0x40];
    Func00269470Value40 value_40;
    u8 unused_44[6];
    u16 flags_4A;
    u8 work_4C[4];
    u32 *record_50;
    void *value_54;
    void *value_58;
    u16 value_5C;
    u8 unused_5E[6];
    u16 value_64;
    u16 value_66;
    void *value_68;
    void *value_6C;
    Func00269470Callback callback_70;
} Func00269470Fields;

typedef struct Func00269470State {
    u8 unused_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *value_0C;
    void *value_10;
    u8 unused_14[8];
    Func00269470Fields fields;
} Func00269470State;

extern volatile u16 g_func_00269470_flags;
extern volatile Func00269470Callback g_func_00269470_callback;
extern volatile u16 g_func_00269470_value_44;
extern volatile u16 g_func_00269470_value_46;
extern void * volatile g_func_00269470_value_48;
extern void * volatile g_func_00269470_value_4C;
extern void * volatile g_func_00269470_value_3C;

extern void func_00268798(void *target);
extern void func_00268AD8(void *target, u16 value_64, void *value_68, u16 value_66, void *value_6C);
extern void func_00268800(void *target);
extern void func_00268890(
    void *target,
    void *value_3C,
    u16 value_64,
    void *value_68,
    u16 value_66,
    void *value_6C);
extern void func_00268678(void *target, void *value_3C);
extern void func_00028C40(Func00269470Fields *fields);
extern void func_00268358(u32 count, void *value_58);
extern void func_00267FD0(void *value_10, u32 *record, void *value_54);
extern void func_002682A4(Func00269470Fields *fields, u32 *record, void *value_54);
extern void func_00268400(u32 count, void *value_54, void *value_58);
extern void func_002677D0(u32 count, void *value_58, void *value_0C);
extern void func_00268478(u32 record_first, void *value_54, float value_40);
extern void func_0026909C(void *value_10, u32 *record, void *value_58, u16 value_66, void *value_6C);
extern void func_00268F64(void *value_10, u32 *record, void *value_58);

typedef struct E06FlagsNode {
    u8 unk00[0x18];
    u16 flags18;
} E06FlagsNode;

static inline void e06_set_node_flags(u32 *record, E06FlagsNode **nodes, u16 flags)
{
    u32 i;
    for (i = 0; i < record[1]; i++) {
        if (nodes[i] != 0) nodes[i]->flags18 = flags;
    }
}
u32 func_00269470(u32 selector_arg, Func00269470State *state)
{
    Func00269470Fields *fields = &state->fields;
    u32 result = 0;

    switch (selector_arg & 0xFFFF) {
    case 1:
        if ((fields->flags_4A & 1) && fields->callback_70) fields->callback_70(1, fields, 0);
        func_00268798(fields->work_4C);
        break;
    case 2:
        if (fields->flags_4A & 4) {
            func_00268AD8(fields->work_4C, fields->value_64, fields->value_68, fields->value_66, fields->value_6C);
        } else func_00268800(fields->work_4C);
        break;
    case 6:
        result = fields->record_50[0];
        break;
    case 0: {
        /* The node flag is a halfword; widening this local changes the
         * compiler's Boolean conversion and the following loop allocation. */
        u16 mask;
        u16 initial_flags;
        /* This access view preserves the observed paired stores and reloads
         * during setup; ordinary accesses resume after initialization. */
        volatile Func00269470Fields *setup = fields;

        setup->flags_4A = g_func_00269470_flags;
        setup->callback_70 = g_func_00269470_callback;
        setup->value_64 = g_func_00269470_value_44;
        setup->value_66 = g_func_00269470_value_46;
        setup->value_68 = g_func_00269470_value_48;
        initial_flags = setup->flags_4A;
        fields->value_6C = g_func_00269470_value_4C;
        if (initial_flags & 4) {
            u16 value_66 = setup->value_66;
            void *value_3C = g_func_00269470_value_3C;
            u16 value_64 = setup->value_64;
            func_00268890(fields->work_4C, value_3C, value_64, fields->value_68, value_66, fields->value_6C);
        } else func_00268678(fields->work_4C, g_func_00269470_value_3C);

        mask = 0;
        if (fields->flags_4A & 0x10) mask |= 1;
        if (fields->flags_4A & 0x20) mask |= 2;
        e06_set_node_flags(fields->record_50, fields->value_58, mask);
        func_00028C40(fields);
        fields->value_40.as_float = 1.0f;
        if ((fields->flags_4A & 1) && fields->callback_70) fields->callback_70(0, fields, 0);
        break;
    }
    case 5:
        func_00268358(fields->record_50[1], fields->value_58);
        state->flags_08 &= ~4;
        break;
    case 3:
        func_00267FD0(state->value_10, fields->record_50, fields->value_54);
        func_002682A4(fields, fields->record_50, fields->value_54);
        func_00268400(fields->record_50[1], fields->value_54, fields->value_58);
        if (state->flags_0A & 0x1000) func_002677D0(fields->record_50[1], fields->value_58, state->value_0C);
        break;
    case 4:
        if (fields->flags_4A & 2) func_00268478(fields->record_50[1], fields->value_54, fields->value_40.as_float);
        if (fields->value_5C) {
            if (fields->flags_4A & 4) func_0026909C(state->value_10, fields->record_50, fields->value_58, fields->value_66, fields->value_6C);
            else func_00268F64(state->value_10, fields->record_50, fields->value_58);
        }
        if ((fields->flags_4A & 1) && fields->callback_70) fields->callback_70(2, fields, state->value_10);
        break;
    }
    return result;
}

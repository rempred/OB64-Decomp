#include "common/types.h"

/* Accessed numeric prefixes; these views do not define allocation extents. */
typedef struct P05PairChild {
    u8 unknown_00[0x1C];
    u16 value_1C;
    u16 value_1E;
    u16 value_20;
} P05PairChild;

typedef struct P05PairActor {
    P05PairChild *primary[3];
    P05PairChild *secondary[3];
    u8 unknown_18[0x44];
    s32 value_5C;
} P05PairActor;

typedef struct P05IntegerTriplet {
    s32 value_00;
    s32 value_04;
    s32 value_08;
} P05IntegerTriplet;

extern s32 func_0020C104(void *);
extern s32 func_0020C120(void *);
extern const s32 D_801CEDFC[];

void func_0025CBA8(P05PairActor *actor, P05IntegerTriplet *values)
{
    u16 i;

    /* The loop bound uses the unsigned halfword; indexing uses its signed view. */
    for (i = 0; i < 3; i++) {
        if (actor->primary[(s16)i] != 0) {
            actor->primary[(s16)i]->value_1C =
                actor->secondary[(s16)i]->value_1C = values->value_00;
            actor->primary[(s16)i]->value_1E =
                actor->secondary[(s16)i]->value_1E = values->value_04;
            actor->primary[(s16)i]->value_20 =
                actor->secondary[(s16)i]->value_20 = values->value_08;
        }
    }

    if (func_0020C104(actor) != 0) {
        for (i = 0; i < 3; i++) {
            if (actor->primary[(s16)i] != 0) {
                const s32 *offsets = D_801CEDFC + (s16)i * 2;

                actor->primary[(s16)i]->value_1C += offsets[0];
                actor->primary[(s16)i]->value_20 += offsets[1];
                actor->secondary[(s16)i]->value_1C += offsets[0];
                actor->secondary[(s16)i]->value_20 += offsets[1];
            }
        }
    } else if (func_0020C120(actor) != 0) {
        s32 first = -8;
        s32 second = 8;

        if (actor->value_5C < 0) {
            first = 8;
            second = -8;
        }
        if (actor->primary[1] != 0) {
            actor->primary[1]->value_1C += first;
            actor->primary[1]->value_20 += second;
            actor->secondary[1]->value_1C += first;
            actor->secondary[1]->value_20 += second;
        }
    }
}

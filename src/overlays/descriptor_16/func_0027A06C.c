#include "game/class_field_lookups.h"
typedef struct {
    u8 unk00[0x4C];
    s32 w4C;
} Unit27;
extern Unit27 *D_8022D134[];
extern const u8 *D_8022D150[];
const u8 *func_0027A06C(s16 i) {
    if (D_8022D134[i]->w4C == 1) {
        return D_8016E1DC(1, 1);
    }
    return D_8022D150[i];
}

#include "game/resource_probe_bits.h"
extern u8 D_80187030;
extern u8 D_80187031;
void func_00042ccc(Bits42 *p) {
    D_80187030 = p->flag;
    D_80187031 = p->mode;
}

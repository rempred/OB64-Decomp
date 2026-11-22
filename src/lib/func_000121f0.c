#include "common/mus_bank.h"

extern void *D_800B1828;
MusBank *func_000121f0(MusBank *bank) {
    if (bank != ((void *)0) && bank->flags < 0) {
        D_800B1828 = bank;
    }
    return D_800B1828;
}

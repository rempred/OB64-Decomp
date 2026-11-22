#include "common/mus_synth.h"
extern AlGlobalsLike *D_800A9E54;
extern AlGlobalsLike *D_800A9E50;
extern AlGlobalsLike *D_800E8298;
void func_00014d70(AlGlobalsLike *g, MusSynConfig *c) {
    if (D_800A9E50 == ((void *)0)) {
        D_800A9E50 = g;
        if (D_800A9E54 == ((void *)0)) {
            func_000154c0(c);
            D_800A9E54 = D_800E8298 = D_800A9E50;
            func_00014dd8(c);
        }
    }
}

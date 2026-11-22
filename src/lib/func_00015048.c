#include "common/mus_synth.h"
extern AlGlobalsLike *D_800A9E54;
s32 func_00015048(s16 idx, MusSynConfig *c, void *hp) {
    func_00015098((void **)&D_800A9E54->unk34->arr[idx], c, hp);
    return D_800A9E54->unk34->arr[idx];
}

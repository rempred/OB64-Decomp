#include "common/mus_effect.h"
#include "common/mus_synth.h"
#include "common/mus_voice.h"
typedef signed long long s64;

typedef struct {
    u8 pad00[0x34];
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        ALFx *fx;
        ALFx *fxArr[1];
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
} N_ALSynth;
extern N_ALSynth *D_800A9E54;

void func_000161a0(void *fx, void *c, void *hp);
void *func_00018f80(s16 bus, ALSynConfig *c, void *hp) {
    func_000161a0(&D_800A9E54->auxBus->fxArr[bus], c, hp);
    return D_800A9E54->auxBus->fxArr[bus];
}

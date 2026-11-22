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
extern void *D_800A9E50;

void func_00018380(void *g, void *c) {
    if (!D_800A9E50) {
        D_800A9E50 = g;
        if (!D_800A9E54) {
            D_800A9E54 = g;
            func_000189d0(c);
        }
    }
}
